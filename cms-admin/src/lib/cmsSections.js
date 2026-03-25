/** Keys must match backend `apps.content.cms_sections.ALL_CMS_SECTIONS`. */
export const CMS_SECTION_OPTIONS = [
  { key: "site", label: "Site & footer" },
  { key: "home", label: "Home page" },
  { key: "about", label: "About" },
  { key: "contact_page", label: "Contact page" },
  { key: "impact", label: "Impact" },
  { key: "technology", label: "Technology" },
  { key: "footer_links", label: "Footer links" },
  { key: "solutions", label: "Solutions" },
  { key: "training", label: "Training" },
  { key: "contact_submissions", label: "Form submissions" },
  { key: "upload", label: "Media upload (images)" },
];

export const NAV_ITEMS = [
  { to: "/app", end: true, label: "Overview", section: null },
  { to: "/app/site", label: "Site & footer", section: "site" },
  { to: "/app/home", label: "Home page", section: "home" },
  { to: "/app/about", label: "About", section: "about" },
  { to: "/app/contact", label: "Contact page", section: "contact_page" },
  { to: "/app/impact", label: "Impact", section: "impact" },
  { to: "/app/technology", label: "Technology", section: "technology" },
  { to: "/app/solutions", label: "Solutions", section: "solutions" },
  { to: "/app/training", label: "Training", section: "training" },
  { to: "/app/footer-links", label: "Footer links", section: "footer_links" },
  { to: "/app/submissions", label: "Form submissions", section: "contact_submissions" },
  {
    to: "/app/users",
    label: "Users",
    section: "users",
    superuserOnly: true,
  },
];

const PATH_RULES = [
  ["/app/users", "users"],
  ["/app/site", "site"],
  ["/app/home", "home"],
  ["/app/about", "about"],
  ["/app/contact", "contact_page"],
  ["/app/impact", "impact"],
  ["/app/technology", "technology"],
  ["/app/solutions", "solutions"],
  ["/app/training", "training"],
  ["/app/footer-links", "footer_links"],
  ["/app/submissions", "contact_submissions"],
];

export function sectionForPath(pathname) {
  const p = pathname.replace(/\/$/, "") || "/app";
  if (p === "/app") return null;
  for (const [prefix, sec] of PATH_RULES) {
    if (p === prefix || p.startsWith(`${prefix}/`)) return sec;
  }
  return null;
}
