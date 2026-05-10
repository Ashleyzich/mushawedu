"""Projects views."""

from rest_framework import generics, permissions, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from .models import Project, ProjectQuote
from .serializers import ProjectSerializer, ProjectQuoteSerializer


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.posted_by == request.user


class ProjectListCreateView(generics.ListCreateAPIView):
    """GET /api/projects/ — list open projects; POST — create (customers only)."""
    serializer_class = ProjectSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["category", "status", "location"]
    search_fields = ["title", "description", "location"]
    ordering_fields = ["created_at", "budget_min"]

    def get_queryset(self):
        return Project.objects.select_related("posted_by").all()

    def get_permissions(self):
        if self.request.method == "GET":
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]


class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    """GET/PATCH/DELETE /api/projects/<id>/"""
    queryset = Project.objects.select_related("posted_by").prefetch_related("quotes")
    serializer_class = ProjectSerializer
    permission_classes = [IsOwnerOrReadOnly]


class ProjectQuoteListCreateView(generics.ListCreateAPIView):
    """GET/POST /api/projects/<project_id>/quotes/"""
    serializer_class = ProjectQuoteSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return ProjectQuote.objects.filter(
            project_id=self.kwargs["project_id"]
        ).select_related("artisan")

    def perform_create(self, serializer):
        project = Project.objects.get(pk=self.kwargs["project_id"])
        serializer.save(artisan=self.request.user, project=project)


@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def project_stats(request):
    """GET /api/projects/stats/ — platform-level stats."""
    return Response({
        "total_projects": Project.objects.count(),
        "open_projects": Project.objects.filter(status="open").count(),
        "completed_projects": Project.objects.filter(status="completed").count(),
    })
