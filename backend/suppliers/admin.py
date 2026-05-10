from django.contrib import admin
from .models import SupplierProfile, SupplierListing, MaterialCategory


@admin.register(MaterialCategory)
class MaterialCategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "slug"]
    prepopulated_fields = {"slug": ("name",)}


@admin.register(SupplierProfile)
class SupplierProfileAdmin(admin.ModelAdmin):
    list_display = ["company_name", "user", "address", "created_at"]
    search_fields = ["company_name", "user__username"]


@admin.register(SupplierListing)
class SupplierListingAdmin(admin.ModelAdmin):
    list_display = ["name", "supplier", "category", "price_usd", "unit", "stock_quantity", "is_available", "is_resale"]
    list_filter = ["category", "is_available", "is_resale"]
    search_fields = ["name", "supplier__username", "location"]
    list_editable = ["is_available", "price_usd"]
