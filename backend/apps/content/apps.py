from django.apps import AppConfig


class ContentConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.content"

    def ready(self):
        # Register every editable CMS model with django-auditlog so each
        # save/delete is recorded. Imported here (lazily) to avoid circular
        # imports during Django startup.
        from auditlog.registry import auditlog
        from . import models as m

        for model in (
            m.SiteSettings,
            m.HomePage,
            m.HomeHeroMeta,
            m.HomePillar,
            m.HomePPPBullet,
            m.HomeProcessStep,
            m.AboutPage,
            m.AboutPrinciple,
            m.AboutWhoBullet,
            m.AboutMeasureCard,
            m.ApproachPage,
            m.ApproachBlock,
            m.ApproachBlockBullet,
            m.ContactPage,
            m.ContactSector,
            m.ContactSubmission,
            m.Solution,
            m.SolutionDeliverable,
            m.SolutionAdjacency,
            m.TrainingArea,
            m.TrainingDeliverable,
            m.TrainingAdjacency,
            m.SolutionsPage,
            m.TrainingPage,
            m.DigitalFastTrackPage,
            m.DftMetric,
            m.DftPillar,
            m.DftPillarPoint,
            m.DftTimeline,
            m.DftOutcomeBullet,
            m.CyberPhase,
            m.CyberCard,
        ):
            try:
                auditlog.register(model)
            except Exception:
                # If a particular model is missing in this code revision
                # (rename, delete) don't break startup — just skip it.
                pass
