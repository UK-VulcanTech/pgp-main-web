/** Map CMS `icon_key` to SVGs for technology domains & enablement rows. */

export const DomainIconSoftware = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" strokeLinecap="round" />
    <path d="M7 8h3M7 11h5" strokeLinecap="round" />
  </svg>
);
export const DomainIconChart = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path d="M3 3v18h18" strokeLinecap="round" />
    <path d="M7 16l4-5 4 3 4-6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const DomainIconComm = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <circle cx="12" cy="12" r="3" />
    <path
      d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"
      strokeLinecap="round"
    />
  </svg>
);
export const DomainIconDc = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <rect x="2" y="2" width="20" height="8" rx="2" />
    <rect x="2" y="14" width="20" height="8" rx="2" />
    <path d="M6 6h.01M6 18h.01" strokeLinecap="round" />
  </svg>
);
export const DomainIconCmd = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" strokeLinecap="round" />
    <circle cx="12" cy="10" r="3" />
    <path d="M6 10h3M15 10h3" strokeLinecap="round" />
  </svg>
);

const DOMAIN_BY_KEY = {
  software: DomainIconSoftware,
  chart: DomainIconChart,
  comm: DomainIconComm,
  dc: DomainIconDc,
  cmd: DomainIconCmd,
};

export function iconForDomainKey(key) {
  const Ico = DOMAIN_BY_KEY[key] || DomainIconSoftware;
  return <Ico />;
}

const EnableIcon1 = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <rect x="2" y="2" width="20" height="8" rx="2" />
    <rect x="2" y="14" width="20" height="8" rx="2" />
    <path d="M6 6h.01M6 18h.01" strokeLinecap="round" />
  </svg>
);
const EnableIcon2 = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" strokeLinecap="round" />
    <path d="M7 9l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const EnableIcon3 = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <circle cx="12" cy="5" r="2" />
    <circle cx="5" cy="19" r="2" />
    <circle cx="19" cy="19" r="2" />
    <path d="M12 7v4M12 11l-5 6M12 11l5 6" strokeLinecap="round" />
  </svg>
);

const ENABLE_FALLBACK = [EnableIcon1, EnableIcon2, EnableIcon3];

export function iconForEnablementKey(key, index) {
  const Ico = DOMAIN_BY_KEY[key] || ENABLE_FALLBACK[index % ENABLE_FALLBACK.length];
  return <Ico />;
}
