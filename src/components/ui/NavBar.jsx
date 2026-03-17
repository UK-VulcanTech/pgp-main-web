import { useState, useRef, useEffect } from "react";
// import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import header from "../../assets/images/header.png";

const solutionsLinks = [
  { label: "Advisory & Consulting", to: "/solutions/advisory" },
  { label: "Investment Strategy", to: "/solutions/investment" },
  { label: "Risk Management", to: "/solutions/risk" },
];

const trainingLinks = [
  { label: "Corporate Training", to: "/training/corporate" },
  { label: "Executive Programs", to: "/training/executive" },
  { label: "Skills Certification", to: "/training/certification" },
];

function Dropdown({ label, links, isOpen, onToggle, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={onToggle}
        className="flex items-center gap-1 text-base font-semibold text-primary hover:text-[#1a3c5e] transition-colors duration-200 py-2"
      >
        {label}
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
          {links.map((link) => (
            // <Link key={link.to} to={link.to} onClick={onClose} className="block px-4 py-2.5 text-sm text-gray-600 hover:text-[#1a3c5e] hover:bg-gray-50 transition-colors duration-150">{link.label}</Link>
            <span
              key={link.to}
              className="block px-4 py-2.5 text-sm text-gray-600 cursor-default"
            >
              {link.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function NavBar() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggle = (name) =>
    setOpenDropdown((prev) => (prev === name ? null : name));

  const closeAll = () => setOpenDropdown(null);

  // const navLinkClass = ({ isActive }) =>
  //   `text-sm font-medium transition-colors duration-200 py-2 border-b-2 ${
  //     isActive
  //       ? "text-[#1a3c5e] border-[#1a3c5e]"
  //       : "text-gray-700 hover:text-[#1a3c5e] border-transparent"
  //   }`;

  const navLinkClass =
    "text-base font-semibold text-primary py-2 cursor-default";

  return (
    <nav className="sticky top-0 z-40 bg-secondary">
      <div className="max-w-[2700px] mx-auto w-full px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          {/* <Link to="/" className="flex items-center gap-2 shrink-0"> */}
          <span className="flex items-center gap-3 shrink-0">
            <img src={logo} alt="logo" className="h-10 w-auto" />
            <img
              src={header}
              alt="Peak Global Partners"
              className="h-5 mt-1 w-auto hidden sm:block"
            />
          </span>

          {/* </Link> */}

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-5 xl:gap-6 2xl:gap-8 ml-auto">
            {" "}
            {/* <NavLink to="/" end className={navLinkClass}>Home</NavLink> */}
            <span className={navLinkClass}>Home</span>
            {/* <NavLink to="/about" className={navLinkClass}>About</NavLink> */}
            <span className={navLinkClass}>About</span>
            <Dropdown
              label="Solutions"
              links={solutionsLinks}
              isOpen={openDropdown === "solutions"}
              onToggle={() => toggle("solutions")}
              onClose={closeAll}
            />
            <Dropdown
              label="Training & Skills Transfer"
              links={trainingLinks}
              isOpen={openDropdown === "training"}
              onToggle={() => toggle("training")}
              onClose={closeAll}
            />
            {/* <NavLink to="/approach" className={navLinkClass}>Approach</NavLink> */}
            <span className={navLinkClass}>Approach</span>
            {/* <NavLink to="/impact" className={navLinkClass}>Impact</NavLink> */}
            <span className={navLinkClass}>Impact</span>
            {/* <NavLink to="/insights" className={navLinkClass}>Insights</NavLink> */}
            <span className={navLinkClass}>Insights</span>
            {/* <NavLink to="/contact" className="text-sm font-medium px-4 py-2 bg-[#1a3c5e] text-white rounded-md hover:bg-[#15304e] transition-colors duration-200">Contact</NavLink> */}
            <span className="text-base font-semibold  px-4 py-2 text-primary cursor-default">
              Contact
            </span>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-[#1a3c5e] hover:bg-gray-100"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 py-3 space-y-1">
            {["Home", "About", "Approach", "Impact", "Insights", "Contact"].map(
              (label) => (
                // <Link key={label} to={...} className="..."> </Link>
                <span
                  key={label}
                  className="block px-3 py-2 text-sm font-medium text-gray-700 cursor-default"
                >
                  {label}
                </span>
              ),
            )}
            <div className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Solutions
            </div>
            {solutionsLinks.map((l) => (
              // <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)} className="...">{l.label}</Link>
              <span
                key={l.to}
                className="block px-6 py-2 text-sm text-gray-600 cursor-default"
              >
                {l.label}
              </span>
            ))}
            <div className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Training & Skills Transfer
            </div>
            {trainingLinks.map((l) => (
              // <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)} className="...">{l.label}</Link>
              <span
                key={l.to}
                className="block px-6 py-2 text-sm text-gray-600 cursor-default"
              >
                {l.label}
              </span>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
