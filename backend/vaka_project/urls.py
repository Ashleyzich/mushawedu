"""Vaka – root URL configuration."""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    # Admin
    path("admin/", admin.site.urls),

    # JWT Auth
    path("api/auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/auth/token/verify/", TokenVerifyView.as_view(), name="token_verify"),

    # App endpoints
    path("api/users/", include("users.urls")),
    path("api/projects/", include("projects.urls")),
    path("api/artisans/", include("artisans.urls")),
    path("api/suppliers/",  include("suppliers.urls")),
    path("api/messaging/",  include("messaging.urls")),
    path("api/payments/",   include("payments.urls")),
    path("api/quotation/",  include("projects.quotation_urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Admin branding
admin.site.site_header = "Vaka Administration"
admin.site.site_title = "Vaka Admin"
admin.site.index_title = "Zimbabwe Construction Marketplace"
