import { useEffect, useState } from "react";
import { api } from "../api/client";

const cats = [
  { value: "quick", label: "Quick links" },
  { value: "sector", label: "Sectors" },
  { value: "legal", label: "Legal" },
];

export default function FooterLinksPage() {
  const [rows, setRows] = useState([]);
  const [msg, setMsg] = useState("");

  async function load() {
    const { data } = await api.get("/footer-links/");
    setRows(data);
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get("/footer-links/");
        if (!cancelled) setRows(data);
      } catch {
        if (!cancelled) setRows([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function add() {
    await api.post("/footer-links/", {
      category: "quick",
      label: "New link",
      url: "/",
      sort_order: rows.length,
    });
    load();
  }

  async function saveRow(id) {
    const r = rows.find((x) => x.id === id);
    if (!r) return;
    await api.patch(`/footer-links/${id}/`, r);
    setMsg("Saved.");
    setTimeout(() => setMsg(""), 2000);
    load();
  }

  async function del(id) {
    if (!confirm("Delete this link?")) return;
    await api.delete(`/footer-links/${id}/`);
    load();
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Footer links</h1>
      <button type="button" className="btn btn-primary" style={{ marginBottom: 16 }} onClick={add}>
        Add row
      </button>
      {msg && <p className="ok">{msg}</p>}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {rows.map((r) => (
          <div key={r.id} className="card" style={{ display: "grid", gap: 8 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr auto", gap: 8 }}>
              <div className="field" style={{ margin: 0 }}>
                <label>Category</label>
                <select
                  value={r.category}
                  onChange={(e) =>
                    setRows((list) =>
                      list.map((x) => (x.id === r.id ? { ...x, category: e.target.value } : x))
                    )
                  }
                >
                  {cats.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field" style={{ margin: 0 }}>
                <label>Sort</label>
                <input
                  type="number"
                  value={r.sort_order}
                  onChange={(e) =>
                    setRows((list) =>
                      list.map((x) =>
                        x.id === r.id
                          ? { ...x, sort_order: parseInt(e.target.value, 10) || 0 }
                          : x
                      )
                    )
                  }
                />
              </div>
              <div className="field" style={{ margin: 0 }}>
                <label>Label</label>
                <input
                  value={r.label}
                  onChange={(e) =>
                    setRows((list) =>
                      list.map((x) => (x.id === r.id ? { ...x, label: e.target.value } : x))
                    )
                  }
                />
              </div>
              <div className="cms-btn-row" style={{ alignSelf: "stretch" }}>
                <button type="button" className="btn btn-primary" onClick={() => saveRow(r.id)}>
                  Save
                </button>
                <button type="button" className="btn btn-danger" onClick={() => del(r.id)}>
                  Delete
                </button>
              </div>
            </div>
            <div className="field" style={{ margin: 0 }}>
              <label>URL</label>
              <input
                value={r.url}
                onChange={(e) =>
                  setRows((list) =>
                    list.map((x) => (x.id === r.id ? { ...x, url: e.target.value } : x))
                  )
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
