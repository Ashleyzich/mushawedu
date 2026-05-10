from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ["username", "email", "get_full_name", "role", "location", "is_verified", "is_active", "created_at"]
    list_filter = ["role", "is_verified", "is_active", "location"]
    search_fields = ["username", "email", "first_name", "last_name", "phone"]
    ordering = ["-created_at"]

    fieldsets = UserAdmin.fieldsets + (
        ("Vaka Profile", {
            "fields": ("role", "phone", "location", "bio", "avatar", "is_verified", "ecocash_number"),
        }),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        ("Vaka Profile", {
            "fields": ("email", "first_name", "last_name", "role", "phone", "location"),
        }),
    )

    actions = ["mark_verified", "mark_unverified"]

    def mark_verified(self, request, queryset):
        queryset.update(is_verified=True)
        self.message_user(request, f"{queryset.count()} user(s) marked as verified.")
    mark_verified.short_description = "Mark selected users as verified"

    def mark_unverified(self, request, queryset):
        queryset.update(is_verified=False)
        self.message_user(request, f"{queryset.count()} user(s) marked as unverified.")
    mark_unverified.short_description = "Mark selected users as unverified"
