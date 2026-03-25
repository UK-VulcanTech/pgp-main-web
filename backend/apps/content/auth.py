from django.utils import timezone
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from .cms_sections import get_effective_cms_sections


class StaffTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Only active staff users may receive CMS tokens."""

    default_error_messages = {
        "no_active_account": "No active account with these credentials.",
        "not_staff": "CMS access requires a staff account.",
    }

    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        if not user.is_active:
            raise serializers.ValidationError(
                {"detail": self.error_messages["no_active_account"]},
                code="authorization",
            )
        if not user.is_staff:
            raise serializers.ValidationError(
                {"detail": self.error_messages["not_staff"]},
                code="authorization",
            )
        user.last_login = timezone.now()
        user.save(update_fields=["last_login"])
        data["user"] = {
            "id": user.id,
            "username": user.username,
            "email": user.email or "",
            "is_superuser": user.is_superuser,
            "cms_sections": sorted(get_effective_cms_sections(user)),
        }
        return data


class StaffTokenObtainPairView(TokenObtainPairView):
    serializer_class = StaffTokenObtainPairSerializer
