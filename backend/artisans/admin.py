from django.contrib import admin
from .models import ArtisanProfile, PortfolioItem, ArtisanReview


class PortfolioInline(admin.TabularInline):
    model = PortfolioItem
    extra = 0


class ReviewInline(admin.TabularInline):
    model = ArtisanReview
    extra = 0
    readonly_fields = ["reviewer", "rating", "comment", "created_at"]


@admin.register(ArtisanProfile)
class ArtisanProfileAdmin(admin.ModelAdmin):
    list_display = ["user", "primary_trade", "years_experience", "average_rating", "completed_jobs", "is_museyamwa", "user__is_verified"]
    list_filter = ["primary_trade", "is_museyamwa"]
    search_fields = ["user__username", "user__first_name", "user__last_name"]
    inlines = [PortfolioInline, ReviewInline]

    def user__is_verified(self, obj):
        return obj.user.is_verified
    user__is_verified.boolean = True
    user__is_verified.short_description = "Verified"


@admin.register(PortfolioItem)
class PortfolioItemAdmin(admin.ModelAdmin):
    list_display = ["artisan", "title", "location", "completed_date"]


@admin.register(ArtisanReview)
class ArtisanReviewAdmin(admin.ModelAdmin):
    list_display = ["artisan", "reviewer", "rating", "created_at"]
    list_filter = ["rating"]
