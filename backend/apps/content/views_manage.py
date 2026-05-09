"""
CMS-admin endpoints. Authenticated as staff via JWT.

Singleton pages: GET/PUT at /api/manage/v1/pages/<slug>/ (Site, Home, About,
Approach, Contact, SolutionsHub, TrainingHub, DFT).

Collections: standard ModelViewSet routes for solutions, training areas,
their child rows, and contact submissions (read-only).
"""
from django.conf import settings
from django.core.mail import EmailMessage
from rest_framework import permissions, serializers as drf_serializers, status, viewsets, mixins
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

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
from .manage_serializers import (
    AboutMeasureCardAdminSerializer,
    AboutPageAdminSerializer,
    AboutPrincipleAdminSerializer,
    AboutWhoBulletAdminSerializer,
    ApproachBlockAdminSerializer,
    ApproachBlockBulletAdminSerializer,
    ApproachPageAdminSerializer,
    ContactPageAdminSerializer,
    ContactSectorAdminSerializer,
    ContactSubmissionAdminSerializer,
    CyberCardAdminSerializer,
    CyberPhaseAdminSerializer,
    DftMetricAdminSerializer,
    DftOutcomeBulletAdminSerializer,
    DftPillarAdminSerializer,
    DftPillarPointAdminSerializer,
    DftTimelineAdminSerializer,
    DigitalFastTrackPageAdminSerializer,
    HomeHeroMetaAdminSerializer,
    HomePPPBulletAdminSerializer,
    HomePageAdminSerializer,
    HomePillarAdminSerializer,
    HomeProcessStepAdminSerializer,
    SiteSettingsAdminSerializer,
    SolutionAdjacencyAdminSerializer,
    SolutionAdminSerializer,
    SolutionDeliverableAdminSerializer,
    SolutionsPageAdminSerializer,
    TrainingAdjacencyAdminSerializer,
    TrainingAreaAdminSerializer,
    TrainingDeliverableAdminSerializer,
    TrainingPageAdminSerializer,
)


class _SingletonAdminView(RetrieveUpdateAPIView):
    """GET/PUT/PATCH the page singleton (always PK=1)."""

    permission_classes = [IsAdminUser]
    model = None

    def get_object(self):
        obj = self.model.load()
        self.check_object_permissions(self.request, obj)
        return obj


def _make_singleton(model_cls, ser_cls, name):
    return type(name, (_SingletonAdminView,), {
        "model": model_cls,
        "serializer_class": ser_cls,
    })


SiteSettingsAdminView = _make_singleton(SiteSettings, SiteSettingsAdminSerializer, "SiteSettingsAdminView")
HomePageAdminView = _make_singleton(HomePage, HomePageAdminSerializer, "HomePageAdminView")
AboutPageAdminView = _make_singleton(AboutPage, AboutPageAdminSerializer, "AboutPageAdminView")
ApproachPageAdminView = _make_singleton(ApproachPage, ApproachPageAdminSerializer, "ApproachPageAdminView")
ContactPageAdminView = _make_singleton(ContactPage, ContactPageAdminSerializer, "ContactPageAdminView")
SolutionsPageAdminView = _make_singleton(SolutionsPage, SolutionsPageAdminSerializer, "SolutionsPageAdminView")
TrainingPageAdminView = _make_singleton(TrainingPage, TrainingPageAdminSerializer, "TrainingPageAdminView")
DigitalFastTrackPageAdminView = _make_singleton(
    DigitalFastTrackPage, DigitalFastTrackPageAdminSerializer, "DigitalFastTrackPageAdminView"
)


class _AdminViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminUser]


class SolutionAdminViewSet(_AdminViewSet):
    queryset = Solution.objects.all().order_by("sort_order", "slug")
    serializer_class = SolutionAdminSerializer
    lookup_field = "slug"


class TrainingAreaAdminViewSet(_AdminViewSet):
    queryset = TrainingArea.objects.all().order_by("sort_order", "slug")
    serializer_class = TrainingAreaAdminSerializer
    lookup_field = "slug"


# Child viewsets (filterable by parent FK in querystring)
class _ChildViewSet(_AdminViewSet):
    parent_filter_field = None  # subclasses override

    def get_queryset(self):
        qs = self.queryset
        if self.parent_filter_field:
            value = self.request.query_params.get(self.parent_filter_field)
            if value not in (None, ""):
                qs = qs.filter(**{self.parent_filter_field: value})
        return qs


def _child(model_cls, ser_cls, parent_field, name):
    Meta = type("Meta", (), {})
    cls = type(name, (_ChildViewSet,), {
        "queryset": model_cls.objects.all().order_by("sort_order", "id"),
        "serializer_class": ser_cls,
        "parent_filter_field": parent_field,
    })
    return cls


HomeHeroMetaAdminViewSet = _child(HomeHeroMeta, HomeHeroMetaAdminSerializer, "page", "HomeHeroMetaAdminViewSet")
HomePillarAdminViewSet = _child(HomePillar, HomePillarAdminSerializer, "page", "HomePillarAdminViewSet")
HomePPPBulletAdminViewSet = _child(HomePPPBullet, HomePPPBulletAdminSerializer, "page", "HomePPPBulletAdminViewSet")
HomeProcessStepAdminViewSet = _child(HomeProcessStep, HomeProcessStepAdminSerializer, "page", "HomeProcessStepAdminViewSet")
AboutPrincipleAdminViewSet = _child(AboutPrinciple, AboutPrincipleAdminSerializer, "page", "AboutPrincipleAdminViewSet")
AboutWhoBulletAdminViewSet = _child(AboutWhoBullet, AboutWhoBulletAdminSerializer, "page", "AboutWhoBulletAdminViewSet")
AboutMeasureCardAdminViewSet = _child(AboutMeasureCard, AboutMeasureCardAdminSerializer, "page", "AboutMeasureCardAdminViewSet")
ApproachBlockAdminViewSet = _child(ApproachBlock, ApproachBlockAdminSerializer, "page", "ApproachBlockAdminViewSet")
ApproachBlockBulletAdminViewSet = _child(ApproachBlockBullet, ApproachBlockBulletAdminSerializer, "block", "ApproachBlockBulletAdminViewSet")
ContactSectorAdminViewSet = _child(ContactSector, ContactSectorAdminSerializer, "page", "ContactSectorAdminViewSet")
SolutionDeliverableAdminViewSet = _child(SolutionDeliverable, SolutionDeliverableAdminSerializer, "solution", "SolutionDeliverableAdminViewSet")
SolutionAdjacencyAdminViewSet = _child(SolutionAdjacency, SolutionAdjacencyAdminSerializer, "from_solution", "SolutionAdjacencyAdminViewSet")
TrainingDeliverableAdminViewSet = _child(TrainingDeliverable, TrainingDeliverableAdminSerializer, "training", "TrainingDeliverableAdminViewSet")
CyberPhaseAdminViewSet = _child(CyberPhase, CyberPhaseAdminSerializer, "training", "CyberPhaseAdminViewSet")
CyberCardAdminViewSet = _child(CyberCard, CyberCardAdminSerializer, "training", "CyberCardAdminViewSet")
TrainingAdjacencyAdminViewSet = _child(TrainingAdjacency, TrainingAdjacencyAdminSerializer, "from_training", "TrainingAdjacencyAdminViewSet")
DftMetricAdminViewSet = _child(DftMetric, DftMetricAdminSerializer, "page", "DftMetricAdminViewSet")
DftPillarAdminViewSet = _child(DftPillar, DftPillarAdminSerializer, "page", "DftPillarAdminViewSet")
DftPillarPointAdminViewSet = _child(DftPillarPoint, DftPillarPointAdminSerializer, "pillar", "DftPillarPointAdminViewSet")
DftTimelineAdminViewSet = _child(DftTimeline, DftTimelineAdminSerializer, "page", "DftTimelineAdminViewSet")
DftOutcomeBulletAdminViewSet = _child(DftOutcomeBullet, DftOutcomeBulletAdminSerializer, "page", "DftOutcomeBulletAdminViewSet")


# Submissions: list + retrieve only.
class ContactSubmissionAdminViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    queryset = ContactSubmission.objects.all().order_by("-created_at")
    serializer_class = ContactSubmissionAdminSerializer
    permission_classes = [IsAdminUser]


class ManageMeView(APIView):
    """Tells the cms-admin who is logged in (and that the token is valid)."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        u = request.user
        return Response({
            "id": u.id,
            "username": u.username,
            "email": u.email,
            "is_staff": u.is_staff,
            "is_superuser": u.is_superuser,
        })


class _ForwardSubmissionsRequest(drf_serializers.Serializer):
    to = drf_serializers.EmailField()
    submission_ids = drf_serializers.ListField(
        child=drf_serializers.IntegerField(),
        min_length=1,
    )
    subject = drf_serializers.CharField(required=False, allow_blank=True, max_length=255)
    note = drf_serializers.CharField(required=False, allow_blank=True)


class ForwardSubmissionsView(APIView):
    """Forwards one or more saved contact submissions as a single email.

    POST body:
        {
            "to": "team@example.com",
            "submission_ids": [4, 7, 12],
            "subject": "Optional override",
            "note": "Optional preamble shown above the bundled submissions"
        }

    Uses Django's configured EMAIL_BACKEND (console in dev, SMTP in prod).
    """

    permission_classes = [IsAdminUser]

    def post(self, request):
        ser = _ForwardSubmissionsRequest(data=request.data)
        ser.is_valid(raise_exception=True)
        data = ser.validated_data
        ids = data["submission_ids"]
        rows = list(ContactSubmission.objects.filter(id__in=ids).order_by("-created_at"))
        if not rows:
            return Response(
                {"detail": "No matching submissions found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        from_addr = settings.DEFAULT_FROM_EMAIL
        if len(rows) == 1:
            r = rows[0]
            subject = data.get("subject") or f"PGP enquiry — {r.name}"
        else:
            subject = data.get("subject") or f"PGP enquiries — {len(rows)} submissions"

        # Compose plain-text body. Each block separated by --- so it's easy to scan.
        parts = []
        if data.get("note"):
            parts.append(data["note"].rstrip() + "\n")
        parts.append(f"Forwarded from the PGP CMS by {request.user.username}.\n")
        for i, r in enumerate(rows, start=1):
            parts.append(f"--- Submission {i} of {len(rows)} ---")
            parts.append(f"Received: {r.created_at:%Y-%m-%d %H:%M %Z}".rstrip())
            parts.append(f"Name:     {r.name}")
            if r.organization:
                parts.append(f"Org:      {r.organization}")
            parts.append(f"Email:    {r.email}")
            if r.country:
                parts.append(f"Country:  {r.country}")
            if r.sector:
                parts.append(f"Sector:   {r.sector}")
            if r.ip_address:
                parts.append(f"IP:       {r.ip_address}")
            parts.append("")
            parts.append(r.message or "")
            parts.append("")
        body = "\n".join(parts)

        # Reply-To is the original sender when only one submission is forwarded;
        # otherwise leave it as the from address so replies don't fan out
        # accidentally.
        headers = {}
        reply_to = [rows[0].email] if len(rows) == 1 and rows[0].email else None

        msg = EmailMessage(
            subject=subject,
            body=body,
            from_email=from_addr,
            to=[data["to"]],
            reply_to=reply_to,
            headers=headers,
        )
        sent = msg.send(fail_silently=False)
        return Response(
            {
                "ok": True,
                "sent": int(sent),
                "to": data["to"],
                "submission_count": len(rows),
            },
            status=status.HTTP_200_OK,
        )
