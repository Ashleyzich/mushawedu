from django.urls import path
from .views import ProjectListCreateView, ProjectDetailView, ProjectQuoteListCreateView, project_stats

urlpatterns = [
    path("", ProjectListCreateView.as_view(), name="project-list"),
    path("stats/", project_stats, name="project-stats"),
    path("<int:pk>/", ProjectDetailView.as_view(), name="project-detail"),
    path("<int:project_id>/quotes/", ProjectQuoteListCreateView.as_view(), name="project-quotes"),
]
