from django.urls import path
from .views import (
    ArtisanListView, ArtisanDetailView, ArtisanProfileCreateUpdateView,
    PortfolioItemCreateView, ArtisanReviewCreateView,
)

urlpatterns = [
    path("", ArtisanListView.as_view(), name="artisan-list"),
    path("me/", ArtisanProfileCreateUpdateView.as_view(), name="artisan-me"),
    path("<int:pk>/", ArtisanDetailView.as_view(), name="artisan-detail"),
    path("<int:artisan_id>/reviews/", ArtisanReviewCreateView.as_view(), name="artisan-review"),
    path("portfolio/add/", PortfolioItemCreateView.as_view(), name="portfolio-add"),
]
