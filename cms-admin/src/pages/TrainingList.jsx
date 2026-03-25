import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";

export default function TrainingList() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    api.get("/training-areas/").then(({ data }) => setRows(data));
  }, []);

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Training areas</h1>
      <div className="card cms-sheet">
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {rows.map((r) => (
            <li
              key={r.slug}
              style={{
                borderBottom: "1px solid var(--border)",
                padding: "0.65rem 0",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <span>{r.title || r.slug}</span>
              <Link to={`/app/training/${r.slug}`}>Edit</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
