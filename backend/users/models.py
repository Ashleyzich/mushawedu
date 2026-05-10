"""Users app models for Vaka."""

from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    """Extended user model supporting Customer, Artisan, Supplier, and Admin roles."""

    ROLE_CUSTOMER = "customer"
    ROLE_ARTISAN = "artisan"
    ROLE_SUPPLIER = "supplier"
    ROLE_ADMIN = "admin"

    ROLE_CHOICES = [
        (ROLE_CUSTOMER, "Customer"),
        (ROLE_ARTISAN, "Artisan / Museyamwa"),
        (ROLE_SUPPLIER, "Supplier"),
        (ROLE_ADMIN, "Administrator"),
    ]

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default=ROLE_CUSTOMER,
    )
    phone = models.CharField(max_length=20, blank=True)
    location = models.CharField(max_length=120, blank=True, help_text="City / area in Zimbabwe")
    bio = models.TextField(blank=True)
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)
    is_verified = models.BooleanField(default=False, help_text="Platform-verified identity")
    ecocash_number = models.CharField(max_length=20, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.get_full_name() or self.username} ({self.get_role_display()})"

    @property
    def is_customer(self):
        return self.role == self.ROLE_CUSTOMER

    @property
    def is_artisan(self):
        return self.role == self.ROLE_ARTISAN

    @property
    def is_supplier(self):
        return self.role == self.ROLE_SUPPLIER
