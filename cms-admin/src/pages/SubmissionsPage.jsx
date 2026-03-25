import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function SubmissionsPage() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    api.get("/contact-submissions/").then(({ data }) => setRows(data));
  }, []);

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Contact submissions</h1>
      <p style={{ color: "var(--muted)" }}>Read-only. Submitted via public API.</p>
      <div className="card cms-table-scroll">
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid var(--border)" }}>
              <th style={{ padding: "0.5rem" }}>When</th>
              <th style={{ padding: "0.5rem" }}>Name</th>
              <th style={{ padding: "0.5rem" }}>Sector</th>
              <th style={{ padding: "0.5rem" }}>Country</th>
              <th style={{ padding: "0.5rem" }}>Message</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: "0.5rem", color: "var(--muted)", whiteSpace: "nowrap" }}>
                  {new Date(r.created_at).toLocaleString()}
                </td>
                <td style={{ padding: "0.5rem" }}>{r.name}</td>
                <td style={{ padding: "0.5rem" }}>{r.sector}</td>
                <td style={{ padding: "0.5rem" }}>{r.country}</td>
                <td style={{ padding: "0.5rem", maxWidth: 360 }}>
                  {(r.project_description || "").slice(0, 200)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <p style={{ color: "var(--muted)", padding: 16 }}>No submissions yet.</p>
        )}
      </div>
    </div>
  );
}
