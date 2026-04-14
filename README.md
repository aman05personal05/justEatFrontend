# JustEats

A full-stack food ordering demo app (FastAPI backend + React frontend).

Quick start

- Backend:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
alembic upgrade head
python -m app.seed    # optional
uvicorn app.main:app --reload
```

- Frontend:

```bash
cd Frontend
npm install
echo VITE_API_URL=http://localhost:8000 > .env
npm run dev
```

Docker: `docker compose up --build` (postgres, api, frontend)

Project layout

- `backend/` — API, models, routers, tests, migrations
- `Frontend/` — Vite + React SPA
- `docker-compose.yml`, `JustEats.postman_collection.json`

Tests

```powershell
cd backend
.\.venv\Scripts\activate
pytest -v
```

Seed demo accounts: run `python -m app.seed` (backend). Sample seeded users include `saurabh@justeats.com` and `gunjan@justeats.com`.

If you'd like a longer README (architecture diagram, full API reference, badges), tell me which sections to expand and I'll update it.

# JustEats

A lightweight full-stack food ordering platform with:

- FastAPI backend (async SQLAlchemy)
- React SPA (Vite)
- PostgreSQL database

Supports two roles: customers (browse & order) and restaurant owners (manage restaurants, menus, orders).

---

## Quick start (development)

Backend (Windows PowerShell):

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
pip install -r requirements-dev.txt
copy .env.example .env
# Edit backend/.env: set DATABASE_URL and SECRET_KEY
alembic upgrade head
python -m app.seed   # optional: seeds demo users, restaurants, menu items
uvicorn app.main:app --reload
```

Frontend:

```bash
cd Frontend
npm install
echo VITE_API_URL=http://localhost:8000 > .env
npm run dev
```

API: http://localhost:8000 — Frontend: http://localhost:5173

Run everything with Docker Compose:

```bash
docker compose up --build
```

---

## Project layout (high level)

- `backend/` — FastAPI app (`app/`), alembic migrations, tests, Dockerfile, requirements.
- `Frontend/` — Vite + React app, `src/api` contains HTTP helpers.
- `docker-compose.yml` — postgres, api, frontend, optional pgAdmin.
- `JustEats.postman_collection.json` — Postman collection for quick API testing.

Inspect `backend/app` and `Frontend/src` for source modules and routes.

---

## Environment variables

- `backend/.env` — `DATABASE_URL`, `SECRET_KEY`, `ACCESS_TOKEN_EXPIRE_MINUTES`, `REFRESH_TOKEN_EXPIRE_DAYS`, `CORS_ORIGINS`, SMTP settings, `MOSTLY_ORDERED_THRESHOLD`.
- `Frontend/.env` — `VITE_API_URL` (set before building the frontend bundle).

Default example for local DB:

`postgresql+asyncpg://postgres:postgres@localhost:5432/justeats`

---

## API overview

- Base path: `/api/v1` (interactive docs at `/docs`).
- Auth: `/auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout`, `/auth/me`, password reset endpoints.
- Restaurants: public listing and owner CRUD at `/restaurants`.
- Menu items: `/restaurants/{id}/menu-items` (+ mostly-ordered, toggle special).
- Cart: `/cart` endpoints for customer cart operations.
- Orders: `/orders` for placing and `/orders/{id}/status` for owner transitions.
- Profile, favourites, and recommendations endpoints available under `/profile`, `/favourites`, `/recommendations`.

Order lifecycle: PENDING → CONFIRMED → PREPARING → READY → COMPLETED (CANCELLED allowed from PENDING or CONFIRMED).

---

## Tests

Backend tests use `pytest`, `pytest-asyncio`, and an in-process `httpx` client.

Run locally:

```powershell
cd backend
.\.venv\Scripts\activate
pytest -v

# To run against a dedicated test DB (PowerShell):
$env:TEST_DATABASE_URL = "postgresql+asyncpg://postgres:postgres@localhost:5432/justeats_test"
pytest -v
```

---

## Seed & demo accounts

Seed demo data with:

```powershell
cd backend
python -m app.seed
```

Demo credentials created by the seed (local/demo use):

- Owner: saurabh@justeats.com / Saurabh123!
- Owner: arjun@justeats.com / Arjun123!
- Customer: gunjan@justeats.com / Gunjan123!
- Customer: sumit@justeats.com / Sumit123!

---

## Notes

- Backend is async (SQLAlchemy 2 + asyncpg); use `asyncpg` in `DATABASE_URL`.
- Frontend includes an Axios interceptor for silent refresh; access tokens are short-lived by default.
- For contributor-friendly docs I can add badges, an architecture diagram, and a short CONTRIBUTING guide — tell me which you'd prefer.

---

File: `README.md` (updated)

# JustEats

A lightweight full-stack food ordering platform with:

- FastAPI backend (async SQLAlchemy)
- React SPA (Vite)
- PostgreSQL database

Supports two roles: customers (browse & order) and restaurant owners (manage restaurants, menus, orders).

---

## Quick start (development)

Backend (Windows PowerShell):

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
pip install -r requirements-dev.txt
copy .env.example .env
# Edit backend/.env: set DATABASE_URL and SECRET_KEY
alembic upgrade head
python -m app.seed   # optional: seeds demo users, restaurants, menu items
uvicorn app.main:app --reload
```

Frontend:

```bash
cd Frontend
npm install
echo VITE_API_URL=http://localhost:8000 > .env
npm run dev
```

API: http://localhost:8000 — Frontend: http://localhost:5173

Run everything with Docker Compose:

```bash
docker compose up --build
```

---

## Project layout (high level)

- `backend/` — FastAPI app (`app/`), alembic migrations, tests, Dockerfile, requirements.
- `Frontend/` — Vite + React app, `src/api` contains HTTP helpers.
- `docker-compose.yml` — postgres, api, frontend, optional pgAdmin.
- `JustEats.postman_collection.json` — Postman collection for quick API testing.

Inspect `backend/app` and `Frontend/src` for source modules and routes.

---

## Environment variables

- `backend/.env` — `DATABASE_URL`, `SECRET_KEY`, `ACCESS_TOKEN_EXPIRE_MINUTES`, `REFRESH_TOKEN_EXPIRE_DAYS`, `CORS_ORIGINS`, SMTP settings, `MOSTLY_ORDERED_THRESHOLD`.
- `Frontend/.env` — `VITE_API_URL` (set before building the frontend bundle).

Default example for local DB:

`postgresql+asyncpg://postgres:postgres@localhost:5432/justeats`

---

## API overview

- Base path: `/api/v1` (interactive docs at `/docs`).
- Auth: `/auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout`, `/auth/me`, password reset endpoints.
- Restaurants: public listing and owner CRUD at `/restaurants`.
- Menu items: `/restaurants/{id}/menu-items` (+ mostly-ordered, toggle special).
- Cart: `/cart` endpoints for customer cart operations.
- Orders: `/orders` for placing and `/orders/{id}/status` for owner transitions.
- Profile, favourites, and recommendations endpoints available under `/profile`, `/favourites`, `/recommendations`.

Order lifecycle: PENDING → CONFIRMED → PREPARING → READY → COMPLETED (CANCELLED allowed from PENDING or CONFIRMED).

---

## Tests

Backend tests use `pytest`, `pytest-asyncio`, and an in-process `httpx` client.

Run locally:

```powershell
cd backend
.\.venv\Scripts\activate
pytest -v

# To run against a dedicated test DB (PowerShell):
$env:TEST_DATABASE_URL = "postgresql+asyncpg://postgres:postgres@localhost:5432/justeats_test"
pytest -v
```

---

## Seed & demo accounts

Seed demo data with:

```powershell
cd backend
python -m app.seed
```

Demo credentials created by the seed (local/demo use):

- Owner: saurabh@justeats.com / Saurabh123!
- Owner: arjun@justeats.com / Arjun123!
- Customer: gunjan@justeats.com / Gunjan123!
- Customer: sumit@justeats.com / Sumit123!

---

## Notes

- Backend is async (SQLAlchemy 2 + asyncpg); use `asyncpg` in `DATABASE_URL`.
- Frontend includes an Axios interceptor for silent refresh; access tokens are short-lived by default.
- For contributor-friendly docs I can add badges, an architecture diagram, and a short CONTRIBUTING guide — tell me which you'd prefer.

---

File: `README.md` (updated)

# JustEat

A full-stack food ordering platform built with **FastAPI** (Python 3.12) and **React 19**. The platform supports two distinct user roles — **Customers** who browse and order food, and **Restaurant Owners** who manage listings, menus, and incoming orders.

---

## Table of Contents

- [Features](#features)
- [Architecture Overview](#architecture-overview)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
- [Environment Variables](#environment-variables)
- [Docker Deployment](#docker-deployment)
- [API Reference](#api-reference)
- [Order Status Workflow](#order-status-workflow)
- [Postman Collection](#postman-collection)
- [Test Credentials](#test-credentials)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Data Model Summary](#data-model-summary)

---

## Features

### Customer

- Register and log in with a customer account
- Browse all active restaurants; search by name, location, or cuisine type
- View a restaurant's full menu with optional category and price-range filters
- Add items to a persistent cart and manage quantities
- Place an order — total amount is snapshotted at checkout so price changes never affect past orders
- Track order status through its full lifecycle
- Save restaurants as favourites for quick re-ordering
- Manage a personal profile including dietary restrictions and favourite cuisine
- Receive personalized restaurant recommendations based on completed order history (falls back to top-rated restaurants for new users)
- Change password and reset a forgotten password via a secure email token

### Restaurant Owner

- Register and log in with an owner account
- Create and manage multiple restaurants (name, cuisine, location, description, image URL, active/inactive toggle, rating)
- Full CRUD on menu items per restaurant (name, description, price, category, image, availability flag)
- Toggle a menu item as **Today's Special**
- Automatic **Mostly Ordered** badge for items whose `order_count` meets or exceeds the configurable threshold (default: 10)
- View all incoming orders for each restaurant and advance them through the status workflow
- Manage own owner profile (name, phone, bio, cuisine specialty, dietary preferences)

### Common

- JWT-based auth — short-lived access tokens (15 min) + rotating refresh tokens (7 days)
- Silent token refresh via Axios response interceptor — users stay logged in without interruption
- Secure password hashing with bcrypt; reset tokens are hashed before storage
- Structured request/response logging with timing via `structlog`
- Interactive Swagger UI at `/docs` and ReDoc at `/redoc`
- Global exception handler returns generic 500 to prevent internal detail leakage

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Browser / Client                    │
│        React 19  ·  Vite 8  ·  Tailwind CSS v4          │
│   React Router v7  ·  TanStack Query v5  ·  Axios       │
└─────────────────────────┬───────────────────────────────┘
                          │ HTTP / REST
             port 5173 (dev) | port 3000 (Docker nginx)
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   FastAPI Backend                        │
│          Python 3.12  ·  Uvicorn  ·  structlog           │
│         Pydantic v2  ·  python-jose  ·  bcrypt           │
│         CORS middleware  ·  LoggingMiddleware            │
│                    port 8000                            │
└─────────────────────────┬───────────────────────────────┘
                          │ async SQLAlchemy 2 + asyncpg
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  PostgreSQL 16                           │
│                    port 5432                            │
└─────────────────────────────────────────────────────────┘
```

All three services are orchestrated via **Docker Compose**. The frontend is served by **nginx** with SPA fallback routing, long-lived cache headers for content-hashed assets, and basic security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`).

---

## Technology Stack

| Layer             | Technology                     | Notes                                           |
| ----------------- | ------------------------------ | ----------------------------------------------- |
| **Frontend**      | React 19, Vite 8               | JSX only, no TypeScript                         |
| **Styling**       | Tailwind CSS v4                | Via `@tailwindcss/vite` plugin                  |
| **Routing**       | React Router DOM v7            | Protected routes per role                       |
| **Server State**  | TanStack React Query v5        | Caching and background refetch                  |
| **Forms**         | React Hook Form v7 + Yup       | Schema-based validation                         |
| **HTTP Client**   | Axios v1                       | Auth interceptor + silent refresh queue         |
| **Notifications** | react-hot-toast                | Toast alerts                                    |
| **Icons**         | lucide-react                   | SVG icon set                                    |
| **Dates**         | date-fns v4                    | Order timestamp formatting                      |
| **Backend**       | FastAPI                        | Async Python web framework                      |
| **Runtime**       | Python 3.12, Uvicorn           | 2 workers in Docker production                  |
| **ORM**           | SQLAlchemy 2 (async) + asyncpg | Full async database layer                       |
| **Validation**    | Pydantic v2                    | Request/response schemas with custom validators |
| **Auth**          | python-jose (JWT), bcrypt      | HS256 access tokens, bcrypt password hashing    |
| **Migrations**    | Alembic                        | Auto-applied on container start                 |
| **Logging**       | structlog                      | ISO-timestamped structured logs                 |
| **Database**      | PostgreSQL 16                  | UUID PKs, `TimestampMixin` on all models        |
| **Containers**    | Docker, Docker Compose         | Multi-stage backend build (builder + runtime)   |
| **Testing**       | pytest, pytest-asyncio, httpx  | In-process async client, isolated test DB       |

---

## Prerequisites

| Requirement             | Minimum Version             |
| ----------------------- | --------------------------- |
| Python                  | 3.12                        |
| Node.js                 | 20                          |
| npm                     | 10                          |
| PostgreSQL              | 16 (skip when using Docker) |
| Docker & Docker Compose | Latest                      |

---

## Local Development Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd JustEats
```

### 2. Create the database

```sql
-- Run in psql or pgAdmin
CREATE DATABASE justeats;
```

### 3. Set up the Backend

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv

# Windows
.\venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

# Install runtime and dev dependencies
pip install -r requirements.txt
pip install -r requirements-dev.txt

# Create your .env (see Environment Variables section)
copy .env.example .env   # Windows
cp  .env.example .env    # macOS / Linux
# Edit .env with your database credentials and secret key

# Apply database migrations
alembic upgrade head

# (Optional) Seed demo data — owners, customers, restaurants, menu items
python -m app.seed

# Start with auto-reload
uvicorn app.main:app --reload
```

- API: **http://localhost:8000**
- Swagger UI: **http://localhost:8000/docs**
- ReDoc: **http://localhost:8000/redoc**

### 4. Set up the Frontend

```bash
cd Frontend

npm install

# Single env variable needed
echo VITE_API_URL=http://localhost:8000 > .env

npm run dev
```

- Frontend: **http://localhost:5173**

---

## Environment Variables

### `backend/.env`

| Variable                      | Default                                                          | Required              | Description                                                  |
| ----------------------------- | ---------------------------------------------------------------- | --------------------- | ------------------------------------------------------------ |
| `DATABASE_URL`                | `postgresql+asyncpg://postgres:postgres@localhost:5432/justeats` | Yes                   | Async PostgreSQL connection string                           |
| `SECRET_KEY`                  | `change-me-in-production`                                        | **Yes — change this** | JWT signing secret                                           |
| `DEBUG`                       | `false`                                                          | No                    | Exposes extra detail in error responses                      |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `15`                                                             | No                    | Access token lifetime in minutes                             |
| `REFRESH_TOKEN_EXPIRE_DAYS`   | `7`                                                              | No                    | Refresh token lifetime in days                               |
| `CORS_ORIGINS`                | `["http://localhost:5173","http://localhost:3000"]`              | No                    | JSON array of allowed origins                                |
| `SMTP_HOST`                   | _(empty)_                                                        | No                    | SMTP host for password-reset emails                          |
| `SMTP_PORT`                   | `587`                                                            | No                    | SMTP port                                                    |
| `SMTP_USER`                   | _(empty)_                                                        | No                    | SMTP username                                                |
| `SMTP_PASSWORD`               | _(empty)_                                                        | No                    | SMTP password                                                |
| `EMAIL_FROM`                  | _(empty)_                                                        | No                    | From address for reset emails                                |
| `MOSTLY_ORDERED_THRESHOLD`    | `10`                                                             | No                    | `order_count` at which items earn the "Mostly Ordered" badge |

### `Frontend/.env`

| Variable       | Description                                                    |
| -------------- | -------------------------------------------------------------- |
| `VITE_API_URL` | Base URL of the FastAPI backend (e.g. `http://localhost:8000`) |

> `VITE_API_URL` is baked into the Vite bundle at build time. Change it before building the Docker image for a different deployment target.

---

## Docker Deployment

Docker Compose starts PostgreSQL, the FastAPI API, and the nginx-served React frontend together. Alembic migrations run automatically when the API container starts.

```bash
# Build and start the full stack
docker compose up --build

# Include optional pgAdmin
docker compose --profile pgadmin up --build

# Apply migrations manually (if required)
docker compose exec api alembic upgrade head

# Seed the database
docker compose exec api python -m app.seed

# Tear down
docker compose down
```

### Service URLs

| Service            | URL                        |
| ------------------ | -------------------------- |
| Frontend (nginx)   | http://localhost:3000      |
| Backend API        | http://localhost:8000      |
| Swagger UI         | http://localhost:8000/docs |
| pgAdmin (optional) | http://localhost:5050      |
| PostgreSQL         | localhost:5432             |

### Backend Dockerfile

The backend uses a **two-stage build** to keep the runtime image lean:

- **Stage 1 — builder:** Full Python 3.12-slim image with `gcc` and `libpq-dev`. Compiles asyncpg, bcrypt, and psycopg2-binary; installs all packages into `/install`.
- **Stage 2 — runtime:** Clean Python 3.12-slim image. Copies only the pre-built packages. Runs as a non-root `appuser` for production safety.

The final `CMD` applies pending Alembic migrations then starts **Uvicorn with 2 workers**.

---

## API Reference

Base path: `/api/v1` — Full interactive docs at `/docs`.

### Authentication

| Method | Endpoint                | Auth Required | Description                                   |
| ------ | ----------------------- | ------------- | --------------------------------------------- |
| `POST` | `/auth/register`        | —             | Create a customer or owner account            |
| `POST` | `/auth/login`           | —             | Log in; returns access token + refresh token  |
| `POST` | `/auth/refresh`         | —             | Exchange a refresh token for a new token pair |
| `POST` | `/auth/logout`          | Bearer        | Revoke the current refresh token              |
| `GET`  | `/auth/me`              | Bearer        | Return current user details                   |
| `POST` | `/auth/change-password` | Bearer        | Change password (current password required)   |
| `POST` | `/auth/forgot-password` | —             | Request a password-reset email                |
| `POST` | `/auth/reset-password`  | —             | Reset password with the emailed token         |

### Restaurants

| Method   | Endpoint            | Auth Required | Description                                            |
| -------- | ------------------- | ------------- | ------------------------------------------------------ |
| `GET`    | `/restaurants`      | —             | List all active restaurants (supports search & filter) |
| `GET`    | `/restaurants/{id}` | —             | Get a single restaurant                                |
| `POST`   | `/restaurants`      | Owner         | Create a restaurant                                    |
| `PATCH`  | `/restaurants/{id}` | Owner         | Update restaurant details                              |
| `DELETE` | `/restaurants/{id}` | Owner         | Delete a restaurant                                    |

### Menu Items

| Method   | Endpoint                                                | Auth Required | Description                                          |
| -------- | ------------------------------------------------------- | ------------- | ---------------------------------------------------- |
| `GET`    | `/restaurants/{id}/menu-items`                          | —             | List menu items (filter by category, price)          |
| `GET`    | `/restaurants/{id}/menu-items/mostly-ordered`           | —             | Items with `order_count >= MOSTLY_ORDERED_THRESHOLD` |
| `POST`   | `/restaurants/{id}/menu-items`                          | Owner         | Add a menu item                                      |
| `PATCH`  | `/restaurants/{id}/menu-items/{item_id}`                | Owner         | Update a menu item                                   |
| `DELETE` | `/restaurants/{id}/menu-items/{item_id}`                | Owner         | Delete a menu item                                   |
| `POST`   | `/restaurants/{id}/menu-items/{item_id}/toggle-special` | Owner         | Toggle "Today's Special" flag                        |

### Cart

| Method   | Endpoint          | Auth Required | Description                        |
| -------- | ----------------- | ------------- | ---------------------------------- |
| `GET`    | `/cart`           | Customer      | View cart contents                 |
| `POST`   | `/cart`           | Customer      | Add an item (or increase quantity) |
| `PATCH`  | `/cart/{item_id}` | Customer      | Set item quantity                  |
| `DELETE` | `/cart/{item_id}` | Customer      | Remove a single item               |
| `DELETE` | `/cart`           | Customer      | Clear the entire cart              |

### Orders

| Method  | Endpoint                  | Auth Required | Description                                          |
| ------- | ------------------------- | ------------- | ---------------------------------------------------- |
| `POST`  | `/orders`                 | Customer      | Place an order from cart; total is price-snapshotted |
| `GET`   | `/orders/my`              | Customer      | Return own order history                             |
| `GET`   | `/orders/restaurant/{id}` | Owner         | Return all orders for a restaurant                   |
| `GET`   | `/orders/{id}`            | Bearer        | Get a single order by ID                             |
| `PATCH` | `/orders/{id}/status`     | Owner         | Advance order to next allowed status                 |

### Profile

| Method  | Endpoint         | Auth Required | Description                                   |
| ------- | ---------------- | ------------- | --------------------------------------------- |
| `GET`   | `/profile`       | Customer      | Get customer profile (auto-created if absent) |
| `PATCH` | `/profile`       | Customer      | Update customer profile                       |
| `GET`   | `/profile/owner` | Owner         | Get owner profile                             |
| `PATCH` | `/profile/owner` | Owner         | Update owner profile                          |

### Favourites & Recommendations

| Method   | Endpoint                      | Auth Required | Description                                      |
| -------- | ----------------------------- | ------------- | ------------------------------------------------ |
| `GET`    | `/favourites`                 | Customer      | List saved favourite restaurants                 |
| `POST`   | `/favourites/{restaurant_id}` | Customer      | Add a restaurant to favourites                   |
| `DELETE` | `/favourites/{restaurant_id}` | Customer      | Remove a restaurant from favourites              |
| `GET`    | `/recommendations`            | Customer      | Up to 10 personalized restaurant recommendations |

### Health

| Method | Endpoint  | Auth Required | Description                |
| ------ | --------- | ------------- | -------------------------- |
| `GET`  | `/health` | —             | Returns `{"status": "ok"}` |

---

## Order Status Workflow

Orders follow a strict server-side state machine. Invalid transitions return `422 Unprocessable Entity`.

```
PENDING ──► CONFIRMED ──► PREPARING ──► READY ──► COMPLETED
   │              │
   └──────────────┴──────────────────────────────► CANCELLED
   (CANCELLED is allowed from PENDING or CONFIRMED only)
```

| From        | Allowed transitions      |
| ----------- | ------------------------ |
| `PENDING`   | `CONFIRMED`, `CANCELLED` |
| `CONFIRMED` | `PREPARING`, `CANCELLED` |
| `PREPARING` | `READY`                  |
| `READY`     | `COMPLETED`              |
| `COMPLETED` | — (terminal)             |
| `CANCELLED` | — (terminal)             |

---

## Postman Collection

The file `JustEats.postman_collection.json` at the repository root is a ready-to-run Postman collection.

**Setup:**

1. Open Postman → **Import** → select `JustEats.postman_collection.json`
2. The collection variable `base_url` is pre-set to `http://localhost:8000/api/v1`
3. Run **Login (Customer)** or **Login (Owner)** — the test script auto-saves `access_token` and `refresh_token` as collection variables
4. All subsequent requests use `{{access_token}}` automatically

**Folders:**

| Folder          | Requests                                                                                                     |
| --------------- | ------------------------------------------------------------------------------------------------------------ |
| Auth            | Register · Login · Refresh · Logout · Me · Forgot/Reset/Change Password                                      |
| Restaurants     | List · Get · Create · Update · Delete                                                                        |
| Menu Items      | List · Category/Price filter · Mostly Ordered · Create · Update · Toggle Special · Toggle Available · Delete |
| Cart            | View · Add · Update Quantity · Remove Item · Clear                                                           |
| Orders          | Place Order · My Orders · Restaurant Orders · Get by ID · Update Status (all transitions)                    |
| Profile         | Get & Update (Customer) · Get & Update (Owner)                                                               |
| Favourites      | List · Add · Remove                                                                                          |
| Recommendations | Get personalized list                                                                                        |
| Health          | Health check                                                                                                 |

---

## Test Credentials

Run `python -m app.seed` from `backend/` to populate demo data.

| Role     | Email                | Password      |
| -------- | -------------------- | ------------- |
| Owner    | saurabh@justeats.com | `Saurabh123!` |
| Owner    | arjun@justeats.com   | `Arjun123!`   |
| Customer | gunjan@justeats.com  | `Gunjan123!`  |
| Customer | sumit@justeats.com   | `Sumit123!`   |

The seed creates 4 vegetarian restaurants (Indian & Asian), 14 menu items, and associated profiles for all users.

---

## Testing

### One-time setup

```sql
-- Create a dedicated test database in psql or pgAdmin
CREATE DATABASE justeats_test;
```

### Running the suite

```bash
cd backend

# Activate the virtual environment first
.\venv\Scripts\activate      # Windows
source venv/bin/activate     # macOS / Linux

# Run all 19 tests
pytest

# Verbose output
pytest -v

# Override the test database URL (defaults to localhost)
# Windows PowerShell
$env:TEST_DATABASE_URL = "postgresql+asyncpg://postgres:postgres@localhost:5432/justeats_test"
# macOS / Linux
export TEST_DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/justeats_test

pytest -v
```

Tests use an **in-process httpx client** (`ASGITransport`) — no running server required. Each test gets a clean database: tables are truncated with FK checks disabled between every test. The session-scoped engine creates all tables once at the start and drops them at the end.

### Test inventory (19 tests)

| #   | Area            | Scenario                                          |
| --- | --------------- | ------------------------------------------------- |
| 1   | Register        | Success — 201 returned with correct fields        |
| 2   | Register        | Duplicate email → 409 Conflict                    |
| 3   | Register        | Weak password → 422 Unprocessable Entity          |
| 4   | Login           | Success — access + refresh tokens returned        |
| 5   | Login           | Wrong password → 401 Unauthorized                 |
| 6   | JWT             | Expired token → 401 Unauthorized                  |
| 7   | Restaurants     | Owner creates a restaurant                        |
| 8   | Restaurants     | Public listing returns restaurants                |
| 9   | Restaurants     | Owner updates their restaurant                    |
| 10  | Restaurants     | Owner deletes restaurant; confirmed gone          |
| 11  | Restaurants     | Customer create attempt → 403 Forbidden           |
| 12  | Orders          | Place order; total matches sum of item prices     |
| 13  | Orders          | PENDING → CONFIRMED status update                 |
| 14  | Orders          | Invalid status transition → 422                   |
| 15  | Profile         | GET auto-creates profile on first call            |
| 16  | Profile         | PATCH saves changes correctly                     |
| 17  | Favourites      | Add and list a favourite restaurant               |
| 18  | Favourites      | Duplicate add → 409 Conflict                      |
| 19  | Recommendations | Returns a list (top-rated fallback for new users) |

---

## Project Structure

```
JustEats/
│
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   ├── config.py           # Pydantic Settings — reads .env
│   │   │   └── security.py         # JWT creation/decode, bcrypt, refresh token generation
│   │   ├── db/
│   │   │   ├── base.py             # DeclarativeBase + TimestampMixin (created_at, updated_at)
│   │   │   └── session.py          # Async engine, sessionmaker, get_db dependency
│   │   ├── models/
│   │   │   ├── user.py             # User · CustomerProfile · OwnerProfile
│   │   │   ├── restaurant.py       # Restaurant · FavouriteRestaurant
│   │   │   ├── menu_item.py        # MenuItem
│   │   │   ├── cart.py             # CartItem
│   │   │   ├── order.py            # Order · OrderItem · OrderStatus · status transitions
│   │   │   └── refresh_token.py    # RefreshToken (hashed, supports multi-device login)
│   │   ├── routers/
│   │   │   ├── auth.py             # Register · Login · Refresh · Logout · Password reset
│   │   │   ├── restaurants.py      # Restaurant CRUD
│   │   │   ├── menu_items.py       # Menu item CRUD + toggle-special
│   │   │   ├── cart.py             # Cart management
│   │   │   ├── orders.py           # Place order · Status updates
│   │   │   ├── profile.py          # Customer & owner profile (auto-create on GET)
│   │   │   ├── favourites.py       # Add · Remove · List favourites
│   │   │   └── recommendations.py  # Personalized recommendations (history + fallback)
│   │   ├── schemas/                # Pydantic v2 request & response models
│   │   ├── dependencies.py         # get_current_user · require_role
│   │   ├── middleware.py           # LoggingMiddleware (method · path · status · ms)
│   │   ├── main.py                 # App init · CORS · middleware · router registration
│   │   └── seed.py                 # Demo data seeding script
│   ├── alembic/                    # Migration environment and version scripts
│   ├── tests/
│   │   ├── conftest.py             # Session engine · table truncation · ASGI client
│   │   └── test_api.py             # 19 integration tests
│   ├── Dockerfile                  # Two-stage build → non-root runtime image
│   ├── requirements.txt            # Production dependencies
│   ├── requirements-dev.txt        # pytest · httpx · pytest-asyncio
│   ├── alembic.ini
│   └── pytest.ini                  # asyncio_mode = auto · testpaths = tests
│
├── Frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── axios.js            # Axios instance · auth interceptor · silent refresh queue
│   │   │   ├── auth.js             # login · register · refresh · logout · password flows
│   │   │   ├── restaurants.js
│   │   │   ├── menuItems.js
│   │   │   ├── cart.js
│   │   │   ├── orders.js
│   │   │   ├── profile.js
│   │   │   ├── favourites.js
│   │   │   └── recommendations.js
│   │   ├── components/
│   │   │   ├── ProtectedRoute.jsx  # Redirects unauthenticated or wrong-role users
│   │   │   ├── layout/             # CustomerLayout · OwnerLayout (nav + <Outlet>)
│   │   │   ├── restaurant/         # RestaurantCard · MenuItemCard
│   │   │   └── ui/                 # FormField · LoadingSpinner
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Auth state · login/logout · token decode · silent refresh
│   │   ├── pages/
│   │   │   ├── public/             # Login · Register · ForgotPassword · ResetPassword
│   │   │   ├── customer/           # Home · RestaurantDetail · Cart · Orders · Profile
│   │   │   └── owner/              # Dashboard · MenuManager · OrderManager · Profile
│   │   ├── App.jsx                 # Route tree (public / customer-protected / owner-protected)
│   │   └── main.jsx                # React root · BrowserRouter · QueryClient · AuthProvider
│   ├── nginx.conf                  # SPA fallback · static asset caching · security headers
│   ├── Dockerfile                  # Vite build → nginx serve
│   ├── vite.config.js
│   └── package.json
│
├── docker-compose.yml              # postgres · api · frontend · pgadmin (optional profile)
├── JustEats.postman_collection.json
├── AI_USAGE.md
└── README.md
```

---

## Data Model Summary

| Table                   | Key Columns                                                                                                                             |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `users`                 | `id` (UUID PK), `email` (unique), `hashed_password`, `role` (customer/owner), `is_active`, `reset_token_hash`, `reset_token_expires_at` |
| `customer_profiles`     | `user_id` (FK → users), `full_name`, `phone`, `dietary_restrictions`, `favourite_cuisine`                                               |
| `owner_profiles`        | `user_id` (FK → users), `full_name`, `phone`, `bio`, `cuisine_specialty`                                                                |
| `restaurants`           | `owner_id` (FK → users), `name`, `cuisine_type`, `location`, `description`, `image_url`, `is_active`, `rating`                          |
| `menu_items`            | `restaurant_id` (FK → restaurants, CASCADE), `name`, `price`, `category`, `is_available`, `is_special`, `order_count`                   |
| `cart_items`            | `customer_id` (FK → customer_profiles), `menu_item_id`, `quantity`                                                                      |
| `orders`                | `customer_id` (FK → customer_profiles, RESTRICT), `restaurant_id` (RESTRICT), `status`, `total_amount`, `special_instructions`          |
| `order_items`           | `order_id` (FK → orders, CASCADE), `menu_item_id` (RESTRICT), `quantity`, `unit_price` (price snapshot)                                 |
| `favourite_restaurants` | `customer_id`, `restaurant_id` — unique constraint prevents duplicates                                                                  |
| `refresh_tokens`        | `user_id` (FK → users, CASCADE), `token_hash`, `expires_at`                                                                             |

All tables use UUID primary keys. `created_at` and `updated_at` are added automatically via `TimestampMixin`.
