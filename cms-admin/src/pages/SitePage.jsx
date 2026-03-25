import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function SitePage() {
  const [f, setF] = useState({});
  const [logo, setLogo] = useState(null);
  const [header, setHeader] = useState(null);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    api.get("/site/").then(({ data }) => setF(data));
  }, []);

  async function save(e) {
    e.preventDefault();
    setMsg("");
    setErr("");
    const fd = new FormData();
    Object.entries(f).forEach(([k, v]) => {
      if (v != null && v !== "") fd.append(k, v);
    });
    if (logo) fd.append("logo", logo);
    if (header) fd.append("header_image", header);
    try {
      await api.patch("/site/", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const { data } = await api.get("/site/");
      setF(data);
      setLogo(null);
      setHeader(null);
      setMsg("Saved.");
    } catch (ex) {
      setErr(JSON.stringify(ex.response?.data || ex.message));
    }
  }

  if (!Object.keys(f).length) return <p style={{ color: "var(--muted)" }}>Loading…</p>;

  const field = (key, label) => (
    <div className="field" key={key}>
      <label>{label}</label>
      <input
        value={f[key] ?? ""}
        onChange={(e) => setF((s) => ({ ...s, [key]: e.target.value }))}
      />
    </div>
  );

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Site settings</h1>
      <form onSubmit={save} className="card">
        {field("meta_title", "Meta title")}
        <div className="field">
          <label>Meta description</label>
          <textarea
            className="code"
            style={{ minHeight: 80 }}
            value={f.meta_description ?? ""}
            onChange={(e) => setF((s) => ({ ...s, meta_description: e.target.value }))}
          />
        </div>
        <div className="field">
          <label>Logo (file)</label>
          <input type="file" accept="image/*" onChange={(e) => setLogo(e.target.files?.[0] || null)} />
          {f.logo && (
            <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 6 }}>
              Current: {f.logo}
            </div>
          )}
        </div>
        <div className="field">
          <label>Header / wordmark (file)</label>
          <input type="file" accept="image/*" onChange={(e) => setHeader(e.target.files?.[0] || null)} />
          {f.header_image && (
            <div style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: 6 }}>
              Current: {f.header_image}
            </div>
          )}
        </div>
        {field("footer_tagline", "Footer tagline")}
        {field("footer_company_line1", "Footer company line 1")}
        {field("footer_company_line2", "Footer company line 2")}
        {field("social_facebook", "Facebook URL")}
        {field("social_google", "Google URL")}
        {field("social_instagram", "Instagram URL")}
        {field("social_youtube", "YouTube URL")}
        <div className="field">
          <label>Footer address</label>
          <textarea
            value={f.footer_address ?? ""}
            onChange={(e) => setF((s) => ({ ...s, footer_address: e.target.value }))}
          />
        </div>
        {field("footer_email", "Footer email")}
        {field("footer_phone", "Footer phone")}
        {field("copyright_line", "Copyright line")}
        {err && <p className="err">{err}</p>}
        {msg && <p className="ok">{msg}</p>}
        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </form>
    </div>
  );
}
