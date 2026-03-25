import { useCallback, useEffect, useState } from "react";
import { api } from "../api/client";

export default function HomePage() {
  const [core, setCore] = useState({});
  const [pillars, setPillars] = useState("[]");
  const [steps, setSteps] = useState("[]");
  const [snapshotCards, setSnapshotCards] = useState([]);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    api.get("/pages/home/").then(({ data }) => {
      const { pillars: p, how_steps: h, snapshot_cards: snap, ...rest } = data;
      setCore(rest);
      setPillars(JSON.stringify(p ?? [], null, 2));
      setSteps(JSON.stringify(h ?? [], null, 2));
      setSnapshotCards(Array.isArray(snap) ? snap : []);
    });
  }, []);

  const uploadSnapshotFile = useCallback(async (cardId, field, file) => {
    if (!file || cardId == null) return;
    setErr("");
    try {
      const fd = new FormData();
      fd.append(field, file);
      const { data } = await api.patch(`/pages/home/snapshot-cards/${cardId}/`, fd);
      setSnapshotCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, ...data } : c)));
      setMsg("Icon updated.");
    } catch (ex) {
      setErr(ex.message || JSON.stringify(ex.response?.data));
    }
  }, []);

  async function save(e) {
    e.preventDefault();
    setMsg("");
    setErr("");
    try {
      const body = {
        ...core,
        pillars: JSON.parse(pillars),
        how_steps: JSON.parse(steps),
        snapshot_cards: snapshotCards.map((c) => {
          const row = {
            id: c.id,
            sort_order: c.sort_order ?? 0,
            title: c.title ?? "",
            description: c.description ?? "",
          };
          if (typeof c.image === "string" && c.image.length) row.image = c.image;
          if (typeof c.hover_image === "string" && c.hover_image.length) {
            row.hover_image = c.hover_image;
          }
          return row;
        }),
      };
      await api.patch("/pages/home/", body);
      setMsg("Saved.");
      const { data } = await api.get("/pages/home/");
      setSnapshotCards(Array.isArray(data.snapshot_cards) ? data.snapshot_cards : []);
    } catch (ex) {
      setErr(ex.message || JSON.stringify(ex.response?.data));
    }
  }

  const field = (key, label) => (
    <div className="field" key={key}>
      <label>{label}</label>
      {key === "hero_h1" || key === "hero_body" || key === "ppp_body" || key === "cta_body" ? (
        <textarea
          value={core[key] ?? ""}
          onChange={(e) => setCore((s) => ({ ...s, [key]: e.target.value }))}
          rows={key === "hero_h1" ? 6 : 4}
        />
      ) : (
        <input value={core[key] ?? ""} onChange={(e) => setCore((s) => ({ ...s, [key]: e.target.value }))} />
      )}
    </div>
  );

  if (!Object.keys(core).length && !msg) {
    return <p style={{ color: "var(--muted)" }}>Loading…</p>;
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Home page</h1>
      <form onSubmit={save} className="card">
        {field("hero_eyebrow", "Hero eyebrow")}
        {field("hero_h1", "Hero headline (multiline)")}
        {field("hero_body", "Hero body")}
        {field("hero_cta_primary_label", "Primary CTA label")}
        {field("hero_cta_primary_url", "Primary CTA URL")}
        {field("hero_cta_secondary_label", "Secondary CTA label")}
        {field("hero_cta_secondary_url", "Secondary CTA URL")}
        {field("what_deliver_title", "What we deliver — title")}
        {field("ppp_heading", "PPP section heading")}
        {field("ppp_body", "PPP body")}
        {field("solutions_snapshot_title", "Solutions snapshot title")}
        {field("how_we_work_title", "How we work title")}
        {field("cta_heading", "Bottom CTA heading")}
        {field("cta_body", "Bottom CTA body")}
        {field("cta_button_label", "Bottom CTA button")}
        {field("cta_button_url", "Bottom CTA URL")}
        <div className="field">
          <label>Pillars (JSON array)</label>
          <textarea className="code" value={pillars} onChange={(e) => setPillars(e.target.value)} />
        </div>
        <div className="field">
          <label>How we work steps (JSON array)</label>
          <textarea className="code" value={steps} onChange={(e) => setSteps(e.target.value)} />
        </div>

        <div className="field">
          <label>Solutions snapshot — card icons (CMS + public site)</label>
          <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 0 }}>
            Each card uses a <strong>default</strong> and <strong>hover</strong> image (PNG/SVG/WebP, etc.). Upload
            below or run <code style={{ fontSize: 12 }}>python manage.py seed_cms</code> in the backend to copy icons
            from <code style={{ fontSize: 12 }}>main_web</code> / <code style={{ fontSize: 12 }}>pgp-main-web-main-old</code>.
          </p>
          {snapshotCards.length === 0 && <p style={{ color: "var(--muted)" }}>No snapshot cards yet — seed the CMS.</p>}
          {snapshotCards.map((c) => (
            <div
              key={c.id}
              style={{
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: 12,
                marginBottom: 12,
                background: "var(--panel)",
              }}
            >
              <p style={{ margin: "0 0 8px", fontWeight: 600, fontSize: 13 }}>{c.title || `Card #${c.id}`}</p>
              <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 8 }}>
                <div>
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>Default</span>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      background: "#1a2233",
                      borderRadius: 6,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {c.image ? (
                      <img src={c.image} alt="" style={{ maxWidth: 36, maxHeight: 36, objectFit: "contain" }} />
                    ) : (
                      <span style={{ fontSize: 10, color: "#888" }}>—</span>
                    )}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>Hover</span>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      background: "#1a2233",
                      borderRadius: 6,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {c.hover_image ? (
                      <img src={c.hover_image} alt="" style={{ maxWidth: 36, maxHeight: 36, objectFit: "contain" }} />
                    ) : (
                      <span style={{ fontSize: 10, color: "#888" }}>—</span>
                    )}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13 }}>
                <label>
                  Default icon{" "}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) uploadSnapshotFile(c.id, "image", f);
                      e.target.value = "";
                    }}
                  />
                </label>
                <label>
                  Hover icon{" "}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) uploadSnapshotFile(c.id, "hover_image", f);
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>

        {err && <p className="err">{err}</p>}
        {msg && <p className="ok">{msg}</p>}
        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </form>
    </div>
  );
}
