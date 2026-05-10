"""Users app views."""

from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import CustomUser
from .serializers import (
    CustomTokenObtainPairSerializer,
    UserRegistrationSerializer,
    UserProfileSerializer,
    UserPublicSerializer,
)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    """POST /api/users/register/ — create a new account."""
    queryset = CustomUser.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                "message": "Account created successfully. Welcome to Vaka!",
                "user": UserProfileSerializer(user).data,
            },
            status=status.HTTP_201_CREATED,
        )


class ProfileView(generics.RetrieveUpdateAPIView):
    """GET/PATCH /api/users/profile/ — read or update own profile."""
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class UserDetailView(generics.RetrieveAPIView):
    """GET /api/users/<id>/ — public user profile."""
    queryset = CustomUser.objects.all()
    serializer_class = UserPublicSerializer
    permission_classes = [permissions.AllowAny]


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def dashboard_summary(request):
    """GET /api/users/dashboard/ — summary data for the authenticated user."""
    user = request.user

    from projects.models import Project
    from artisans.models import ArtisanProfile
    from suppliers.models import SupplierListing

    data = {
        "user": UserProfileSerializer(user).data,
        "stats": {},
    }

    if user.is_customer:
        my_projects = Project.objects.filter(posted_by=user)
        data["stats"] = {
            "total_projects": my_projects.count(),
            "open_projects": my_projects.filter(status="open").count(),
            "in_progress": my_projects.filter(status="in_progress").count(),
            "completed": my_projects.filter(status="completed").count(),
        }
        data["recent_projects"] = [
            {
                "id": p.id,
                "title": p.title,
                "category": p.get_category_display(),
                "status": p.status,
                "budget_min": str(p.budget_min),
                "budget_max": str(p.budget_max),
                "created_at": p.created_at,
            }
            for p in my_projects.order_by("-created_at")[:5]
        ]

    elif user.is_artisan:
        try:
            profile = user.artisan_profile
            data["stats"] = {
                "rating": float(profile.average_rating or 0),
                "review_count": profile.reviews.count(),
                "is_verified": user.is_verified,
                "trade": profile.get_primary_trade_display(),
            }
        except ArtisanProfile.DoesNotExist:
            data["stats"] = {"profile_complete": False}

    elif user.is_supplier:
        listings = SupplierListing.objects.filter(supplier=user)
        data["stats"] = {
            "total_listings": listings.count(),
            "active_listings": listings.filter(is_available=True).count(),
        }

    return Response(data)
