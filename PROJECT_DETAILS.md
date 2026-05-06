# RentWise Project Details

## 1. Overview

RentWise is a two-part property management system for landlords and tenants. The repository contains:

- `rentwise-backend`: an Express API backed by PostgreSQL.
- `rentwise-frontend`: a React + Vite client that provides the public landing page, login flow, and role-based dashboards.

The application focuses on rental operations such as property tracking, tenant records, lease documents, payments, maintenance requests, notifications, and portal authentication.

## 2. What The App Does

The current product flow is centered on two roles:

- Landlords manage properties, tenants, lease documents, payments, maintenance, and notifications.
- Tenants view their assigned property, review payment history, submit maintenance requests, and access lease-related documents.

The frontend enforces role-based navigation using local storage session values, while the backend exposes REST endpoints for authentication and the main property-management domains.

## 3. Technology Stack

### Backend

- Node.js
- Express 5
- PostgreSQL via `pg`
- JWT for login session tokens
- bcrypt for password hashing
- cors and dotenv for API access and environment configuration

### Frontend

- React 19
- Vite
- react-router-dom for routing
- lucide-react for icons
- Tailwind CSS v4 tooling is installed

## 4. Repository Structure

### Backend folder: `rentwise-backend`

- `server.js`: API entry point and route registration.
- `db/index.js`: PostgreSQL pool configuration.
- `db/schema.sql`: database schema definition.
- `controllers/`: business logic for each domain.
- `routes/`: HTTP route definitions for each module.
- `migrate.js` and `migrate_tenants.js`: migration scripts.
- `setup_backend.js`: backend setup/bootstrap helper.

### Frontend folder: `rentwise-frontend`

- `src/main.jsx`: React bootstrap file.
- `src/App.jsx`: route configuration for public, landlord, and tenant views.
- `src/components/layout/`: shared application shell components.
- `src/pages/`: page-level screens for landing, login, landlord, and tenant flows.
- `src/App.css` and `src/index.css`: global styling layers.

## 5. Backend Architecture

The backend is organized around a standard Express controller-and-route split.

### Main server flow

- `server.js` creates the Express app.
- CORS and JSON body parsing are enabled globally.
- API modules are mounted under `/api/*`.
- A health check endpoint exists at `/api/health`.
- A database connectivity test exists at `/api/test-db`.
- A centralized error handler returns generic 500 responses.

### Available backend modules

- Authentication: `/api/auth`
- Properties: `/api/properties`
- Tenants: `/api/tenants`
- Payments: `/api/payments`
- Maintenance: `/api/maintenance`
- Leases: `/api/leases`
- Notifications: `/api/notifications`

### Important backend behavior

- The auth flow uses bcrypt to hash passwords and JWT to issue tokens.
- The tenant endpoint joins tenant and property data for a given email.
- The properties endpoint supports listing landlord properties and adding a new property.
- Several domain routes are currently scaffolded CRUD placeholders and will need real controller logic if the API is to become production complete.

### Database configuration notes

- `db/schema.sql` defines the core tables.
- `db/index.js` currently uses a local PostgreSQL connection configuration.
- The schema currently covers users, properties, tenants, payments, maintenance requests, lease documents, and notifications.

## 6. Frontend Architecture

The frontend is a routed React application with one public landing experience and two protected portal experiences.

### App routing

- Public routes:
  - `/` landing page
  - `/login` login page
- Landlord portal:
  - `/landlord/dashboard`
  - `/landlord/properties`
  - `/landlord/tenants`
  - `/landlord/payments`
  - `/landlord/maintenance`
  - `/landlord/documents`
  - `/landlord/notifications`
- Tenant portal:
  - `/tenant/dashboard`
  - `/tenant/payments`
  - `/tenant/maintenance`
  - `/tenant/documents`

### Portal protection

- `ProtectedRoute.jsx` checks `rentwise_token` and `rentwise_role` in local storage.
- Access is redirected to the correct role dashboard when the stored role does not match the allowed role.
- `AppLayout.jsx` wraps the dashboard pages with the top navbar and sidebar shell.

### Session handling

- Login data is stored in local storage after successful authentication.
- The app reads `rentwise_user`, `rentwise_name`, `rentwise_role`, and `rentwise_token`.
- A legacy `/dashboard` route redirects to the proper portal based on the stored role.

## 7. Database Schema Summary

The schema in `rentwise-backend/db/schema.sql` models the core rental workflow:

- `users`: landlord and tenant credentials and roles.
- `properties`: rental assets with location, rent, status, and landlord email.
- `tenants`: tenant identity and property assignment.
- `payments`: rent payments linked to tenants and properties.
- `maintenance_requests`: tenant-raised maintenance issues with priority and status.
- `lease_documents`: lease-related files and expiry tracking.
- `notifications`: in-app notices tied to a user.

## 8. Important Files

### Root documentation and project metadata

- `README.md`: short project overview and setup guide.
- `PROJECT_DETAILS.md`: this detailed project analysis file.

### Backend files that matter most

- `rentwise-backend/server.js`: app startup, route mounting, health checks, and error handling.
- `rentwise-backend/db/index.js`: database connection pool.
- `rentwise-backend/db/schema.sql`: full schema definition.
- `rentwise-backend/routes/auth.js`: signup and login endpoints.
- `rentwise-backend/routes/properties.js`: property listing and creation endpoints.
- `rentwise-backend/routes/tenants.js`: tenant creation and tenant-property lookup.
- `rentwise-backend/routes/leases.js`: lease CRUD route shell.
- `rentwise-backend/routes/payments.js`: payment CRUD route shell.
- `rentwise-backend/routes/maintenance.js`: maintenance CRUD route shell.
- `rentwise-backend/routes/notifications.js`: notification CRUD route shell.
- `rentwise-backend/controllers/auth.js`: placeholder CRUD controller file.

### Frontend files that matter most

- `rentwise-frontend/src/App.jsx`: route map and portal redirects.
- `rentwise-frontend/src/main.jsx`: React app bootstrapping.
- `rentwise-frontend/src/components/layout/AppLayout.jsx`: shared portal layout.
- `rentwise-frontend/src/components/layout/ProtectedRoute.jsx`: auth and role guard.
- `rentwise-frontend/src/components/layout/Navbar.jsx`: top bar with logout/session display.
- `rentwise-frontend/src/components/layout/Sidebar.jsx`: landlord and tenant navigation menu.
- `rentwise-frontend/src/pages/Landing.jsx`: public marketing / portal entry page.
- `rentwise-frontend/src/pages/Login.jsx`: authentication form and role-based login redirect.
- `rentwise-frontend/src/pages/landlord/Dashboard.jsx`: landlord dashboard overview.
- `rentwise-frontend/src/pages/tenant/Dashboard.jsx`: tenant dashboard overview and property lookup.

## 9. Key User Flows

### Landlord flow

1. Open the landing page.
2. Sign in from the login page.
3. Land on the landlord dashboard.
4. Navigate to properties, tenants, payments, maintenance, documents, and notifications.

### Tenant flow

1. Open the landing page.
2. Sign in from the login page.
3. Land on the tenant dashboard.
4. View assigned property details, payment history, maintenance status, and lease documents.

## 10. Current Implementation Notes

- The frontend calls the backend directly at `http://localhost:5000`.
- The login page performs a health check before the auth request.
- The tenant dashboard fetches tenant data by email from the backend.
- Some UI routes and backend controllers are already scaffolded but still return placeholder data.
- There are duplicate layout component paths in `src/components/` and `src/components/layout/`, so the `layout/` versions are the ones used by `App.jsx`.

## 11. Setup Summary

### Backend

1. Install dependencies with `npm install` inside `rentwise-backend`.
2. Start the API with `npm run dev` or `npm start`.
3. Ensure PostgreSQL is available and the `rentwise` database matches the schema.

### Frontend

1. Install dependencies with `npm install` inside `rentwise-frontend`.
2. Start the Vite dev server with `npm run dev`.

## 12. Gaps And Follow-Up Work

- Add real controller logic for the currently placeholder CRUD modules.
- Replace hardcoded local backend URLs with a shared environment variable.
- Normalize database naming across `users`, `tenants`, and auth flows if production hardening is planned.
- Add tests for the API and routing layer.
- Expand the documentation with screenshots and deployment notes when available.
