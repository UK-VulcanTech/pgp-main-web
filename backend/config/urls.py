from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path

from apps.content.urls import manage_urlpatterns, public_urlpatterns

urlpatterns = [
    path("api/public/v1/", include(public_urlpatterns)),
    path("api/manage/v1/", include(manage_urlpatterns)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
