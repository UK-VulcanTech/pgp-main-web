from django.contrib.auth import get_user_model

from rest_framework import serializers

from .cms_sections import ALL_CMS_SECTIONS
from .models import (
    AboutApproachStep,
    AboutDifferentiatorCard,
    AboutPage,
    CaseStudy,
    CaseStudyQuadrant,
    ContactPage,
    ContactSectorOption,
    CmsEditorProfile,
    ContactSubmission,
    FooterLink,
    HomeHowStep,
    HomePage,
    HomePillar,
    ImpactMetric,
    ImpactPage,
    SiteSettings,
    Solution,
    SolutionDeliverable,
    SolutionSnapshotCard,
    TechnologyDomain,
    TechnologyEnablementItem,
    TechnologyPage,
    TrainingArea,
    TrainingCard,
    TrainingNavItem,
)


def _abs_url(request, file_field):
    if file_field and hasattr(file_field, "url"):
        return request.build_absolute_uri(file_field.url)
    return None


# ——— Manage (nested) ———


class HomePillarNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomePillar
        fields = ("id", "sort_order", "title", "description")


class HomeHowStepNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeHowStep
        fields = ("id", "sort_order", "title", "description")


class SolutionSnapshotCardNestedSerializer(serializers.ModelSerializer):
    """Read: absolute image URLs. Write: handled in HomePageManageSerializer._sync_snapshot_cards."""

    class Meta:
        model = SolutionSnapshotCard
        fields = ("id", "sort_order", "title", "description", "image", "hover_image")

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get("request")
        if request:
            data["image"] = request.build_absolute_uri(instance.image.url) if instance.image else None
            data["hover_image"] = (
                request.build_absolute_uri(instance.hover_image.url) if instance.hover_image else None
            )
        return data


_SNAP_IMG_SKIP = object()


class HomePageManageSerializer(serializers.ModelSerializer):
    pillars = HomePillarNestedSerializer(many=True, required=False)
    how_steps = HomeHowStepNestedSerializer(many=True, required=False)
    snapshot_cards = serializers.SerializerMethodField()

    class Meta:
        model = HomePage
        fields = (
            "hero_eyebrow",
            "hero_h1",
            "hero_body",
            "hero_cta_primary_label",
            "hero_cta_primary_url",
            "hero_cta_secondary_label",
            "hero_cta_secondary_url",
            "hero_bg",
            "what_deliver_title",
            "ppp_heading",
            "ppp_body",
            "solutions_snapshot_title",
            "how_we_work_title",
            "cta_heading",
            "cta_body",
            "cta_button_label",
            "cta_button_url",
            "cta_bg",
            "pillars",
            "how_steps",
            "snapshot_cards",
        )

    def get_snapshot_cards(self, obj):
        qs = obj.snapshot_cards.all().order_by("sort_order", "id")
        return SolutionSnapshotCardNestedSerializer(qs, many=True, context=self.context).data

    def _sync_snapshot_cards(self, instance, rows):
        from django.core.files.uploadedfile import UploadedFile

        if not isinstance(rows, list):
            return
        existing = {c.id: c for c in instance.snapshot_cards.all()}
        keep = []
        for raw in rows:
            if not isinstance(raw, dict):
                continue
            rid = raw.get("id")
            try:
                rid = int(rid) if rid is not None and rid != "" else None
            except (TypeError, ValueError):
                rid = None
            title = raw.get("title") or ""
            description = raw.get("description") or ""
            try:
                sort_order = int(raw.get("sort_order", 0))
            except (TypeError, ValueError):
                sort_order = 0
            img_val = raw.get("image", _SNAP_IMG_SKIP)
            hover_val = raw.get("hover_image", _SNAP_IMG_SKIP)

            def _apply_file_field(obj, field, val):
                if val is _SNAP_IMG_SKIP:
                    return
                if isinstance(val, UploadedFile):
                    setattr(obj, field, val)
                elif val is None:
                    setattr(obj, field, None)
                elif isinstance(val, str) and val.strip():
                    # URL from last GET — do not replace file on disk
                    if val.startswith("http") or "/media/" in val:
                        return
                # empty string or unknown: ignore

            if rid is not None and rid in existing:
                obj = existing[rid]
                obj.title = title
                obj.description = description
                obj.sort_order = sort_order
                _apply_file_field(obj, "image", img_val)
                _apply_file_field(obj, "hover_image", hover_val)
                obj.save()
                keep.append(rid)
            else:
                obj = SolutionSnapshotCard(
                    home=instance, title=title, description=description, sort_order=sort_order
                )
                if isinstance(img_val, UploadedFile):
                    obj.image = img_val
                if isinstance(hover_val, UploadedFile):
                    obj.hover_image = hover_val
                obj.save()
                keep.append(obj.id)
        instance.snapshot_cards.exclude(pk__in=keep).delete()

    def update(self, instance, validated_data):
        pillars = validated_data.pop("pillars", None)
        how_steps = validated_data.pop("how_steps", None)
        instance = super().update(instance, validated_data)
        if pillars is not None:
            instance.pillars.all().delete()
            for row in pillars:
                HomePillar.objects.create(home=instance, **row)
        if how_steps is not None:
            instance.how_steps.all().delete()
            for row in how_steps:
                HomeHowStep.objects.create(home=instance, **row)
        if "snapshot_cards" in self.initial_data:
            self._sync_snapshot_cards(instance, self.initial_data.get("snapshot_cards") or [])
        return instance


class AboutCardNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutDifferentiatorCard
        fields = ("id", "sort_order", "title", "text", "icon")


class AboutApproachNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutApproachStep
        fields = ("id", "sort_order", "number", "title", "description", "bullets")


class AboutPageManageSerializer(serializers.ModelSerializer):
    differentiator_cards = AboutCardNestedSerializer(many=True, required=False)
    approach_steps = AboutApproachNestedSerializer(many=True, required=False)

    class Meta:
        model = AboutPage
        fields = (
            "hero_title",
            "hero_intro",
            "hero_wave_image",
            "differentiators_section_title",
            "who_heading",
            "who_body",
            "outcome_heading",
            "outcome_subheading",
            "outcome_body",
            "outcome_cta_label",
            "outcome_cta_url",
            "outcome_image",
            "approach_pill",
            "approach_heading",
            "approach_bottom_cta_label",
            "approach_bottom_cta_url",
            "approach_wave_image",
            "differentiator_cards",
            "approach_steps",
        )

    def update(self, instance, validated_data):
        cards = validated_data.pop("differentiator_cards", None)
        steps = validated_data.pop("approach_steps", None)
        instance = super().update(instance, validated_data)
        if cards is not None:
            instance.differentiator_cards.all().delete()
            for row in cards:
                AboutDifferentiatorCard.objects.create(about=instance, **row)
        if steps is not None:
            instance.approach_steps.all().delete()
            for row in steps:
                AboutApproachStep.objects.create(about=instance, **row)
        return instance


class ContactSectorNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactSectorOption
        fields = ("id", "sort_order", "label", "value")


class ContactPageManageSerializer(serializers.ModelSerializer):
    sector_options = ContactSectorNestedSerializer(many=True, required=False)

    class Meta:
        model = ContactPage
        fields = (
            "headline_gold",
            "headline_dark",
            "intro",
            "submit_label",
            "sector_options",
        )

    def update(self, instance, validated_data):
        opts = validated_data.pop("sector_options", None)
        instance = super().update(instance, validated_data)
        if opts is not None:
            instance.sector_options.all().delete()
            for row in opts:
                ContactSectorOption.objects.create(contact=instance, **row)
        return instance


class ImpactMetricNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImpactMetric
        fields = ("id", "sort_order", "stat", "label", "wide")


class CaseStudyQuadrantNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = CaseStudyQuadrant
        fields = ("id", "sort_order", "label", "body")


class CaseStudyNestedSerializer(serializers.ModelSerializer):
    quadrants = CaseStudyQuadrantNestedSerializer(many=True, required=False)

    class Meta:
        model = CaseStudy
        fields = ("id", "sort_order", "badge", "title", "quadrants")


class ImpactPageManageSerializer(serializers.ModelSerializer):
    metrics = ImpactMetricNestedSerializer(many=True, required=False)
    case_studies = CaseStudyNestedSerializer(many=True, required=False)

    class Meta:
        model = ImpactPage
        fields = (
            "hero_eyebrow",
            "headline",
            "headline_highlight",
            "metrics_section_title",
            "case_studies_section_title",
            "metrics",
            "case_studies",
        )

    def update(self, instance, validated_data):
        metrics = validated_data.pop("metrics", None)
        cases = validated_data.pop("case_studies", None)
        instance = super().update(instance, validated_data)
        if metrics is not None:
            instance.metrics.all().delete()
            for row in metrics:
                ImpactMetric.objects.create(impact=instance, **row)
        if cases is not None:
            instance.case_studies.all().delete()
            for row in cases:
                r = dict(row)
                quads = r.pop("quadrants", [])
                r.pop("id", None)
                cs = CaseStudy.objects.create(impact=instance, **r)
                for q in quads:
                    qd = dict(q)
                    qd.pop("id", None)
                    CaseStudyQuadrant.objects.create(case_study=cs, **qd)
        return instance


class TechnologyDomainNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = TechnologyDomain
        fields = ("id", "sort_order", "title", "description", "wide", "icon_key")


class TechnologyEnablementNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = TechnologyEnablementItem
        fields = ("id", "sort_order", "label", "icon_key")


class TechnologyPageManageSerializer(serializers.ModelSerializer):
    domains = TechnologyDomainNestedSerializer(many=True, required=False)
    enablement_items = TechnologyEnablementNestedSerializer(many=True, required=False)

    class Meta:
        model = TechnologyPage
        fields = (
            "hero_label",
            "title_black_1",
            "title_black_2",
            "title_yellow",
            "overview_text",
            "overview_sidebar_label",
            "domains_heading",
            "enablement_heading",
            "outcome_eyebrow",
            "outcome_headline",
            "outcome_cta_label",
            "outcome_cta_url",
            "domains",
            "enablement_items",
        )

    def update(self, instance, validated_data):
        domains = validated_data.pop("domains", None)
        items = validated_data.pop("enablement_items", None)
        instance = super().update(instance, validated_data)
        if domains is not None:
            instance.domains.all().delete()
            for row in domains:
                TechnologyDomain.objects.create(tech_page=instance, **row)
        if items is not None:
            instance.enablement_items.all().delete()
            for row in items:
                TechnologyEnablementItem.objects.create(tech_page=instance, **row)
        return instance


class SiteSettingsManageSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = (
            "meta_title",
            "meta_description",
            "logo",
            "header_image",
            "footer_tagline",
            "footer_company_line1",
            "footer_company_line2",
            "social_facebook",
            "social_google",
            "social_instagram",
            "social_youtube",
            "footer_address",
            "footer_email",
            "footer_phone",
            "copyright_line",
        )


class FooterLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = FooterLink
        fields = ("id", "category", "label", "url", "sort_order")


class SolutionDeliverableSerializer(serializers.ModelSerializer):
    class Meta:
        model = SolutionDeliverable
        fields = ("id", "sort_order", "code", "text")


class SolutionBriefSerializer(serializers.ModelSerializer):
    class Meta:
        model = Solution
        fields = ("slug", "nav_title", "nav_subtitle", "is_published")


class SolutionManageSerializer(serializers.ModelSerializer):
    deliverables = SolutionDeliverableSerializer(many=True, required=False)

    class Meta:
        model = Solution
        fields = (
            "id",
            "slug",
            "is_published",
            "nav_title",
            "nav_subtitle",
            "nav_column",
            "nav_order",
            "hero_label",
            "title_black_1",
            "title_black_2",
            "title_yellow",
            "overview_text",
            "outcome_headline",
            "outcome_cta",
            "outcome_cta_url",
            "deliverables",
        )

    def update(self, instance, validated_data):
        dels = validated_data.pop("deliverables", None)
        instance = super().update(instance, validated_data)
        if dels is not None:
            instance.deliverables.all().delete()
            for row in dels:
                SolutionDeliverable.objects.create(solution=instance, **row)
        return instance

    def create(self, validated_data):
        dels = validated_data.pop("deliverables", [])
        s = Solution.objects.create(**validated_data)
        for row in dels:
            SolutionDeliverable.objects.create(solution=s, **row)
        return s


class TrainingCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingCard
        fields = ("id", "sort_order", "icon_emoji", "title", "subtitle")


class TrainingAreaBriefSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingArea
        fields = ("slug", "title", "is_published", "featured")


class TrainingAreaManageSerializer(serializers.ModelSerializer):
    cards = TrainingCardSerializer(many=True, required=False)

    class Meta:
        model = TrainingArea
        fields = (
            "id",
            "slug",
            "is_published",
            "featured",
            "hub_subtitle",
            "hub_order",
            "category",
            "title",
            "description_start",
            "highlighted_text",
            "description_end",
            "deliver_section_title",
            "display_style",
            "outcome_tag",
            "outcome_title",
            "cards",
        )

    def update(self, instance, validated_data):
        cards = validated_data.pop("cards", None)
        instance = super().update(instance, validated_data)
        if cards is not None:
            instance.cards.all().delete()
            for row in cards:
                TrainingCard.objects.create(training=instance, **row)
        return instance

    def create(self, validated_data):
        cards = validated_data.pop("cards", [])
        t = TrainingArea.objects.create(**validated_data)
        for row in cards:
            TrainingCard.objects.create(training=t, **row)
        return t


class TrainingNavItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingNavItem
        fields = ("id", "sort_order", "title", "subtitle", "path")


class ContactSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactSubmission
        fields = ("id", "name", "sector", "country", "project_description", "created_at", "ip_address")
        read_only_fields = ("created_at", "ip_address")


class PublicContactSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    sector = serializers.CharField(max_length=120, required=False, allow_blank=True)
    country = serializers.CharField(max_length=255, required=False, allow_blank=True)
    project_description = serializers.CharField(required=False, allow_blank=True)


User = get_user_model()


class CmsUserManageSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    sections = serializers.ListField(
        child=serializers.CharField(max_length=64),
        required=False,
    )

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "email",
            "is_active",
            "is_superuser",
            "password",
            "sections",
        )
        read_only_fields = ("id",)

    def validate_sections(self, value):
        bad = [x for x in value if x not in ALL_CMS_SECTIONS]
        if bad:
            raise serializers.ValidationError(f"Unknown sections: {bad}")
        return list(dict.fromkeys(value))

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.is_superuser:
            data["sections"] = sorted(ALL_CMS_SECTIONS)
        else:
            try:
                prof = instance.cms_profile
                data["sections"] = list(prof.sections) if isinstance(prof.sections, list) else []
            except CmsEditorProfile.DoesNotExist:
                # Matches effective permissions (full access until a profile row exists).
                data["sections"] = sorted(ALL_CMS_SECTIONS)
        return data

    def create(self, validated_data):
        sections = validated_data.pop("sections", None)
        if sections is None:
            sections = []
        password = validated_data.pop("password", None)
        if not password:
            raise serializers.ValidationError({"password": "Required for new users."})
        validated_data.setdefault("is_active", True)
        validated_data.setdefault("is_superuser", False)
        validated_data["is_staff"] = True
        user = User.objects.create_user(password=password, **validated_data)
        if not user.is_superuser:
            CmsEditorProfile.objects.create(user=user, sections=sections)
        return user

    def update(self, instance, validated_data):
        sections = validated_data.pop("sections", serializers.empty)
        password = validated_data.pop("password", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()

        if instance.is_superuser:
            CmsEditorProfile.objects.filter(user=instance).delete()
        else:
            if sections is not serializers.empty:
                CmsEditorProfile.objects.update_or_create(
                    user=instance,
                    defaults={"sections": sections if isinstance(sections, list) else []},
                )
            else:
                CmsEditorProfile.objects.get_or_create(user=instance, defaults={"sections": []})
        return instance
