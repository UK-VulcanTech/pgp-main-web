import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/client";

export default function SolutionEdit() {
  const { slug } = useParams();
  const [core, setCore] = useState(null);
  const [deliverables, setDeliverables] = useState("[]");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    api.get(`/solutions/${slug}/`).then(({ data }) => {
      const { deliverables: d, ...rest } = data;
      setCore(rest);
      setDeliverables(JSON.stringify(d ?? [], null, 2));
    });
  }, [slug]);

  async function save(e) {
    e.preventDefault();
    setMsg("");
    setErr("");
    try {
      await api.patch(`/solutions/${slug}/`, {
        ...core,
        deliverables: JSON.parse(deliverables),
      });
      setMsg("Saved.");
    } catch (ex) {
      setErr(JSON.stringify(ex.response?.data || ex.message));
    }
  }

  if (!core) return <p style={{ color: "var(--muted)" }}>Loading…</p>;

  return (
    <div>
      <p>
        <Link to="/app/solutions">← Solutions</Link>
      </p>
      <h1 style={{ marginTop: 0 }}>Solution: {slug}</h1>
      <form onSubmit={save} className="card">
        <div className="field">
          <label>Nav title</label>
          <input
            value={core.nav_title ?? ""}
            onChange={(e) => setCore((s) => ({ ...s, nav_title: e.target.value }))}
          />
        </div>
        <div className="field">
          <label>Nav subtitle</label>
          <input
            value={core.nav_subtitle ?? ""}
            onChange={(e) => setCore((s) => ({ ...s, nav_subtitle: e.target.value }))}
          />
        </div>
        <div className="field">
          <label>Nav column (1=left, 2=right)</label>
          <input
            type="number"
            min={1}
            max={2}
            value={core.nav_column ?? 1}
            onChange={(e) =>
              setCore((s) => ({ ...s, nav_column: parseInt(e.target.value, 10) || 1 }))
            }
          />
        </div>
        <div className="field">
          <label>Nav order</label>
          <input
            type="number"
            value={core.nav_order ?? 0}
            onChange={(e) =>
              setCore((s) => ({ ...s, nav_order: parseInt(e.target.value, 10) || 0 }))
            }
          />
        </div>
        <div className="field">
          <label>Published</label>
          <select
            value={core.is_published ? "yes" : "no"}
            onChange={(e) =>
              setCore((s) => ({ ...s, is_published: e.target.value === "yes" }))
            }
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        <div className="field">
          <label>Hero label</label>
          <input
            value={core.hero_label ?? ""}
            onChange={(e) => setCore((s) => ({ ...s, hero_label: e.target.value }))}
          />
        </div>
        <div className="field">
          <label>Title black 1</label>
          <input
            value={core.title_black_1 ?? ""}
            onChange={(e) => setCore((s) => ({ ...s, title_black_1: e.target.value }))}
          />
        </div>
        <div className="field">
          <label>Title black 2</label>
          <input
            value={core.title_black_2 ?? ""}
            onChange={(e) => setCore((s) => ({ ...s, title_black_2: e.target.value }))}
          />
        </div>
        <div className="field">
          <label>Title yellow</label>
          <input
            value={core.title_yellow ?? ""}
            onChange={(e) => setCore((s) => ({ ...s, title_yellow: e.target.value }))}
          />
        </div>
        <div className="field">
          <label>Overview</label>
          <textarea
            rows={4}
            value={core.overview_text ?? ""}
            onChange={(e) => setCore((s) => ({ ...s, overview_text: e.target.value }))}
          />
        </div>
        <div className="field">
          <label>Outcome headline</label>
          <textarea
            rows={3}
            value={core.outcome_headline ?? ""}
            onChange={(e) => setCore((s) => ({ ...s, outcome_headline: e.target.value }))}
          />
        </div>
        <div className="field">
          <label>Outcome CTA label</label>
          <input
            value={core.outcome_cta ?? ""}
            onChange={(e) => setCore((s) => ({ ...s, outcome_cta: e.target.value }))}
          />
        </div>
        <div className="field">
          <label>Outcome CTA URL</label>
          <input
            value={core.outcome_cta_url ?? ""}
            onChange={(e) => setCore((s) => ({ ...s, outcome_cta_url: e.target.value }))}
          />
        </div>
        <div className="field">
          <label>Deliverables (JSON)</label>
          <textarea
            className="code"
            value={deliverables}
            onChange={(e) => setDeliverables(e.target.value)}
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
