"""Suppliers views."""
from rest_framework import generics, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import SupplierListing, MaterialCategory, SupplierProfile
from .serializers import SupplierListingSerializer, MaterialCategorySerializer, SupplierProfileSerializer

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Count
from datetime import datetime, timedelta


class ListingListCreateView(generics.ListCreateAPIView):
    serializer_class = SupplierListingSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["category", "is_available", "is_resale", "location"]
    search_fields = ["name", "description", "location"]
    ordering_fields = ["price_usd", "created_at"]

    def get_queryset(self):
        return SupplierListing.objects.select_related("supplier", "category").filter(is_available=True)

    def get_permissions(self):
        if self.request.method == "GET":
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]


class ListingDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = SupplierListing.objects.select_related("supplier", "category")
    serializer_class = SupplierListingSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class ResaleListView(generics.ListAPIView):
    """GET /api/suppliers/resale/ — resale/excess material listings."""
    serializer_class = SupplierListingSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return SupplierListing.objects.filter(is_resale=True, is_available=True).select_related("supplier", "category")


class CategoryListView(generics.ListAPIView):
    queryset = MaterialCategory.objects.all()
    serializer_class = MaterialCategorySerializer
    permission_classes = [permissions.AllowAny]


class SupplierProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = SupplierProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        profile, _ = SupplierProfile.objects.get_or_create(
            user=self.request.user,
            defaults={"company_name": self.request.user.get_full_name() or self.request.user.username, "address": ""},
        )
        return profile


class AnalyticsView(APIView):
    """GET /api/suppliers/analytics/ — market analytics data."""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        try:
            # Top materials by listing count
            top_materials = (
                SupplierListing.objects
                .filter(is_available=True)
                .values('name')
                .annotate(count=Count('id'))
                .order_by('-count')[:6]
            )
            top_materials_labels = [m['name'] for m in top_materials]
            top_materials_data = [m['count'] for m in top_materials]

            # Sales by category
            category_sales = (
                SupplierListing.objects
                .filter(is_available=True)
                .values('category__name')
                .annotate(count=Count('id'))
                .order_by('-count')[:6]
            )
            category_labels = [c['category__name'] or 'Uncategorized' for c in category_sales]
            category_data = [c['count'] for c in category_sales]

            # Market trends (last 6 months by category count)
            now = datetime.now()
            trends = []
            trend_labels = []
            for i in range(5, -1, -1):
                month_date = now - timedelta(days=30*i)
                month_str = month_date.strftime('%b')
                month_start = month_date.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
                month_end = (month_date.replace(day=28) + timedelta(days=4)).replace(day=1) - timedelta(seconds=1)
                
                count = SupplierListing.objects.filter(
                    created_at__gte=month_start,
                    created_at__lte=month_end,
                    is_available=True
                ).count()
                trends.append(count * 100)  # Simulated sales (count * 100 ZWL)
                trend_labels.append(month_str)

            return Response({
                'top_materials': {
                    'labels': top_materials_labels,
                    'data': top_materials_data,
                },
                'market_trends': {
                    'labels': trend_labels,
                    'data': trends,
                },
                'category_breakdown': {
                    'labels': category_labels,
                    'data': category_data,
                },
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
