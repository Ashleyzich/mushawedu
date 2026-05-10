"""Projects serializers."""

from rest_framework import serializers
from .models import Project, ProjectQuote
from users.serializers import UserPublicSerializer


class ProjectQuoteSerializer(serializers.ModelSerializer):
    artisan = UserPublicSerializer(read_only=True)

    class Meta:
        model = ProjectQuote
        fields = ["id", "artisan", "amount", "timeline_days", "proposal", "status", "created_at"]
        read_only_fields = ["id", "artisan", "status", "created_at"]


class ProjectSerializer(serializers.ModelSerializer):
    posted_by = UserPublicSerializer(read_only=True)
    category_display = serializers.CharField(source="get_category_display", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    quote_count = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            "id", "posted_by", "title", "description", "category", "category_display",
            "location", "budget_min", "budget_max", "status", "status_display",
            "requires_materials", "deadline", "image", "quote_count", "created_at",
        ]
        read_only_fields = ["id", "posted_by", "created_at"]

    def get_quote_count(self, obj):
        return obj.quotes.count()

    def create(self, validated_data):
        validated_data["posted_by"] = self.context["request"].user
        return super().create(validated_data)
