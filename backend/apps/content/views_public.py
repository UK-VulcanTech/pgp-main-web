from rest_framework import status
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from .models import (
    AboutPage,
    CaseStudy,
    ContactPage,
    FooterLink,
    HomePage,
    ImpactPage,
    SiteSettings,
    Solution,
    TechnologyPage,
    TrainingArea,
    TrainingNavItem,
)
from .serializers import PublicContactSerializer


def _abs(request, f):
    if f and hasattr(f, "url"):
        return request.build_absolute_uri(f.url)
    return None


class PublicSiteView(APIView):
    authentication_classes = ()
    permission_classes = ()

    def get(self, request):
        s = SiteSettings.load()
        return Response(
            {
                "meta_title": s.meta_title,
                "meta_description": s.meta_description,
                "logo": _abs(request, s.logo),
                "header_image": _abs(request, s.header_image),
                "footer": {
                    "tagline": s.footer_tagline,
                    "company_line1": s.footer_company_line1,
                    "company_line2": s.footer_company_line2,
                    "social": {
                        "facebook": s.social_facebook or None,
                        "google": s.social_google or None,
                        "instagram": s.social_instagram or None,
                        "youtube": s.social_youtube or None,
                    },
                    "address": s.footer_address,
                    "email": s.footer_email,
                    "phone": s.footer_phone,
                    "copyright": s.copyright_line,
                },
            }
        )


class PublicNavigationView(APIView):
    authentication_classes = ()
    permission_classes = ()

    def get(self, request):
        solutions = (
            Solution.objects.filter(is_published=True)
            .order_by("nav_column", "nav_order", "slug")
            .values("slug", "nav_subtitle", "nav_column", "nav_title", "nav_order")
        )
        left, right = [], []
        for row in solutions:
            title = row["nav_title"] or row["slug"].replace("-", " ").title()
            item = {
                "title": title,
                "subtitle": row["nav_subtitle"],
                "slug": row["slug"],
                "_order": row["nav_order"],
            }
            if row.get("nav_column", 1) == 2:
                right.append(item)
            else:
                left.append(item)
        left.sort(key=lambda x: x["_order"])
        right.sort(key=lambda x: x["_order"])
        for lst in (left, right):
            for x in lst:
                x.pop("_order", None)
        tech = {"title": "Technology", "subtitle": "Data-driven visibility", "slug": "technology"}
        hi = next((i for i, x in enumerate(left) if x["slug"] == "healthcare"), len(left))
        left.insert(hi, tech)
        training = list(
            TrainingNavItem.objects.order_by("sort_order").values(
                "title", "subtitle", "path"
            )
        )
        return Response(
            {
                "solutions_dropdown": {"left": left, "right": right},
                "training_dropdown": training,
            }
        )


class PublicFooterLinksView(APIView):
    authentication_classes = ()
    permission_classes = ()

    def get(self, request):
        links = FooterLink.objects.all()
        out = {"quick": [], "sector": [], "legal": []}
        for L in links:
            out.setdefault(L.category, []).append(
                {"label": L.label, "url": L.url, "sort_order": L.sort_order}
            )
        return Response(out)


class PublicHomeView(APIView):
    authentication_classes = ()
    permission_classes = ()

    def get(self, request):
        h = HomePage.load()
        return Response(
            {
                "hero": {
                    "eyebrow": h.hero_eyebrow,
                    "h1": h.hero_h1,
                    "body": h.hero_body,
                    "cta_primary": {"label": h.hero_cta_primary_label, "url": h.hero_cta_primary_url},
                    "cta_secondary": {
                        "label": h.hero_cta_secondary_label,
                        "url": h.hero_cta_secondary_url,
                    },
                    "background_image": _abs(request, h.hero_bg),
                },
                "what_deliver": {
                    "title": h.what_deliver_title,
                    "pillars": [
                        {"title": p.title, "description": p.description}
                        for p in h.pillars.all()
                    ],
                },
                "ppp": {"heading": h.ppp_heading, "body": h.ppp_body},
                "solutions_snapshot": {
                    "title": h.solutions_snapshot_title,
                    "cards": [
                        {
                            "title": c.title,
                            "description": c.description,
                            "image": _abs(request, c.image),
                            "hover_image": _abs(request, c.hover_image),
                        }
                        for c in h.snapshot_cards.all()
                    ],
                },
                "how_we_work": {
                    "title": h.how_we_work_title,
                    "steps": [
                        {"title": s.title, "description": s.description}
                        for s in h.how_steps.all()
                    ],
                },
                "cta": {
                    "heading": h.cta_heading,
                    "body": h.cta_body,
                    "button": {"label": h.cta_button_label, "url": h.cta_button_url},
                    "background_image": _abs(request, h.cta_bg),
                },
            }
        )


class PublicAboutView(APIView):
    authentication_classes = ()
    permission_classes = ()

    def get(self, request):
        a = AboutPage.load()
        return Response(
            {
                "hero": {
                    "title": a.hero_title,
                    "intro": a.hero_intro,
                    "wave_image": _abs(request, a.hero_wave_image),
                },
                "differentiators": {
                    "section_title": a.differentiators_section_title,
                    "cards": [
                        {
                            "title": c.title,
                            "text": c.text,
                            "icon": _abs(request, c.icon),
                        }
                        for c in a.differentiator_cards.all()
                    ],
                },
                "who_we_serve": {"heading": a.who_heading, "body": a.who_body},
                "outcome": {
                    "heading": a.outcome_heading,
                    "subheading": a.outcome_subheading,
                    "body": a.outcome_body,
                    "cta": {"label": a.outcome_cta_label, "url": a.outcome_cta_url},
                    "image": _abs(request, a.outcome_image),
                },
                "approach": {
                    "pill": a.approach_pill,
                    "heading": a.approach_heading,
                    "steps": [
                        {
                            "number": st.number,
                            "title": st.title,
                            "description": st.description,
                            "bullets": st.bullets or [],
                        }
                        for st in a.approach_steps.all()
                    ],
                    "bottom_cta": {
                        "label": a.approach_bottom_cta_label,
                        "url": a.approach_bottom_cta_url,
                    },
                    "wave_image": _abs(request, a.approach_wave_image),
                },
            }
        )


class PublicContactPageView(APIView):
    authentication_classes = ()
    permission_classes = ()

    def get(self, request):
        c = ContactPage.load()
        return Response(
            {
                "headline_gold": c.headline_gold,
                "headline_dark": c.headline_dark,
                "intro": c.intro,
                "submit_label": c.submit_label,
                "sector_options": [
                    {"label": o.label, "value": o.value}
                    for o in c.sector_options.all()
                ],
            }
        )


class PublicImpactView(APIView):
    authentication_classes = ()
    permission_classes = ()

    def get(self, request):
        p = ImpactPage.load()
        cases = (
            CaseStudy.objects.filter(impact=p)
            .prefetch_related("quadrants")
            .order_by("sort_order")
        )
        return Response(
            {
                "hero": {
                    "eyebrow": p.hero_eyebrow,
                    "headline": p.headline,
                    "headline_highlight": p.headline_highlight,
                },
                "metrics_section_title": p.metrics_section_title,
                "metrics": [
                    {"stat": m.stat, "label": m.label, "wide": m.wide}
                    for m in p.metrics.all()
                ],
                "case_studies_section_title": p.case_studies_section_title,
                "case_studies": [
                    {
                        "badge": cs.badge,
                        "title": cs.title,
                        "quadrants": [
                            {"label": q.label, "body": q.body}
                            for q in cs.quadrants.all()
                        ],
                    }
                    for cs in cases
                ],
            }
        )


class PublicTechnologyView(APIView):
    authentication_classes = ()
    permission_classes = ()

    def get(self, request):
        t = TechnologyPage.load()
        return Response(
            {
                "hero": {
                    "label": t.hero_label,
                    "title_black_1": t.title_black_1,
                    "title_black_2": t.title_black_2,
                    "title_yellow": t.title_yellow,
                },
                "overview": {
                    "sidebar_label": t.overview_sidebar_label,
                    "text": t.overview_text,
                },
                "domains_heading": t.domains_heading,
                "domains": [
                    {
                        "title": d.title,
                        "description": d.description,
                        "wide": d.wide,
                        "icon_key": d.icon_key,
                    }
                    for d in t.domains.all()
                ],
                "enablement_heading": t.enablement_heading,
                "enablement_items": [
                    {"label": i.label, "icon_key": i.icon_key} for i in t.enablement_items.all()
                ],
                "outcome": {
                    "eyebrow": t.outcome_eyebrow,
                    "headline": t.outcome_headline,
                    "cta": {"label": t.outcome_cta_label, "url": t.outcome_cta_url},
                },
            }
        )


class PublicSolutionDetailView(APIView):
    authentication_classes = ()
    permission_classes = ()

    def get(self, request, slug):
        try:
            s = Solution.objects.prefetch_related("deliverables").get(slug=slug, is_published=True)
        except Solution.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(
            {
                "slug": s.slug,
                "hero_label": s.hero_label,
                "hero_title_black_1": s.title_black_1,
                "hero_title_black_2": s.title_black_2,
                "hero_title_yellow": s.title_yellow,
                "overview_text": s.overview_text,
                "deliver_items": [
                    {"id": d.code or str(d.sort_order), "text": d.text}
                    for d in s.deliverables.all()
                ],
                "outcome_headline": s.outcome_headline,
                "outcome_cta": s.outcome_cta,
                "outcome_cta_url": s.outcome_cta_url,
            }
        )


class PublicSolutionListView(APIView):
    authentication_classes = ()
    permission_classes = ()

    def get(self, request):
        qs = Solution.objects.filter(is_published=True).order_by("nav_column", "nav_order", "slug")
        return Response([{"slug": s.slug, "nav_subtitle": s.nav_subtitle} for s in qs])


class PublicTrainingHubView(APIView):
    authentication_classes = ()
    permission_classes = ()

    def get(self, request):
        qs = TrainingArea.objects.filter(is_published=True).order_by("hub_order", "slug")
        return Response(
            [
                {
                    "slug": t.slug,
                    "title": t.title,
                    "subtitle": t.hub_subtitle,
                    "featured": t.featured,
                }
                for t in qs
            ]
        )


class PublicTrainingDetailView(APIView):
    authentication_classes = ()
    permission_classes = ()

    def get(self, request, slug):
        try:
            t = TrainingArea.objects.prefetch_related("cards").get(slug=slug, is_published=True)
        except TrainingArea.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(
            {
                "slug": t.slug,
                "category": t.category,
                "title": t.title,
                "description": t.description_start,
                "highlighted_text": t.highlighted_text,
                "description_end": t.description_end,
                "deliver_section_title": t.deliver_section_title,
                "display_style": t.display_style,
                "cards": [
                    {
                        "id": c.sort_order,
                        "icon": c.icon_emoji,
                        "title": c.title,
                        "subtitle": c.subtitle,
                    }
                    for c in t.cards.all()
                ],
                "outcome_tag": t.outcome_tag,
                "outcome_title": t.outcome_title,
            }
        )


class ContactThrottle(ScopedRateThrottle):
    scope = "contact"


class PublicContactSubmitView(APIView):
    authentication_classes = ()
    permission_classes = ()
    throttle_classes = [ContactThrottle]

    def post(self, request):
        ser = PublicContactSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        ip = request.META.get("HTTP_X_FORWARDED_FOR", "").split(",")[0].strip()
        if not ip:
            ip = request.META.get("REMOTE_ADDR")
        from .models import ContactSubmission

        ContactSubmission.objects.create(
            ip_address=ip or None,
            **ser.validated_data,
        )
        return Response({"ok": True}, status=status.HTTP_201_CREATED)
