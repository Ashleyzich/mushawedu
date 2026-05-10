"""
Paynow / EcoCash payment service for Vaka.

To activate real payments:
1. Register at https://www.paynow.co.zw and get merchant credentials
2. Add to your .env:
   PAYNOW_INTEGRATION_ID=your_integration_id
   PAYNOW_INTEGRATION_KEY=your_integration_key
   PAYNOW_RETURN_URL=https://yourdomain.com/payment/return
   PAYNOW_RESULT_URL=https://yourdomain.com/api/payments/webhook/

Without credentials, all payments run in SIMULATION mode — useful for development and demos.
"""

import hashlib
import urllib.parse
import urllib.request
from decimal import Decimal
from django.conf import settings
from django.utils import timezone


INTEGRATION_ID  = getattr(settings, "PAYNOW_INTEGRATION_ID",  "")
INTEGRATION_KEY = getattr(settings, "PAYNOW_INTEGRATION_KEY", "")
RETURN_URL      = getattr(settings, "PAYNOW_RETURN_URL",      "http://localhost:5173/payment/return")
RESULT_URL      = getattr(settings, "PAYNOW_RESULT_URL",      "http://localhost:8000/api/payments/webhook/")
PAYNOW_INITIATE = "https://www.paynow.co.zw/interface/remotetransaction"
PAYNOW_MOBILE   = "https://www.paynow.co.zw/interface/remotemobileTransaction"

SIMULATION_MODE = not (INTEGRATION_ID and INTEGRATION_KEY)


def _hash(values: dict, key: str) -> str:
    """Generate Paynow HMAC hash."""
    string = "".join(str(v) for k, v in values.items() if k != "hash")
    string += key
    return hashlib.sha512(string.encode()).hexdigest().upper()


def _post(url: str, data: dict) -> dict:
    """POST to Paynow and parse the URL-encoded response."""
    body = urllib.parse.urlencode(data).encode()
    req  = urllib.request.Request(url, data=body)
    with urllib.request.urlopen(req, timeout=15) as resp:
        raw = resp.read().decode()
    return dict(urllib.parse.parse_qsl(raw))


def initiate_ecocash_payment(payment_obj, ecocash_number: str) -> dict:
    """
    Initiate a mobile (EcoCash) payment via Paynow.

    Returns:
        { "success": bool, "poll_url": str, "redirect_url": str, "message": str }
    """
    if SIMULATION_MODE:
        # Simulate a successful payment initiation for demo purposes
        sim_ref  = f"SIM-{payment_obj.id}-{timezone.now().strftime('%Y%m%d%H%M%S')}"
        sim_poll = f"https://www.paynow.co.zw/interface/returntransaction/{sim_ref}"
        return {
            "success":      True,
            "poll_url":     sim_poll,
            "redirect_url": RETURN_URL,
            "message":      "SIMULATION MODE — No real money moved. Add PAYNOW credentials to go live.",
            "reference":    sim_ref,
            "simulated":    True,
        }

    reference = f"VAKA-{payment_obj.id}"
    amount    = str(Decimal(payment_obj.amount_usd).quantize(Decimal("0.01")))

    data = {
        "id":           INTEGRATION_ID,
        "reference":    reference,
        "amount":       amount,
        "additionalinfo": payment_obj.description[:100],
        "returnurl":    RETURN_URL,
        "resulturl":    RESULT_URL,
        "authemail":    payment_obj.payer.email or "",
        "phone":        ecocash_number.replace("+", "").replace(" ", ""),
        "method":       "ecocash",
        "status":       "Message",
    }
    data["hash"] = _hash(data, INTEGRATION_KEY)

    try:
        result = _post(PAYNOW_MOBILE, data)
    except Exception as exc:
        return {"success": False, "message": str(exc)}

    if result.get("status", "").lower() == "ok":
        return {
            "success":      True,
            "poll_url":     result.get("pollurl", ""),
            "redirect_url": result.get("browserurl", RETURN_URL),
            "message":      "Payment initiated. Approve on your EcoCash handset.",
            "reference":    reference,
            "simulated":    False,
        }
    return {
        "success": False,
        "message": result.get("error", "Paynow returned an unexpected response."),
    }


def poll_payment_status(poll_url: str) -> dict:
    """
    Poll Paynow for the current payment status.

    Returns:
        { "paid": bool, "status": str, "amount": str }
    """
    if not poll_url or "SIM-" in poll_url:
        # Simulation — always report paid after first poll
        return {"paid": True, "status": "paid", "amount": "0.00", "simulated": True}

    data = {"id": INTEGRATION_ID, "pollurl": poll_url}
    data["hash"] = _hash(data, INTEGRATION_KEY)

    try:
        result = _post(poll_url, {})
    except Exception:
        return {"paid": False, "status": "error", "amount": "0.00"}

    raw_status = result.get("status", "").lower()
    paid = raw_status in ("paid", "awaiting delivery")
    return {
        "paid":   paid,
        "status": raw_status,
        "amount": result.get("amount", "0.00"),
    }
