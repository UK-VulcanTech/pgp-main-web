import { useState } from "react";
import { publicClient } from "../api/publicClient";
import { useContactPage } from "../hooks/usePublicApi";

const CONTACT_FALLBACK = {
  page_eyebrow: "Contact PGP",
  page_title: "Let's build what lasts.",
  page_lede:
    "Whether you're structuring a partnership, delivering an infrastructure program, or modernizing operations with technology, PGP can help bring clarity, governance, and execution to your initiative.",
  page_image: "/images/topo-navy.webp",
  hq_label: "Headquarters",
  hq_address: "724 W. Lancaster Ave, Suite 210\nWayne, PA 19087",
  phone_label: "Phone",
  phone_number: "610-602-4200",
  email_label: "Email",
  email_address: "info@peakglobalpartners.com",
  next_steps_label: "Next steps",
  next_steps_text:
    "We review your inquiry within two business days. If aligned, we schedule a 30-minute scoping call, and discuss how PGP will approach the project.",
  sectors: [
    { label: "Energy Infrastructure" },
    { label: "Renewables" },
    { label: "Water & Sanitation" },
    { label: "Waste Management & Recycling" },
    { label: "Technology (Data Centers, Command Centers, Software)" },
    { label: "Transportation (Roads, Ports)" },
    { label: "Healthcare" },
    { label: "Real Estate" },
    { label: "Capital Access" },
    { label: "Training & Skills Transfer" },
    { label: "Multiple sectors / Cross-sector" },
  ],
};

export default function ContactPage() {
  const { data } = useContactPage();
  const view = data || CONTACT_FALLBACK;

  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState({ kind: null, message: "" });
  const [fieldErrors, setFieldErrors] = useState({});

  async function handleSubmit(e) {
    e.preventDefault();
    if (submitting) return;

    const form = e.currentTarget;
    const fd = new FormData(form);
    if (fd.get("_gotcha")) return; // honeypot

    const payload = {
      name: (fd.get("name") || "").toString().trim(),
      organization: (fd.get("organization") || "").toString().trim(),
      email: (fd.get("email") || "").toString().trim(),
      country: (fd.get("country") || "").toString().trim(),
      sector: (fd.get("sector") || "").toString(),
      message: (fd.get("message") || "").toString().trim(),
    };

    setSubmitting(true);
    setStatus({ kind: null, message: "" });
    setFieldErrors({});
    try {
      await publicClient.post("/contact/", payload);
      setStatus({
        kind: "success",
        message:
          "Thanks — your inquiry was received. A member of the PGP team will be in touch within two business days.",
      });
      form.reset();
    } catch (err) {
      const data = err?.response?.data;
      if (data && typeof data === "object" && !Array.isArray(data)) {
        setFieldErrors(data);
        setStatus({
          kind: "error",
          message: "Some fields need attention.",
        });
      } else {
        setStatus({
          kind: "error",
          message: `Something went wrong. Please try again or email ${view.email_address} directly.`,
        });
      }
    } finally {
      setSubmitting(false);
    }
  }

  function fieldError(name) {
    const v = fieldErrors[name];
    if (!v) return null;
    return Array.isArray(v) ? v.join(" ") : String(v);
  }

  return (
    <main id="main">
      <section className="page-header">
        <div className="page-header__bg">
          <img src={view.page_image} alt="" />
        </div>
        <div className="page-header__inner">
          <div className="page-header__eyebrow">{view.page_eyebrow}</div>
          <h1 className="page-header__title">{view.page_title}</h1>
          <p className="page-header__lede">{view.page_lede}</p>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2>{view.hq_label}</h2>
              <p style={{ whiteSpace: "pre-line" }}>{view.hq_address}</p>
              <dl>
                <dt>{view.phone_label}</dt>
                <dd>
                  <a href={`tel:${view.phone_number.replace(/[^\d+]/g, "")}`}>
                    {view.phone_number}
                  </a>
                </dd>
                <dt>{view.email_label}</dt>
                <dd>
                  <a href={`mailto:${view.email_address}`}>{view.email_address}</a>
                </dd>
                <dt>{view.next_steps_label}</dt>
                <dd>{view.next_steps_text}</dd>
              </dl>
            </div>

            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              {status.kind === "success" && (
                <div className="form-success show">{status.message}</div>
              )}
              {status.kind === "error" && (
                <div className="form-error show">{status.message}</div>
              )}

              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="name">
                    Name <span className="required">*</span>
                  </label>
                  <input type="text" id="name" name="name" required placeholder="Your name" />
                  {fieldError("name") && (
                    <div className="form-error show" style={{ marginTop: 6 }}>
                      {fieldError("name")}
                    </div>
                  )}
                </div>
                <div className="form-field">
                  <label htmlFor="organization">Organization</label>
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    placeholder="Company, agency, or ministry"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="email">
                    Email <span className="required">*</span>
                  </label>
                  <input type="email" id="email" name="email" required placeholder="you@example.com" />
                  {fieldError("email") && (
                    <div className="form-error show" style={{ marginTop: 6 }}>
                      {fieldError("email")}
                    </div>
                  )}
                </div>
                <div className="form-field">
                  <label htmlFor="country">Country / Region</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    placeholder="Where the program lives"
                  />
                </div>
              </div>
              <div className="form-field">
                <label htmlFor="sector">Sector of interest</label>
                <select id="sector" name="sector" defaultValue="">
                  <option value="" disabled>
                    Select a sector
                  </option>
                  {view.sectors.map((s) => (
                    <option key={s.label}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="message">
                  Project description <span className="required">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  required
                  placeholder="Tell us about your initiative — current stage, stakeholders, timeline, and what success looks like."
                />
                {fieldError("message") && (
                  <div className="form-error show" style={{ marginTop: 6 }}>
                    {fieldError("message")}
                  </div>
                )}
              </div>
              <div className="form-field" style={{ display: "none" }}>
                <label htmlFor="_gotcha">Leave this empty</label>
                <input type="text" id="_gotcha" name="_gotcha" tabIndex={-1} autoComplete="off" />
              </div>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? "Sending…" : "Request a Consultation"}{" "}
                <span className="arrow" aria-hidden="true">→</span>
              </button>
              <p className="form-disclosure">
                By submitting, you consent to PGP contacting you about your inquiry. We don't share submissions.
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
