# DScribe – Patient Admission Management System

A full-stack web application for managing hospital patient admissions: register patients, search and filter records, edit details, discharge patients and track live admission statistics.

**Live application:** `LIVE_FRONTEND_URL`
**Backend API:** `LIVE_BACKEND_URL/api` · Health: `LIVE_BACKEND_URL/api/health`
**GitHub repository:** `GITHUB_REPO_URL`

---

## Overview

The system is made of three parts:

| Layer    | Technology                                   | Hosted on |
|----------|----------------------------------------------|-----------|
| Frontend | React 19 + TypeScript + Vite + Tailwind CSS  | Vercel    |
| Backend  | Java 21 + Spring Boot 4 (REST API)           | Render    |
| Database | PostgreSQL                                   | Neon      |

Every number and record you see in the UI comes from the PostgreSQL database through the REST API. There is no mock data.

## Features

- **Dashboard**: total patients, currently admitted, discharged and today's admissions, all computed by the database. Also shows the five most recent patients and a quick "Add Patient" action.
- **Add patient**: modal form with dropdowns. Status defaults to **Admitted**, and a unique patient ID such as `DS-2026-0001` is generated automatically.
- **Patient list**: a table showing avatar initials, name, patient ID, age, gender, ward, department, doctor, admission date, a status badge and an actions menu.
- **Search** by name (case-insensitive, runs in the database).
- **Filters** by ward, department, doctor and status. Filters combine with each other and with search; a **Clear filters** button resets them.
- **Edit patient**: changes are saved to PostgreSQL.
- **Mark discharged**, with a confirmation dialog.
- **Delete patient**, with a confirmation dialog.
- **View details** of a patient, including created and updated timestamps.
- **Validation on both sides**: Zod and React Hook Form on the frontend, Jakarta Bean Validation plus service checks on the backend.
- **Error handling**: toasts for success and failure, inline field errors, loading, empty and error states, and a friendly message when the backend is unreachable.
- **Responsive layout**: a collapsible sidebar on mobile, card layout for the patient list on small screens and no horizontal page overflow.

## Tech Stack

**Frontend:** React, Vite, TypeScript, Tailwind CSS v4, Radix UI primitives (dialog, alert dialog, dropdown menu), Lucide icons, React Router, React Hook Form, Zod, Axios, Sonner (toasts)

**Backend:** Java 21, Spring Boot 4, Spring Web MVC, Spring Data JPA, Hibernate, Jakarta Bean Validation, Maven (wrapper included)

**Database:** Neon serverless PostgreSQL

## Screenshots

| Dashboard | Patients |
|-----------|----------|
| ![Dashboard](docs/screenshots/dashboard.png) | ![Patients](docs/screenshots/patients.png) |

| Validation | Delete confirmation | Mobile |
|------------|---------------------|--------|
| ![Validation](docs/screenshots/validation.png) | ![Delete](docs/screenshots/delete-confirm.png) | ![Mobile](docs/screenshots/mobile-patients.png) |

## Architecture

```
┌──────────────────────┐   HTTPS / JSON    ┌────────────────────────────┐   JDBC (SSL)   ┌──────────────────┐
│  React SPA (Vercel)  │ ────────────────▶ │  Spring Boot API (Render)  │ ─────────────▶ │ Neon PostgreSQL  │
│  Axios · RHF · Zod   │ ◀──────────────── │  Controller→Service→Repo   │ ◀───────────── │  patients table  │
└──────────────────────┘                   └────────────────────────────┘                └──────────────────┘
```

Backend request flow: **Controller** (HTTP and `@Valid`) → **Service** (business rules, ID generation, duplicate check) → **Repository** (Spring Data JPA; search and filters use a JPA `Specification`) → **PostgreSQL**.
A `@RestControllerAdvice` turns every exception into one consistent JSON error shape.

## Folder Structure

```
.
├── backend/                          Spring Boot API
│   ├── src/main/java/com/dscribe/patients/
│   │   ├── controller/               PatientController, DashboardController, HealthController
│   │   ├── service/                  PatientService (business logic)
│   │   ├── repository/               PatientRepository, PatientSpecifications (search + filters)
│   │   ├── entity/                   Patient (JPA entity), PatientStatus (enum)
│   │   ├── dto/                      PatientRequest, PatientResponse, StatusUpdateRequest, DashboardStats, ErrorResponse, PatientOptions
│   │   ├── exception/                GlobalExceptionHandler + custom exceptions
│   │   └── config/                   CorsConfig
│   ├── src/main/resources/
│   │   ├── application.properties    All config via environment variables
│   │   └── schema.sql                Creates the patient-number sequence
│   └── pom.xml
├── frontend/                         React app
│   └── src/
│       ├── components/               Sidebar, Header, StatCard, PatientTable, PatientForm, PatientDialog,
│       │                             PatientDetailsDialog, FilterBar, StatusBadge, ConfirmDialog, EmptyState, LoadingState, ui/
│       ├── pages/                    Dashboard, Patients
│       ├── services/                 api (Axios instance), patientService, dashboardService
│       ├── types/                    patient.ts
│       └── lib/                      dropdown options, helpers
├── docs/screenshots/
├── Dockerfile                        Backend build recipe used by Render
└── render.yaml                       Render blueprint
```

## Database Configuration

Table `patients` (created and updated automatically by Hibernate with `ddl-auto=update`, which never drops data):

| Column         | Type         | Notes                                   |
|----------------|--------------|-----------------------------------------|
| id             | UUID         | Primary key                             |
| patient_id     | varchar(20)  | Unique, e.g. `DS-2026-0001`             |
| name           | varchar(100) |                                         |
| age            | integer      | 0 – 120                                 |
| gender         | varchar(20)  |                                         |
| ward           | varchar(50)  |                                         |
| department     | varchar(50)  |                                         |
| doctor         | varchar(50)  |                                         |
| admission_date | date         | Not in the future                       |
| status         | varchar(20)  | `Admitted` / `Discharged`               |
| created_at     | timestamp    | Set on insert                           |
| updated_at     | timestamp    | Updated on every change                 |

Patient IDs come from a PostgreSQL **sequence** (`patient_number_seq`), so they are unique, safe under concurrent requests and never reused after a delete.

### Getting a Neon connection

1. Create a project at [console.neon.tech](https://console.neon.tech).
2. Click **Connect** and copy the connection string, for example
   `postgresql://neondb_owner:PASSWORD@ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require`
3. Split it into the three variables Spring Boot needs:
   - `DATABASE_URL` = `jdbc:postgresql://ep-xxx-pooler.region.aws.neon.tech/neondb?sslmode=require`
   - `DATABASE_USERNAME` = `neondb_owner`
   - `DATABASE_PASSWORD` = `PASSWORD`

## Backend Setup

Requirements: JDK 21 or newer. Maven is not needed because the wrapper is included.

```bash
cd backend
# create backend/.env (gitignored) with:
#   DATABASE_URL=jdbc:postgresql://<host>/<db>?sslmode=require
#   DATABASE_USERNAME=<user>
#   DATABASE_PASSWORD=<password>
./mvnw spring-boot:run          # Windows: mvnw.cmd spring-boot:run
```

The API starts on `http://localhost:8080`. Check it with `curl http://localhost:8080/api/health`.

## Frontend Setup

Requirements: Node.js 20 or newer.

```bash
cd frontend
cp .env.example .env            # VITE_API_URL=http://localhost:8080/api
npm install
npm run dev                     # http://localhost:5173
```

## Environment Variables

**Backend**

| Variable               | Required | Example / default                                         |
|------------------------|----------|-----------------------------------------------------------|
| `DATABASE_URL`         | yes      | `jdbc:postgresql://host/neondb?sslmode=require`           |
| `DATABASE_USERNAME`    | yes      | `neondb_owner`                                            |
| `DATABASE_PASSWORD`    | yes      | (secret)                                                  |
| `CORS_ALLOWED_ORIGINS` | no       | default `http://localhost:5173,https://*.vercel.app`      |
| `APP_TIMEZONE`         | no       | default `Asia/Kolkata`; used for "today" and future-date checks |
| `PORT`                 | no       | default `8080` (Render sets this automatically)           |

**Frontend**

| Variable       | Example                                      |
|----------------|----------------------------------------------|
| `VITE_API_URL` | `https://your-backend.onrender.com/api`      |

Secrets are never committed: `.env` files are gitignored.

## API Endpoints

Base URL: `/api`

| Method | Endpoint                          | Description                                   | Success |
|--------|-----------------------------------|-----------------------------------------------|---------|
| GET    | `/health`                         | API and database health                       | 200     |
| GET    | `/patients`                       | List patients (supports search and filters)   | 200     |
| GET    | `/patients/{id}`                  | Get one patient                               | 200     |
| POST   | `/patients`                       | Create a patient (status = Admitted)          | 201     |
| PUT    | `/patients/{id}`                  | Update a patient                              | 200     |
| PATCH  | `/patients/{id}/status`           | Change status, body `{"status":"Discharged"}` | 200     |
| DELETE | `/patients/{id}`                  | Delete a patient                              | 204     |
| GET    | `/dashboard/stats`                | Total / admitted / discharged / today         | 200     |
| GET    | `/dashboard/recent-patients`      | Five most recently added patients             | 200     |

Query parameters for `GET /patients` can be combined:
`search`, `ward`, `department`, `doctor`, `status`, for example
`/api/patients?search=rao&ward=ICU&department=Cardiology&doctor=Dr.%20Ananya%20Rao&status=Admitted`

**Error format** (400 / 404 / 409 / 500):

```json
{
  "timestamp": "2026-11-25T14:38:34Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "errors": { "name": "Name can contain only letters and spaces", "age": "Age must be at most 120" }
}
```

Status codes: `400` validation error or malformed body, `404` patient not found, `409` duplicate admission or already discharged, `503` database down (health endpoint).

## Validation Rules

The frontend (Zod) and the backend (Bean Validation plus service checks) enforce the same rules **independently**.

| Field          | Rules                                                                      |
|----------------|----------------------------------------------------------------------------|
| Name           | Required; trimmed (repeated spaces collapsed); letters and spaces only; 2–100 characters |
| Age            | Required; whole number; 0–120 (decimals such as `12.5` are rejected)        |
| Gender         | Required; one of Male, Female, Other                                       |
| Ward           | Required; one of the 7 predefined wards                                    |
| Department     | Required; one of the 10 predefined departments                             |
| Doctor         | Required; one of the 5 predefined doctors                                  |
| Admission Date | Required; valid date; not in the future                                    |
| Duplicate      | The same name, admission date and doctor cannot be admitted twice (409)    |

## Deployment

### Database: Neon
Create the project and copy the connection details (see [Database Configuration](#database-configuration)).

### Backend: Render
Render has no native Java runtime, so it builds the backend from the root `Dockerfile`, a two-stage Maven build and JRE image.

1. On Render, choose **New → Web Service** and connect this GitHub repository.
2. **Language:** Docker · **Root Directory:** leave blank · **Region:** Ohio (same as Neon) · **Instance type:** Free
3. Add the environment variables `DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD` and `CORS_ALLOWED_ORIGINS=https://<your-app>.vercel.app,http://localhost:5173`.
4. **Health Check Path:** `/api/health`, then deploy.

(Alternatively use **New → Blueprint**, which reads `render.yaml`.)

> The free Render tier sleeps after 15 minutes of inactivity, so the first request can take about 50 seconds. The frontend shows a loading message while it waits.

### Frontend: Vercel
1. Import the repository on Vercel and set **Root Directory** to `frontend` (the Vite preset is detected automatically).
2. Add the environment variable `VITE_API_URL=https://<your-backend>.onrender.com/api`.
3. Deploy. `vercel.json` rewrites all routes to `index.html` so React Router deep links work.

## Testing Performed

API tests (curl against Neon): create, list, get, update, discharge, delete; search; each filter alone and all combined; invalid name, age (−1, 150, 12.5, "abc"), future date, invalid date, empty body, values outside the dropdown lists, duplicate admission, discharging twice, unknown ID, malformed UUID, CORS preflight from an allowed and a disallowed origin; data persisting across a server restart.

Browser end-to-end tests (headless Chrome, 28 checks): dashboard stats, required, name, age and future-date validation messages, add patient with toast and generated ID, persistence after refresh, search, ward, department, doctor and status filters combined, empty state, clear filters, view details, edit, discharge with confirmation, delete with confirmation, mobile layout (375 px) with no horizontal overflow, mobile sidebar, and no console errors.
