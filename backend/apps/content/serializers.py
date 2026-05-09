"""
Serializers for the public read-only API. Each top-level page returns a
single shape that mirrors the React page's structure 1:1, so the frontend
can drop them directly into JSX.
"""
from rest_framework import serializers

from .models import (
    AboutMeasureCard,
    AboutPage,
    AboutPrinciple,
    AboutWhoBullet,
    ApproachBlock,
    ApproachBlockBullet,
    ApproachPage,
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
    SolutionDeliverable,
    SolutionsPage,
    TrainingArea,
    TrainingDeliverable,
    TrainingPage,
)


class AbsoluteImageField(serializers.ImageField):
    """Like ImageField but always returns an absolute URL (or None)."""

    def to_representation(self, value):
        if not value:
            return None
        request = self.context.get("request")
        url = value.url
        return request.build_absolute_uri(url) if request else url


class ImageOrUrlField(serializers.Field):
    """Returns the sibling `<name>_url` text field if non-empty, else the
    absolute URL of the uploaded ImageField, else None.

    Used so the seed (and editors) can populate a static path like
    `/images/hero-control-room.webp` without having to upload the file.
    """

    def __init__(self, image_attr, url_attr, *args, **kwargs):
        kwargs.setdefault("read_only", True)
        super().__init__(*args, **kwargs)
        self.image_attr = image_attr
        self.url_attr = url_attr

    def to_representation(self, instance):
        url = getattr(instance, self.url_attr, "") or ""
        if url:
            return url
        f = getattr(instance, self.image_attr, None)
        if not f:
            return None
        try:
            href = f.url
        except (ValueError, AttributeError):
            return None
        request = self.context.get("request")
        return request.build_absolute_uri(href) if request else href

    def get_attribute(self, instance):
        # We pull from the model directly in to_representation, so just pass
        # the instance through.
        return instance


# ---------- Site --------------------------------------------------------------


class SiteSettingsSerializer(serializers.ModelSerializer):
    favicon = AbsoluteImageField(required=False, allow_null=True)

    class Meta:
        model = SiteSettings
        fields = [
            "meta_title", "meta_description", "favicon",
            "footer_tagline", "footer_address", "footer_phone", "footer_email",
            "copyright_line",
            "social_linkedin", "social_x", "social_youtube",
        ]


# ---------- Home --------------------------------------------------------------


class HomeHeroMetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeHeroMeta
        fields = ["label", "value", "desc"]


class HomePillarSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomePillar
        fields = ["num", "title", "description", "link_label", "link_url"]


class HomePPPBulletSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomePPPBullet
        fields = ["text"]


class HomeProcessStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeProcessStep
        fields = ["num", "title", "description"]


class HomePageSerializer(serializers.ModelSerializer):
    hero_image = ImageOrUrlField(image_attr="hero_image", url_attr="hero_image_url")
    ppp_image = ImageOrUrlField(image_attr="ppp_image", url_attr="ppp_image_url")
    hero_meta = HomeHeroMetaSerializer(many=True, read_only=True)
    pillars = HomePillarSerializer(many=True, read_only=True)
    ppp_bullets = HomePPPBulletSerializer(many=True, read_only=True)
    process_steps = HomeProcessStepSerializer(many=True, read_only=True)

    class Meta:
        model = HomePage
        fields = [
            "hero_eyebrow", "hero_title_lead", "hero_title_em", "hero_lede", "hero_image",
            "hero_cta_primary_label", "hero_cta_primary_url",
            "hero_cta_secondary_label", "hero_cta_secondary_url",
            "hero_meta",
            "pillars_section_eyebrow", "pillars_section_title", "pillars_section_lede",
            "pillars",
            "ppp_image", "ppp_eyebrow", "ppp_title", "ppp_body", "ppp_bullets",
            "snapshot_section_eyebrow", "snapshot_section_title",
            "howwework_section_eyebrow", "howwework_section_title", "process_steps",
            "cta_heading", "cta_body",
            "cta_primary_label", "cta_primary_url",
            "cta_secondary_label", "cta_secondary_url",
        ]


# ---------- About -------------------------------------------------------------


class AboutPrincipleSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutPrinciple
        fields = ["num", "title", "description"]


class AboutWhoBulletSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutWhoBullet
        fields = ["text"]


class AboutMeasureCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutMeasureCard
        fields = ["label", "title", "description"]


class AboutPageSerializer(serializers.ModelSerializer):
    page_image = ImageOrUrlField(image_attr="page_image", url_attr="page_image_url")
    whoweserve_image = ImageOrUrlField(image_attr="whoweserve_image", url_attr="whoweserve_image_url")
    principles = AboutPrincipleSerializer(many=True, read_only=True)
    who_bullets = AboutWhoBulletSerializer(many=True, read_only=True)
    measure_cards = AboutMeasureCardSerializer(many=True, read_only=True)

    class Meta:
        model = AboutPage
        fields = [
            "page_eyebrow", "page_title", "page_lede", "page_image",
            "principles_section_eyebrow", "principles_section_title", "principles",
            "whoweserve_image", "whoweserve_eyebrow", "whoweserve_title",
            "whoweserve_body", "who_bullets",
            "measure_section_eyebrow", "measure_section_title", "measure_section_lede",
            "measure_cards",
            "cta_heading", "cta_body",
            "cta_primary_label", "cta_primary_url",
            "cta_secondary_label", "cta_secondary_url",
        ]


# ---------- Approach ----------------------------------------------------------


class ApproachBlockBulletSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApproachBlockBullet
        fields = ["text"]


class ApproachBlockSerializer(serializers.ModelSerializer):
    bullets = ApproachBlockBulletSerializer(many=True, read_only=True)

    class Meta:
        model = ApproachBlock
        fields = ["num", "title", "bullets"]


class ApproachPageSerializer(serializers.ModelSerializer):
    page_image = ImageOrUrlField(image_attr="page_image", url_attr="page_image_url")
    blocks = ApproachBlockSerializer(many=True, read_only=True)

    class Meta:
        model = ApproachPage
        fields = [
            "page_eyebrow", "page_title", "page_lede", "page_image",
            "blocks",
            "cta_heading", "cta_body",
            "cta_primary_label", "cta_primary_url",
            "cta_secondary_label", "cta_secondary_url",
        ]


# ---------- Contact -----------------------------------------------------------


class ContactSectorSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactSector
        fields = ["label"]


class ContactPageSerializer(serializers.ModelSerializer):
    page_image = ImageOrUrlField(image_attr="page_image", url_attr="page_image_url")
    sectors = ContactSectorSerializer(many=True, read_only=True)

    class Meta:
        model = ContactPage
        fields = [
            "page_eyebrow", "page_title", "page_lede", "page_image",
            "hq_label", "hq_address",
            "phone_label", "phone_number",
            "email_label", "email_address",
            "next_steps_label", "next_steps_text",
            "sectors",
        ]


class ContactSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactSubmission
        fields = ["name", "organization", "email", "country", "sector", "message"]


# ---------- Solutions ---------------------------------------------------------


class SolutionDeliverableSerializer(serializers.ModelSerializer):
    class Meta:
        model = SolutionDeliverable
        fields = ["text"]


class SolutionListItemSerializer(serializers.ModelSerializer):
    """Compact shape for the hub grid + adjacent links."""

    hero_image = ImageOrUrlField(image_attr="hero_image", url_attr="hero_image_url")
    class Meta:
        model = Solution
        fields = ["slug", "title", "snapshot", "hero_image"]


class SolutionDetailSerializer(serializers.ModelSerializer):
    hero_image = ImageOrUrlField(image_attr="hero_image", url_attr="hero_image_url")
    deliver = SolutionDeliverableSerializer(source="deliverables", many=True, read_only=True)
    adjacent = serializers.SerializerMethodField()

    class Meta:
        model = Solution
        fields = [
            "slug", "title", "snapshot", "hero_image",
            "hero_title", "hero_lede",
            "overview_title", "overview_lede", "outcome",
            "cta_label",
            "deliver",
            "adjacent",
        ]

    def get_adjacent(self, obj):
        rows = (
            obj.adjacent_links.filter(to_solution__is_published=True)
            .select_related("to_solution")
            .order_by("sort_order", "id")
        )
        return SolutionListItemSerializer(
            [r.to_solution for r in rows], many=True, context=self.context
        ).data


class SolutionsPageSerializer(serializers.ModelSerializer):
    page_image = ImageOrUrlField(image_attr="page_image", url_attr="page_image_url")
    class Meta:
        model = SolutionsPage
        fields = [
            "page_eyebrow", "page_title", "page_lede", "page_image",
            "section_eyebrow", "section_title",
            "cta_heading", "cta_body",
            "cta_primary_label", "cta_primary_url",
            "cta_secondary_label", "cta_secondary_url",
        ]


# ---------- Training ----------------------------------------------------------


class TrainingDeliverableSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingDeliverable
        fields = ["text"]


class CyberPhaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = CyberPhase
        fields = ["num", "label"]


class CyberCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = CyberCard
        fields = ["tag", "title", "description"]


class TrainingListItemSerializer(serializers.ModelSerializer):
    hero_image = ImageOrUrlField(image_attr="hero_image", url_attr="hero_image_url")
    class Meta:
        model = TrainingArea
        fields = ["slug", "title", "snapshot", "hero_image"]


class TrainingDetailSerializer(serializers.ModelSerializer):
    hero_image = ImageOrUrlField(image_attr="hero_image", url_attr="hero_image_url")
    deliver = TrainingDeliverableSerializer(source="deliverables", many=True, read_only=True)
    adjacent = serializers.SerializerMethodField()
    cf_phases = CyberPhaseSerializer(many=True, read_only=True)
    cf_cards = CyberCardSerializer(many=True, read_only=True)

    class Meta:
        model = TrainingArea
        fields = [
            "slug", "title", "snapshot", "hero_image",
            "hero_title", "hero_lede",
            "overview_title", "overview_lede", "outcome",
            "cta_label",
            "deliver",
            "adjacent",
            "has_cyber_framework",
            "cf_section_eyebrow", "cf_section_title", "cf_section_lede",
            "cf_phases", "cf_cards",
            "cf_foundation_tag", "cf_foundation_title", "cf_foundation_desc",
        ]

    def get_adjacent(self, obj):
        rows = (
            obj.adjacent_links.filter(to_training__is_published=True)
            .select_related("to_training")
            .order_by("sort_order", "id")
        )
        return TrainingListItemSerializer(
            [r.to_training for r in rows], many=True, context=self.context
        ).data


class TrainingPageSerializer(serializers.ModelSerializer):
    page_image = ImageOrUrlField(image_attr="page_image", url_attr="page_image_url")
    class Meta:
        model = TrainingPage
        fields = [
            "page_eyebrow", "page_title", "page_lede", "page_image",
            "section_eyebrow", "section_title",
            "cta_heading", "cta_body",
            "cta_primary_label", "cta_primary_url",
            "cta_secondary_label", "cta_secondary_url",
        ]


# ---------- Digital Fast Track -----------------------------------------------


class DftMetricSerializer(serializers.ModelSerializer):
    class Meta:
        model = DftMetric
        fields = ["num", "label"]


class DftPillarPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = DftPillarPoint
        fields = ["text"]


class DftPillarSerializer(serializers.ModelSerializer):
    points = DftPillarPointSerializer(many=True, read_only=True)

    class Meta:
        model = DftPillar
        fields = ["num", "title", "blurb", "points"]


class DftTimelineSerializer(serializers.ModelSerializer):
    class Meta:
        model = DftTimeline
        fields = ["num", "title", "description"]


class DftOutcomeBulletSerializer(serializers.ModelSerializer):
    class Meta:
        model = DftOutcomeBullet
        fields = ["text"]


class DigitalFastTrackPageSerializer(serializers.ModelSerializer):
    page_image = ImageOrUrlField(image_attr="page_image", url_attr="page_image_url")
    outcomes_image = ImageOrUrlField(image_attr="outcomes_image", url_attr="outcomes_image_url")
    metrics = DftMetricSerializer(many=True, read_only=True)
    pillars = DftPillarSerializer(many=True, read_only=True)
    timeline = DftTimelineSerializer(many=True, read_only=True)
    outcome_bullets = DftOutcomeBulletSerializer(many=True, read_only=True)

    class Meta:
        model = DigitalFastTrackPage
        fields = [
            "page_eyebrow", "page_title", "page_lede", "page_image",
            "page_cta_primary_label", "page_cta_primary_url",
            "page_cta_secondary_label", "page_cta_secondary_url",
            "why_section_eyebrow", "why_section_title", "why_section_lede",
            "metrics",
            "pillars_section_eyebrow", "pillars_section_title", "pillars_section_lede",
            "pillars",
            "timeline_section_eyebrow", "timeline_section_title", "timeline_section_lede",
            "timeline",
            "outcomes_image", "outcomes_eyebrow", "outcomes_title", "outcomes_body",
            "outcome_bullets",
            "cta_heading", "cta_body",
            "cta_primary_label", "cta_primary_url",
            "cta_secondary_label", "cta_secondary_url",
        ]
