"""Artisans serializers."""

from rest_framework import serializers
from .models import ArtisanProfile, PortfolioItem, ArtisanReview
from users.serializers import UserPublicSerializer


class PortfolioItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioItem
        fields = ["id", "title", "description", "image", "project_value", "location", "completed_date", "created_at"]
        read_only_fields = ["id", "created_at"]


class ArtisanReviewSerializer(serializers.ModelSerializer):
    reviewer = UserPublicSerializer(read_only=True)

    class Meta:
        model = ArtisanReview
        fields = ["id", "reviewer", "rating", "comment", "created_at"]
        read_only_fields = ["id", "reviewer", "created_at"]

    def create(self, validated_data):
        validated_data["reviewer"] = self.context["request"].user
        return super().create(validated_data)


class ArtisanProfileSerializer(serializers.ModelSerializer):
    user = UserPublicSerializer(read_only=True)
    primary_trade_display = serializers.CharField(source="get_primary_trade_display", read_only=True)
    portfolio_items = PortfolioItemSerializer(many=True, read_only=True)
    reviews = ArtisanReviewSerializer(many=True, read_only=True)
    review_count = serializers.SerializerMethodField()

    class Meta:
        model = ArtisanProfile
        fields = [
            "id", "user", "primary_trade", "primary_trade_display",
            "secondary_trades", "years_experience", "description",
            "certifications", "service_areas", "is_museyamwa",
            "average_rating", "completed_jobs", "profile_image",
            "portfolio_items", "reviews", "review_count", "created_at",
        ]
        read_only_fields = ["id", "average_rating", "created_at"]

    def get_review_count(self, obj):
        return obj.reviews.count()


class ArtisanListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views."""
    user = UserPublicSerializer(read_only=True)
    primary_trade_display = serializers.CharField(source="get_primary_trade_display", read_only=True)
    review_count = serializers.SerializerMethodField()

    class Meta:
        model = ArtisanProfile
        fields = [
            "id", "user", "primary_trade", "primary_trade_display",
            "years_experience", "is_museyamwa", "average_rating",
            "completed_jobs", "service_areas", "profile_image", "review_count",
        ]

    def get_review_count(self, obj):
        return obj.reviews.count()
