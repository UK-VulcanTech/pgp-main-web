import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function ImpactPage() {
  const [core, setCore] = useState({});
  const [metrics, setMetrics] = useState("[]");
  const [cases, setCases] = useState("[]");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    api.get("/pages/impact/").then(({ data }) => {
      const { metrics: m, case_studies: c, ...rest } = data;
      setCore(rest);
      setMetrics(JSON.stringify(m ?? [], null, 2));
      setCases(JSON.stringify(c ?? [], null, 2));
    });
  }, []);

  async function save(e) {
    e.preventDefault();
    setMsg("");
    setErr("");
    try {
      await api.patch("/pages/impact/", {
        ...core,
        metrics: JSON.parse(metrics),
        case_studies: JSON.parse(cases),
      });
      setMsg("Saved.");
    } catch (ex) {
      setErr(ex.message || JSON.stringify(ex.response?.data));
    }
  }

  if (!Object.keys(core).length && !msg) {
    return <p style={{ color: "var(--muted)" }}>Loading…</p>;
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Impact page</h1>
      <form onSubmit={save} className="card">
        <div className="field">
          <label>Hero eyebrow</label>
          <input
            value={core.hero_eyebrow ?? ""}
            onChange={(e) => setCore((s) => ({ ...s, hero_eyebrow: e.target.value }))}
          />
        </div>
        <div className="field">
          <label>Headline</label>
          <textarea
            rows={4}
            value={core.headline ?? ""}
            onChange={(e) => setCore((s) => ({ ...s, headline: e.target.value }))}
          />
        </div>
        <div className="field">
          <label>Headline highlight (yellow span)</label>
          <input
            value={core.headline_highlight ?? ""}
            onChange={(e) => setCore((s) => ({ ...s, headline_highlight: e.target.value }))}
          />
        </div>
        <div className="field">
          <label>Metrics section title</label>
          <input
            value={core.metrics_section_title ?? ""}
            onChange={(e) => setCore((s) => ({ ...s, metrics_section_title: e.target.value }))}
          />
        </div>
        <div className="field">
          <label>Case studies section title</label>
          <input
            value={core.case_studies_section_title ?? ""}
            onChange={(e) =>
              setCore((s) => ({ ...s, case_studies_section_title: e.target.value }))
            }
          />
        </div>
        <div className="field">
          <label>Metrics (JSON)</label>
          <textarea className="code" value={metrics} onChange={(e) => setMetrics(e.target.value)} />
        </div>
        <div className="field">
          <label>Case studies (JSON, nested quadrants)</label>
          <textarea className="code" value={cases} onChange={(e) => setCases(e.target.value)} />
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
