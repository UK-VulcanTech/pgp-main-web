import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useNavigation, useSiteSettings } from "../../hooks/usePublicApi";
import { iconForSolutionSlug, iconForTrainingPath } from "../../lib/navMegaIcons";
import fallbackLogo from "../../assets/images/logo.png";
import fallbackHeader from "../../assets/images/header.png";

function DropdownItem({ icon, title, subtitle, slug, path, onClose }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (path) navigate(path);
    else if (slug) {
      navigate(slug === "technology" ? "/solutions/technology" : `/solutions/${slug}`);
    }
    onClose?.();
  };

  const clickable = !!(path || slug);

  return (
    <div
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={clickable ? handleClick : undefined}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleClick();
              }
            }
          : undefined
      }
      className={`flex items-start gap-3 px-3 py-3 rounded-lg hover:bg-white/5 transition-colors duration-150 ${
        clickable ? "cursor-pointer" : "cursor-default"
      }`}
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

function Dropdown({ label, linkTo, leftItems, rightItems, panelWidth, isOpen, onToggle, onClose }) {
  const navigate = useNavigate();

  return (
    <div className="relative">
      <div className="flex items-center gap-1 py-2">
        <span
          onClick={() => {
            if (linkTo) {
              navigate(linkTo);
              onClose();
            } else onToggle();
          }}
          className="text-base font-semibold text-primary hover:opacity-75 transition-opacity duration-200 whitespace-nowrap cursor-pointer"
        >
          {label}
        </span>
        <button
          type="button"
          onClick={onToggle}
          className="text-primary hover:opacity-75 transition-opacity duration-200 cursor-pointer"
          aria-label="Toggle dropdown"
        >
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={onClose} aria-hidden />
          <div
            className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 ${panelWidth} bg-primary rounded-2xl shadow-2xl z-50`}
          >
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

export default function NavBar() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  /** Mobile/tablet: which accordion is open — null = none (submenus start collapsed). */
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const { data: site } = useSiteSettings();
  const { data: nav } = useNavigation();

  const toggle = (name) => setOpenDropdown((prev) => (prev === name ? null : name));
  const closeAll = () => setOpenDropdown(null);

  const setMobileMenuOpen = (next) => {
    setMobileOpen(next);
    if (!next) {
      setMobileExpanded(null);
      closeAll();
    }
  };

  const toggleMobileSection = (id) => {
    setMobileExpanded((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1280px)");
    const onChange = () => {
      if (mq.matches) {
        setMobileOpen(false);
        setMobileExpanded(null);
        setOpenDropdown(null);
      }
    };
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const logoSrc = site?.logo || fallbackLogo;
  const headerSrc = site?.header_image || fallbackHeader;

  const { solutionsLeft, solutionsRight, trainingLeft, trainingRight } = useMemo(() => {
    const sd = nav?.solutions_dropdown || {};
    const left = (sd.left || []).map((item) => ({
      title: item.title,
      subtitle: item.subtitle,
      slug: item.slug,
      icon: iconForSolutionSlug(item.slug),
    }));
    const right = (sd.right || []).map((item) => ({
      title: item.title,
      subtitle: item.subtitle,
      slug: item.slug,
      icon: iconForSolutionSlug(item.slug),
    }));
    const training = nav?.training_dropdown || [];
    const mid = Math.ceil(training.length / 2) || 1;
    const tLeft = training.slice(0, mid).map((item) => ({
      title: item.title,
      subtitle: item.subtitle,
      path: item.path,
      slug: undefined,
      icon: iconForTrainingPath(item.path),
    }));
    const tRight = training.slice(mid).map((item) => ({
      title: item.title,
      subtitle: item.subtitle,
      path: item.path,
      slug: undefined,
      icon: iconForTrainingPath(item.path),
    }));
    return { solutionsLeft: left, solutionsRight: right, trainingLeft: tLeft, trainingRight: tRight };
  }, [nav]);

  const navLinkClass =
    "text-sm xl:text-base font-semibold text-primary py-2 cursor-pointer whitespace-nowrap";

  const allSolutions = [...solutionsLeft, ...solutionsRight];
  const allTraining = [...trainingLeft, ...trainingRight];

  return (
    <>
    <nav className="sticky top-0 z-50 bg-secondary xl:z-40">
      <div className="max-w-675 mx-auto w-full px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img src={logoSrc} alt="" className="h-10 w-auto" />
            <img src={headerSrc} alt="Peak Global Partners" className="h-5 mt-1 w-auto hidden sm:block" />
          </Link>

          <div className="hidden xl:flex items-center gap-3 2xl:gap-8 ml-auto">
            <Link to="/" className={`${navLinkClass} hover:opacity-75 transition-opacity duration-200`}>
              Home
            </Link>
            <Link to="/about" className={`${navLinkClass} hover:opacity-75 transition-opacity duration-200`}>
              About
            </Link>

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

            <Link
              to="/about#how-we-deliver"
              className={`${navLinkClass} hover:opacity-75 transition-opacity duration-200`}
            >
              Approach
            </Link>
            <Link to="/impact" className={`${navLinkClass} hover:opacity-75 transition-opacity duration-200`}>
              Impact
            </Link>
            <span className={navLinkClass}>Insights</span>
            <Link
              to="/contact"
              className="text-base font-semibold px-4 py-2 text-primary hover:opacity-75 transition-opacity duration-200 whitespace-nowrap"
            >
              Contact
            </Link>
          </div>

          <button
            type="button"
            className="xl:hidden p-2 rounded-md text-gray-600 hover:text-[#1a3c5e] hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-drawer"
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
      </div>
    </nav>

    {/* Mobile / tablet: overlay + drawer (does not shift page content) */}
    <div className="xl:hidden" aria-hidden={!mobileOpen}>
      <button
        type="button"
        aria-label="Close menu"
        className={`fixed top-16 left-0 right-0 bottom-0 z-[45] bg-black/40 transition-opacity duration-300 ease-out ${
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />
      <aside
        id="mobile-nav-drawer"
        className={`fixed top-16 right-0 bottom-0 z-[55] flex w-[min(22rem,88vw)] max-w-full flex-col border-l border-gray-200 bg-secondary shadow-2xl transition-transform duration-300 ease-out ${
          mobileOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}
        aria-hidden={!mobileOpen}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <span className="text-sm font-semibold text-primary">Menu</span>
          <button
            type="button"
            className="rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-[#1a3c5e]"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain py-3 space-y-1">
          <Link
            to="/"
            className="block px-4 py-2 text-sm font-medium text-gray-700 hover:opacity-75"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/about"
            className="block px-4 py-2 text-sm font-medium text-gray-700 hover:opacity-75"
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </Link>
          <Link
            to="/about#how-we-deliver"
            className="block px-4 py-2 text-sm font-medium text-gray-700 hover:opacity-75"
            onClick={() => setMobileMenuOpen(false)}
          >
            Approach
          </Link>
          <span className="block px-4 py-2 text-sm font-medium text-gray-700 cursor-default">Insights</span>
          <Link
            to="/impact"
            className="block px-4 py-2 text-sm font-medium text-gray-700 hover:opacity-75"
            onClick={() => setMobileMenuOpen(false)}
          >
            Impact
          </Link>
          <Link
            to="/contact"
            className="block px-4 py-2 text-sm font-medium text-gray-700 hover:opacity-75"
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact
          </Link>

          <div className="border-t border-gray-100 mt-2 pt-2">
            <button
              type="button"
              className="flex w-full items-center justify-between px-4 py-2 text-left text-sm font-semibold text-gray-800"
              onClick={() => toggleMobileSection("solutions")}
              aria-expanded={mobileExpanded === "solutions"}
            >
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Solutions</span>
              <svg
                className={`w-4 h-4 shrink-0 text-gray-500 transition-transform ${mobileExpanded === "solutions" ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {mobileExpanded === "solutions" &&
              allSolutions.map((item) => (
                <Link
                  key={item.title}
                  to={item.slug === "technology" ? "/solutions/technology" : `/solutions/${item.slug}`}
                  className="flex items-center gap-3 pl-6 pr-4 py-2 text-gray-600 hover:opacity-75"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-yellow-500">{item.icon}</span>
                  <div>
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-gray-400">{item.subtitle}</p>
                  </div>
                </Link>
              ))}
          </div>

          <div className="border-t border-gray-100 mt-1 pt-2">
            <button
              type="button"
              className="flex w-full items-center justify-between px-4 py-2 text-left text-sm font-semibold text-gray-800"
              onClick={() => toggleMobileSection("training")}
              aria-expanded={mobileExpanded === "training"}
            >
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider pr-2">
                Training & Skills Transfer
              </span>
              <svg
                className={`w-4 h-4 shrink-0 text-gray-500 transition-transform ${mobileExpanded === "training" ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {mobileExpanded === "training" && (
              <>
                <Link
                  to="/training"
                  className="block pl-6 pr-4 py-2 text-sm font-medium text-primary hover:opacity-80"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  View all training →
                </Link>
                {allTraining.map((item) => (
                  <Link
                    key={item.title}
                    to={item.path || "/training"}
                    className="flex items-center gap-3 pl-6 pr-4 py-2 text-gray-600 hover:opacity-75"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-yellow-500">{item.icon}</span>
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-gray-400">{item.subtitle}</p>
                    </div>
                  </Link>
                ))}
              </>
            )}
          </div>
        </div>
      </aside>
    </div>
    </>
  );
}
