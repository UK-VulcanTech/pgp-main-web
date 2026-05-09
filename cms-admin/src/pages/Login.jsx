import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { user, login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-ink-soft">Loading…</div>;
  }
  if (user) return <Navigate to={location.state?.from || "/"} replace />;

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(username, password);
      navigate(location.state?.from || "/", { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.detail || "Sign-in failed. Check your credentials.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-navy text-white p-12">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-white/10 flex items-center justify-center font-semibold">
            PGP
          </div>
          <span className="font-semibold tracking-tight">Peak Global Partners · CMS</span>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-white/50 mb-3">
            Content control
          </div>
          <h1 className="text-3xl font-medium tracking-tight leading-tight max-w-md">
            Edit every page, sector, and program from one dashboard.
          </h1>
          <p className="mt-4 text-white/70 max-w-md">
            Changes go live instantly on staging.peakglobalpartners.com. Use the
            sidebar to jump between pages and collections.
          </p>
        </div>
        <div className="text-xs text-white/40">© Peak Global Partners</div>
      </div>

      <div className="flex items-center justify-center p-8">
        <form
          onSubmit={onSubmit}
          className="w-full max-w-sm bg-white rounded-xl border border-divider shadow-sm p-7"
        >
          <h2 className="text-xl font-semibold tracking-tight">Sign in</h2>
          <p className="text-sm text-ink-soft mt-1">
            Use your CMS staff credentials.
          </p>

          {error && (
            <div className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <label className="block mt-5 text-sm font-medium">
            Username
            <input
              type="text"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              required
            />
          </label>

          <label className="block mt-4 text-sm font-medium">
            Password
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              required
            />
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full bg-navy hover:bg-navy-2 text-white rounded-md py-2.5 text-sm font-medium disabled:opacity-60"
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
