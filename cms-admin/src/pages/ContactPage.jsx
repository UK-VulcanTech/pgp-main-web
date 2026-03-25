import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function ContactPage() {
  const [core, setCore] = useState({});
  const [sectors, setSectors] = useState("[]");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    api.get("/pages/contact/").then(({ data }) => {
      const { sector_options: s, ...rest } = data;
      setCore(rest);
      setSectors(JSON.stringify(s ?? [], null, 2));
    });
  }, []);

  async function save(e) {
    e.preventDefault();
    setMsg("");
    setErr("");
    try {
      await api.patch("/pages/contact/", {
        ...core,
        sector_options: JSON.parse(sectors),
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
      <h1 style={{ marginTop: 0 }}>Contact page</h1>
      <form onSubmit={save} className="card">
        <div className="field">
          <label>Headline (gold)</label>
          <input
            value={core.headline_gold ?? ""}
            onChange={(e) => setCore((s) => ({ ...s, headline_gold: e.target.value }))}
          />
        </div>
        <div className="field">
          <label>Headline (dark)</label>
          <input
            value={core.headline_dark ?? ""}
            onChange={(e) => setCore((s) => ({ ...s, headline_dark: e.target.value }))}
          />
        </div>
        <div className="field">
          <label>Intro</label>
          <textarea
            rows={4}
            value={core.intro ?? ""}
            onChange={(e) => setCore((s) => ({ ...s, intro: e.target.value }))}
          />
        </div>
        <div className="field">
          <label>Submit button label</label>
          <input
            value={core.submit_label ?? ""}
            onChange={(e) => setCore((s) => ({ ...s, submit_label: e.target.value }))}
          />
        </div>
        <div className="field">
          <label>Sector options (JSON)</label>
          <textarea className="code" value={sectors} onChange={(e) => setSectors(e.target.value)} />
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
