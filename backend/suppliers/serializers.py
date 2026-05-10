"""Suppliers serializers."""
from rest_framework import serializers
from .models import SupplierProfile, SupplierListing, MaterialCategory
from users.serializers import UserPublicSerializer


class MaterialCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = MaterialCategory
        fields = ["id", "name", "slug", "icon"]


class SupplierListingSerializer(serializers.ModelSerializer):
    supplier = UserPublicSerializer(read_only=True)
    category = MaterialCategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=MaterialCategory.objects.all(), source="category", write_only=True, required=False
    )
    unit_display = serializers.CharField(source="get_unit_display", read_only=True)

    class Meta:
        model = SupplierListing
        fields = [
            "id", "supplier", "category", "category_id", "name", "description",
            "unit", "unit_display", "price_usd", "stock_quantity", "image",
            "is_available", "is_resale", "location", "created_at",
        ]
        read_only_fields = ["id", "supplier", "created_at"]

    def create(self, validated_data):
        validated_data["supplier"] = self.context["request"].user
        return super().create(validated_data)


class SupplierProfileSerializer(serializers.ModelSerializer):
    user = UserPublicSerializer(read_only=True)
    listings = SupplierListingSerializer(many=True, read_only=True)

    class Meta:
        model = SupplierProfile
        fields = ["id", "user", "company_name", "description", "address", "phone", "website", "logo", "delivery_areas", "listings", "created_at"]
        read_only_fields = ["id", "user", "created_at"]
