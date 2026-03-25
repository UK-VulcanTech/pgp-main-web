from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .auth import StaffTokenObtainPairView
from .views_manage import (
    CmsUserViewSet,
    ContactSubmissionViewSet,
    FooterLinkViewSet,
    ManageAboutView,
    ManageContactPageView,
    ManageHomeSnapshotCardView,
    ManageHomeView,
    ManageImpactView,
    ManageMeView,
    ManageSiteSettingsView,
    ManageTechnologyView,
    SolutionViewSet,
    StaffUploadView,
    TrainingAreaViewSet,
    TrainingNavItemViewSet,
)
from .views_public import (
    PublicAboutView,
    PublicContactPageView,
    PublicContactSubmitView,
    PublicFooterLinksView,
    PublicHomeView,
    PublicImpactView,
    PublicNavigationView,
    PublicSiteView,
    PublicSolutionDetailView,
    PublicSolutionListView,
    PublicTechnologyView,
    PublicTrainingDetailView,
    PublicTrainingHubView,
)

router = DefaultRouter()
router.register(r"footer-links", FooterLinkViewSet, basename="footerlink")
router.register(r"solutions", SolutionViewSet, basename="solution")
router.register(r"training-areas", TrainingAreaViewSet, basename="trainingarea")
router.register(r"training-nav", TrainingNavItemViewSet, basename="trainingnav")
router.register(r"contact-submissions", ContactSubmissionViewSet, basename="contactsubmission")
router.register(r"users", CmsUserViewSet, basename="cmsuser")

manage_urlpatterns = [
    path("me/", ManageMeView.as_view(), name="manage_me"),
    path("auth/login/", StaffTokenObtainPairView.as_view(), name="token_obtain"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("upload/", StaffUploadView.as_view(), name="manage_upload"),
    path("site/", ManageSiteSettingsView.as_view(), name="manage_site"),
    path("pages/home/", ManageHomeView.as_view(), name="manage_home"),
    path(
        "pages/home/snapshot-cards/<int:pk>/",
        ManageHomeSnapshotCardView.as_view(),
        name="manage_home_snapshot_card",
    ),
    path("pages/about/", ManageAboutView.as_view(), name="manage_about"),
    path("pages/contact/", ManageContactPageView.as_view(), name="manage_contact_page"),
    path("pages/impact/", ManageImpactView.as_view(), name="manage_impact"),
    path("pages/technology/", ManageTechnologyView.as_view(), name="manage_technology"),
    path("", include(router.urls)),
]

public_urlpatterns = [
    path("site/", PublicSiteView.as_view(), name="public_site"),
    path("navigation/", PublicNavigationView.as_view(), name="public_nav"),
    path("footer-links/", PublicFooterLinksView.as_view(), name="public_footer"),
    path("pages/home/", PublicHomeView.as_view(), name="public_home"),
    path("pages/about/", PublicAboutView.as_view(), name="public_about"),
    path("pages/contact/", PublicContactPageView.as_view(), name="public_contact_page"),
    path("pages/impact/", PublicImpactView.as_view(), name="public_impact"),
    path("pages/technology/", PublicTechnologyView.as_view(), name="public_technology"),
    path("solutions/", PublicSolutionListView.as_view(), name="public_solutions_list"),
    path("solutions/<slug:slug>/", PublicSolutionDetailView.as_view(), name="public_solution_detail"),
    path("training/", PublicTrainingHubView.as_view(), name="public_training_hub"),
    path("training/<slug:slug>/", PublicTrainingDetailView.as_view(), name="public_training_detail"),
    path("contact/", PublicContactSubmitView.as_view(), name="public_contact_submit"),
]
