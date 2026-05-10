from django.urls import path
from .views import ListingListCreateView, ListingDetailView, ResaleListView, CategoryListView, SupplierProfileView, AnalyticsView

urlpatterns = [
    path("", ListingListCreateView.as_view(), name="listing-list"),
    path("analytics/", AnalyticsView.as_view(), name="analytics"),
    path("resale/", ResaleListView.as_view(), name="resale-list"),
    path("categories/", CategoryListView.as_view(), name="category-list"),
    path("profile/", SupplierProfileView.as_view(), name="supplier-profile"),
    path("<int:pk>/", ListingDetailView.as_view(), name="listing-detail"),
]
