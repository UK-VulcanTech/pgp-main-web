import { useCallback, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { CMS_SECTION_OPTIONS } from "../lib/cmsSections";

function rowToDraft(row) {
  return {
    username: row.username,
    email: row.email || "",
    sections: [...(row.sections || [])],
    is_active: row.is_active,
    is_superuser: row.is_superuser,
    password: "",
  };
}

function normSections(list) {
  return [...(list || [])].filter(Boolean).sort();
}

function draftsEqual(row, d) {
  const base = rowToDraft(row);
  if ((d.username || "").trim() !== (base.username || "").trim()) return false;
  if ((d.email || "").trim() !== (base.email || "").trim()) return false;
  if (d.is_active !== base.is_active) return false;
  if (d.is_superuser !== base.is_superuser) return false;
  if ((d.password || "").trim()) return false;
  const a = normSections(d.sections);
  const b = normSections(base.sections);
  if (a.length !== b.length) return false;
  return a.every((x, i) => x === b[i]);
}

/** Stable comparison for API ids (number vs string). */
function sameUserId(a, b) {
  if (a == null || b == null) return false;
  return Number(a) === Number(b);
}

export default function UsersPage() {
  const { isSuperuser, user: currentUser, refreshUser } = useAuth();
  const [rows, setRows] = useState([]);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [creating, setCreating] = useState(false);
  const [localEdits, setLocalEdits] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    is_superuser: false,
    sections: [],
  });

  const load = useCallback(async () => {
    setErr("");
    try {
      const { data } = await api.get("/users/");
      setRows(Array.isArray(data) ? data : data.results ?? []);
    } catch (ex) {
      setErr(ex.response?.data?.detail || ex.message || String(ex.response?.data));
    }
  }, []);

  useEffect(() => {
    if (isSuperuser) load();
  }, [isSuperuser, load]);

  useEffect(() => {
    if (selectedUserId == null) return;
    if (!rows.some((r) => sameUserId(r.id, selectedUserId))) {
      setSelectedUserId(null);
    }
  }, [rows, selectedUserId]);

  function toggleUserCard(rowId) {
    const id = Number(rowId);
    if (!Number.isFinite(id)) return;
    setSelectedUserId((cur) => (cur != null && sameUserId(cur, id) ? null : id));
  }

  const updateDraft = useCallback((row, updater) => {
    setLocalEdits((prev) => {
      const base = prev[row.id] ?? rowToDraft(row);
      const next = typeof updater === "function" ? updater(base) : updater;
      return { ...prev, [row.id]: next };
    });
  }, []);

  function draftFor(row) {
    return localEdits[row.id] ?? rowToDraft(row);
  }

  function isDirty(row) {
    return !draftsEqual(row, draftFor(row));
  }

  if (!isSuperuser) return <Navigate to="/app" replace />;

  async function createUser(e) {
    e.preventDefault();
    setMsg("");
    setErr("");
    if (!newUser.username?.trim() || !newUser.password) {
      setErr("Username and password are required.");
      return;
    }
    try {
      await api.post("/users/", {
        username: newUser.username.trim(),
        email: newUser.email?.trim() || "",
        password: newUser.password,
        is_superuser: newUser.is_superuser,
        sections: newUser.is_superuser ? [] : newUser.sections,
      });
      setMsg("User created.");
      setNewUser({
        username: "",
        email: "",
        password: "",
        is_superuser: false,
        sections: [],
      });
      setCreating(false);
      await load();
    } catch (ex) {
      setErr(
        ex.response?.data?.detail ||
          JSON.stringify(ex.response?.data) ||
          ex.message ||
          "Create failed."
      );
    }
  }

  async function saveUser(row) {
    const d = draftFor(row);
    setMsg("");
    setErr("");
    setSavingId(row.id);
    try {
      const body = {
        username: d.username.trim(),
        email: d.email.trim(),
        is_active: d.is_active,
        is_superuser: d.is_superuser,
      };
      if (!d.is_superuser) {
        body.sections = d.sections;
      }
      if (d.password?.trim()) {
        body.password = d.password.trim();
      }
      const { data } = await api.patch(`/users/${row.id}/`, body);
      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, ...data } : r)));
      setLocalEdits((prev) => {
        const next = { ...prev };
        delete next[row.id];
        return next;
      });
      setMsg("Saved.");
      if (currentUser?.id != null && sameUserId(currentUser.id, row.id) && refreshUser) await refreshUser();
    } catch (ex) {
      setErr(ex.response?.data?.detail || JSON.stringify(ex.response?.data) || ex.message);
    } finally {
      setSavingId(null);
    }
  }

  function resetDraft(row) {
    setLocalEdits((prev) => {
      const next = { ...prev };
      delete next[row.id];
      return next;
    });
    setMsg("");
  }

  async function deleteUser(row) {
    if (currentUser?.id != null && sameUserId(row.id, currentUser.id)) {
      setErr("You cannot delete your own account.");
      return;
    }
    if (
      !confirm(
        `Delete user "${row.username}"? This cannot be undone.`
      )
    ) {
      return;
    }
    setErr("");
    setDeletingId(row.id);
    try {
      await api.delete(`/users/${row.id}/`);
      setLocalEdits((prev) => {
        const next = { ...prev };
        delete next[row.id];
        return next;
      });
      setMsg("User deleted.");
      await load();
    } catch (ex) {
      setErr(ex.response?.data?.detail || JSON.stringify(ex.response?.data) || ex.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>CMS users</h1>
      <p className="cms-prose" style={{ color: "var(--muted)", fontSize: "0.9rem" }}>
        Superusers have every section and can manage accounts. Editors only see CMS areas you assign.
        Include <strong>Media upload</strong> if they need images. Use <strong>Save changes</strong> to
        apply edits; <strong>Reset</strong> discards unsaved changes. Editors without a saved profile
        effectively have every section until you save a narrower set here.
      </p>

      {!creating ? (
        <div className="cms-btn-row" style={{ marginBottom: "1rem" }}>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setSelectedUserId(null);
              setCreating(true);
            }}
          >
            Add user
          </button>
        </div>
      ) : (
        <form className="card" style={{ marginBottom: "1.5rem" }} onSubmit={createUser}>
          <h2 style={{ marginTop: 0, fontSize: "1.1rem" }}>New staff user</h2>
          <div className="field">
            <label>Username</label>
            <input
              value={newUser.username}
              onChange={(e) => setNewUser((s) => ({ ...s, username: e.target.value }))}
              autoComplete="username"
              required
            />
          </div>
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser((s) => ({ ...s, email: e.target.value }))}
              autoComplete="email"
            />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser((s) => ({ ...s, password: e.target.value }))}
              autoComplete="new-password"
              required
            />
          </div>
          <label className="cms-check-label" style={{ marginBottom: "0.75rem" }}>
            <input
              type="checkbox"
              checked={newUser.is_superuser}
              onChange={(e) => setNewUser((s) => ({ ...s, is_superuser: e.target.checked }))}
            />
            Superuser (full access + user management)
          </label>
          {!newUser.is_superuser && (
            <div className="field">
              <label>Sections</label>
              <div className="cms-section-grid">
                {CMS_SECTION_OPTIONS.map((opt) => (
                  <label key={opt.key} className="cms-check-label">
                    <input
                      type="checkbox"
                      checked={newUser.sections.includes(opt.key)}
                      onChange={(e) => {
                        const on = e.target.checked;
                        setNewUser((s) => ({
                          ...s,
                          sections: on
                            ? [...s.sections, opt.key]
                            : s.sections.filter((k) => k !== opt.key),
                        }));
                      }}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>
          )}
          <div className="cms-btn-row">
            <button type="submit" className="btn btn-primary">
              Save new user
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setCreating(false);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {err && <p className="err">{err}</p>}
      {msg && <p className="ok">{msg}</p>}

      <div className="cms-user-grid">
        {rows.map((row) => {
          const d = draftFor(row);
          const dirty = isDirty(row);
          const isSelf = currentUser?.id != null && sameUserId(currentUser.id, row.id);
          const expanded = selectedUserId != null && sameUserId(selectedUserId, row.id);

          return (
            <div key={row.id} className="card cms-user-card">
              <button
                type="button"
                className="cms-user-card-header"
                aria-expanded={expanded}
                aria-controls={`user-editor-${row.id}`}
                id={`user-card-${row.id}`}
                onClick={() => toggleUserCard(row.id)}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "0.35rem 0.5rem" }}>
                    <strong style={{ fontSize: "1rem" }}>{row.username}</strong>
                    {isSelf && (
                      <span style={{ color: "var(--muted)", fontSize: "0.8rem" }}>(you)</span>
                    )}
                    {dirty && (
                      <span
                        style={{
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          color: "var(--accent)",
                        }}
                      >
                        Unsaved
                      </span>
                    )}
                  </div>
                  <div style={{ color: "var(--muted)", fontSize: "0.8rem", marginTop: 4 }}>
                    {d.email || "—"}
                  </div>
                  <div style={{ color: "var(--muted)", fontSize: "0.75rem", marginTop: 6 }}>
                    {d.is_superuser ? "Superuser" : "Editor"}
                    {" · "}
                    {d.is_active ? "Active" : "Inactive"}
                  </div>
                </div>
                <span className="cms-user-card-chevron" aria-hidden>
                  {expanded ? "▾" : "▸"}
                </span>
              </button>

              {expanded && (
                <div className="cms-user-card-body" id={`user-editor-${row.id}`} role="region" aria-labelledby={`user-card-${row.id}`}>
              <div className="field" style={{ marginBottom: "0.75rem" }}>
                <label>Username</label>
                <input
                  value={d.username}
                  onChange={(e) =>
                    updateDraft(row, (base) => ({ ...base, username: e.target.value }))
                  }
                  autoComplete="off"
                />
              </div>
              <div className="field" style={{ marginBottom: "0.75rem" }}>
                <label>Email</label>
                <input
                  type="email"
                  value={d.email}
                  onChange={(e) =>
                    updateDraft(row, (base) => ({ ...base, email: e.target.value }))
                  }
                />
              </div>

              <label className="cms-check-label" style={{ marginBottom: "0.5rem" }}>
                <input
                  type="checkbox"
                  checked={d.is_active}
                  onChange={(e) =>
                    updateDraft(row, (base) => ({ ...base, is_active: e.target.checked }))
                  }
                />
                Account active
              </label>

              <label className="cms-check-label" style={{ marginBottom: "0.75rem" }}>
                <input
                  type="checkbox"
                  checked={d.is_superuser}
                  onChange={(e) =>
                    updateDraft(row, (base) => ({ ...base, is_superuser: e.target.checked }))
                  }
                />
                Superuser
              </label>

              {!d.is_superuser && (
                <div className="field" style={{ marginBottom: "0.75rem" }}>
                  <label>Permissions (sections)</label>
                  <div className="cms-section-grid">
                    {CMS_SECTION_OPTIONS.map((opt) => (
                      <label key={opt.key} className="cms-check-label">
                        <input
                          type="checkbox"
                          checked={d.sections.includes(opt.key)}
                          onChange={(e) => {
                            const on = e.target.checked;
                            updateDraft(row, (base) => ({
                              ...base,
                              sections: on
                                ? [...base.sections, opt.key]
                                : base.sections.filter((k) => k !== opt.key),
                            }));
                          }}
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {d.is_superuser && (
                <p style={{ color: "var(--muted)", fontSize: "0.85rem", margin: "0 0 0.75rem" }}>
                  Superusers always have access to every section.
                </p>
              )}

              <div className="field" style={{ marginBottom: "0.75rem" }}>
                <label>New password (optional)</label>
                <input
                  type="password"
                  value={d.password}
                  placeholder="Leave blank to keep current"
                  autoComplete="new-password"
                  onChange={(e) =>
                    updateDraft(row, (base) => ({ ...base, password: e.target.value }))
                  }
                />
              </div>

              <div className="cms-btn-row" style={{ marginTop: "0.5rem" }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={!dirty || savingId === row.id}
                  onClick={() => saveUser(row)}
                >
                  {savingId === row.id ? "Saving…" : "Save changes"}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  disabled={!dirty || savingId === row.id}
                  onClick={() => resetDraft(row)}
                >
                  Reset
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  disabled={isSelf || deletingId === row.id}
                  title={isSelf ? "You cannot delete your own account" : undefined}
                  onClick={() => deleteUser(row)}
                >
                  {deletingId === row.id ? "Deleting…" : "Delete user"}
                </button>
              </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {rows.length === 0 && (
        <p style={{ color: "var(--muted)", padding: 12 }}>No staff users loaded.</p>
      )}
    </div>
  );
}
