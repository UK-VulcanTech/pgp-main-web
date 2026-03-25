from rest_framework.permissions import BasePermission

from .cms_sections import get_effective_cms_sections


class IsStaffUser(BasePermission):
    """CMS access: JWT-authenticated Django staff."""

    message = "Staff authentication required."

    def has_permission(self, request, view):
        u = request.user
        return bool(u and u.is_authenticated and u.is_staff)


class HasCmsSectionPermission(BasePermission):
    """Requires staff plus membership in the view's `cms_section` (superusers: all)."""

    message = "You do not have permission to edit this section."

    def has_permission(self, request, view):
        u = request.user
        if not u or not u.is_authenticated or not u.is_staff:
            return False
        section = getattr(view, "cms_section", None)
        if section is None:
            return True
        return section in get_effective_cms_sections(u)


class IsCmsSuperuser(BasePermission):
    """User management and other admin-only operations."""

    message = "Superuser privileges required."

    def has_permission(self, request, view):
        u = request.user
        return bool(u and u.is_authenticated and u.is_staff and u.is_superuser)
