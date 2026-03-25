import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api/client";

export default function TrainingEdit() {
  const { slug } = useParams();
  const [core, setCore] = useState(null);
  const [cards, setCards] = useState("[]");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    api.get(`/training-areas/${slug}/`).then(({ data }) => {
      const { cards: c, ...rest } = data;
      setCore(rest);
      setCards(JSON.stringify(c ?? [], null, 2));
    });
  }, [slug]);

  async function save(e) {
    e.preventDefault();
    setMsg("");
    setErr("");
    try {
      await api.patch(`/training-areas/${slug}/`, {
        ...core,
        cards: JSON.parse(cards),
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
        <Link to="/app/training">← Training</Link>
      </p>
      <h1 style={{ marginTop: 0 }}>Training: {slug}</h1>
      <form onSubmit={save} className="card">
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
          <label>Featured (hub)</label>
          <select
            value={core.featured ? "yes" : "no"}
            onChange={(e) => setCore((s) => ({ ...s, featured: e.target.value === "yes" }))}
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        <div className="field">
          <label>Hub subtitle</label>
          <input
            value={core.hub_subtitle ?? ""}
            onChange={(e) => setCore((s) => ({ ...s, hub_subtitle: e.target.value }))}
          />
        </div>
        <div className="field">
          <label>Hub order</label>
          <input
            type="number"
            value={core.hub_order ?? 0}
            onChange={(e) =>
              setCore((s) => ({ ...s, hub_order: parseInt(e.target.value, 10) || 0 }))
            }
          />
        </div>
        <div className="field">
          <label>Category</label>
          <input
            value={core.category ?? ""}
            onChange={(e) => setCore((s) => ({ ...s, category: e.target.value }))}
          />
        </div>
        <div className="field">
          <label>Title</label>
          <input
            value={core.title ?? ""}
            onChange={(e) => setCore((s) => ({ ...s, title: e.target.value }))}
          />
        </div>
        <div className="field">
          <label>Description start</label>
          <textarea
            rows={2}
            value={core.description_start ?? ""}
            onChange={(e) => setCore((s) => ({ ...s, description_start: e.target.value }))}
          />
        </div>
        <div className="field">
          <label>Highlighted text</label>
          <input
            value={core.highlighted_text ?? ""}
            onChange={(e) => setCore((s) => ({ ...s, highlighted_text: e.target.value }))}
          />
        </div>
        <div className="field">
          <label>Description end</label>
          <textarea
            rows={2}
            value={core.description_end ?? ""}
            onChange={(e) => setCore((s) => ({ ...s, description_end: e.target.value }))}
          />
        </div>
        <div className="field">
          <label>Deliver section title</label>
          <input
            value={core.deliver_section_title ?? ""}
            onChange={(e) => setCore((s) => ({ ...s, deliver_section_title: e.target.value }))}
          />
        </div>
        <div className="field">
          <label>Display style</label>
          <select
            value={core.display_style ?? "emoji"}
            onChange={(e) => setCore((s) => ({ ...s, display_style: e.target.value }))}
          >
            <option value="emoji">emoji</option>
            <option value="numbered">numbered</option>
          </select>
        </div>
        <div className="field">
          <label>Outcome tag</label>
          <input
            value={core.outcome_tag ?? ""}
            onChange={(e) => setCore((s) => ({ ...s, outcome_tag: e.target.value }))}
          />
        </div>
        <div className="field">
          <label>Outcome title</label>
          <textarea
            rows={3}
            value={core.outcome_title ?? ""}
            onChange={(e) => setCore((s) => ({ ...s, outcome_title: e.target.value }))}
          />
        </div>
        <div className="field">
          <label>Cards (JSON)</label>
          <textarea className="code" value={cards} onChange={(e) => setCards(e.target.value)} />
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
