import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function TechnologyPage() {
  const [core, setCore] = useState({});
  const [domains, setDomains] = useState("[]");
  const [enable, setEnable] = useState("[]");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    api.get("/pages/technology/").then(({ data }) => {
      const { domains: d, enablement_items: e, ...rest } = data;
      setCore(rest);
      setDomains(JSON.stringify(d ?? [], null, 2));
      setEnable(JSON.stringify(e ?? [], null, 2));
    });
  }, []);

  async function save(e) {
    e.preventDefault();
    setMsg("");
    setErr("");
    try {
      await api.patch("/pages/technology/", {
        ...core,
        domains: JSON.parse(domains),
        enablement_items: JSON.parse(enable),
      });
      setMsg("Saved.");
    } catch (ex) {
      setErr(ex.message || JSON.stringify(ex.response?.data));
    }
  }

  const inp = (key, label) => (
    <div className="field" key={key}>
      <label>{label}</label>
      <input
        value={core[key] ?? ""}
        onChange={(e) => setCore((s) => ({ ...s, [key]: e.target.value }))}
      />
    </div>
  );

  if (!Object.keys(core).length && !msg) {
    return <p style={{ color: "var(--muted)" }}>Loading…</p>;
  }

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Technology solution page</h1>
      <form onSubmit={save} className="card">
        {inp("hero_label", "Hero label")}
        {inp("title_black_1", "Title black 1")}
        {inp("title_black_2", "Title black 2")}
        {inp("title_yellow", "Title yellow")}
        <div className="field">
          <label>Overview text</label>
          <textarea
            rows={4}
            value={core.overview_text ?? ""}
            onChange={(e) => setCore((s) => ({ ...s, overview_text: e.target.value }))}
          />
        </div>
        {inp("overview_sidebar_label", "Overview sidebar label")}
        {inp("domains_heading", "Domains heading")}
        {inp("enablement_heading", "Enablement heading")}
        {inp("outcome_eyebrow", "Outcome eyebrow")}
        <div className="field">
          <label>Outcome headline</label>
          <textarea
            rows={3}
            value={core.outcome_headline ?? ""}
            onChange={(e) => setCore((s) => ({ ...s, outcome_headline: e.target.value }))}
          />
        </div>
        {inp("outcome_cta_label", "Outcome CTA label")}
        {inp("outcome_cta_url", "Outcome CTA URL")}
        <div className="field">
          <label>Domains (JSON)</label>
          <textarea className="code" value={domains} onChange={(e) => setDomains(e.target.value)} />
        </div>
        <div className="field">
          <label>Enablement items (JSON)</label>
          <textarea className="code" value={enable} onChange={(e) => setEnable(e.target.value)} />
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
