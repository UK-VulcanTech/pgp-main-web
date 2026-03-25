export default function Overview() {
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Overview</h1>
      <p style={{ color: "var(--muted)", maxWidth: 560 }}>
        Edit site copy, solutions, and training programs. Public JSON APIs are served at{" "}
        <code style={{ color: "var(--accent)" }}>/api/public/v1/</code> for the marketing site.
        All write endpoints require a staff JWT.
      </p>
      <div
        className="card"
        style={{ marginTop: 24, maxWidth: 520, fontSize: "0.9rem", color: "var(--muted)" }}
      >
        <strong style={{ color: "var(--text)" }}>Security</strong>
        <ul style={{ paddingLeft: 18, margin: "12px 0 0" }}>
          <li>Staff-only login; short-lived access tokens + refresh rotation + blacklist.</li>
          <li>Public POST contact is rate-limited (scoped throttle).</li>
          <li>Uploads: image types only, 5MB max.</li>
          <li>Production: set DEBUG=False, SECRET_KEY, ALLOWED_HOSTS, CORS_ALLOWED_ORIGINS.</li>
        </ul>
      </div>
    </div>
  );
}
