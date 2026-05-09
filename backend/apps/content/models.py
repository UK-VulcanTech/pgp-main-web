"""
Content models for the new PGP design.

Each top-level page is a Singleton (PK fixed at 1). Pages aggregate inline
related models for the lists/cards/bullets that make up their sections.

Solutions and TrainingArea are independent rows keyed by `slug`. Adjacency
between solutions / training programs is modelled with a small through-table
so the order of "Adjacent sectors" / "More training programs" is editable
per-row.
"""
from django.conf import settings
from django.db import models


class SingletonModel(models.Model):
    """Mixin that pins the row to PK=1 — useful for global page singletons."""

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        # Singleton rows shouldn't be deletable from the admin.
        pass

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


# ---------- Site-wide ---------------------------------------------------------


class SiteSettings(SingletonModel):
    meta_title = models.CharField(max_length=255, blank=True)
    meta_description = models.TextField(blank=True)
    favicon = models.ImageField(upload_to="site/", blank=True, null=True)

    # Footer brand block
    footer_tagline = models.TextField(blank=True)
    footer_address = models.TextField(blank=True)
    footer_phone = models.CharField(max_length=64, blank=True)
    footer_email = models.EmailField(blank=True)
    copyright_line = models.CharField(max_length=255, blank=True)

    # Social
    social_linkedin = models.URLField(blank=True)
    social_x = models.URLField(blank=True)
    social_youtube = models.URLField(blank=True)

    class Meta:
        verbose_name_plural = "Site settings"

    def __str__(self):
        return "Site settings"


# ---------- Home page ---------------------------------------------------------


class HomePage(SingletonModel):
    hero_eyebrow = models.CharField(max_length=255, blank=True)
    hero_title_lead = models.CharField(
        max_length=255, blank=True,
        help_text='The plain part of the hero title — e.g. "Full-service technology services for"',
    )
    hero_title_em = models.CharField(
        max_length=255, blank=True,
        help_text='The italic/cyan portion of the hero title.',
    )
    hero_lede = models.TextField(blank=True)
    hero_image = models.ImageField(upload_to="home/", blank=True, null=True)
    hero_image_url = models.CharField(max_length=512, blank=True, help_text="Static path or absolute URL — used in place of the uploaded file when set.")
    hero_cta_primary_label = models.CharField(max_length=120, blank=True)
    hero_cta_primary_url = models.CharField(max_length=512, blank=True)
    hero_cta_secondary_label = models.CharField(max_length=120, blank=True)
    hero_cta_secondary_url = models.CharField(max_length=512, blank=True)

    pillars_section_eyebrow = models.CharField(max_length=120, blank=True)
    pillars_section_title = models.CharField(max_length=255, blank=True)
    pillars_section_lede = models.TextField(blank=True)

    ppp_image = models.ImageField(upload_to="home/", blank=True, null=True)
    ppp_image_url = models.CharField(max_length=512, blank=True, help_text="Static path or absolute URL — used in place of the uploaded file when set.")
    ppp_eyebrow = models.CharField(max_length=120, blank=True)
    ppp_title = models.CharField(max_length=255, blank=True)
    ppp_body = models.TextField(blank=True)

    snapshot_section_eyebrow = models.CharField(max_length=120, blank=True)
    snapshot_section_title = models.CharField(max_length=255, blank=True)

    howwework_section_eyebrow = models.CharField(max_length=120, blank=True)
    howwework_section_title = models.CharField(max_length=255, blank=True)

    cta_heading = models.CharField(max_length=255, blank=True)
    cta_body = models.TextField(blank=True)
    cta_primary_label = models.CharField(max_length=120, blank=True)
    cta_primary_url = models.CharField(max_length=512, blank=True)
    cta_secondary_label = models.CharField(max_length=120, blank=True)
    cta_secondary_url = models.CharField(max_length=512, blank=True)

    class Meta:
        verbose_name = "Home page"
        verbose_name_plural = "Home page"

    def __str__(self):
        return "Home page"


class HomeHeroMeta(models.Model):
    """The 3 meta tiles below the hero (Mission Scope / Operating Model / Outcome Lens)."""

    page = models.ForeignKey(HomePage, on_delete=models.CASCADE, related_name="hero_meta")
    sort_order = models.PositiveSmallIntegerField(default=0)
    label = models.CharField(max_length=120)
    value = models.CharField(max_length=120)
    desc = models.CharField(max_length=255, blank=True)

    class Meta:
        ordering = ["sort_order", "id"]


class HomePillar(models.Model):
    """The 3 pillar cards under "What PGP Delivers"."""

    page = models.ForeignKey(HomePage, on_delete=models.CASCADE, related_name="pillars")
    sort_order = models.PositiveSmallIntegerField(default=0)
    num = models.CharField(max_length=8)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    link_label = models.CharField(max_length=120, blank=True)
    link_url = models.CharField(max_length=512, blank=True)

    class Meta:
        ordering = ["sort_order", "id"]


class HomePPPBullet(models.Model):
    page = models.ForeignKey(HomePage, on_delete=models.CASCADE, related_name="ppp_bullets")
    sort_order = models.PositiveSmallIntegerField(default=0)
    text = models.CharField(max_length=500)

    class Meta:
        ordering = ["sort_order", "id"]


class HomeProcessStep(models.Model):
    page = models.ForeignKey(HomePage, on_delete=models.CASCADE, related_name="process_steps")
    sort_order = models.PositiveSmallIntegerField(default=0)
    num = models.CharField(max_length=64)
    title = models.CharField(max_length=120)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ["sort_order", "id"]


# ---------- About page --------------------------------------------------------


class AboutPage(SingletonModel):
    page_eyebrow = models.CharField(max_length=120, blank=True)
    page_title = models.TextField(blank=True)
    page_lede = models.TextField(blank=True)
    page_image = models.ImageField(upload_to="about/", blank=True, null=True)
    page_image_url = models.CharField(max_length=512, blank=True, help_text="Static path or absolute URL — used in place of the uploaded file when set.")

    principles_section_eyebrow = models.CharField(max_length=120, blank=True)
    principles_section_title = models.CharField(max_length=255, blank=True)

    whoweserve_image = models.ImageField(upload_to="about/", blank=True, null=True)
    whoweserve_image_url = models.CharField(max_length=512, blank=True, help_text="Static path or absolute URL — used in place of the uploaded file when set.")
    whoweserve_eyebrow = models.CharField(max_length=120, blank=True)
    whoweserve_title = models.CharField(max_length=255, blank=True)
    whoweserve_body = models.TextField(blank=True)

    measure_section_eyebrow = models.CharField(max_length=120, blank=True)
    measure_section_title = models.CharField(max_length=255, blank=True)
    measure_section_lede = models.TextField(blank=True)

    cta_heading = models.CharField(max_length=255, blank=True)
    cta_body = models.TextField(blank=True)
    cta_primary_label = models.CharField(max_length=120, blank=True)
    cta_primary_url = models.CharField(max_length=512, blank=True)
    cta_secondary_label = models.CharField(max_length=120, blank=True)
    cta_secondary_url = models.CharField(max_length=512, blank=True)

    class Meta:
        verbose_name = "About page"
        verbose_name_plural = "About page"

    def __str__(self):
        return "About page"


class AboutPrinciple(models.Model):
    page = models.ForeignKey(AboutPage, on_delete=models.CASCADE, related_name="principles")
    sort_order = models.PositiveSmallIntegerField(default=0)
    num = models.CharField(max_length=8)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ["sort_order", "id"]


class AboutWhoBullet(models.Model):
    page = models.ForeignKey(AboutPage, on_delete=models.CASCADE, related_name="who_bullets")
    sort_order = models.PositiveSmallIntegerField(default=0)
    text = models.CharField(max_length=500)

    class Meta:
        ordering = ["sort_order", "id"]


class AboutMeasureCard(models.Model):
    page = models.ForeignKey(AboutPage, on_delete=models.CASCADE, related_name="measure_cards")
    sort_order = models.PositiveSmallIntegerField(default=0)
    label = models.CharField(max_length=120)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ["sort_order", "id"]


# ---------- Approach page -----------------------------------------------------


class ApproachPage(SingletonModel):
    page_eyebrow = models.CharField(max_length=120, blank=True)
    page_title = models.TextField(blank=True)
    page_lede = models.TextField(blank=True)
    page_image = models.ImageField(upload_to="approach/", blank=True, null=True)
    page_image_url = models.CharField(max_length=512, blank=True, help_text="Static path or absolute URL — used in place of the uploaded file when set.")

    cta_heading = models.CharField(max_length=255, blank=True)
    cta_body = models.TextField(blank=True)
    cta_primary_label = models.CharField(max_length=120, blank=True)
    cta_primary_url = models.CharField(max_length=512, blank=True)
    cta_secondary_label = models.CharField(max_length=120, blank=True)
    cta_secondary_url = models.CharField(max_length=512, blank=True)

    class Meta:
        verbose_name = "Approach page"
        verbose_name_plural = "Approach page"

    def __str__(self):
        return "Approach page"


class ApproachBlock(models.Model):
    page = models.ForeignKey(ApproachPage, on_delete=models.CASCADE, related_name="blocks")
    sort_order = models.PositiveSmallIntegerField(default=0)
    num = models.CharField(max_length=8)
    title = models.CharField(max_length=255)

    class Meta:
        ordering = ["sort_order", "id"]


class ApproachBlockBullet(models.Model):
    block = models.ForeignKey(ApproachBlock, on_delete=models.CASCADE, related_name="bullets")
    sort_order = models.PositiveSmallIntegerField(default=0)
    text = models.CharField(max_length=500)

    class Meta:
        ordering = ["sort_order", "id"]


# ---------- Contact page ------------------------------------------------------


class ContactPage(SingletonModel):
    page_eyebrow = models.CharField(max_length=120, blank=True)
    page_title = models.TextField(blank=True)
    page_lede = models.TextField(blank=True)
    page_image = models.ImageField(upload_to="contact/", blank=True, null=True)
    page_image_url = models.CharField(max_length=512, blank=True, help_text="Static path or absolute URL — used in place of the uploaded file when set.")

    hq_label = models.CharField(max_length=120, blank=True, default="Headquarters")
    hq_address = models.TextField(blank=True)
    phone_label = models.CharField(max_length=120, blank=True, default="Phone")
    phone_number = models.CharField(max_length=64, blank=True)
    email_label = models.CharField(max_length=120, blank=True, default="Email")
    email_address = models.EmailField(blank=True)
    next_steps_label = models.CharField(max_length=120, blank=True, default="Next steps")
    next_steps_text = models.TextField(blank=True)

    class Meta:
        verbose_name = "Contact page"
        verbose_name_plural = "Contact page"

    def __str__(self):
        return "Contact page"


class ContactSector(models.Model):
    """Options for the form's 'Sector of interest' select."""

    page = models.ForeignKey(ContactPage, on_delete=models.CASCADE, related_name="sectors")
    sort_order = models.PositiveSmallIntegerField(default=0)
    label = models.CharField(max_length=255)

    class Meta:
        ordering = ["sort_order", "id"]


# ---------- Solutions hub + sectors ------------------------------------------


class SolutionsPage(SingletonModel):
    page_eyebrow = models.CharField(max_length=120, blank=True)
    page_title = models.TextField(blank=True)
    page_lede = models.TextField(blank=True)
    page_image = models.ImageField(upload_to="solutions/", blank=True, null=True)
    page_image_url = models.CharField(max_length=512, blank=True, help_text="Static path or absolute URL — used in place of the uploaded file when set.")

    section_eyebrow = models.CharField(max_length=120, blank=True)
    section_title = models.CharField(max_length=255, blank=True)

    cta_heading = models.CharField(max_length=255, blank=True)
    cta_body = models.TextField(blank=True)
    cta_primary_label = models.CharField(max_length=120, blank=True)
    cta_primary_url = models.CharField(max_length=512, blank=True)
    cta_secondary_label = models.CharField(max_length=120, blank=True)
    cta_secondary_url = models.CharField(max_length=512, blank=True)

    class Meta:
        verbose_name = "Solutions hub"
        verbose_name_plural = "Solutions hub"

    def __str__(self):
        return "Solutions hub"


class Solution(models.Model):
    slug = models.SlugField(max_length=80, unique=True)
    title = models.CharField(max_length=255)
    snapshot = models.TextField(
        blank=True,
        help_text="Short blurb shown on the Solutions hub and Home snapshot grids.",
    )
    hero_image = models.ImageField(upload_to="solutions/", blank=True, null=True)
    hero_image_url = models.CharField(max_length=512, blank=True, help_text="Static path or absolute URL — used in place of the uploaded file when set.")
    hero_title = models.TextField(blank=True)
    hero_lede = models.TextField(blank=True)
    overview_title = models.CharField(max_length=255, blank=True)
    overview_lede = models.TextField(blank=True)
    outcome = models.TextField(
        blank=True,
        help_text="Single-sentence outcome focus shown in the highlighted band.",
    )
    cta_label = models.CharField(max_length=120, blank=True)

    sort_order = models.PositiveSmallIntegerField(default=0)
    is_published = models.BooleanField(default=True)

    adjacent = models.ManyToManyField(
        "self",
        through="SolutionAdjacency",
        through_fields=("from_solution", "to_solution"),
        symmetrical=False,
        related_name="referenced_by",
        blank=True,
    )

    class Meta:
        ordering = ["sort_order", "slug"]

    def __str__(self):
        return self.title or self.slug


class SolutionDeliverable(models.Model):
    solution = models.ForeignKey(Solution, on_delete=models.CASCADE, related_name="deliverables")
    sort_order = models.PositiveSmallIntegerField(default=0)
    text = models.TextField()

    class Meta:
        ordering = ["sort_order", "id"]


class SolutionAdjacency(models.Model):
    from_solution = models.ForeignKey(
        Solution, on_delete=models.CASCADE, related_name="adjacent_links"
    )
    to_solution = models.ForeignKey(
        Solution, on_delete=models.CASCADE, related_name="adjacent_links_reverse"
    )
    sort_order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "id"]
        unique_together = [("from_solution", "to_solution")]


# ---------- Training hub + areas ----------------------------------------------


class TrainingPage(SingletonModel):
    page_eyebrow = models.CharField(max_length=120, blank=True)
    page_title = models.TextField(blank=True)
    page_lede = models.TextField(blank=True)
    page_image = models.ImageField(upload_to="training/", blank=True, null=True)
    page_image_url = models.CharField(max_length=512, blank=True, help_text="Static path or absolute URL — used in place of the uploaded file when set.")

    section_eyebrow = models.CharField(max_length=120, blank=True)
    section_title = models.CharField(max_length=255, blank=True)

    cta_heading = models.CharField(max_length=255, blank=True)
    cta_body = models.TextField(blank=True)
    cta_primary_label = models.CharField(max_length=120, blank=True)
    cta_primary_url = models.CharField(max_length=512, blank=True)
    cta_secondary_label = models.CharField(max_length=120, blank=True)
    cta_secondary_url = models.CharField(max_length=512, blank=True)

    class Meta:
        verbose_name = "Training hub"
        verbose_name_plural = "Training hub"

    def __str__(self):
        return "Training hub"


class TrainingArea(models.Model):
    slug = models.SlugField(max_length=80, unique=True)
    title = models.CharField(max_length=255)
    snapshot = models.TextField(blank=True)
    hero_image = models.ImageField(upload_to="training/", blank=True, null=True)
    hero_image_url = models.CharField(max_length=512, blank=True, help_text="Static path or absolute URL — used in place of the uploaded file when set.")
    hero_title = models.TextField(blank=True)
    hero_lede = models.TextField(blank=True)
    overview_title = models.CharField(max_length=255, blank=True)
    overview_lede = models.TextField(blank=True)
    outcome = models.TextField(blank=True)
    cta_label = models.CharField(max_length=120, blank=True)

    sort_order = models.PositiveSmallIntegerField(default=0)
    is_published = models.BooleanField(default=True)

    # Optional cybersecurity 4-phase framework (only populated for the cyber
    # program; flag controls whether the section renders).
    has_cyber_framework = models.BooleanField(default=False)
    cf_section_eyebrow = models.CharField(max_length=120, blank=True)
    cf_section_title = models.TextField(blank=True)
    cf_section_lede = models.TextField(blank=True)
    cf_foundation_tag = models.CharField(max_length=120, blank=True)
    cf_foundation_title = models.CharField(max_length=255, blank=True)
    cf_foundation_desc = models.TextField(blank=True)

    adjacent = models.ManyToManyField(
        "self",
        through="TrainingAdjacency",
        through_fields=("from_training", "to_training"),
        symmetrical=False,
        related_name="referenced_by",
        blank=True,
    )

    class Meta:
        ordering = ["sort_order", "slug"]

    def __str__(self):
        return self.title or self.slug


class TrainingDeliverable(models.Model):
    training = models.ForeignKey(TrainingArea, on_delete=models.CASCADE, related_name="deliverables")
    sort_order = models.PositiveSmallIntegerField(default=0)
    text = models.TextField()

    class Meta:
        ordering = ["sort_order", "id"]


class CyberPhase(models.Model):
    """The four colour-coded phase chips above the framework grid."""

    training = models.ForeignKey(TrainingArea, on_delete=models.CASCADE, related_name="cf_phases")
    sort_order = models.PositiveSmallIntegerField(default=0)
    num = models.CharField(max_length=8)
    label = models.CharField(max_length=120)

    class Meta:
        ordering = ["sort_order", "id"]


class CyberCard(models.Model):
    """One card in the framework grid, tagged by phase."""

    training = models.ForeignKey(TrainingArea, on_delete=models.CASCADE, related_name="cf_cards")
    sort_order = models.PositiveSmallIntegerField(default=0)
    tag = models.CharField(
        max_length=120,
        help_text='Match a phase label exactly: "Preparation", "Prevention", "Detection", "Response".',
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ["sort_order", "id"]


class TrainingAdjacency(models.Model):
    from_training = models.ForeignKey(
        TrainingArea, on_delete=models.CASCADE, related_name="adjacent_links"
    )
    to_training = models.ForeignKey(
        TrainingArea, on_delete=models.CASCADE, related_name="adjacent_links_reverse"
    )
    sort_order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["sort_order", "id"]
        unique_together = [("from_training", "to_training")]


# ---------- Digital Fast Track page ------------------------------------------


class DigitalFastTrackPage(SingletonModel):
    page_eyebrow = models.CharField(max_length=120, blank=True)
    page_title = models.TextField(blank=True)
    page_lede = models.TextField(blank=True)
    page_image = models.ImageField(upload_to="dft/", blank=True, null=True)
    page_image_url = models.CharField(max_length=512, blank=True, help_text="Static path or absolute URL — used in place of the uploaded file when set.")

    page_cta_primary_label = models.CharField(max_length=120, blank=True)
    page_cta_primary_url = models.CharField(max_length=512, blank=True)
    page_cta_secondary_label = models.CharField(max_length=120, blank=True)
    page_cta_secondary_url = models.CharField(max_length=512, blank=True)

    why_section_eyebrow = models.CharField(max_length=120, blank=True)
    why_section_title = models.CharField(max_length=255, blank=True)
    why_section_lede = models.TextField(blank=True)

    pillars_section_eyebrow = models.CharField(max_length=120, blank=True)
    pillars_section_title = models.CharField(max_length=255, blank=True)
    pillars_section_lede = models.TextField(blank=True)

    timeline_section_eyebrow = models.CharField(max_length=120, blank=True)
    timeline_section_title = models.CharField(max_length=255, blank=True)
    timeline_section_lede = models.TextField(blank=True)

    outcomes_image = models.ImageField(upload_to="dft/", blank=True, null=True)
    outcomes_image_url = models.CharField(max_length=512, blank=True, help_text="Static path or absolute URL — used in place of the uploaded file when set.")
    outcomes_eyebrow = models.CharField(max_length=120, blank=True)
    outcomes_title = models.CharField(max_length=255, blank=True)
    outcomes_body = models.TextField(blank=True)

    cta_heading = models.CharField(max_length=255, blank=True)
    cta_body = models.TextField(blank=True)
    cta_primary_label = models.CharField(max_length=120, blank=True)
    cta_primary_url = models.CharField(max_length=512, blank=True)
    cta_secondary_label = models.CharField(max_length=120, blank=True)
    cta_secondary_url = models.CharField(max_length=512, blank=True)

    class Meta:
        verbose_name = "Digital Fast Track page"
        verbose_name_plural = "Digital Fast Track page"

    def __str__(self):
        return "Digital Fast Track page"


class DftMetric(models.Model):
    page = models.ForeignKey(DigitalFastTrackPage, on_delete=models.CASCADE, related_name="metrics")
    sort_order = models.PositiveSmallIntegerField(default=0)
    num = models.CharField(max_length=32)
    label = models.CharField(max_length=255)

    class Meta:
        ordering = ["sort_order", "id"]


class DftPillar(models.Model):
    page = models.ForeignKey(DigitalFastTrackPage, on_delete=models.CASCADE, related_name="pillars")
    sort_order = models.PositiveSmallIntegerField(default=0)
    num = models.CharField(max_length=8)
    title = models.CharField(max_length=255)
    blurb = models.TextField(blank=True)

    class Meta:
        ordering = ["sort_order", "id"]


class DftPillarPoint(models.Model):
    pillar = models.ForeignKey(DftPillar, on_delete=models.CASCADE, related_name="points")
    sort_order = models.PositiveSmallIntegerField(default=0)
    text = models.CharField(max_length=500)

    class Meta:
        ordering = ["sort_order", "id"]


class DftTimeline(models.Model):
    page = models.ForeignKey(DigitalFastTrackPage, on_delete=models.CASCADE, related_name="timeline")
    sort_order = models.PositiveSmallIntegerField(default=0)
    num = models.CharField(max_length=64)
    title = models.CharField(max_length=120)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ["sort_order", "id"]


class DftOutcomeBullet(models.Model):
    page = models.ForeignKey(DigitalFastTrackPage, on_delete=models.CASCADE, related_name="outcome_bullets")
    sort_order = models.PositiveSmallIntegerField(default=0)
    text = models.CharField(max_length=500)

    class Meta:
        ordering = ["sort_order", "id"]


# ---------- Contact form submissions ------------------------------------------


class ContactSubmission(models.Model):
    """Inbound submissions from the public contact form."""

    name = models.CharField(max_length=255)
    organization = models.CharField(max_length=255, blank=True)
    email = models.EmailField()
    country = models.CharField(max_length=255, blank=True)
    sector = models.CharField(max_length=255, blank=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} <{self.email}> @ {self.created_at:%Y-%m-%d}"


# ---------- Editor profile (kept; useful for granular admin perms) -----------


class CmsEditorProfile(models.Model):
    """Per-user allowed sections for non-superuser staff. Superusers ignore this."""

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="cms_profile",
    )
    sections = models.JSONField(default=list, blank=True)

    def __str__(self):
        return f"CMS profile ({self.user_id})"
