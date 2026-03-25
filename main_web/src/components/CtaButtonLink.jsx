import { Link } from "react-router-dom";

/** Internal <Link> or external <a> from a CMS URL string. */
export default function CtaButtonLink({ href, className = "", children, ...rest }) {
  if (!href) {
    return (
      <span className={className} {...rest}>
        {children}
      </span>
    );
  }
  const external = /^https?:\/\//i.test(href);
  if (external) {
    return (
      <a href={href} className={className} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link to={href} className={className} {...rest}>
      {children}
    </Link>
  );
}
