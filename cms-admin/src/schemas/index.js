/**
 * Schemas for every page-level editor. Each schema lists:
 *   - sections: top-level fields, grouped + grid-laid-out
 *   - inlines: child collections rendered below the form
 *
 * Field shape: { name, label, type?, help?, full?, placeholder?, rows? }
 *   type: text | textarea | url | image-url | checkbox | number | select
 *   full: span both columns on desktop
 */

const ctaFields = [
  { name: "cta_heading", label: "CTA heading" },
  { name: "cta_body", label: "CTA body", type: "textarea", rows: 2, full: true },
  { name: "cta_primary_label", label: "Primary CTA label" },
  { name: "cta_primary_url", label: "Primary CTA URL", placeholder: "/contact" },
  { name: "cta_secondary_label", label: "Secondary CTA label" },
  { name: "cta_secondary_url", label: "Secondary CTA URL", placeholder: "/approach" },
];
const ctaSection = { title: "CTA band (bottom of page)", fields: ctaFields };

const pageHeaderFields = [
  { name: "page_eyebrow", label: "Eyebrow", placeholder: "About PGP" },
  { name: "page_image_url", type: "image", imageField: "page_image", label: "Background image URL", help: "e.g. /images/topo-navy.webp" },
  { name: "page_title", label: "Headline", type: "textarea", rows: 2, full: true },
  { name: "page_lede", label: "Lede paragraph", type: "textarea", rows: 3, full: true },
];

export const SITE_SCHEMA = {
  title: "Site settings",
  description: "Brand, footer copy, and metadata used across every page.",
  endpoint: "/pages/site/",
  sections: [
    {
      title: "Metadata",
      fields: [
        { name: "meta_title", label: "Meta title" },
        { name: "meta_description", label: "Meta description", type: "textarea", rows: 2, full: true },
      ],
    },
    {
      title: "Footer",
      fields: [
        { name: "footer_tagline", label: "Tagline", type: "textarea", rows: 2, full: true },
        { name: "footer_address", label: "Address", type: "textarea", rows: 2, full: true },
        { name: "footer_phone", label: "Phone" },
        { name: "footer_email", label: "Email" },
        { name: "copyright_line", label: "Copyright line", full: true },
      ],
    },
    {
      title: "Social",
      fields: [
        { name: "social_linkedin", label: "LinkedIn URL", type: "url" },
        { name: "social_x", label: "X / Twitter URL", type: "url" },
        { name: "social_youtube", label: "YouTube URL", type: "url" },
      ],
    },
  ],
  inlines: [],
};

export const HOME_SCHEMA = {
  title: "Home page",
  description: "The site's front door — hero, pillars, the PPP feature row, and the CTA band.",
  endpoint: "/pages/home/",
  sections: [
    {
      title: "Hero",
      fields: [
        { name: "hero_eyebrow", label: "Eyebrow", placeholder: "Strategy · Operations · Execution" },
        { name: "hero_image_url", type: "image", imageField: "hero_image", label: "Background image URL", help: "e.g. /images/hero-control-room.webp" },
        { name: "hero_title_lead", label: "Headline (lead text)", full: true },
        { name: "hero_title_em", label: "Headline (emphasised italic part)", full: true },
        { name: "hero_lede", label: "Lede", type: "textarea", rows: 3, full: true },
        { name: "hero_cta_primary_label", label: "Primary CTA label" },
        { name: "hero_cta_primary_url", label: "Primary CTA URL" },
        { name: "hero_cta_secondary_label", label: "Secondary CTA label" },
        { name: "hero_cta_secondary_url", label: "Secondary CTA URL" },
      ],
    },
    {
      title: "What PGP Delivers — section heading",
      fields: [
        { name: "pillars_section_eyebrow", label: "Eyebrow" },
        { name: "pillars_section_title", label: "Heading", full: true },
        { name: "pillars_section_lede", label: "Lede", type: "textarea", rows: 3, full: true },
      ],
    },
    {
      title: "Built for Public-Private Partnerships",
      fields: [
        { name: "ppp_image_url", type: "image", imageField: "ppp_image", label: "Image URL", help: "e.g. /images/satellite-earth.webp" },
        { name: "ppp_eyebrow", label: "Eyebrow" },
        { name: "ppp_title", label: "Heading", full: true },
        { name: "ppp_body", label: "Body", type: "textarea", rows: 4, full: true },
      ],
    },
    {
      title: "Section headings",
      fields: [
        { name: "snapshot_section_eyebrow", label: "Snapshot eyebrow" },
        { name: "snapshot_section_title", label: "Snapshot heading", full: true },
        { name: "howwework_section_eyebrow", label: "How We Work eyebrow" },
        { name: "howwework_section_title", label: "How We Work heading", full: true },
      ],
    },
    ctaSection,
  ],
  inlines: [
    {
      key: "hero_meta",
      title: "Hero meta tiles",
      endpoint: "/home/hero-meta/",
      parentKey: "page",
      fields: [
        { name: "label", label: "Label", placeholder: "Mission Scope" },
        { name: "value", label: "Value", placeholder: "Critical Infrastructure" },
        { name: "desc", label: "Description", full: true },
      ],
    },
    {
      key: "pillars",
      title: "Pillar cards",
      endpoint: "/home/pillars/",
      parentKey: "page",
      fields: [
        { name: "num", label: "Number", placeholder: "01" },
        { name: "title", label: "Title" },
        { name: "description", label: "Description", type: "textarea", rows: 3, full: true },
        { name: "link_label", label: "Link label" },
        { name: "link_url", label: "Link URL" },
      ],
    },
    {
      key: "ppp_bullets",
      title: "PPP bullets",
      endpoint: "/home/ppp-bullets/",
      parentKey: "page",
      fields: [{ name: "text", label: "Bullet", full: true }],
    },
    {
      key: "process_steps",
      title: "How We Work — process steps",
      endpoint: "/home/process-steps/",
      parentKey: "page",
      fields: [
        { name: "num", label: "Number", placeholder: "01 / Define" },
        { name: "title", label: "Title" },
        { name: "description", label: "Description", type: "textarea", rows: 3, full: true },
      ],
    },
  ],
};

export const ABOUT_SCHEMA = {
  title: "About page",
  description: "Page header, principles, who-we-serve feature row, what-we-measure cards.",
  endpoint: "/pages/about/",
  sections: [
    { title: "Page header", fields: pageHeaderFields },
    {
      title: "Principles section",
      fields: [
        { name: "principles_section_eyebrow", label: "Eyebrow" },
        { name: "principles_section_title", label: "Heading", full: true },
      ],
    },
    {
      title: "Who we serve (feature row)",
      fields: [
        { name: "whoweserve_image_url", type: "image", imageField: "whoweserve_image", label: "Image URL" },
        { name: "whoweserve_eyebrow", label: "Eyebrow" },
        { name: "whoweserve_title", label: "Title", full: true },
        { name: "whoweserve_body", label: "Body", type: "textarea", rows: 3, full: true },
      ],
    },
    {
      title: "What we measure",
      fields: [
        { name: "measure_section_eyebrow", label: "Eyebrow" },
        { name: "measure_section_title", label: "Heading", full: true },
        { name: "measure_section_lede", label: "Lede", type: "textarea", rows: 3, full: true },
      ],
    },
    ctaSection,
  ],
  inlines: [
    {
      key: "principles",
      title: "Principles",
      endpoint: "/about/principles/",
      parentKey: "page",
      fields: [
        { name: "num", label: "Number" },
        { name: "title", label: "Title" },
        { name: "description", label: "Description", type: "textarea", rows: 3, full: true },
      ],
    },
    {
      key: "who_bullets",
      title: "Who we serve — bullets",
      endpoint: "/about/who-bullets/",
      parentKey: "page",
      fields: [{ name: "text", label: "Bullet", full: true }],
    },
    {
      key: "measure_cards",
      title: "What we measure — cards",
      endpoint: "/about/measure-cards/",
      parentKey: "page",
      fields: [
        { name: "label", label: "Eyebrow / category" },
        { name: "title", label: "Title" },
        { name: "description", label: "Description", type: "textarea", rows: 3, full: true },
      ],
    },
  ],
};

export const APPROACH_SCHEMA = {
  title: "Approach page",
  description: "Page header + the five numbered delivery blocks.",
  endpoint: "/pages/approach/",
  sections: [{ title: "Page header", fields: pageHeaderFields }, ctaSection],
  inlines: [
    {
      key: "blocks",
      title: "Approach blocks (each block has its own bullets — edit in /admin/ for now)",
      endpoint: "/approach/blocks/",
      parentKey: "page",
      fields: [
        { name: "num", label: "Number", placeholder: "01" },
        { name: "title", label: "Title" },
      ],
    },
  ],
};

export const CONTACT_SCHEMA = {
  title: "Contact page",
  description: "Page header + sidebar info + sector dropdown options.",
  endpoint: "/pages/contact/",
  sections: [
    { title: "Page header", fields: pageHeaderFields },
    {
      title: "Sidebar info",
      fields: [
        { name: "hq_label", label: "HQ label" },
        { name: "hq_address", label: "HQ address", type: "textarea", rows: 3, full: true },
        { name: "phone_label", label: "Phone label" },
        { name: "phone_number", label: "Phone number" },
        { name: "email_label", label: "Email label" },
        { name: "email_address", label: "Email address" },
        { name: "next_steps_label", label: "Next-steps label" },
        { name: "next_steps_text", label: "Next-steps body", type: "textarea", rows: 3, full: true },
      ],
    },
  ],
  inlines: [
    {
      key: "sectors",
      title: "Sector-of-interest dropdown options",
      endpoint: "/contact/sectors/",
      parentKey: "page",
      fields: [{ name: "label", label: "Label", full: true }],
    },
  ],
};

export const SOLUTIONS_PAGE_SCHEMA = {
  title: "Solutions hub",
  description: "Page header + section title + bottom CTA. Sectors themselves are edited under Solutions.",
  endpoint: "/pages/solutions/",
  sections: [
    { title: "Page header", fields: pageHeaderFields },
    {
      title: "Section heading",
      fields: [
        { name: "section_eyebrow", label: "Eyebrow" },
        { name: "section_title", label: "Heading", full: true },
      ],
    },
    ctaSection,
  ],
  inlines: [],
};

export const TRAINING_PAGE_SCHEMA = {
  title: "Training hub",
  description: "Page header + section title + bottom CTA. Programs themselves are edited under Training.",
  endpoint: "/pages/training/",
  sections: [
    { title: "Page header", fields: pageHeaderFields },
    {
      title: "Section heading",
      fields: [
        { name: "section_eyebrow", label: "Eyebrow" },
        { name: "section_title", label: "Heading", full: true },
      ],
    },
    ctaSection,
  ],
  inlines: [],
};

export const DFT_SCHEMA = {
  title: "Digital Fast Track page",
  description: "Hero + four pillars + 365-day timeline + outcomes feature row.",
  endpoint: "/pages/digital-fast-track/",
  sections: [
    {
      title: "Page header",
      fields: [
        { name: "page_eyebrow", label: "Eyebrow" },
        { name: "page_image_url", type: "image", imageField: "page_image", label: "Background image URL" },
        { name: "page_title", label: "Headline", type: "textarea", rows: 2, full: true },
        { name: "page_lede", label: "Lede", type: "textarea", rows: 3, full: true },
        { name: "page_cta_primary_label", label: "Primary CTA label (in header)" },
        { name: "page_cta_primary_url", label: "Primary CTA URL" },
        { name: "page_cta_secondary_label", label: "Secondary CTA label" },
        { name: "page_cta_secondary_url", label: "Secondary CTA URL" },
      ],
    },
    {
      title: "Why a fast track",
      fields: [
        { name: "why_section_eyebrow", label: "Eyebrow" },
        { name: "why_section_title", label: "Heading", full: true },
        { name: "why_section_lede", label: "Lede", type: "textarea", rows: 3, full: true },
      ],
    },
    {
      title: "Pillars heading",
      fields: [
        { name: "pillars_section_eyebrow", label: "Eyebrow" },
        { name: "pillars_section_title", label: "Heading", full: true },
        { name: "pillars_section_lede", label: "Lede", type: "textarea", rows: 3, full: true },
      ],
    },
    {
      title: "Timeline heading",
      fields: [
        { name: "timeline_section_eyebrow", label: "Eyebrow" },
        { name: "timeline_section_title", label: "Heading", full: true },
        { name: "timeline_section_lede", label: "Lede", type: "textarea", rows: 3, full: true },
      ],
    },
    {
      title: "Outcomes (feature row)",
      fields: [
        { name: "outcomes_image_url", type: "image", imageField: "outcomes_image", label: "Image URL" },
        { name: "outcomes_eyebrow", label: "Eyebrow" },
        { name: "outcomes_title", label: "Title", full: true },
        { name: "outcomes_body", label: "Body", type: "textarea", rows: 3, full: true },
      ],
    },
    ctaSection,
  ],
  inlines: [
    {
      key: "metrics",
      title: "Metrics",
      endpoint: "/dft/metrics/",
      parentKey: "page",
      fields: [
        { name: "num", label: "Value", placeholder: "365" },
        { name: "label", label: "Label", full: true },
      ],
    },
    {
      key: "pillars",
      title: "Pillars (each has bullet points — edit via /admin/)",
      endpoint: "/dft/pillars/",
      parentKey: "page",
      fields: [
        { name: "num", label: "Number" },
        { name: "title", label: "Title" },
        { name: "blurb", label: "Blurb", type: "textarea", rows: 4, full: true },
      ],
    },
    {
      key: "timeline",
      title: "Timeline phases",
      endpoint: "/dft/timeline/",
      parentKey: "page",
      fields: [
        { name: "num", label: "Range", placeholder: "Days 1–60 / Mobilize" },
        { name: "title", label: "Title" },
        { name: "description", label: "Description", type: "textarea", rows: 3, full: true },
      ],
    },
    {
      key: "outcome_bullets",
      title: "Outcome bullets",
      endpoint: "/dft/outcome-bullets/",
      parentKey: "page",
      fields: [{ name: "text", label: "Bullet", full: true }],
    },
  ],
};

// Per-row schemas for Solutions / Training (used by the list/edit pages)
export const SOLUTION_FIELDS = {
  title: "Solution",
  endpointBase: "/solutions/",
  sections: [
    {
      title: "Identity",
      fields: [
        {
          name: "slug",
          label: "Slug",
          placeholder: "energy-infrastructure",
          help: "Used in the public URL: /solutions/<slug>. Renaming changes the URL — any external links to the old slug will 404.",
        },
        { name: "title", label: "Title" },
        { name: "snapshot", label: "Snapshot blurb", type: "textarea", rows: 3, full: true },
        { name: "sort_order", label: "Sort order", type: "number" },
        { name: "is_published", label: "Published?", type: "checkbox", help: "Visible on the public site" },
      ],
    },
    {
      title: "Hero",
      fields: [
        { name: "hero_image_url", type: "image", imageField: "hero_image", label: "Hero image URL" },
        { name: "hero_title", label: "Hero title", type: "textarea", rows: 2, full: true },
        { name: "hero_lede", label: "Hero lede", type: "textarea", rows: 3, full: true },
      ],
    },
    {
      title: "Body",
      fields: [
        { name: "overview_title", label: "Overview title", full: true },
        { name: "overview_lede", label: "Overview lede", type: "textarea", rows: 3, full: true },
        { name: "outcome", label: "Outcome focus (single sentence)", type: "textarea", rows: 2, full: true },
        { name: "cta_label", label: "CTA label" },
      ],
    },
  ],
  inlines: [
    {
      key: "deliverables",
      title: "What we deliver",
      endpoint: "/solutions-children/deliverables/",
      parentKey: "solution",
      fields: [{ name: "text", label: "Bullet", type: "textarea", rows: 2, full: true }],
    },
  ],
};

export const TRAINING_FIELDS = {
  title: "Training program",
  endpointBase: "/training-areas/",
  sections: [
    {
      title: "Identity",
      fields: [
        {
          name: "slug",
          label: "Slug",
          help: "Used in the public URL: /training/<slug>. Renaming changes the URL.",
        },
        { name: "title", label: "Title" },
        { name: "snapshot", label: "Snapshot blurb", type: "textarea", rows: 3, full: true },
        { name: "sort_order", label: "Sort order", type: "number" },
        { name: "is_published", label: "Published?", type: "checkbox" },
      ],
    },
    {
      title: "Hero",
      fields: [
        { name: "hero_image_url", type: "image", imageField: "hero_image", label: "Hero image URL" },
        { name: "hero_title", label: "Hero title", type: "textarea", rows: 2, full: true },
        { name: "hero_lede", label: "Hero lede", type: "textarea", rows: 3, full: true },
      ],
    },
    {
      title: "Body",
      fields: [
        { name: "overview_title", label: "Overview title", full: true },
        { name: "overview_lede", label: "Overview lede", type: "textarea", rows: 3, full: true },
        { name: "outcome", label: "Outcome focus", type: "textarea", rows: 2, full: true },
        { name: "cta_label", label: "CTA label" },
      ],
    },
    {
      title: "Cybersecurity framework (optional)",
      help: "Only enable for the Cybersecurity Training program.",
      fields: [
        { name: "has_cyber_framework", label: "Show framework section?", type: "checkbox" },
        { name: "cf_section_eyebrow", label: "Eyebrow" },
        { name: "cf_section_title", label: "Heading", type: "textarea", rows: 2, full: true },
        { name: "cf_section_lede", label: "Lede", type: "textarea", rows: 3, full: true },
        { name: "cf_foundation_tag", label: "Foundation tag" },
        { name: "cf_foundation_title", label: "Foundation title", full: true },
        { name: "cf_foundation_desc", label: "Foundation description", type: "textarea", rows: 3, full: true },
      ],
    },
  ],
  inlines: [
    {
      key: "deliverables",
      title: "What we deliver",
      endpoint: "/training-children/deliverables/",
      parentKey: "training",
      fields: [{ name: "text", label: "Bullet", type: "textarea", rows: 2, full: true }],
    },
    {
      key: "cf_phases",
      title: "Cyber framework — phases (4 expected)",
      endpoint: "/training-children/cyber-phases/",
      parentKey: "training",
      fields: [
        { name: "num", label: "Number", placeholder: "01" },
        { name: "label", label: "Label", placeholder: "Preparation / Prevention / Detection / Response" },
      ],
    },
    {
      key: "cf_cards",
      title: "Cyber framework — cards",
      endpoint: "/training-children/cyber-cards/",
      parentKey: "training",
      fields: [
        { name: "tag", label: "Phase tag", help: 'Match a phase label exactly: "Preparation" / "Prevention" / "Detection" / "Response"' },
        { name: "title", label: "Title" },
        { name: "description", label: "Description", type: "textarea", rows: 3, full: true },
      ],
    },
  ],
};
