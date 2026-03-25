import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import header from "../../assets/images/header.png";

/* ── Icons ─────────────────────────────────────────────────────────── */
const IcoLightning = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
    <path d="M13 2L3 14h8l-2 8 10-12h-8z" fill="currentColor" />
  </svg>
);
const IcoSun = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
    <circle cx="12" cy="12" r="4" fill="currentColor" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const IcoSeedling = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
    <path d="M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M12 12C12 7 7 3 2 3c0 5 4 9 10 9z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="currentColor" fillOpacity="0.2" />
    <path d="M12 12c0-5 5-9 10-9 0 5-4 9-10 9z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="currentColor" fillOpacity="0.2" />
  </svg>
);
const IcoChip = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
    <rect x="7" y="7" width="10" height="10" rx="1" stroke="currentColor" strokeWidth="2" />
    <path d="M10 7V4M14 7V4M10 20v-3M14 20v-3M7 10H4M7 14H4M20 10h-3M20 14h-3"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const IcoHeart = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      fill="currentColor" />
  </svg>
);
const IcoRecycle = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
    <path d="M7 19H4a1 1 0 0 1-.86-1.5L8 9M11 19h9.14a1 1 0 0 0 .86-1.5L16 9M9 19l3 3m-3-3-3 3M15 5l-3-3-3 3M12 2v7"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IcoDrop = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="currentColor" />
  </svg>
);
const IcoTruck = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
    <rect x="1" y="3" width="15" height="13" rx="1" stroke="currentColor" strokeWidth="2" />
    <path d="M16 8h4l3 3v5h-7V8z" stroke="currentColor" strokeWidth="2" />
    <circle cx="5.5" cy="18.5" r="2.5" fill="currentColor" />
    <circle cx="18.5" cy="18.5" r="2.5" fill="currentColor" />
  </svg>
);
const IcoBuilding = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
    <path d="M3 22V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14M1 22h22"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M9 22V13h6v9" stroke="currentColor" strokeWidth="2" />
    <rect x="8" y="3" width="8" height="3" rx="0.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);
const IcoWallet = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
    <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M2 10h20" stroke="currentColor" strokeWidth="2" />
    <circle cx="16" cy="16" r="1.5" fill="currentColor" />
  </svg>
);
const IcoArrows = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
    <path d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IcoBrain = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24A2.5 2.5 0 0 1 9.5 2z"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24A2.5 2.5 0 0 0 14.5 2z"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
const IcoFingerprint = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
    <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4M12 10a2 2 0 0 1 2 2c0 1.02.1 2.51.26 4"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M6 14c0-3.31 2.69-6 6-6s6 2.69 6 6c0 2.2-.24 3.96-.39 5"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M3 12c0-4.97 4.03-9 9-9s9 4.03 9 9c0 1.42-.33 2.77-.92 3.96"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
const IcoLock = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
    <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" />
    <circle cx="12" cy="16" r="1.5" fill="currentColor" />
  </svg>
);

/* ── Data ───────────────────────────────────────────────────────────── */
const solutionsLeft = [
  { title: "Energy Infrastructure", subtitle: "Optimizing grid reliability",    icon: <IcoLightning />, slug: "energy-infrastructure" },
  { title: "Renewables",            subtitle: "Scalable green power",            icon: <IcoSun />,       slug: "renewables" },
  { title: "Agriculture",           subtitle: "Modernizing food chains",         icon: <IcoSeedling />,  slug: "agriculture" },
  { title: "Technology",            subtitle: "Data-driven visibility",          icon: <IcoChip />,      slug: "technology" },
  { title: "Healthcare",            subtitle: "Strengthening care access",       icon: <IcoHeart />,     slug: "healthcare" },
];
const solutionsRight = [
  { title: "Waste & Recycling",  subtitle: "Modern environmental systems",    icon: <IcoRecycle />,  slug: "waste-recycling" },
  { title: "Water & Sanitation", subtitle: "Sustainable lifecycle services",  icon: <IcoDrop />,     slug: "water-sanitation" },
  { title: "Transportation",     subtitle: "Enhancing global mobility",       icon: <IcoTruck />,    slug: "transportation" },
  { title: "Real Estate",        subtitle: "High-impact asset development",   icon: <IcoBuilding />, slug: "real-estate" },
  { title: "Capital Access",     subtitle: "Connecting funding to execution", icon: <IcoWallet />,   slug: "capital-access" },
];

const trainingLeft = [
  { title: "Skills Transfer",          subtitle: "Knowledge sharing programs",     icon: <IcoArrows />,      path: "/training/skills-transfer" },
  { title: "Technology Training",      subtitle: "Digital skills development",     icon: <IcoChip />,        path: "/training/technology-training" },
  { title: "Police Forensics Training",subtitle: "Crime investigation techniques", icon: <IcoFingerprint />, path: "/training/police-forensics-training" },
];
const trainingRight = [
  { title: "Intelligence Training",  subtitle: "Strategic intelligence skills", icon: <IcoBrain />, path: "/training/intelligence-training" },
  { title: "Cybersecurity Training", subtitle: "Cyber threat defense",          icon: <IcoLock />,  path: "/training/cybersecurity-training" },
];

/* ── DropdownItem ───────────────────────────────────────────────────── */
function DropdownItem({ icon, title, subtitle, slug, path, onClose }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (path) navigate(path);
    else if (slug) navigate(`/solutions/${slug}`);
    if (onClose) onClose();
  };

  const clickable = !!(path || slug);

  return (
    <div
      onClick={handleClick}
      className={`flex items-start gap-3 px-3 py-3 rounded-lg hover:bg-white/5 transition-colors duration-150 ${clickable ? "cursor-pointer" : "cursor-default"}`}
    >
      <div className="shrink-0 w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-yellow-400">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-white font-semibold text-sm leading-tight">{title}</p>
        <p className="text-gray-400 text-xs mt-0.5 leading-snug">{subtitle}</p>
      </div>
    </div>
  );
}

/* ── Dropdown ───────────────────────────────────────────────────────── */
function Dropdown({ label, linkTo, leftItems, rightItems, panelWidth, isOpen, onToggle, onClose }) {
  const navigate = useNavigate();

  return (
    <div className="relative">
      <div className="flex items-center gap-1 py-2">
        {/* Label — navigates to linkTo if provided */}
        <span
          onClick={() => { if (linkTo) { navigate(linkTo); onClose(); } else onToggle(); }}
          className="text-base font-semibold text-primary hover:opacity-75 transition-opacity duration-200 whitespace-nowrap cursor-pointer"
        >
          {label}
        </span>
        {/* Chevron — always toggles dropdown */}
        <button
          onClick={onToggle}
          className="text-primary hover:opacity-75 transition-opacity duration-200 cursor-pointer"
          aria-label="Toggle dropdown"
        >
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <>
          {/* Backdrop — clicking outside closes the dropdown */}
          <div className="fixed inset-0 z-40" onClick={onClose} />

          {/* Panel — above backdrop */}
          <div
            className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 ${panelWidth} bg-primary rounded-2xl shadow-2xl z-50`}
          >
            {/* Triangle pointer */}
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-primary rotate-45 rounded-sm" />

            <div className="grid grid-cols-2 gap-x-2 p-4">
              <div>
                {leftItems.map((item) => (
                  <DropdownItem key={item.title} {...item} onClose={onClose} />
                ))}
              </div>
              <div>
                {rightItems.map((item) => (
                  <DropdownItem key={item.title} {...item} onClose={onClose} />
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ── NavBar ─────────────────────────────────────────────────────────── */
export default function NavBar() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggle = (name) => setOpenDropdown((prev) => (prev === name ? null : name));
  const closeAll = () => setOpenDropdown(null);

  const navLinkClass =
    "text-sm xl:text-base font-semibold text-primary py-2 cursor-pointer whitespace-nowrap";

  return (
    <nav className="sticky top-0 z-40 bg-secondary">
      <div className="max-w-675 mx-auto w-full px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img src={logo} alt="logo" className="h-10 w-auto" />
            <img src={header} alt="Peak Global Partners" className="h-5 mt-1 w-auto hidden sm:block" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden xl:flex items-center gap-3 2xl:gap-8 ml-auto">
            <Link to="/" className={navLinkClass + " hover:opacity-75 transition-opacity duration-200"}>Home</Link>
            <Link to="/about" className={navLinkClass + " hover:opacity-75 transition-opacity duration-200"}>About</Link>

            <Dropdown
              label="Solutions"
              leftItems={solutionsLeft}
              rightItems={solutionsRight}
              panelWidth="w-[580px]"
              isOpen={openDropdown === "solutions"}
              onToggle={() => toggle("solutions")}
              onClose={closeAll}
            />
            <Dropdown
              label="Training & Skills Transfer"
              linkTo="/training"
              leftItems={trainingLeft}
              rightItems={trainingRight}
              panelWidth="w-[520px]"
              isOpen={openDropdown === "training"}
              onToggle={() => toggle("training")}
              onClose={closeAll}
            />

            <Link to="/about#how-we-deliver" className={navLinkClass + " hover:opacity-75 transition-opacity duration-200"}>Approach</Link>
            <Link to="/impact" className={navLinkClass + " hover:opacity-75 transition-opacity duration-200"}>Impact</Link>
            <span className={navLinkClass}>Insights</span>
            <Link to="/contact" className="text-base font-semibold px-4 py-2 text-primary hover:opacity-75 transition-opacity duration-200 whitespace-nowrap">
              Contact
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="xl:hidden p-2 rounded-md text-gray-600 hover:text-[#1a3c5e] hover:bg-gray-100"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="xl:hidden border-t border-gray-100 py-3 space-y-1">
            <Link to="/" className="block px-3 py-2 text-sm font-medium text-gray-700 hover:opacity-75">Home</Link>
            <Link to="/about" className="block px-3 py-2 text-sm font-medium text-gray-700 hover:opacity-75">About</Link>
            <Link to="/about#how-we-deliver" className="block px-3 py-2 text-sm font-medium text-gray-700 hover:opacity-75">Approach</Link>
            <span className="block px-3 py-2 text-sm font-medium text-gray-700 cursor-default">Insights</span>
            <Link to="/impact" className="block px-3 py-2 text-sm font-medium text-gray-700 hover:opacity-75">Impact</Link>
            <Link to="/contact" className="block px-3 py-2 text-sm font-medium text-gray-700 hover:opacity-75">
              Contact
            </Link>

            <div className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Solutions</div>
            {[...solutionsLeft, ...solutionsRight].map((item) => (
              <div key={item.title} className="flex items-center gap-3 px-6 py-2 text-gray-600 cursor-default">
                <span className="text-yellow-500">{item.icon}</span>
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-gray-400">{item.subtitle}</p>
                </div>
              </div>
            ))}

            <div className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Training & Skills Transfer</div>
            {[...trainingLeft, ...trainingRight].map((item) => (
              <Link key={item.title} to={item.path} className="flex items-center gap-3 px-6 py-2 text-gray-600 hover:opacity-75">
                <span className="text-yellow-500">{item.icon}</span>
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-gray-400">{item.subtitle}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
