"""Projects app models for Vaka."""

from django.db import models
from django.conf import settings


class Project(models.Model):
    """A construction project posted by a customer."""

    CATEGORY_CHOICES = [
        ("residential_build", "Residential Build"),
        ("renovation", "Renovation / Remodelling"),
        ("plumbing", "Plumbing"),
        ("electrical", "Electrical"),
        ("roofing", "Roofing"),
        ("flooring", "Flooring"),
        ("painting", "Painting & Finishing"),
        ("landscaping", "Landscaping & Paving"),
        ("fencing", "Fencing & Security"),
        ("other", "Other"),
    ]

    STATUS_OPEN = "open"
    STATUS_IN_PROGRESS = "in_progress"
    STATUS_COMPLETED = "completed"
    STATUS_CANCELLED = "cancelled"

    STATUS_CHOICES = [
        (STATUS_OPEN, "Open – Accepting Quotes"),
        (STATUS_IN_PROGRESS, "In Progress"),
        (STATUS_COMPLETED, "Completed"),
        (STATUS_CANCELLED, "Cancelled"),
    ]

    posted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="projects",
    )
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=40, choices=CATEGORY_CHOICES)
    location = models.CharField(max_length=120, help_text="Area in Zimbabwe")
    budget_min = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    budget_max = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_OPEN)
    requires_materials = models.BooleanField(default=False)
    deadline = models.DateField(null=True, blank=True)
    image = models.ImageField(upload_to="projects/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Project"
        verbose_name_plural = "Projects"

    def __str__(self):
        return f"{self.title} – {self.get_status_display()}"


class ProjectQuote(models.Model):
    """A quote/bid submitted by an artisan on a project."""

    STATUS_CHOICES = [
        ("pending", "Pending Review"),
        ("accepted", "Accepted"),
        ("declined", "Declined"),
    ]

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="quotes")
    artisan = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="submitted_quotes",
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    timeline_days = models.PositiveIntegerField(help_text="Estimated working days")
    proposal = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        unique_together = [("project", "artisan")]
        verbose_name = "Project Quote"

    def __str__(self):
        return f"Quote by {self.artisan.username} on {self.project.title}"
