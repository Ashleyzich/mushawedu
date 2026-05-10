"""Payments app — EcoCash / Paynow integration for Vaka."""

from django.db import models
from django.conf import settings


class Payment(models.Model):
    STATUS_PENDING   = "pending"
    STATUS_PAID      = "paid"
    STATUS_FAILED    = "failed"
    STATUS_CANCELLED = "cancelled"
    STATUS_REFUNDED  = "refunded"

    STATUS_CHOICES = [
        (STATUS_PENDING,   "Pending"),
        (STATUS_PAID,      "Paid"),
        (STATUS_FAILED,    "Failed"),
        (STATUS_CANCELLED, "Cancelled"),
        (STATUS_REFUNDED,  "Refunded"),
    ]

    TYPE_CHOICES = [
        ("project_quote",   "Project Quote Payment"),
        ("material_order",  "Material Order"),
        ("subscription",    "Subscription"),
    ]

    payer       = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name="payments_made",
    )
    payee       = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name="payments_received",
    )
    amount_usd  = models.DecimalField(max_digits=10, decimal_places=2)
    payment_type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    description = models.CharField(max_length=250)

    # Paynow fields
    paynow_reference    = models.CharField(max_length=100, blank=True)
    paynow_poll_url     = models.URLField(blank=True)
    paynow_redirect_url = models.URLField(blank=True)
    ecocash_number      = models.CharField(max_length=20, blank=True)

    status      = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    paid_at     = models.DateTimeField(null=True, blank=True)
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)

    # Optional links to related objects
    project     = models.ForeignKey(
        "projects.Project", on_delete=models.SET_NULL,
        null=True, blank=True, related_name="payments",
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"${self.amount_usd} from {self.payer} to {self.payee} [{self.status}]"
