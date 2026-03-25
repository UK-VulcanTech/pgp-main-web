from django.conf import settings
from django.core.validators import MaxLengthValidator
from django.db import models


class SingletonModel(models.Model):
    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        pass

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class SiteSettings(SingletonModel):
    meta_title = models.CharField(max_length=255, blank=True)
    meta_description = models.TextField(blank=True)
    logo = models.ImageField(upload_to="site/", blank=True, null=True)
    header_image = models.ImageField(upload_to="site/", blank=True, null=True)

    footer_tagline = models.CharField(max_length=255, blank=True)
    footer_company_line1 = models.CharField(max_length=120, default="Peak Global")
    footer_company_line2 = models.CharField(max_length=120, default="Partners")
    social_facebook = models.URLField(blank=True)
    social_google = models.URLField(blank=True)
    social_instagram = models.URLField(blank=True)
    social_youtube = models.URLField(blank=True)
    footer_address = models.TextField(blank=True)
    footer_email = models.EmailField(blank=True)
    footer_phone = models.CharField(max_length=64, blank=True)
    copyright_line = models.CharField(max_length=255, blank=True)

    class Meta:
        verbose_name_plural = "Site settings"


class FooterLink(models.Model):
    class Category(models.TextChoices):
        QUICK = "quick", "Quick links"
        SECTOR = "sector", "Sectors"
        LEGAL = "legal", "Legal"

    category = models.CharField(max_length=16, choices=Category.choices)
    label = models.CharField(max_length=120)
    url = models.CharField(max_length=512, blank=True)
    sort_order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["category", "sort_order", "id"]


class HomePage(SingletonModel):
    hero_eyebrow = models.CharField(max_length=120, blank=True)
    hero_h1 = models.TextField(blank=True, validators=[MaxLengthValidator(2000)])
    hero_body = models.TextField(blank=True)
    hero_cta_primary_label = models.CharField(max_length=120, blank=True)
    hero_cta_primary_url = models.CharField(max_length=512, blank=True)
    hero_cta_secondary_label = models.CharField(max_length=120, blank=True)
    hero_cta_secondary_url = models.CharField(max_length=512, blank=True)
    hero_bg = models.ImageField(upload_to="home/", blank=True, null=True)

    what_deliver_title = models.CharField(max_length=255, blank=True)
    ppp_heading = models.CharField(max_length=255, blank=True)
    ppp_body = models.TextField(blank=True)

    solutions_snapshot_title = models.CharField(max_length=255, blank=True)
    how_we_work_title = models.CharField(max_length=255, blank=True)

    cta_heading = models.CharField(max_length=255, blank=True)
    cta_body = models.TextField(blank=True)
    cta_button_label = models.CharField(max_length=120, blank=True)
    cta_button_url = models.CharField(max_length=512, blank=True)
    cta_bg = models.ImageField(upload_to="home/", blank=True, null=True)

    class Meta:
        verbose_name = "Home page"
        verbose_name_plural = "Home page"


class HomePillar(models.Model):
    home = models.ForeignKey(HomePage, on_delete=models.CASCADE, related_name="pillars")
    sort_order = models.PositiveSmallIntegerField(default=0)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ["sort_order", "id"]


class HomeHowStep(models.Model):
    home = models.ForeignKey(HomePage, on_delete=models.CASCADE, related_name="how_steps")
    sort_order = models.PositiveSmallIntegerField(default=0)
    title = models.CharField(max_length=120)
    description = models.CharField(max_length=500, blank=True)

    class Meta:
        ordering = ["sort_order", "id"]


class SolutionSnapshotCard(models.Model):
    home = models.ForeignKey(HomePage, on_delete=models.CASCADE, related_name="snapshot_cards")
    sort_order = models.PositiveSmallIntegerField(default=0)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="solutions/snap/", blank=True, null=True)
    hover_image = models.ImageField(upload_to="solutions/snap/", blank=True, null=True)

    class Meta:
        ordering = ["sort_order", "id"]


class AboutPage(SingletonModel):
    hero_title = models.CharField(max_length=255, blank=True)
    hero_intro = models.TextField(blank=True)
    hero_wave_image = models.ImageField(upload_to="about/", blank=True, null=True)

    differentiators_section_title = models.CharField(max_length=255, blank=True)
    who_heading = models.CharField(max_length=255, blank=True)
    who_body = models.TextField(blank=True)

    outcome_heading = models.CharField(max_length=255, blank=True)
    outcome_subheading = models.CharField(max_length=255, blank=True)
    outcome_body = models.TextField(blank=True)
    outcome_cta_label = models.CharField(max_length=120, blank=True)
    outcome_cta_url = models.CharField(max_length=512, blank=True)
    outcome_image = models.ImageField(upload_to="about/", blank=True, null=True)

    approach_pill = models.CharField(max_length=120, blank=True)
    approach_heading = models.CharField(max_length=255, blank=True)
    approach_bottom_cta_label = models.CharField(max_length=120, blank=True)
    approach_bottom_cta_url = models.CharField(max_length=512, blank=True)
    approach_wave_image = models.ImageField(upload_to="about/", blank=True, null=True)

    class Meta:
        verbose_name = "About page"


class AboutDifferentiatorCard(models.Model):
    about = models.ForeignKey(AboutPage, on_delete=models.CASCADE, related_name="differentiator_cards")
    sort_order = models.PositiveSmallIntegerField(default=0)
    title = models.CharField(max_length=255)
    text = models.TextField(blank=True)
    icon = models.ImageField(upload_to="about/icons/", blank=True, null=True)

    class Meta:
        ordering = ["sort_order", "id"]


class AboutApproachStep(models.Model):
    about = models.ForeignKey(AboutPage, on_delete=models.CASCADE, related_name="approach_steps")
    sort_order = models.PositiveSmallIntegerField(default=0)
    number = models.CharField(max_length=8, default="1")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    bullets = models.JSONField(default=list, blank=True)

    class Meta:
        ordering = ["sort_order", "id"]


class ContactPage(SingletonModel):
    headline_gold = models.CharField(max_length=255, blank=True)
    headline_dark = models.CharField(max_length=255, blank=True)
    intro = models.TextField(blank=True)
    submit_label = models.CharField(max_length=120, blank=True)

    class Meta:
        verbose_name = "Contact page"


class ContactSectorOption(models.Model):
    contact = models.ForeignKey(ContactPage, on_delete=models.CASCADE, related_name="sector_options")
    sort_order = models.PositiveSmallIntegerField(default=0)
    label = models.CharField(max_length=120)
    value = models.SlugField(max_length=64)

    class Meta:
        ordering = ["sort_order", "id"]


class ImpactPage(SingletonModel):
    hero_eyebrow = models.CharField(max_length=120, blank=True)
    headline = models.TextField(blank=True)
    headline_highlight = models.CharField(max_length=500, blank=True)
    metrics_section_title = models.CharField(max_length=255, blank=True)
    case_studies_section_title = models.CharField(max_length=255, blank=True)

    class Meta:
        verbose_name = "Impact page"


class ImpactMetric(models.Model):
    impact = models.ForeignKey(ImpactPage, on_delete=models.CASCADE, related_name="metrics")
    sort_order = models.PositiveSmallIntegerField(default=0)
    stat = models.CharField(max_length=64)
    label = models.CharField(max_length=255)
    wide = models.BooleanField(default=False)

    class Meta:
        ordering = ["sort_order", "id"]


class CaseStudy(models.Model):
    impact = models.ForeignKey(ImpactPage, on_delete=models.CASCADE, related_name="case_studies")
    sort_order = models.PositiveSmallIntegerField(default=0)
    badge = models.CharField(max_length=120, blank=True)
    title = models.CharField(max_length=255, blank=True)

    class Meta:
        ordering = ["sort_order", "id"]
        verbose_name_plural = "Case studies"


class CaseStudyQuadrant(models.Model):
    case_study = models.ForeignKey(CaseStudy, on_delete=models.CASCADE, related_name="quadrants")
    sort_order = models.PositiveSmallIntegerField(default=0)
    label = models.CharField(max_length=120)
    body = models.TextField(blank=True)

    class Meta:
        ordering = ["sort_order", "id"]


class TechnologyPage(SingletonModel):
    hero_label = models.CharField(max_length=120, blank=True)
    title_black_1 = models.CharField(max_length=255, blank=True)
    title_black_2 = models.CharField(max_length=255, blank=True)
    title_yellow = models.CharField(max_length=255, blank=True)
    overview_text = models.TextField(blank=True)
    overview_sidebar_label = models.CharField(max_length=64, default="Overview")
    domains_heading = models.CharField(max_length=255, blank=True)
    enablement_heading = models.CharField(max_length=255, blank=True)
    outcome_eyebrow = models.CharField(max_length=120, blank=True)
    outcome_headline = models.TextField(blank=True)
    outcome_cta_label = models.CharField(max_length=255, blank=True)
    outcome_cta_url = models.CharField(max_length=512, blank=True)

    class Meta:
        verbose_name = "Technology page"


class TechnologyDomain(models.Model):
    tech_page = models.ForeignKey(TechnologyPage, on_delete=models.CASCADE, related_name="domains")
    sort_order = models.PositiveSmallIntegerField(default=0)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    wide = models.BooleanField(default=False)
    icon_key = models.CharField(max_length=64, blank=True)

    class Meta:
        ordering = ["sort_order", "id"]


class TechnologyEnablementItem(models.Model):
    tech_page = models.ForeignKey(TechnologyPage, on_delete=models.CASCADE, related_name="enablement_items")
    sort_order = models.PositiveSmallIntegerField(default=0)
    label = models.TextField()
    icon_key = models.CharField(max_length=64, blank=True)

    class Meta:
        ordering = ["sort_order", "id"]


class Solution(models.Model):
    slug = models.SlugField(max_length=80, unique=True)
    is_published = models.BooleanField(default=True)
    nav_title = models.CharField(max_length=255, blank=True)
    nav_subtitle = models.CharField(max_length=255, blank=True)
    nav_column = models.PositiveSmallIntegerField(default=1)
    nav_order = models.PositiveSmallIntegerField(default=0)

    hero_label = models.CharField(max_length=120, blank=True)
    title_black_1 = models.CharField(max_length=255, blank=True)
    title_black_2 = models.CharField(max_length=255, blank=True)
    title_yellow = models.CharField(max_length=255, blank=True)
    overview_text = models.TextField(blank=True)
    outcome_headline = models.TextField(blank=True)
    outcome_cta = models.CharField(max_length=255, blank=True)
    outcome_cta_url = models.CharField(max_length=512, blank=True)

    class Meta:
        ordering = ["nav_column", "nav_order", "slug"]


class SolutionDeliverable(models.Model):
    solution = models.ForeignKey(Solution, on_delete=models.CASCADE, related_name="deliverables")
    sort_order = models.PositiveSmallIntegerField(default=0)
    code = models.CharField(max_length=8, blank=True)
    text = models.TextField()

    class Meta:
        ordering = ["sort_order", "id"]


class TrainingArea(models.Model):
    slug = models.SlugField(max_length=80, unique=True)
    is_published = models.BooleanField(default=True)
    featured = models.BooleanField(default=False)
    hub_subtitle = models.CharField(max_length=500, blank=True)
    hub_order = models.PositiveSmallIntegerField(default=0)

    category = models.CharField(max_length=120, blank=True)
    title = models.CharField(max_length=255, blank=True)
    description_start = models.TextField(blank=True)
    highlighted_text = models.CharField(max_length=500, blank=True)
    description_end = models.TextField(blank=True)
    deliver_section_title = models.CharField(max_length=120, default="WHAT WE DELIVER")
    display_style = models.CharField(
        max_length=32,
        choices=[("emoji", "Emoji / icon box"), ("numbered", "Numbered (forensics)")],
        default="emoji",
    )
    outcome_tag = models.CharField(max_length=120, blank=True)
    outcome_title = models.TextField(blank=True)

    class Meta:
        ordering = ["hub_order", "slug"]


class TrainingCard(models.Model):
    training = models.ForeignKey(TrainingArea, on_delete=models.CASCADE, related_name="cards")
    sort_order = models.PositiveSmallIntegerField(default=0)
    icon_emoji = models.CharField(max_length=32, blank=True)
    title = models.CharField(max_length=500)
    subtitle = models.TextField(blank=True)

    class Meta:
        ordering = ["sort_order", "id"]


class TrainingNavItem(models.Model):
    """Optional overrides for mega-menu; path usually /training/{slug}."""

    sort_order = models.PositiveSmallIntegerField(default=0)
    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=500, blank=True)
    path = models.CharField(max_length=255)

    class Meta:
        ordering = ["sort_order", "id"]


class ContactSubmission(models.Model):
    name = models.CharField(max_length=255)
    sector = models.CharField(max_length=120, blank=True)
    country = models.CharField(max_length=255, blank=True)
    project_description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]


class CmsEditorProfile(models.Model):
    """Per-user allowed CMS sections (non-superuser staff). Superusers ignore this."""

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="cms_profile",
    )
    sections = models.JSONField(default=list, blank=True)

    def __str__(self):
        return f"CMS profile ({self.user_id})"
