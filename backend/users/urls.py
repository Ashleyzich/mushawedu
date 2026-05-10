from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    CustomTokenObtainPairView,
    RegisterView,
    ProfileView,
    UserDetailView,
    dashboard_summary,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="user-register"),
    path("login/", CustomTokenObtainPairView.as_view(), name="user-login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("profile/", ProfileView.as_view(), name="user-profile"),
    path("dashboard/", dashboard_summary, name="user-dashboard"),
    path("<int:pk>/", UserDetailView.as_view(), name="user-detail"),
]
