"""CMS editor section keys for fine-grained manage API access."""

from __future__ import annotations

from typing import TYPE_CHECKING, FrozenSet

if TYPE_CHECKING:
    from django.contrib.auth.models import AbstractUser

ALL_CMS_SECTIONS: FrozenSet[str] = frozenset(
    {
        "site",
        "home",
        "about",
        "contact_page",
        "impact",
        "technology",
        "footer_links",
        "solutions",
        "training",
        "contact_submissions",
        "upload",
    }
)

SECTION_LABELS: dict[str, str] = {
    "site": "Site & footer",
    "home": "Home page",
    "about": "About",
    "contact_page": "Contact page",
    "impact": "Impact",
    "technology": "Technology",
    "footer_links": "Footer links",
    "solutions": "Solutions",
    "training": "Training",
    "contact_submissions": "Form submissions",
    "upload": "Media upload (images)",
}


def get_effective_cms_sections(user: AbstractUser) -> FrozenSet[str]:
    from .models import CmsEditorProfile

    if not user or not user.is_authenticated or not getattr(user, "is_staff", False):
        return frozenset()
    if user.is_superuser:
        return ALL_CMS_SECTIONS
    try:
        prof = user.cms_profile
    except CmsEditorProfile.DoesNotExist:
        return ALL_CMS_SECTIONS
    raw = prof.sections if isinstance(prof.sections, list) else []
    return frozenset(s for s in raw if s in ALL_CMS_SECTIONS)
