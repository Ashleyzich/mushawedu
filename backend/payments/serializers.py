"""Payments serializers."""
from rest_framework import serializers
from .models import Payment
from users.serializers import UserPublicSerializer

class PaymentSerializer(serializers.ModelSerializer):
    payer = UserPublicSerializer(read_only=True)
    payee = UserPublicSerializer(read_only=True)
    class Meta:
        model  = Payment
        fields = ["id","payer","payee","amount_usd","payment_type","description",
                  "status","paid_at","ecocash_number","paynow_redirect_url","created_at"]
        read_only_fields = ["id","payer","status","paid_at","paynow_redirect_url","created_at"]
