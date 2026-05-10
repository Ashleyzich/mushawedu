"""Artisans app models for Vaka."""

from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator


class ArtisanProfile(models.Model):
    TRADE_CHOICES = [
        ("bricklaying", "Bricklaying & Masonry"),
        ("carpentry", "Carpentry & Joinery"),
        ("plumbing", "Plumbing"),
        ("electrical", "Electrical Installation"),
        ("roofing", "Roofing"),
        ("painting", "Painting & Finishing"),
        ("tiling", "Tiling & Flooring"),
        ("welding", "Welding & Fabrication"),
        ("plastering", "Plastering"),
        ("landscaping", "Landscaping & Paving"),
        ("glazing", "Glazing & Windows"),
        ("general", "General Construction"),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="artisan_profile",
    )
    primary_trade = models.CharField(max_length=40, choices=TRADE_CHOICES)
    secondary_trades = models.JSONField(default=list, blank=True)
    years_experience = models.PositiveIntegerField(default=0)
    description = models.TextField(blank=True)
    certifications = models.TextField(blank=True, help_text="Comma-separated certificates")
    service_areas = models.CharField(max_length=250, blank=True, help_text="Areas served in Zimbabwe")
    is_museyamwa = models.BooleanField(
        default=False,
        help_text="Small informal/independent artisan (Museyamwa)",
    )
    average_rating = models.DecimalField(
        max_digits=3, decimal_places=2, default=0,
        validators=[MinValueValidator(0), MaxValueValidator(5)],
    )
    completed_jobs = models.PositiveIntegerField(default=0)
    profile_image = models.ImageField(upload_to="artisans/profiles/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-average_rating", "-completed_jobs"]
        verbose_name = "Artisan Profile"

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username} – {self.get_primary_trade_display()}"


class PortfolioItem(models.Model):
    artisan = models.ForeignKey(
        ArtisanProfile, on_delete=models.CASCADE, related_name="portfolio_items"
    )
    title = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="artisans/portfolio/")
    project_value = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True,
        help_text="Approximate value in USD",
    )
    location = models.CharField(max_length=100, blank=True)
    completed_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Portfolio Item"

    def __str__(self):
        return f"{self.artisan} – {self.title}"


class ArtisanReview(models.Model):
    artisan = models.ForeignKey(
        ArtisanProfile, on_delete=models.CASCADE, related_name="reviews"
    )
    reviewer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="given_reviews",
    )
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        unique_together = [("artisan", "reviewer")]
        verbose_name = "Artisan Review"

    def __str__(self):
        return f"{self.rating}★ for {self.artisan} by {self.reviewer.username}"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Recompute average rating on the profile
        profile = self.artisan
        reviews = profile.reviews.all()
        if reviews.exists():
            avg = sum(r.rating for r in reviews) / reviews.count()
            profile.average_rating = round(avg, 2)
            profile.save(update_fields=["average_rating"])
