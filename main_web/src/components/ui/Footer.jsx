import { useMemo } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaGooglePlusG, FaInstagram, FaYoutube, FaMapMarkerAlt, FaEnvelope, FaPhone } from "react-icons/fa";
import { useFooterLinks, useSiteSettings } from "../../hooks/usePublicApi";
import fallbackLogo from "../../assets/images/logo.png";

function FooterLink({ url, children, className = "" }) {
  const base = `hover:text-black ${className}`.trim();
  if (!url) {
    return <span className={base}>{children}</span>;
  }
  if (/^https?:\/\//i.test(url)) {
    return (
      <a href={url} className={`cursor-pointer ${base}`}>
        {children}
      </a>
    );
  }
  return (
    <Link to={url} className={`cursor-pointer ${base}`}>
      {children}
    </Link>
  );
}

function SocialIconButton({ href, label, children }) {
  const ring =
    "w-10 h-10 flex items-center justify-center border rounded-full border-gray-300 text-gray-700 transition-colors";
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${ring} hover:bg-gray-200 cursor-pointer`}
        aria-label={label}
      >
        {children}
      </a>
    );
  }
  return (
    <span className={`${ring} text-gray-400 cursor-not-allowed`} aria-hidden>
      {children}
    </span>
  );
}

export default function Footer() {
  const { data: site } = useSiteSettings();
  const { data: groups } = useFooterLinks();

  const quick = useMemo(
    () => [...(groups?.quick || [])].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    [groups]
  );
  const sector = useMemo(
    () => [...(groups?.sector || [])].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    [groups]
  );
  const legal = useMemo(
    () => [...(groups?.legal || [])].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)),
    [groups]
  );

  const f = site?.footer || {};
  const logoSrc = site?.logo || fallbackLogo;
  const social = f.social || {};

  return (
    <footer className="bg-gray-100 text-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src={logoSrc} alt="Peak Global Partners" className="h-10 w-auto" />
            <span className="text-lg font-semibold text-[#0d1f35] leading-tight">
              {f.company_line1 || "Peak Global"}
              <br />
              {f.company_line2 || "Partners"}
            </span>
          </div>

          <p className="text-sm mb-6 text-gray-600">{f.tagline || "Building systems that last"}</p>

          <div className="flex gap-3">
            <SocialIconButton href={social.facebook} label="Facebook">
              <FaFacebookF />
            </SocialIconButton>
            <SocialIconButton href={social.google} label="Google">
              <FaGooglePlusG />
            </SocialIconButton>
            <SocialIconButton href={social.instagram} label="Instagram">
              <FaInstagram />
            </SocialIconButton>
            <SocialIconButton href={social.youtube} label="YouTube">
              <FaYoutube />
            </SocialIconButton>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
          <ul className="space-y-3 text-sm">
            {quick.map((item) => (
              <li key={`${item.label}-${item.url}`}>
                <FooterLink url={item.url} className="cursor-pointer">
                  {item.label}
                </FooterLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-4">The Sectors</h3>
          <ul className="space-y-3 text-sm">
            {sector.map((item) => (
              <li key={`${item.label}-${item.url}`}>
                <FooterLink url={item.url} className="cursor-pointer">
                  {item.label}
                </FooterLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
          <div className="space-y-4 text-sm">
            {f.address && (
              <div className="flex gap-3">
                <FaMapMarkerAlt className="mt-1 text-gray-500 shrink-0" />
                <p className="whitespace-pre-line">{f.address}</p>
              </div>
            )}
            {f.email && (
              <div className="flex gap-3 items-center">
                <FaEnvelope className="text-gray-500 shrink-0" />
                <a href={`mailto:${f.email}`} className="hover:text-black cursor-pointer">
                  {f.email}
                </a>
              </div>
            )}
            {f.phone && (
              <div className="flex gap-3 items-center">
                <FaPhone className="text-gray-500 shrink-0" />
                <a href={`tel:${String(f.phone).replace(/\s/g, "")}`} className="hover:text-black cursor-pointer">
                  {f.phone}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className=" py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-col items-center justify-between text-sm text-[#7B7E86]">
          <div className="flex gap-6 mb-3 md:mb-0 flex-wrap justify-center">
            {legal.map((item) => (
              <FooterLink key={`${item.label}-${item.url}`} url={item.url} className="cursor-pointer">
                {item.label}
              </FooterLink>
            ))}
          </div>
          <p>{f.copyright || "© 2026 Peak Global Partners. All Rights Reserved."}</p>
        </div>
      </div>
    </footer>
  );
}
