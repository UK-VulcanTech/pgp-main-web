import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function AboutPage() {
  const [core, setCore] = useState({});
  const [diff, setDiff] = useState("[]");
  const [approach, setApproach] = useState("[]");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    api.get("/pages/about/").then(({ data }) => {
      const { differentiator_cards: d, approach_steps: a, ...rest } = data;
      setCore(rest);
      setDiff(JSON.stringify(d ?? [], null, 2));
      setApproach(JSON.stringify(a ?? [], null, 2));
    });
  }, []);

  async function save(e) {
    e.preventDefault();
    setMsg("");
    setErr("");
    try {
      await api.patch("/pages/about/", {
        ...core,
        differentiator_cards: JSON.parse(diff),
        approach_steps: JSON.parse(approach),
      });
      setMsg("Saved.");
    } catch (ex) {
      setErr(ex.message || JSON.stringify(ex.response?.data));
    }
  }

  const txt = (key, label, rows = 3) => (
    <div className="field" key={key}>
      <label>{label}</label>
      <textarea
        rows={rows}
        value={core[key] ?? ""}
        onChange={(e) => setCore((s) => ({ ...s, [key]: e.target.value }))}
      />
    </div>
  );

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
      <h1 style={{ marginTop: 0 }}>About page</h1>
      <form onSubmit={save} className="card">
        {inp("hero_title", "Hero title")}
        {txt("hero_intro", "Hero intro", 4)}
        {inp("differentiators_section_title", "Differentiators section title")}
        {inp("who_heading", "Who we serve heading")}
        {txt("who_body", "Who we serve body", 3)}
        {inp("outcome_heading", "Outcome heading")}
        {inp("outcome_subheading", "Outcome subheading")}
        {txt("outcome_body", "Outcome body", 3)}
        {inp("outcome_cta_label", "Outcome CTA label")}
        {inp("outcome_cta_url", "Outcome CTA URL")}
        {inp("approach_pill", "Approach pill")}
        {inp("approach_heading", "Approach heading")}
        {inp("approach_bottom_cta_label", "Bottom CTA label")}
        {inp("approach_bottom_cta_url", "Bottom CTA URL")}
        <div className="field">
          <label>Differentiator cards (JSON)</label>
          <textarea className="code" value={diff} onChange={(e) => setDiff(e.target.value)} />
        </div>
        <div className="field">
          <label>Approach steps (JSON, bullets = string[])</label>
          <textarea
            className="code"
            value={approach}
            onChange={(e) => setApproach(e.target.value)}
          />
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
