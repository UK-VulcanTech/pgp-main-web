"""
URL patterns for both the public site and the CMS-admin manage API.
"""
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views_public import (
    PublicAboutView,
    PublicApproachView,
    PublicContactPageView,
    PublicContactSubmitView,
    PublicDigitalFastTrackView,
    PublicHomeView,
    PublicSiteView,
    PublicSolutionDetailView,
    PublicSolutionListView,
    PublicSolutionsPageView,
    PublicTrainingDetailView,
    PublicTrainingListView,
    PublicTrainingPageView,
)
from .views_manage import (
    AboutMeasureCardAdminViewSet,
    AboutPageAdminView,
    AboutPrincipleAdminViewSet,
    AboutWhoBulletAdminViewSet,
    ApproachBlockAdminViewSet,
    ApproachBlockBulletAdminViewSet,
    ApproachPageAdminView,
    ContactPageAdminView,
    ContactSectorAdminViewSet,
    ContactSubmissionAdminViewSet,
    CyberCardAdminViewSet,
    CyberPhaseAdminViewSet,
    DftMetricAdminViewSet,
    DftOutcomeBulletAdminViewSet,
    DftPillarAdminViewSet,
    DftPillarPointAdminViewSet,
    DftTimelineAdminViewSet,
    DigitalFastTrackPageAdminView,
    ForwardSubmissionsView,
    HomeHeroMetaAdminViewSet,
    HomePPPBulletAdminViewSet,
    HomePageAdminView,
    HomePillarAdminViewSet,
    HomeProcessStepAdminViewSet,
    ManageMeView,
    SiteSettingsAdminView,
    SolutionAdjacencyAdminViewSet,
    SolutionAdminViewSet,
    SolutionDeliverableAdminViewSet,
    SolutionsPageAdminView,
    TrainingAdjacencyAdminViewSet,
    TrainingAreaAdminViewSet,
    TrainingDeliverableAdminViewSet,
    TrainingPageAdminView,
)


public_urlpatterns = [
    path("site/", PublicSiteView.as_view(), name="public_site"),
    path("pages/home/", PublicHomeView.as_view(), name="public_home"),
    path("pages/about/", PublicAboutView.as_view(), name="public_about"),
    path("pages/approach/", PublicApproachView.as_view(), name="public_approach"),
    path("pages/contact/", PublicContactPageView.as_view(), name="public_contact_page"),
    path("pages/solutions/", PublicSolutionsPageView.as_view(), name="public_solutions_page"),
    path("pages/training/", PublicTrainingPageView.as_view(), name="public_training_page"),
    path(
        "pages/digital-fast-track/",
        PublicDigitalFastTrackView.as_view(),
        name="public_dft_page",
    ),
    path("solutions/", PublicSolutionListView.as_view(), name="public_solutions_list"),
    path(
        "solutions/<slug:slug>/",
        PublicSolutionDetailView.as_view(),
        name="public_solution_detail",
    ),
    path("training/", PublicTrainingListView.as_view(), name="public_training_list"),
    path(
        "training/<slug:slug>/",
        PublicTrainingDetailView.as_view(),
        name="public_training_detail",
    ),
    path("contact/", PublicContactSubmitView.as_view(), name="public_contact_submit"),
]


router = DefaultRouter()
router.register(r"solutions", SolutionAdminViewSet, basename="manage-solution")
router.register(r"training-areas", TrainingAreaAdminViewSet, basename="manage-training-area")
# Singleton-page child collections, scoped by ?page= query param.
router.register(r"home/hero-meta", HomeHeroMetaAdminViewSet, basename="manage-home-hero-meta")
router.register(r"home/pillars", HomePillarAdminViewSet, basename="manage-home-pillars")
router.register(r"home/ppp-bullets", HomePPPBulletAdminViewSet, basename="manage-home-ppp-bullets")
router.register(r"home/process-steps", HomeProcessStepAdminViewSet, basename="manage-home-process-steps")
router.register(r"about/principles", AboutPrincipleAdminViewSet, basename="manage-about-principles")
router.register(r"about/who-bullets", AboutWhoBulletAdminViewSet, basename="manage-about-who-bullets")
router.register(r"about/measure-cards", AboutMeasureCardAdminViewSet, basename="manage-about-measure-cards")
router.register(r"approach/blocks", ApproachBlockAdminViewSet, basename="manage-approach-blocks")
router.register(r"approach/block-bullets", ApproachBlockBulletAdminViewSet, basename="manage-approach-block-bullets")
router.register(r"contact/sectors", ContactSectorAdminViewSet, basename="manage-contact-sectors")
router.register(r"solutions-children/deliverables", SolutionDeliverableAdminViewSet, basename="manage-solution-deliverables")
router.register(r"solutions-children/adjacency", SolutionAdjacencyAdminViewSet, basename="manage-solution-adjacency")
router.register(r"training-children/deliverables", TrainingDeliverableAdminViewSet, basename="manage-training-deliverables")
router.register(r"training-children/cyber-phases", CyberPhaseAdminViewSet, basename="manage-cyber-phases")
router.register(r"training-children/cyber-cards", CyberCardAdminViewSet, basename="manage-cyber-cards")
router.register(r"training-children/adjacency", TrainingAdjacencyAdminViewSet, basename="manage-training-adjacency")
router.register(r"dft/metrics", DftMetricAdminViewSet, basename="manage-dft-metrics")
router.register(r"dft/pillars", DftPillarAdminViewSet, basename="manage-dft-pillars")
router.register(r"dft/pillar-points", DftPillarPointAdminViewSet, basename="manage-dft-pillar-points")
router.register(r"dft/timeline", DftTimelineAdminViewSet, basename="manage-dft-timeline")
router.register(r"dft/outcome-bullets", DftOutcomeBulletAdminViewSet, basename="manage-dft-outcome-bullets")
router.register(r"submissions", ContactSubmissionAdminViewSet, basename="manage-submissions")


manage_urlpatterns = [
    path("auth/login/", TokenObtainPairView.as_view(), name="manage_token_obtain"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="manage_token_refresh"),
    path("me/", ManageMeView.as_view(), name="manage_me"),
    # Singleton page edits
    path("pages/site/", SiteSettingsAdminView.as_view(), name="manage_site"),
    path("pages/home/", HomePageAdminView.as_view(), name="manage_home"),
    path("pages/about/", AboutPageAdminView.as_view(), name="manage_about"),
    path("pages/approach/", ApproachPageAdminView.as_view(), name="manage_approach"),
    path("pages/contact/", ContactPageAdminView.as_view(), name="manage_contact"),
    path("pages/solutions/", SolutionsPageAdminView.as_view(), name="manage_solutions_page"),
    path("pages/training/", TrainingPageAdminView.as_view(), name="manage_training_page"),
    path("pages/digital-fast-track/", DigitalFastTrackPageAdminView.as_view(), name="manage_dft_page"),
    path("submissions/forward/", ForwardSubmissionsView.as_view(), name="manage_submissions_forward"),
    path("", include(router.urls)),
]
