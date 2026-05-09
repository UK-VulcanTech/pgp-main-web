"""
Read-only public API. One endpoint per page singleton, plus list/detail
for solutions and training areas, plus the contact-form submit endpoint.

CMS staff edit content via /admin/. Authenticated CMS endpoints have been
removed in this rewrite — use Django admin until a fresh CMS UI exists.
"""
from rest_framework import status
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (
    AboutPage,
    ApproachPage,
    ContactPage,
    DigitalFastTrackPage,
    HomePage,
    SiteSettings,
    Solution,
    SolutionsPage,
    TrainingArea,
    TrainingPage,
)
from .serializers import (
    AboutPageSerializer,
    ApproachPageSerializer,
    ContactPageSerializer,
    ContactSubmissionSerializer,
    DigitalFastTrackPageSerializer,
    HomePageSerializer,
    SiteSettingsSerializer,
    SolutionDetailSerializer,
    SolutionListItemSerializer,
    SolutionsPageSerializer,
    TrainingDetailSerializer,
    TrainingListItemSerializer,
    TrainingPageSerializer,
)


class _SingletonView(APIView):
    """Returns the always-PK=1 row for a page singleton."""

    authentication_classes = ()
    permission_classes = (AllowAny,)
    model = None
    serializer_class = None

    def get(self, request):
        obj = self.model.load()
        ser = self.serializer_class(obj, context={"request": request})
        return Response(ser.data)


class PublicSiteView(_SingletonView):
    model = SiteSettings
    serializer_class = SiteSettingsSerializer


class PublicHomeView(_SingletonView):
    model = HomePage
    serializer_class = HomePageSerializer


class PublicAboutView(_SingletonView):
    model = AboutPage
    serializer_class = AboutPageSerializer


class PublicApproachView(_SingletonView):
    model = ApproachPage
    serializer_class = ApproachPageSerializer


class PublicContactPageView(_SingletonView):
    model = ContactPage
    serializer_class = ContactPageSerializer


class PublicSolutionsPageView(_SingletonView):
    model = SolutionsPage
    serializer_class = SolutionsPageSerializer


class PublicTrainingPageView(_SingletonView):
    model = TrainingPage
    serializer_class = TrainingPageSerializer


class PublicDigitalFastTrackView(_SingletonView):
    model = DigitalFastTrackPage
    serializer_class = DigitalFastTrackPageSerializer


class PublicSolutionListView(ListAPIView):
    authentication_classes = ()
    permission_classes = (AllowAny,)
    serializer_class = SolutionListItemSerializer
    pagination_class = None

    def get_queryset(self):
        return Solution.objects.filter(is_published=True).order_by("sort_order", "slug")


class PublicSolutionDetailView(RetrieveAPIView):
    authentication_classes = ()
    permission_classes = (AllowAny,)
    serializer_class = SolutionDetailSerializer
    lookup_field = "slug"

    def get_queryset(self):
        return Solution.objects.filter(is_published=True)


class PublicTrainingListView(ListAPIView):
    authentication_classes = ()
    permission_classes = (AllowAny,)
    serializer_class = TrainingListItemSerializer
    pagination_class = None

    def get_queryset(self):
        return TrainingArea.objects.filter(is_published=True).order_by("sort_order", "slug")


class PublicTrainingDetailView(RetrieveAPIView):
    authentication_classes = ()
    permission_classes = (AllowAny,)
    serializer_class = TrainingDetailSerializer
    lookup_field = "slug"

    def get_queryset(self):
        return TrainingArea.objects.filter(is_published=True)


class PublicContactSubmitView(APIView):
    """POST endpoint for the public contact form. Accepts JSON payloads.

    Note: Formspree is the primary submission target on the React side; this
    endpoint exists so the same form can be served without Formspree if
    needed (e.g. self-hosted spike). It rate-limits aggressively.
    """

    authentication_classes = ()
    permission_classes = (AllowAny,)

    def post(self, request):
        # Honeypot — drop silently.
        if request.data.get("_gotcha"):
            return Response({"ok": True})

        ser = ContactSubmissionSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        obj = ser.save(
            ip_address=request.META.get("HTTP_X_FORWARDED_FOR", "").split(",")[0].strip()
            or request.META.get("REMOTE_ADDR")
        )
        return Response({"ok": True, "id": obj.id}, status=status.HTTP_201_CREATED)
