from django.urls import path
from .views import PaymentListView, initiate_payment, check_payment_status, paynow_webhook

urlpatterns = [
    path("",                         PaymentListView.as_view(),   name="payment-list"),
    path("initiate/",                initiate_payment,            name="payment-initiate"),
    path("webhook/",                 paynow_webhook,              name="payment-webhook"),
    path("<int:payment_id>/check/",  check_payment_status,        name="payment-check"),
]
