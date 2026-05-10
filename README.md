# Vaka — Zimbabwe's Construction Marketplace

> *Connecting Homes, Skills, and Trust*

A full-stack digital marketplace connecting Zimbabwean homeowners with verified artisans,
construction material suppliers, and a resale hub for excess building materials.

---

## Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | React 18 (Vite), TailwindCSS, React Router v6  |
| Backend    | Django 4.2, Django REST Framework               |
| Auth       | JWT via `djangorestframework-simplejwt`         |
| Database   | PostgreSQL                                      |
| Payments   | EcoCash / Paynow (integration-ready)            |
| AI         | TensorFlow / OpenAI API (integration-ready)     |

---

## Project Structure

```
vaka/
├── backend/                  # Django project
│   ├── vaka_project/         # Settings, root URLs, WSGI
│   ├── users/                # CustomUser, auth, dashboard
│   ├── projects/             # Project listings & quotes
│   ├── artisans/             # Artisan profiles, portfolio, reviews
│   ├── suppliers/            # Material listings, resale, categories
│   └── manage.py
│
└── frontend/                 # React + Vite
    ├── src/
    │   ├── api/              # Axios instance (JWT interceptors)
    │   ├── context/          # AuthContext
    │   ├── components/       # Navbar, Footer, UI components
    │   └── pages/            # HomePage, ArtisansPage, SuppliersPage,
    │                         # LoginPage, RegisterPage, DashboardPage
    ├── tailwind.config.js
    └── vite.config.js
```

---

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 14+

---

### 1. Database

```bash
psql -U postgres
CREATE DATABASE vaka_db;
\q
```

---

### 2. Backend

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your DB credentials

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Seed demo data (artisans, suppliers, categories, projects)
python manage.py seed_demo_data

# Start development server
python manage.py runserver
```

Backend runs at: **http://localhost:8000**

Admin panel: **http://localhost:8000/admin/**
- Username: `admin`
- Password: `vakadmin123`

---

### 3. Frontend

```bash
cd frontend

npm install
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## Demo Accounts

All demo accounts use password: **`vaka1234`**

| Role     | Username         |
|----------|-----------------|
| Customer | demo_customer   |
| Artisan  | john_builder    |
| Artisan  | grace_plumber   |
| Artisan  | david_sparks    |
| Artisan  | linda_carpenter |
| Supplier | simba_hardware  |
| Supplier | zim_timber      |
| Admin    | admin (pw: vakadmin123) |

---

## API Endpoints

### Auth
| Method | Endpoint                    | Description             |
|--------|-----------------------------|-------------------------|
| POST   | `/api/users/login/`         | Obtain JWT tokens       |
| POST   | `/api/users/register/`      | Create new account      |
| POST   | `/api/users/token/refresh/` | Refresh access token    |
| GET    | `/api/users/profile/`       | Own profile (auth)      |
| GET    | `/api/users/dashboard/`     | Role-aware dashboard    |

### Projects
| Method | Endpoint                          | Description         |
|--------|-----------------------------------|---------------------|
| GET    | `/api/projects/`                  | List all projects   |
| POST   | `/api/projects/`                  | Create project      |
| GET    | `/api/projects/<id>/`             | Project detail      |
| GET    | `/api/projects/<id>/quotes/`      | Project quotes      |
| POST   | `/api/projects/<id>/quotes/`      | Submit quote        |
| GET    | `/api/projects/stats/`            | Platform stats      |

### Artisans
| Method | Endpoint                          | Description               |
|--------|-----------------------------------|---------------------------|
| GET    | `/api/artisans/`                  | List artisans (filterable)|
| GET    | `/api/artisans/<id>/`             | Artisan detail            |
| GET    | `/api/artisans/me/`               | Own profile (auth)        |
| POST   | `/api/artisans/<id>/reviews/`     | Submit review             |
| POST   | `/api/artisans/portfolio/add/`    | Add portfolio item        |

### Suppliers
| Method | Endpoint                    | Description               |
|--------|-----------------------------|---------------------------|
| GET    | `/api/suppliers/`           | All material listings     |
| GET    | `/api/suppliers/resale/`    | Resale/excess materials   |
| GET    | `/api/suppliers/categories/`| Material categories       |
| POST   | `/api/suppliers/`           | Create listing (auth)     |
| GET    | `/api/suppliers/profile/`   | Supplier profile (auth)   |

---

## Filter & Search Examples

```
# Artisans by trade
GET /api/artisans/?primary_trade=plumbing

# Artisans in a specific area
GET /api/artisans/?search=Harare

# Museyamwa only
GET /api/artisans/?is_museyamwa=true

# Materials by category
GET /api/suppliers/?category=1

# Resale materials only
GET /api/suppliers/resale/

# Projects in Harare
GET /api/projects/?search=Harare&status=open
```

---

## Design System

| Token          | Value     | Usage                             |
|----------------|-----------|-----------------------------------|
| Primary Navy   | `#0D1B2A` | Navbar, headings, hero background |
| Maroon Accent  | `#8B1A1A` | Card left borders, trade badges   |
| Orange         | `#D4820A` | CTA buttons, Gantt blocks         |
| Green          | `#1E6B45` | Verified badges, success states   |
| Background     | `#F4F4F4` | Card backgrounds, sections        |

---

## Academic Context

**Project:** HIT 200 — Harare Institute of Technology  
**Department:** Information Technology  
**Team:** Pamela V Moyo · Prince Hofisi · Ashley Guveya · Mcklin Zirongodza  
**Supervisor:** Mr P Mhaka  

Built to address Zimbabwe's construction industry challenges:
- 78% of homeowners report budget overruns
- 65% struggle to find reliable artisans  
- 40% of materials are wasted in typical projects
- 83% of stakeholders lack digital planning resources

---

## License

Academic project — Harare Institute of Technology © 2025
