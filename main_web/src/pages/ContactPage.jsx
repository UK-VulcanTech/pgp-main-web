import { useRef, useState } from "react";

const SECTORS = [
  "Energy Infrastructure",
  "Renewables",
  "Water & Sanitation",
  "Waste Management & Recycling",
  "Technology (Data Centers, Command Centers, Software)",
  "Transportation (Roads, Ports)",
  "Healthcare",
  "Real Estate",
  "Capital Access",
  "Training & Skills Transfer",
  "Multiple sectors / Cross-sector",
];

export default function ContactPage() {
  const formRef = useRef(null);
  const [status, setStatus] = useState({ kind: null, msg: "" });
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    if (!formRef.current) return;
    setStatus({ kind: null, msg: "" });
    setSubmitting(true);
    try {
      const data = new FormData(formRef.current);
      const action = formRef.current.getAttribute("action");
      if (action && action.includes("formspree.io")) {
        const res = await fetch(action, {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error("Network");
      } else {
        await new Promise((r) => setTimeout(r, 600));
      }
      formRef.current.reset();
      setStatus({
        kind: "success",
        msg:
          "Thanks — your inquiry was received. A member of the PGP team will be in touch within two business days.",
      });
    } catch {
      setStatus({
        kind: "error",
        msg:
          "Something went wrong sending your message. Please try again or email info@peakglobalpartners.com directly.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main id="main">
      <section className="page-header">
        <div className="page-header__bg">
          <img src="/images/topo-navy.png" alt="" />
        </div>
        <div className="page-header__inner">
          <div className="page-header__eyebrow">Contact PGP</div>
          <h1 className="page-header__title">Let's build what lasts.</h1>
          <p className="page-header__lede">
            Whether you're structuring a partnership, delivering an
            infrastructure program, or modernizing operations with technology,
            PGP can help bring clarity, governance, and execution to your
            initiative.
          </p>
        </div>
      </section>

      <section>
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2>Headquarters</h2>
              <p>
                724 W. Lancaster Ave, Suite 210
                <br />
                Wayne, PA 19087
              </p>
              <dl>
                <dt>Phone</dt>
                <dd>
                  <a href="tel:+16106024200">610-602-4200</a>
                </dd>
                <dt>Email</dt>
                <dd>
                  <a href="mailto:info@peakglobalpartners.com">
                    info@peakglobalpartners.com
                  </a>
                </dd>
                <dt>Next steps</dt>
                <dd>
                  We review your inquiry within two business days. If aligned,
                  we schedule a 30-minute scoping call, then come back with how
                  PGP would approach the work.
                </dd>
              </dl>
            </div>

            <form
              ref={formRef}
              className="contact-form"
              action="https://formspree.io/f/info@peakglobalpartners.com"
              method="POST"
              onSubmit={onSubmit}
            >
              {status.kind === "success" && (
                <div className="form-success show">{status.msg}</div>
              )}
              {status.kind === "error" && (
                <div className="form-error show">{status.msg}</div>
              )}

              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="name">
                    Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="Your name"
                  />
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
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="you@example.com"
                  />
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
                  {SECTORS.map((s) => (
                    <option key={s}>{s}</option>
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
              </div>
              <div className="form-field" style={{ display: "none" }}>
                <label htmlFor="_gotcha">Leave this empty</label>
                <input
                  type="text"
                  id="_gotcha"
                  name="_gotcha"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? "Sending…" : "Request a Consultation"}{" "}
                <span className="arrow" aria-hidden="true">→</span>
              </button>
              <p className="form-disclosure">
                By submitting, you consent to PGP contacting you about your
                inquiry. We don't share submissions.
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
