"""
Django admin registrations for the new content schema.

Each top-level page is a singleton; we use SingletonAdmin to hide the
"Add" button and route the changelist straight to the singleton row.
Inlines surface the per-page repeating sections (cards, bullets, etc.).
"""
from django.contrib import admin
from django.http import HttpResponseRedirect
from django.urls import reverse

from .models import (
    AboutMeasureCard,
    AboutPage,
    AboutPrinciple,
    AboutWhoBullet,
    ApproachBlock,
    ApproachBlockBullet,
    ApproachPage,
    CmsEditorProfile,
    ContactPage,
    ContactSector,
    ContactSubmission,
    CyberCard,
    CyberPhase,
    DftMetric,
    DftOutcomeBullet,
    DftPillar,
    DftPillarPoint,
    DftTimeline,
    DigitalFastTrackPage,
    HomeHeroMeta,
    HomePPPBullet,
    HomePage,
    HomePillar,
    HomeProcessStep,
    SiteSettings,
    Solution,
    SolutionAdjacency,
    SolutionDeliverable,
    SolutionsPage,
    TrainingAdjacency,
    TrainingArea,
    TrainingDeliverable,
    TrainingPage,
)


class SingletonAdmin(admin.ModelAdmin):
    """Treat the model as a single global row; the changelist redirects to it."""

    def has_add_permission(self, request):
        return not type(self).model.objects.exists() if hasattr(type(self), "model") else True

    def has_delete_permission(self, request, obj=None):
        return False

    def changelist_view(self, request, extra_context=None):
        obj, _ = self.model.objects.get_or_create(pk=1)
        url = reverse(
            f"admin:{self.model._meta.app_label}_{self.model._meta.model_name}_change",
            args=[obj.pk],
        )
        return HttpResponseRedirect(url)


# ---------- Site --------------------------------------------------------------


@admin.register(SiteSettings)
class SiteSettingsAdmin(SingletonAdmin):
    fieldsets = (
        ("Meta", {"fields": ("meta_title", "meta_description", "favicon")}),
        ("Footer", {
            "fields": (
                "footer_tagline",
                "footer_address",
                "footer_phone",
                "footer_email",
                "copyright_line",
            ),
        }),
        ("Social", {"fields": ("social_linkedin", "social_x", "social_youtube")}),
    )


# ---------- Home --------------------------------------------------------------


class HomeHeroMetaInline(admin.TabularInline):
    model = HomeHeroMeta
    extra = 0


class HomePillarInline(admin.StackedInline):
    model = HomePillar
    extra = 0


class HomePPPBulletInline(admin.TabularInline):
    model = HomePPPBullet
    extra = 0


class HomeProcessStepInline(admin.StackedInline):
    model = HomeProcessStep
    extra = 0


@admin.register(HomePage)
class HomePageAdmin(SingletonAdmin):
    inlines = [
        HomeHeroMetaInline,
        HomePillarInline,
        HomePPPBulletInline,
        HomeProcessStepInline,
    ]
    fieldsets = (
        ("Hero", {
            "fields": (
                "hero_eyebrow",
                "hero_title_lead",
                "hero_title_em",
                "hero_lede",
                "hero_image",
                "hero_cta_primary_label",
                "hero_cta_primary_url",
                "hero_cta_secondary_label",
                "hero_cta_secondary_url",
            ),
        }),
        ("What PGP Delivers", {
            "fields": (
                "pillars_section_eyebrow",
                "pillars_section_title",
                "pillars_section_lede",
            ),
        }),
        ("Built for PPP", {
            "fields": ("ppp_image", "ppp_eyebrow", "ppp_title", "ppp_body"),
        }),
        ("Solutions Snapshot", {
            "fields": ("snapshot_section_eyebrow", "snapshot_section_title"),
        }),
        ("How We Work", {
            "fields": ("howwework_section_eyebrow", "howwework_section_title"),
        }),
        ("CTA Band", {
            "fields": (
                "cta_heading",
                "cta_body",
                "cta_primary_label",
                "cta_primary_url",
                "cta_secondary_label",
                "cta_secondary_url",
            ),
        }),
    )


# ---------- About -------------------------------------------------------------


class AboutPrincipleInline(admin.StackedInline):
    model = AboutPrinciple
    extra = 0


class AboutWhoBulletInline(admin.TabularInline):
    model = AboutWhoBullet
    extra = 0


class AboutMeasureCardInline(admin.StackedInline):
    model = AboutMeasureCard
    extra = 0


@admin.register(AboutPage)
class AboutPageAdmin(SingletonAdmin):
    inlines = [AboutPrincipleInline, AboutWhoBulletInline, AboutMeasureCardInline]
    fieldsets = (
        ("Page header", {
            "fields": ("page_eyebrow", "page_title", "page_lede", "page_image"),
        }),
        ("What makes us different", {
            "fields": ("principles_section_eyebrow", "principles_section_title"),
        }),
        ("Who we serve", {
            "fields": (
                "whoweserve_image",
                "whoweserve_eyebrow",
                "whoweserve_title",
                "whoweserve_body",
            ),
        }),
        ("What we measure", {
            "fields": (
                "measure_section_eyebrow",
                "measure_section_title",
                "measure_section_lede",
            ),
        }),
        ("CTA band", {
            "fields": (
                "cta_heading",
                "cta_body",
                "cta_primary_label",
                "cta_primary_url",
                "cta_secondary_label",
                "cta_secondary_url",
            ),
        }),
    )


# ---------- Approach ----------------------------------------------------------


class ApproachBlockBulletInline(admin.TabularInline):
    model = ApproachBlockBullet
    extra = 0


@admin.register(ApproachBlock)
class ApproachBlockAdmin(admin.ModelAdmin):
    inlines = [ApproachBlockBulletInline]
    list_display = ("page", "sort_order", "num", "title")
    list_filter = ("page",)


@admin.register(ApproachPage)
class ApproachPageAdmin(SingletonAdmin):
    fieldsets = (
        ("Page header", {
            "fields": ("page_eyebrow", "page_title", "page_lede", "page_image"),
        }),
        ("CTA band", {
            "fields": (
                "cta_heading",
                "cta_body",
                "cta_primary_label",
                "cta_primary_url",
                "cta_secondary_label",
                "cta_secondary_url",
            ),
        }),
    )


# ---------- Contact -----------------------------------------------------------


class ContactSectorInline(admin.TabularInline):
    model = ContactSector
    extra = 0


@admin.register(ContactPage)
class ContactPageAdmin(SingletonAdmin):
    inlines = [ContactSectorInline]
    fieldsets = (
        ("Page header", {
            "fields": ("page_eyebrow", "page_title", "page_lede", "page_image"),
        }),
        ("Sidebar info", {
            "fields": (
                "hq_label",
                "hq_address",
                "phone_label",
                "phone_number",
                "email_label",
                "email_address",
                "next_steps_label",
                "next_steps_text",
            ),
        }),
    )


# ---------- Solutions ---------------------------------------------------------


class SolutionDeliverableInline(admin.TabularInline):
    model = SolutionDeliverable
    extra = 0


class SolutionAdjacencyInline(admin.TabularInline):
    model = SolutionAdjacency
    fk_name = "from_solution"
    extra = 0
    autocomplete_fields = ["to_solution"]


@admin.register(Solution)
class SolutionAdmin(admin.ModelAdmin):
    inlines = [SolutionDeliverableInline, SolutionAdjacencyInline]
    list_display = ("title", "slug", "sort_order", "is_published")
    list_filter = ("is_published",)
    search_fields = ("slug", "title")
    prepopulated_fields = {"slug": ("title",)}
    fieldsets = (
        (None, {"fields": ("slug", "title", "snapshot", "sort_order", "is_published")}),
        ("Hero", {"fields": ("hero_image", "hero_title", "hero_lede")}),
        ("Body", {"fields": ("overview_title", "overview_lede", "outcome", "cta_label")}),
    )


@admin.register(SolutionsPage)
class SolutionsPageAdmin(SingletonAdmin):
    fieldsets = (
        ("Page header", {
            "fields": ("page_eyebrow", "page_title", "page_lede", "page_image"),
        }),
        ("Section heading", {"fields": ("section_eyebrow", "section_title")}),
        ("CTA band", {
            "fields": (
                "cta_heading",
                "cta_body",
                "cta_primary_label",
                "cta_primary_url",
                "cta_secondary_label",
                "cta_secondary_url",
            ),
        }),
    )


# ---------- Training ----------------------------------------------------------


class TrainingDeliverableInline(admin.TabularInline):
    model = TrainingDeliverable
    extra = 0


class CyberPhaseInline(admin.TabularInline):
    model = CyberPhase
    extra = 0


class CyberCardInline(admin.StackedInline):
    model = CyberCard
    extra = 0


class TrainingAdjacencyInline(admin.TabularInline):
    model = TrainingAdjacency
    fk_name = "from_training"
    extra = 0
    autocomplete_fields = ["to_training"]


@admin.register(TrainingArea)
class TrainingAreaAdmin(admin.ModelAdmin):
    inlines = [
        TrainingDeliverableInline,
        CyberPhaseInline,
        CyberCardInline,
        TrainingAdjacencyInline,
    ]
    list_display = ("title", "slug", "sort_order", "is_published", "has_cyber_framework")
    list_filter = ("is_published", "has_cyber_framework")
    search_fields = ("slug", "title")
    prepopulated_fields = {"slug": ("title",)}
    fieldsets = (
        (None, {"fields": ("slug", "title", "snapshot", "sort_order", "is_published")}),
        ("Hero", {"fields": ("hero_image", "hero_title", "hero_lede")}),
        ("Body", {"fields": ("overview_title", "overview_lede", "outcome", "cta_label")}),
        ("Cybersecurity framework (only used if enabled)", {
            "classes": ("collapse",),
            "fields": (
                "has_cyber_framework",
                "cf_section_eyebrow",
                "cf_section_title",
                "cf_section_lede",
                "cf_foundation_tag",
                "cf_foundation_title",
                "cf_foundation_desc",
            ),
        }),
    )


@admin.register(TrainingPage)
class TrainingPageAdmin(SingletonAdmin):
    fieldsets = (
        ("Page header", {
            "fields": ("page_eyebrow", "page_title", "page_lede", "page_image"),
        }),
        ("Section heading", {"fields": ("section_eyebrow", "section_title")}),
        ("CTA band", {
            "fields": (
                "cta_heading",
                "cta_body",
                "cta_primary_label",
                "cta_primary_url",
                "cta_secondary_label",
                "cta_secondary_url",
            ),
        }),
    )


# ---------- Digital Fast Track -----------------------------------------------


class DftMetricInline(admin.TabularInline):
    model = DftMetric
    extra = 0


class DftPillarPointInline(admin.TabularInline):
    model = DftPillarPoint
    extra = 0


@admin.register(DftPillar)
class DftPillarAdmin(admin.ModelAdmin):
    inlines = [DftPillarPointInline]
    list_display = ("page", "sort_order", "num", "title")


class DftTimelineInline(admin.StackedInline):
    model = DftTimeline
    extra = 0


class DftOutcomeBulletInline(admin.TabularInline):
    model = DftOutcomeBullet
    extra = 0


@admin.register(DigitalFastTrackPage)
class DigitalFastTrackPageAdmin(SingletonAdmin):
    inlines = [DftMetricInline, DftTimelineInline, DftOutcomeBulletInline]
    fieldsets = (
        ("Page header", {
            "fields": (
                "page_eyebrow",
                "page_title",
                "page_lede",
                "page_image",
                "page_cta_primary_label",
                "page_cta_primary_url",
                "page_cta_secondary_label",
                "page_cta_secondary_url",
            ),
        }),
        ("Why a fast track", {
            "fields": ("why_section_eyebrow", "why_section_title", "why_section_lede"),
        }),
        ("Pillars section heading", {
            "fields": (
                "pillars_section_eyebrow",
                "pillars_section_title",
                "pillars_section_lede",
            ),
        }),
        ("Timeline section heading", {
            "fields": (
                "timeline_section_eyebrow",
                "timeline_section_title",
                "timeline_section_lede",
            ),
        }),
        ("Outcomes feature row", {
            "fields": (
                "outcomes_image",
                "outcomes_eyebrow",
                "outcomes_title",
                "outcomes_body",
            ),
        }),
        ("CTA band", {
            "fields": (
                "cta_heading",
                "cta_body",
                "cta_primary_label",
                "cta_primary_url",
                "cta_secondary_label",
                "cta_secondary_url",
            ),
        }),
    )


# ---------- Submissions -------------------------------------------------------


@admin.register(ContactSubmission)
class ContactSubmissionAdmin(admin.ModelAdmin):
    list_display = ("created_at", "name", "email", "organization", "sector", "country")
    list_filter = ("sector", "country", "created_at")
    search_fields = ("name", "email", "organization", "message")
    readonly_fields = (
        "name", "organization", "email", "country", "sector",
        "message", "created_at", "ip_address",
    )

    def has_add_permission(self, request):
        return False


@admin.register(CmsEditorProfile)
class CmsEditorProfileAdmin(admin.ModelAdmin):
    list_display = ("user",)
    autocomplete_fields = ["user"]
