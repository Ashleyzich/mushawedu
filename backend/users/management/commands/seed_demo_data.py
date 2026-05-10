"""
Management command: seed_demo_data
Usage: python manage.py seed_demo_data

Creates sample users, artisan profiles, supplier listings, material categories,
and projects so the Vaka frontend has data to display immediately.
"""

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from artisans.models import ArtisanProfile, PortfolioItem
from suppliers.models import SupplierProfile, SupplierListing, MaterialCategory
from projects.models import Project

User = get_user_model()


CATEGORIES = [
    ("Cement & Concrete", "cement-concrete", "box"),
    ("Timber & Wood",     "timber-wood",     "layers"),
    ("Steel & Metal",     "steel-metal",     "wrench"),
    ("Roofing Materials", "roofing",         "home"),
    ("Plumbing Fittings", "plumbing",        "droplets"),
    ("Electrical",        "electrical",      "zap"),
    ("Paint & Finishes",  "paint-finishes",  "paintbrush"),
    ("Bricks & Blocks",   "bricks-blocks",   "grid"),
    ("Sand & Aggregates", "sand-aggregates", "circle"),
    ("Flooring",          "flooring",        "layout"),
]

ARTISANS = [
    {
        "username": "john_builder",
        "first_name": "John",
        "last_name": "Moyo",
        "location": "Harare",
        "trade": "bricklaying",
        "years_exp": 8,
        "completed": 47,
        "rating": 4.8,
        "desc": "Expert bricklayer with 8 years of residential and commercial experience in Harare.",
        "areas": "Harare, Chitungwiza",
        "museyamwa": False,
    },
    {
        "username": "grace_plumber",
        "first_name": "Grace",
        "last_name": "Chirume",
        "location": "Bulawayo",
        "trade": "plumbing",
        "years_exp": 5,
        "completed": 31,
        "rating": 4.6,
        "desc": "Certified plumber specialising in residential installations and repairs across Bulawayo.",
        "areas": "Bulawayo, Gwanda",
        "museyamwa": True,
    },
    {
        "username": "david_sparks",
        "first_name": "David",
        "last_name": "Ncube",
        "location": "Harare",
        "trade": "electrical",
        "years_exp": 10,
        "completed": 62,
        "rating": 4.9,
        "desc": "Licensed electrician, ZERA registered. Residential, commercial, and solar installations.",
        "areas": "Harare, Marondera, Ruwa",
        "museyamwa": False,
    },
    {
        "username": "linda_carpenter",
        "first_name": "Linda",
        "last_name": "Mutasa",
        "location": "Mutare",
        "trade": "carpentry",
        "years_exp": 6,
        "completed": 28,
        "rating": 4.5,
        "desc": "Skilled carpenter specialising in fitted kitchens, wardrobes, and timber framing.",
        "areas": "Mutare, Chimanimani",
        "museyamwa": True,
    },
]

SUPPLIERS = [
    {
        "username": "simba_hardware",
        "first_name": "Simba",
        "last_name": "Dube",
        "company": "Simba Hardware & Building Supplies",
        "location": "Harare",
    },
    {
        "username": "zim_timber",
        "first_name": "Tatenda",
        "last_name": "Mpofu",
        "company": "Zimbabwe Timber & Wood Products",
        "location": "Bulawayo",
    },
]

LISTINGS_DATA = [
    ("Portland Cement 50kg",  "cement-concrete",  13.50, "bag",    200, False, "Harare"),
    ("River Sand (1 Tonne)",  "sand-aggregates",  18.00, "tonne",  50,  False, "Harare"),
    ("Timber 2x4 Sawn 4.8m", "timber-wood",       4.20, "length", 150, False, "Bulawayo"),
    ("Clay Bricks (each)",   "bricks-blocks",      0.12, "unit",  5000, False, "Harare"),
    ("Galv Roofing Sheet 2m","roofing",             8.75, "length",  80, False, "Harare"),
    ("20mm PVC Pipe 6m",     "plumbing",            3.50, "length", 120, False, "Bulawayo"),
    ("12mm Rebar 6m",        "steel-metal",         6.80, "length",  90, False, "Harare"),
    ("Interior White Paint 20L","paint-finishes",  22.00, "unit",   60, False, "Harare"),
    # Resale items
    ("Surplus Cement x20 bags","cement-concrete",  11.00, "bag",    20, True,  "Glen View"),
    ("Used Timber Planks",    "timber-wood",         2.00, "length",  35, True, "Waterfalls"),
    ("Ex-Stock Roofing Sheets","roofing",            6.00, "length",  15, True, "Bulawayo"),
]


class Command(BaseCommand):
    help = "Seed the Vaka database with demo data"

    def handle(self, *args, **options):
        self.stdout.write("🌱 Seeding Vaka demo data…")

        # 1. Material categories
        cat_map = {}
        for name, slug, icon in CATEGORIES:
            cat, _ = MaterialCategory.objects.get_or_create(
                slug=slug, defaults={"name": name, "icon": icon}
            )
            cat_map[slug] = cat
        self.stdout.write(f"  ✓ {len(CATEGORIES)} material categories")

        # 2. Artisans
        for a in ARTISANS:
            user, created = User.objects.get_or_create(
                username=a["username"],
                defaults={
                    "first_name": a["first_name"],
                    "last_name":  a["last_name"],
                    "email":      f"{a['username']}@vaka.demo",
                    "role":       "artisan",
                    "location":   a["location"],
                    "is_verified": True,
                },
            )
            if created:
                user.set_password("vaka1234")
                user.save()

            ArtisanProfile.objects.update_or_create(
                user=user,
                defaults={
                    "primary_trade":    a["trade"],
                    "years_experience": a["years_exp"],
                    "completed_jobs":   a["completed"],
                    "average_rating":   a["rating"],
                    "description":      a["desc"],
                    "service_areas":    a["areas"],
                    "is_museyamwa":     a["museyamwa"],
                },
            )
        self.stdout.write(f"  ✓ {len(ARTISANS)} artisan profiles")

        # 3. Suppliers + listings
        for s in SUPPLIERS:
            user, created = User.objects.get_or_create(
                username=s["username"],
                defaults={
                    "first_name": s["first_name"],
                    "last_name":  s["last_name"],
                    "email":      f"{s['username']}@vaka.demo",
                    "role":       "supplier",
                    "location":   s["location"],
                    "is_verified": True,
                },
            )
            if created:
                user.set_password("vaka1234")
                user.save()

            SupplierProfile.objects.update_or_create(
                user=user,
                defaults={"company_name": s["company"], "address": s["location"]},
            )

        # Assign listings to first supplier
        sup_user = User.objects.get(username=SUPPLIERS[0]["username"])
        sup2_user = User.objects.get(username=SUPPLIERS[1]["username"])

        for i, (name, cat_slug, price, unit, stock, resale, loc) in enumerate(LISTINGS_DATA):
            owner = sup_user if i % 2 == 0 else sup2_user
            cat   = cat_map.get(cat_slug)
            SupplierListing.objects.get_or_create(
                name=name,
                supplier=owner,
                defaults={
                    "category":       cat,
                    "price_usd":      price,
                    "unit":           unit,
                    "stock_quantity": stock,
                    "is_resale":      resale,
                    "is_available":   True,
                    "location":       loc,
                },
            )
        self.stdout.write(f"  ✓ {len(LISTINGS_DATA)} supplier listings")

        # 4. Demo customer + projects
        customer, created = User.objects.get_or_create(
            username="demo_customer",
            defaults={
                "first_name": "Pamela",
                "last_name":  "Moyo",
                "email":      "pamela@vaka.demo",
                "role":       "customer",
                "location":   "Harare",
            },
        )
        if created:
            customer.set_password("vaka1234")
            customer.save()

        Project.objects.get_or_create(
            title="3-Bedroom House Construction",
            posted_by=customer,
            defaults={
                "description": "Looking for a reliable bricklayer and site manager for a new 3-bedroom house in Borrowdale. Plans are ready.",
                "category": "residential_build",
                "location": "Borrowdale, Harare",
                "budget_min": 8000,
                "budget_max": 15000,
                "status": "open",
            },
        )
        Project.objects.get_or_create(
            title="Kitchen Renovation — Tiling & Fitting",
            posted_by=customer,
            defaults={
                "description": "Need experienced tiler and carpenter for kitchen renovation. Approx 25sqm floor + wall tiling and new fitted units.",
                "category": "renovation",
                "location": "Avondale, Harare",
                "budget_min": 1200,
                "budget_max": 2500,
                "status": "open",
            },
        )
        self.stdout.write("  ✓ 2 demo projects")

        # 5. Superuser
        if not User.objects.filter(is_superuser=True).exists():
            User.objects.create_superuser(
                username="admin",
                email="admin@vaka.co.zw",
                password="vakadmin123",
                first_name="Vaka",
                last_name="Admin",
                role="admin",
            )
            self.stdout.write("  ✓ Superuser: admin / vakadmin123")

        self.stdout.write(self.style.SUCCESS("\n✅ Demo seed complete!"))
        self.stdout.write("\n  Demo accounts (password: vaka1234):")
        self.stdout.write("    Customer  → demo_customer")
        self.stdout.write("    Artisan   → john_builder, grace_plumber, david_sparks, linda_carpenter")
        self.stdout.write("    Supplier  → simba_hardware, zim_timber")
        self.stdout.write("    Admin     → admin  (password: vakadmin123)")
