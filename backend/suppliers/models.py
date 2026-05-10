"""Suppliers app models for Vaka."""

from django.db import models
from django.conf import settings


class SupplierProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="supplier_profile"
    )
    company_name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    address = models.CharField(max_length=250)
    phone = models.CharField(max_length=20, blank=True)
    website = models.URLField(blank=True)
    logo = models.ImageField(upload_to="suppliers/logos/", blank=True, null=True)
    delivery_areas = models.CharField(max_length=250, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Supplier Profile"

    def __str__(self):
        return self.company_name


class MaterialCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)
    icon = models.CharField(max_length=50, blank=True, help_text="Lucide icon name")

    class Meta:
        verbose_name_plural = "Material Categories"
        ordering = ["name"]

    def __str__(self):
        return self.name


class SupplierListing(models.Model):
    UNIT_CHOICES = [
        ("bag", "Bag"), ("tonne", "Tonne"), ("kg", "Kilogram"),
        ("litre", "Litre"), ("m2", "Square Metre"), ("m3", "Cubic Metre"),
        ("length", "Length/Piece"), ("roll", "Roll"), ("unit", "Unit"),
    ]

    supplier = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="listings"
    )
    category = models.ForeignKey(MaterialCategory, on_delete=models.SET_NULL, null=True, related_name="listings")
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    unit = models.CharField(max_length=20, choices=UNIT_CHOICES, default="unit")
    price_usd = models.DecimalField(max_digits=10, decimal_places=2)
    stock_quantity = models.PositiveIntegerField(default=0)
    image = models.ImageField(upload_to="suppliers/materials/", blank=True, null=True)
    is_available = models.BooleanField(default=True)
    is_resale = models.BooleanField(default=False, help_text="Excess/resale material")
    location = models.CharField(max_length=120, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Supplier Listing"

    def __str__(self):
        return f"{self.name} – {self.supplier.username} (${self.price_usd}/{self.unit})"
