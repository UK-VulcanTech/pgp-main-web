"""
Writable serializers used by the CMS-admin UI. Includes every field on the
model (including raw image_url strings and ImageField file paths) so editors
can change anything from the dashboard. Read-only fields are kept off the
serializers entirely; everything declared is writable.
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
    SolutionAdjacency,
    SolutionDeliverable,
    SolutionsPage,
    TrainingAdjacency,
    TrainingArea,
    TrainingDeliverable,
    TrainingPage,
)


def _all_fields(model):
    return [f.name for f in model._meta.fields if f.name != "id"]


class _PageSerializer(serializers.ModelSerializer):
    """Base for singleton pages — exposes every concrete field."""

    class Meta:
        fields = "__all__"


def _make_page_serializer(model_cls, name):
    return type(name, (_PageSerializer,), {
        "Meta": type("Meta", (_PageSerializer.Meta,), {"model": model_cls}),
    })


SiteSettingsAdminSerializer = _make_page_serializer(SiteSettings, "SiteSettingsAdminSerializer")
HomePageAdminSerializer = _make_page_serializer(HomePage, "HomePageAdminSerializer")
AboutPageAdminSerializer = _make_page_serializer(AboutPage, "AboutPageAdminSerializer")
ApproachPageAdminSerializer = _make_page_serializer(ApproachPage, "ApproachPageAdminSerializer")
ContactPageAdminSerializer = _make_page_serializer(ContactPage, "ContactPageAdminSerializer")
SolutionsPageAdminSerializer = _make_page_serializer(SolutionsPage, "SolutionsPageAdminSerializer")
TrainingPageAdminSerializer = _make_page_serializer(TrainingPage, "TrainingPageAdminSerializer")
DigitalFastTrackPageAdminSerializer = _make_page_serializer(
    DigitalFastTrackPage, "DigitalFastTrackPageAdminSerializer"
)


def _make_child_serializer(model_cls, name):
    Meta = type("Meta", (), {"model": model_cls, "fields": "__all__"})
    return type(name, (serializers.ModelSerializer,), {"Meta": Meta})


# Inline child serializers (each has at minimum: id, sort_order, parent FK, fields)
HomeHeroMetaAdminSerializer = _make_child_serializer(HomeHeroMeta, "HomeHeroMetaAdminSerializer")
HomePillarAdminSerializer = _make_child_serializer(HomePillar, "HomePillarAdminSerializer")
HomePPPBulletAdminSerializer = _make_child_serializer(HomePPPBullet, "HomePPPBulletAdminSerializer")
HomeProcessStepAdminSerializer = _make_child_serializer(HomeProcessStep, "HomeProcessStepAdminSerializer")
AboutPrincipleAdminSerializer = _make_child_serializer(AboutPrinciple, "AboutPrincipleAdminSerializer")
AboutWhoBulletAdminSerializer = _make_child_serializer(AboutWhoBullet, "AboutWhoBulletAdminSerializer")
AboutMeasureCardAdminSerializer = _make_child_serializer(AboutMeasureCard, "AboutMeasureCardAdminSerializer")
ApproachBlockAdminSerializer = _make_child_serializer(ApproachBlock, "ApproachBlockAdminSerializer")
ApproachBlockBulletAdminSerializer = _make_child_serializer(ApproachBlockBullet, "ApproachBlockBulletAdminSerializer")
ContactSectorAdminSerializer = _make_child_serializer(ContactSector, "ContactSectorAdminSerializer")
SolutionDeliverableAdminSerializer = _make_child_serializer(SolutionDeliverable, "SolutionDeliverableAdminSerializer")
SolutionAdjacencyAdminSerializer = _make_child_serializer(SolutionAdjacency, "SolutionAdjacencyAdminSerializer")
TrainingDeliverableAdminSerializer = _make_child_serializer(TrainingDeliverable, "TrainingDeliverableAdminSerializer")
CyberPhaseAdminSerializer = _make_child_serializer(CyberPhase, "CyberPhaseAdminSerializer")
CyberCardAdminSerializer = _make_child_serializer(CyberCard, "CyberCardAdminSerializer")
TrainingAdjacencyAdminSerializer = _make_child_serializer(TrainingAdjacency, "TrainingAdjacencyAdminSerializer")
DftMetricAdminSerializer = _make_child_serializer(DftMetric, "DftMetricAdminSerializer")
DftPillarAdminSerializer = _make_child_serializer(DftPillar, "DftPillarAdminSerializer")
DftPillarPointAdminSerializer = _make_child_serializer(DftPillarPoint, "DftPillarPointAdminSerializer")
DftTimelineAdminSerializer = _make_child_serializer(DftTimeline, "DftTimelineAdminSerializer")
DftOutcomeBulletAdminSerializer = _make_child_serializer(DftOutcomeBullet, "DftOutcomeBulletAdminSerializer")


# Solution + TrainingArea: full row CRUD
class SolutionAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Solution
        fields = "__all__"


class TrainingAreaAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingArea
        fields = "__all__"


class ContactSubmissionAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactSubmission
        fields = "__all__"
        read_only_fields = ["id", "created_at", "ip_address"]
