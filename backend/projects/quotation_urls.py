"""AI Quotation endpoint."""

from django.urls import path
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .ai_quotation import generate_quotation


@api_view(["POST"])
@permission_classes([AllowAny])
def get_quotation(request):
    """
    POST /api/quotation/
    Body: { "description": str, "location": str (optional) }
    Returns an AI-generated cost estimate.
    """
    description = request.data.get("description", "").strip()
    user_location = getattr(getattr(request, "user", None), "location", "")
    location = request.data.get("location", user_location or "Zimbabwe")

    if not description or len(description) < 20:
        return Response(
            {"error": "Please describe your project in at least 20 characters."},
            status=400,
        )

    result = generate_quotation(description, location)

    if result["success"]:
        return Response({
            "data":      result["data"],
            "simulated": result["simulated"],
        })

    return Response({"error": result.get("error", "Failed to generate quotation.")}, status=500)


urlpatterns = [
    path("", get_quotation, name="ai-quotation"),
]
