from django.contrib.auth import get_user_model

from rest_framework import generics, status, viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from django.shortcuts import get_object_or_404

from .cms_sections import get_effective_cms_sections

from .models import (
    AboutPage,
    ContactPage,
    ContactSubmission,
    FooterLink,
    HomePage,
    ImpactPage,
    SiteSettings,
    Solution,
    SolutionSnapshotCard,
    TechnologyPage,
    TrainingArea,
    TrainingNavItem,
)
from .permissions import HasCmsSectionPermission, IsCmsSuperuser, IsStaffUser
from .serializers import (
    AboutPageManageSerializer,
    ContactPageManageSerializer,
    ContactSubmissionSerializer,
    CmsUserManageSerializer,
    FooterLinkSerializer,
    HomePageManageSerializer,
    SolutionSnapshotCardNestedSerializer,
    ImpactPageManageSerializer,
    SiteSettingsManageSerializer,
    SolutionBriefSerializer,
    SolutionManageSerializer,
    TechnologyPageManageSerializer,
    TrainingAreaBriefSerializer,
    TrainingAreaManageSerializer,
    TrainingNavItemSerializer,
)

User = get_user_model()

_CMS_ACCESS = (IsAuthenticated, IsStaffUser, HasCmsSectionPermission)


class ManageSingletonRetrieveUpdate(generics.RetrieveUpdateAPIView):
    permission_classes = _CMS_ACCESS
    parser_classes = (JSONParser, MultiPartParser, FormParser)

    def get_queryset(self):
        return self.model.objects.all()

    def get_object(self):
        return self.model.load()


class ManageHomeView(ManageSingletonRetrieveUpdate):
    serializer_class = HomePageManageSerializer
    model = HomePage
    queryset = HomePage.objects.all()
    cms_section = "home"


class ManageHomeSnapshotCardView(APIView):
    """PATCH multipart: replace `image` and/or `hover_image` for one snapshot card."""

    permission_classes = _CMS_ACCESS
    cms_section = "home"
    parser_classes = (MultiPartParser, FormParser)

    def patch(self, request, pk):
        home = HomePage.load()
        card = get_object_or_404(SolutionSnapshotCard, pk=pk, home=home)
        if "image" in request.FILES:
            card.image = request.FILES["image"]
        if "hover_image" in request.FILES:
            card.hover_image = request.FILES["hover_image"]
        card.save()
        return Response(SolutionSnapshotCardNestedSerializer(card, context={"request": request}).data)


class ManageAboutView(ManageSingletonRetrieveUpdate):
    serializer_class = AboutPageManageSerializer
    model = AboutPage
    queryset = AboutPage.objects.all()
    cms_section = "about"


class ManageContactPageView(ManageSingletonRetrieveUpdate):
    serializer_class = ContactPageManageSerializer
    model = ContactPage
    queryset = ContactPage.objects.all()
    cms_section = "contact_page"


class ManageImpactView(ManageSingletonRetrieveUpdate):
    serializer_class = ImpactPageManageSerializer
    model = ImpactPage
    queryset = ImpactPage.objects.all()
    cms_section = "impact"


class ManageTechnologyView(ManageSingletonRetrieveUpdate):
    serializer_class = TechnologyPageManageSerializer
    model = TechnologyPage
    queryset = TechnologyPage.objects.all()
    cms_section = "technology"


class ManageSiteSettingsView(ManageSingletonRetrieveUpdate):
    serializer_class = SiteSettingsManageSerializer
    model = SiteSettings
    queryset = SiteSettings.objects.all()
    cms_section = "site"


class FooterLinkViewSet(viewsets.ModelViewSet):
    queryset = FooterLink.objects.all()
    serializer_class = FooterLinkSerializer
    permission_classes = _CMS_ACCESS
    cms_section = "footer_links"
    parser_classes = (JSONParser, MultiPartParser, FormParser)
    pagination_class = None


class SolutionViewSet(viewsets.ModelViewSet):
    queryset = Solution.objects.all()
    serializer_class = SolutionManageSerializer
    permission_classes = _CMS_ACCESS
    cms_section = "solutions"
    lookup_field = "slug"
    lookup_url_kwarg = "slug"
    parser_classes = (JSONParser, MultiPartParser, FormParser)
    pagination_class = None

    def get_serializer_class(self):
        if self.action == "list":
            return SolutionBriefSerializer
        return SolutionManageSerializer


class TrainingAreaViewSet(viewsets.ModelViewSet):
    queryset = TrainingArea.objects.all()
    serializer_class = TrainingAreaManageSerializer
    permission_classes = _CMS_ACCESS
    cms_section = "training"
    lookup_field = "slug"
    lookup_url_kwarg = "slug"
    parser_classes = (JSONParser, MultiPartParser, FormParser)
    pagination_class = None

    def get_serializer_class(self):
        if self.action == "list":
            return TrainingAreaBriefSerializer
        return TrainingAreaManageSerializer


class TrainingNavItemViewSet(viewsets.ModelViewSet):
    queryset = TrainingNavItem.objects.all()
    serializer_class = TrainingNavItemSerializer
    permission_classes = _CMS_ACCESS
    cms_section = "training"
    parser_classes = (JSONParser, MultiPartParser, FormParser)
    pagination_class = None


class ContactSubmissionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ContactSubmission.objects.all()
    serializer_class = ContactSubmissionSerializer
    permission_classes = _CMS_ACCESS
    cms_section = "contact_submissions"
    pagination_class = None


class StaffUploadView(APIView):
    permission_classes = _CMS_ACCESS
    cms_section = "upload"
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        f = request.FILES.get("file")
        if not f:
            return Response({"detail": "Missing file."}, status=status.HTTP_400_BAD_REQUEST)
        if f.size > 5 * 1024 * 1024:
            return Response({"detail": "File too large (max 5MB)."}, status=status.HTTP_400_BAD_REQUEST)
        allowed = ("image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/gif")
        if f.content_type not in allowed:
            return Response({"detail": "Unsupported type."}, status=status.HTTP_400_BAD_REQUEST)
        from django.core.files.storage import default_storage
        from uuid import uuid4

        path = f"uploads/{uuid4().hex}_{f.name.replace(' ', '_')[:80]}"
        saved = default_storage.save(path, f)
        url = request.build_absolute_uri(default_storage.url(saved))
        return Response({"url": url})


class ManageMeView(APIView):
    permission_classes = (IsAuthenticated, IsStaffUser)

    def get(self, request):
        u = request.user
        return Response(
            {
                "id": u.id,
                "username": u.username,
                "email": u.email or "",
                "is_superuser": u.is_superuser,
                "cms_sections": sorted(get_effective_cms_sections(u)),
            }
        )


class CmsUserViewSet(viewsets.ModelViewSet):
    """Create and manage staff CMS accounts (superusers only)."""

    queryset = User.objects.filter(is_staff=True).order_by("username")
    serializer_class = CmsUserManageSerializer
    permission_classes = (IsAuthenticated, IsStaffUser, IsCmsSuperuser)
    parser_classes = (JSONParser, MultiPartParser, FormParser)
    pagination_class = None

    def perform_destroy(self, instance):
        if instance.pk == self.request.user.pk:
            raise ValidationError({"detail": "Cannot delete your own account."})
        if instance.is_superuser and User.objects.filter(is_superuser=True).count() <= 1:
            raise ValidationError({"detail": "Cannot remove the last superuser."})
        super().perform_destroy(instance)

    def perform_update(self, serializer):
        instance = serializer.instance
        if (
            instance.is_superuser
            and User.objects.filter(is_superuser=True).count() == 1
            and serializer.validated_data.get("is_superuser") is False
        ):
            raise ValidationError({"detail": "Cannot demote the last superuser."})
        serializer.save()
