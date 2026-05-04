import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

const SOLUTIONS_ITEMS = [
  {
    to: "/solutions/energy-infrastructure",
    title: "Energy Infrastructure",
    sub: "Optimizing grid reliability",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2 L4 14 h7 l-1 8 9-12 h-7 z" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    to: "/solutions/waste-recycling",
    title: "Waste & Recycling",
    sub: "Modern environmental systems",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 7l3-3 4 4-3 3z" />
        <path d="M5 14l-2 4 4 1" />
        <path d="M17 9l4 1-1 4" />
        <path d="M14 19l-3-3-4 3" />
      </svg>
    ),
  },
  {
    to: "/solutions/renewables",
    title: "Renewables",
    sub: "Scalable green power",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" />
      </svg>
    ),
  },
  {
    to: "/solutions/water-sanitation",
    title: "Water & Sanitation",
    sub: "Sustainable lifecycle services",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3 C7 10 5 13 5 16 a7 7 0 0 0 14 0 c0-3-2-6-7-13z" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    to: "/solutions/transportation",
    title: "Transportation",
    sub: "Enhancing global mobility",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="13" height="10" rx="1.5" />
        <path d="M15 10h4l3 4v3h-7z" />
        <circle cx="7" cy="19" r="2" fill="currentColor" stroke="none" />
        <circle cx="18" cy="19" r="2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    to: "/solutions/technology",
    title: "Technology",
    sub: "Data-driven visibility",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="12" rx="1.5" />
        <path d="M3 13h18" />
        <path d="M9 20h6" />
        <path d="M12 17v3" />
      </svg>
    ),
  },
  {
    to: "/solutions/real-estate",
    title: "Real Estate",
    sub: "High-impact asset development",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11 L12 4 L21 11 V20 H3 Z" />
        <path d="M9 20v-6h6v6" />
      </svg>
    ),
  },
  {
    to: "/solutions/healthcare",
    title: "Healthcare",
    sub: "Strengthening care access",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21s-7-4.3-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.7-9.5 9-9.5 9z" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    to: "/solutions/capital-access",
    title: "Capital Access",
    sub: "Connecting funding to execution",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
        <path d="M6 9v0M18 15v0" />
      </svg>
    ),
  },
];

const TRAINING_ITEMS = [
  {
    to: "/training/skills-transfer",
    title: "Skills Transfer",
    sub: "Knowledge sharing programs",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 8h12l-3-3M20 16H8l3 3" />
      </svg>
    ),
  },
  {
    to: "/training/intelligence-training",
    title: "Intelligence Training",
    sub: "Strategic intelligence skills",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3 a5 5 0 0 0-5 5 v3 a3 3 0 0 0 3 3 v3 a2 2 0 0 0 4 0 v-3 a3 3 0 0 0 3-3 V8 a5 5 0 0 0-5-5 z" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    to: "/training/technology-training",
    title: "Technology Training",
    sub: "Digital skills development",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="5" width="18" height="12" rx="1.5" />
        <path d="M9 20h6M12 17v3" />
      </svg>
    ),
  },
  {
    to: "/training/cybersecurity-training",
    title: "Cybersecurity Training",
    sub: "Cyber threat defense",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    to: "/training/digital-workforce-training",
    title: "Digital Workforce Training",
    sub: "Adoption-ready transformation",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="9" r="2.2" />
        <path d="M3 19c0-3 3-5 6-5s6 2 6 5" />
        <path d="M15 18c0-2 2-3 4-3" />
      </svg>
    ),
  },
];

function MegaMenu({ items, narrow }) {
  return (
    <div className={`mega-menu${narrow ? " mega-menu--narrow" : ""}`} role="menu">
      <div className="mega-menu__grid">
        {items.map((item) => (
          <Link key={item.to} to={item.to} className="mega-item" role="menuitem">
            <span className="mega-item__icon" aria-hidden="true">
              {item.icon}
            </span>
            <span className="mega-item__text">
              <span className="mega-item__title">{item.title}</span>
              <span className="mega-item__sub">{item.sub}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function NavDropdown({ to, label, items, narrow, openKey, setOpenKey, dropdownKey }) {
  const isOpen = openKey === dropdownKey;
  const ref = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpenKey((k) => (k === dropdownKey ? null : k));
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [dropdownKey, setOpenKey]);

  return (
    <div ref={ref} className={`nav-dropdown${isOpen ? " open" : ""}`} data-nav-dropdown>
      <NavLink
        to={to}
        end
        className={({ isActive }) =>
          isActive ? "nav-dropdown__trigger active" : "nav-dropdown__trigger"
        }
      >
        {label}
      </NavLink>
      <button
        type="button"
        className="nav-dropdown__caret"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={`Open ${label} menu`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpenKey(isOpen ? null : dropdownKey);
        }}
      >
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
          <path
            d="M1 1l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <MegaMenu items={items} narrow={narrow} />
    </div>
  );
}

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openKey, setOpenKey] = useState(null);
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setOpenKey(null);
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setOpenKey(null);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const sunSvg = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
  const moonSvg = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );

  return (
    <>
      <a href="#main" className="sr-only">Skip to content</a>
      <header className={`site-header${scrolled ? " scrolled" : ""}`} role="banner">
        <div className="site-header__inner">
          <Link to="/" className="site-logo" aria-label="Peak Global Partners home">
            <img
              className="site-logo__img"
              src="/images/pgp-logo.png"
              alt=""
              width="188"
              height="151"
            />
            <span>Peak Global Partners</span>
          </Link>
          <nav className={`primary-nav${open ? " open" : ""}`} aria-label="Primary">
            <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : undefined)}>
              Home
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => (isActive ? "active" : undefined)}>
              About
            </NavLink>
            <NavDropdown
              to="/solutions"
              label="Solutions"
              items={SOLUTIONS_ITEMS}
              dropdownKey="solutions"
              openKey={openKey}
              setOpenKey={setOpenKey}
            />
            <NavDropdown
              to="/training"
              label="Training & Skills Transfer"
              items={TRAINING_ITEMS}
              narrow
              dropdownKey="training"
              openKey={openKey}
              setOpenKey={setOpenKey}
            />
            <NavLink to="/digital-fast-track" className={({ isActive }) => (isActive ? "active" : undefined)}>
              Digital Fast Track
            </NavLink>
            <NavLink to="/approach" className={({ isActive }) => (isActive ? "active" : undefined)}>
              Approach
            </NavLink>
          </nav>
          <div className="header-actions">
            <button
              type="button"
              className="theme-toggle"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            >
              {theme === "dark" ? sunSvg : moonSvg}
            </button>
            <Link className="btn btn-primary" to="/contact">
              Contact<span className="arrow" aria-hidden="true">→</span>
            </Link>
            <button
              type="button"
              className="menu-toggle"
              aria-label="Open menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
