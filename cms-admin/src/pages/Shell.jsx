import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { NAV_ITEMS, sectionForPath } from "../lib/cmsSections";

export default function Shell() {
  const { logout, canAccessSection, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const visibleNav = NAV_ITEMS.filter((item) => {
    if (item.superuserOnly && !user?.is_superuser) return false;
    if (item.section == null) return true;
    return canAccessSection(item.section);
  });

  useEffect(() => {
    if (!user) return;
    const sec = sectionForPath(location.pathname);
    if (sec && !canAccessSection(sec)) navigate("/app", { replace: true });
  }, [location.pathname, canAccessSection, navigate, user]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    const mq = window.matchMedia("(max-width: 1023px)");
    if (menuOpen && mq.matches) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <div className="cms-shell">
      <button
        type="button"
        className={`cms-sidebar-backdrop${menuOpen ? " is-open" : ""}`}
        aria-label="Close menu"
        onClick={() => setMenuOpen(false)}
      />
      <aside
        id="cms-nav-sidebar"
        className={`cms-sidebar${menuOpen ? " is-open" : ""}`}
        aria-label="Main navigation"
      >
        <div className="cms-sidebar-header">
          <div className="cms-brand-eyebrow">PEAK GLOBAL</div>
          <div style={{ fontWeight: 700, fontSize: "1.05rem", marginTop: 4 }}>Content System</div>
          {user?.username && (
            <div style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 8 }}>
              {user.username}
              {user.is_superuser ? " · Admin" : ""}
            </div>
          )}
        </div>
        <nav className="cms-sidebar-nav">
          {visibleNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `cms-nav-link${isActive ? " is-active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="cms-sidebar-footer">
          <button
            type="button"
            className="btn btn-ghost"
            style={{ width: "100%" }}
            onClick={() => {
              logout();
              navigate("/login", { replace: true });
            }}
          >
            Log out
          </button>
        </div>
      </aside>

      <div className="cms-main-column">
        <header className="cms-topbar">
          <button
            type="button"
            className="cms-menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="cms-nav-sidebar"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            ☰
          </button>
          <div className="cms-brand-compact">
            <div className="cms-brand-eyebrow">PEAK GLOBAL</div>
            <div className="cms-brand-title">Content System</div>
          </div>
          <span style={{ width: "2.5rem", flexShrink: 0 }} aria-hidden />
        </header>
        <main className="cms-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
