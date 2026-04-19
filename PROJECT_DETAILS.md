# RentWise Project Documentation

## Project Overview

**RentWise** is a comprehensive property management platform designed to streamline the rental process for landlords and tenants. It provides features for managing properties, leases, tenants, payments, maintenance requests, notifications, and authentication. The project is divided into two main parts:

- **rentwise-backend**: Node.js/Express backend API with a PostgreSQL database.
- **rentwise-frontend**: React-based frontend using Vite for a modern, fast UI.

---

## Project Idea & Goals

The goal of RentWise is to simplify property management by providing a unified platform where:
- **Landlords** can manage properties, tenants, leases, payments, and maintenance requests.
- **Tenants** can view their leases, make payments, submit maintenance requests, and receive notifications.

Key objectives:
- Secure authentication and role-based access (landlord/tenant)
- Real-time notifications for important events
- Easy tracking of payments and maintenance
- Scalable and maintainable architecture

---

## Backend (rentwise-backend)

### Structure
- **server.js**: Main entry point, sets up Express server and routes.
- **db/**: Database connection and schema (PostgreSQL).
- **controllers/**: Business logic for each domain (auth, leases, maintenance, notifications, payments, properties, tenants).
- **routes/**: API endpoints for each domain.
- **migrate.js / migrate_tenants.js**: Database migration scripts.
- **setup_backend.js**: Backend setup script.

### Important Code & Concepts
- **Express.js** for RESTful API structure
- **Controllers** handle business logic, separated from route definitions
- **Database Layer**: `db/index.js` manages connections and queries
- **Schema**: Defined in `db/schema.sql` for all tables (users, properties, leases, payments, etc.)
- **Authentication**: Likely JWT-based (see `controllers/auth.js` and `routes/auth.js`)
- **Role Management**: Landlord and tenant roles enforced in controllers/routes
- **Error Handling**: Centralized error handling for API responses

---

## Frontend (rentwise-frontend)

### Structure
- **src/**: Main source folder
  - **App.jsx**: Main app component
  - **components/**: Shared UI components (Layout, Navbar, Sidebar)
  - **pages/**: Page-level components for both landlord and tenant
    - **landlord/**: Dashboard, Properties, Tenants, Leases, Payments, Maintenance, Notifications
    - **tenant/**: Dashboard, Documents, Payments, Maintenance
  - **assets/**: Static assets (images, icons, etc.)
  - **App.css / index.css**: Global styles
- **public/**: Static files
- **vite.config.js**: Vite configuration
- **eslint.config.js**: Linting rules

### Important Code & Concepts
- **React Router** for navigation between pages
- **Role-based Routing**: `ProtectedRoute.jsx` ensures only authorized users access certain pages
- **Layout Components**: `AppLayout`, `Navbar`, `Sidebar` for consistent UI
- **State Management**: Likely using React Context or hooks for user/session state
- **API Integration**: Fetches data from backend for properties, leases, payments, etc.
- **Responsive Design**: CSS for mobile and desktop

---

## Database Schema (db/schema.sql)
- **Users**: Stores landlord and tenant info, roles, credentials
- **Properties**: Property details
- **Leases**: Lease agreements linking tenants and properties
- **Payments**: Rent and other payments
- **Maintenance**: Requests and status tracking
- **Notifications**: System and user notifications

---

## Key Features
- **Authentication**: Secure login, JWT tokens, role-based access
- **Property Management**: CRUD for properties, assign tenants
- **Lease Management**: Track lease terms, documents
- **Payments**: Record and track rent payments, payment history
- **Maintenance Requests**: Submit and manage maintenance issues
- **Notifications**: Real-time updates for important events
- **Responsive UI**: Works on desktop and mobile

---

## How It Works (Flow)
1. **Landlord** logs in, adds properties, creates leases, manages tenants
2. **Tenant** logs in, views lease, makes payments, submits maintenance requests
3. **Backend** handles API requests, enforces roles, manages data
4. **Frontend** displays data, handles navigation, and user interactions

---

## Technologies Used
- **Backend**: Node.js, Express.js, PostgreSQL
- **Frontend**: React, Vite, CSS
- **Authentication**: JWT (assumed)
- **Other**: ESLint, modern JS/React best practices

---

## Setup Instructions

### Backend
1. Install dependencies: `npm install`
2. Set up PostgreSQL and run migrations (`migrate.js`)
3. Start server: `node server.js`

### Frontend
1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`

---

## Future Improvements
- Add automated tests (unit/integration)
- Add email/SMS notifications
- Add analytics/dashboard for landlords
- Improve UI/UX with more interactivity
- Add support for multiple properties per tenant

---

## Authors & Contributors
- [Your Name Here]

---

## License
Specify your license here (e.g., MIT, GPL, etc.)

---

## Contact
For questions or support, contact [your-email@example.com]

---

*This file is auto-generated. Please update as the project evolves.*
