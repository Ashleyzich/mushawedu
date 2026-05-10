"""Artisans views."""

from rest_framework import generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import ArtisanProfile, PortfolioItem, ArtisanReview
from .serializers import ArtisanProfileSerializer, ArtisanListSerializer, PortfolioItemSerializer, ArtisanReviewSerializer


class ArtisanListView(generics.ListAPIView):
    queryset = ArtisanProfile.objects.select_related("user").prefetch_related("reviews")
    serializer_class = ArtisanListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["primary_trade", "is_museyamwa"]
    search_fields = ["user__first_name", "user__last_name", "description", "service_areas"]
    ordering_fields = ["average_rating", "completed_jobs", "years_experience"]


class ArtisanDetailView(generics.RetrieveAPIView):
    queryset = ArtisanProfile.objects.select_related("user").prefetch_related("portfolio_items", "reviews__reviewer")
    serializer_class = ArtisanProfileSerializer
    permission_classes = [permissions.AllowAny]


class ArtisanProfileCreateUpdateView(generics.RetrieveUpdateAPIView):
    """GET/PATCH own artisan profile, or create it."""
    serializer_class = ArtisanProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, _ = ArtisanProfile.objects.get_or_create(user=self.request.user)
        return profile


class PortfolioItemCreateView(generics.CreateAPIView):
    serializer_class = PortfolioItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        profile, _ = ArtisanProfile.objects.get_or_create(user=self.request.user)
        serializer.save(artisan=profile)


class ArtisanReviewCreateView(generics.CreateAPIView):
    serializer_class = ArtisanReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        artisan = ArtisanProfile.objects.get(pk=self.kwargs["artisan_id"])
        serializer.save(artisan=artisan, reviewer=self.request.user)
