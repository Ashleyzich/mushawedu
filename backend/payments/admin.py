from django.contrib import admin
from .models import Payment

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display  = ["id","payer","payee","amount_usd","payment_type","status","paid_at","created_at"]
    list_filter   = ["status","payment_type"]
    search_fields = ["payer__username","payee__username","paynow_reference"]
    readonly_fields = ["paynow_reference","paynow_poll_url","paynow_redirect_url","paid_at"]
