"""Payments views."""

from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.utils import timezone

from .models import Payment
from .serializers import PaymentSerializer
from .paynow_service import initiate_ecocash_payment, poll_payment_status


class PaymentListView(generics.ListAPIView):
    """GET /api/payments/ — current user's payment history."""
    serializer_class    = PaymentSerializer
    permission_classes  = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Payment.objects.filter(payer=self.request.user).select_related("payer","payee")


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def initiate_payment(request):
    """
    POST /api/payments/initiate/
    Body: {
        payee_id:       int,
        amount_usd:     float,
        payment_type:   str,
        description:    str,
        ecocash_number: str,
        project_id:     int (optional)
    }
    """
    from users.models import CustomUser
    from projects.models import Project

    payee_id       = request.data.get("payee_id")
    amount_usd     = request.data.get("amount_usd")
    payment_type   = request.data.get("payment_type", "project_quote")
    description    = request.data.get("description", "Vaka payment")
    ecocash_number = request.data.get("ecocash_number", "").strip()
    project_id     = request.data.get("project_id")

    if not all([payee_id, amount_usd, ecocash_number]):
        return Response(
            {"error": "payee_id, amount_usd, and ecocash_number are required."},
            status=400,
        )

    try:
        payee = CustomUser.objects.get(pk=payee_id)
    except CustomUser.DoesNotExist:
        return Response({"error": "Payee not found."}, status=404)

    project = None
    if project_id:
        try:
            project = Project.objects.get(pk=project_id)
        except Project.DoesNotExist:
            pass

    payment = Payment.objects.create(
        payer          = request.user,
        payee          = payee,
        amount_usd     = amount_usd,
        payment_type   = payment_type,
        description    = description,
        ecocash_number = ecocash_number,
        project        = project,
    )

    result = initiate_ecocash_payment(payment, ecocash_number)

    if result["success"]:
        payment.paynow_reference    = result.get("reference", "")
        payment.paynow_poll_url     = result.get("poll_url", "")
        payment.paynow_redirect_url = result.get("redirect_url", "")
        payment.save()
        return Response({
            "payment_id":    payment.id,
            "redirect_url":  result.get("redirect_url", ""),
            "poll_url":      result.get("poll_url", ""),
            "message":       result["message"],
            "simulated":     result.get("simulated", False),
        }, status=201)

    payment.status = Payment.STATUS_FAILED
    payment.save()
    return Response({"error": result["message"]}, status=400)


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def check_payment_status(request, payment_id):
    """POST /api/payments/<id>/check/ — poll Paynow for updated status."""
    try:
        payment = Payment.objects.get(pk=payment_id, payer=request.user)
    except Payment.DoesNotExist:
        return Response({"error": "Payment not found."}, status=404)

    if payment.status == Payment.STATUS_PAID:
        return Response({"status": "paid", "message": "Payment already confirmed."})

    result = poll_payment_status(payment.paynow_poll_url)

    if result["paid"]:
        payment.status  = Payment.STATUS_PAID
        payment.paid_at = timezone.now()
        payment.save()

        # Send confirmation emails
        from django.core.mail import send_mail
        from django.conf import settings
        for recipient, msg in [
            (payment.payer, f"Your payment of ${payment.amount_usd} to {payment.payee.get_full_name()} has been confirmed on Vaka."),
            (payment.payee, f"You have received a payment of ${payment.amount_usd} from {payment.payer.get_full_name()} on Vaka."),
        ]:
            if recipient.email:
                try:
                    send_mail(
                        subject="Vaka — Payment Confirmed",
                        message=msg,
                        from_email=settings.DEFAULT_FROM_EMAIL,
                        recipient_list=[recipient.email],
                        fail_silently=True,
                    )
                except Exception:
                    pass

    return Response({
        "status":    payment.status,
        "paynow_status": result.get("status"),
        "simulated": result.get("simulated", False),
    })


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def paynow_webhook(request):
    """POST /api/payments/webhook/ — Paynow result URL callback."""
    reference = request.data.get("reference", "")
    raw_status = request.data.get("status", "").lower()

    if reference.startswith("VAKA-"):
        try:
            payment_id = int(reference.split("-")[1])
            payment = Payment.objects.get(pk=payment_id)
        except (ValueError, Payment.DoesNotExist):
            return Response({"status": "ignored"})

        if raw_status in ("paid", "awaiting delivery") and payment.status != Payment.STATUS_PAID:
            payment.status  = Payment.STATUS_PAID
            payment.paid_at = timezone.now()
            payment.save()

    return Response({"status": "ok"})
