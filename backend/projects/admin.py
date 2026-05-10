from django.contrib import admin
from .models import Project, ProjectQuote


class ProjectQuoteInline(admin.TabularInline):
    model = ProjectQuote
    extra = 0
    readonly_fields = ["artisan", "amount", "timeline_days", "status", "created_at"]


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ["title", "posted_by", "category", "location", "status", "budget_min", "budget_max", "created_at"]
    list_filter = ["status", "category", "location"]
    search_fields = ["title", "description", "posted_by__username"]
    ordering = ["-created_at"]
    inlines = [ProjectQuoteInline]


@admin.register(ProjectQuote)
class ProjectQuoteAdmin(admin.ModelAdmin):
    list_display = ["project", "artisan", "amount", "timeline_days", "status", "created_at"]
    list_filter = ["status"]
    search_fields = ["project__title", "artisan__username"]
