import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login(username, password);
      nav("/app", { replace: true });
    } catch (ex) {
      const d = ex.response?.data;
      setErr(
        d?.detail ||
          d?.non_field_errors?.[0] ||
          "Login failed. Staff account required."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        padding: "clamp(1rem, 4vw, 1.5rem)",
        background:
          "radial-gradient(ellipse 80% 60% at 50% -20%, #1e3a5f 0%, transparent 50%), var(--bg)",
      }}
    >
      <div className="card" style={{ width: "100%", maxWidth: "min(26rem, 100%)" }}>
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.2em",
              color: "var(--accent)",
              marginBottom: 8,
            }}
          >
            PGP CMS
          </div>
          <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700 }}>
            Sign in
          </h1>
          <p style={{ margin: "8px 0 0", color: "var(--muted)", fontSize: "0.9rem" }}>
            Staff credentials only. JWT-secured session.
          </p>
        </div>
        <form onSubmit={onSubmit}>
          <div className="field">
            <label>Username</label>
            <input
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {err && <p className="err">{err}</p>}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: 8 }}
            disabled={loading}
          >
            {loading ? "Signing in…" : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
