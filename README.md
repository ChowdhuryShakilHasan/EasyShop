# EasyShop Admin Dashboard

A responsive e-commerce admin dashboard built with Next.js, TypeScript, Redux Toolkit (RTK Query), and Tailwind CSS. Includes authentication with role-based access, product/order/customer/inventory/staff management, analytics, reports, and dark mode.

## Tech Stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS v4
- **State Management:** Redux Toolkit + RTK Query
- **Forms & Validation:** React Hook Form + Zod
- **Charts:** Recharts
- **Icons:** Lucide React
- **Mock Backend:** json-server

## Features

- **Authentication** — login with mock credentials, protected routes, persisted session (localStorage), role-based access (Admin/Staff)
- **Dashboard** — KPI cards, revenue chart, category breakdown, recent orders, low-stock alerts
- **Products** — search, filter, sort, pagination, add/edit/delete, bulk delete, mock image upload
- **Orders** — status filter tabs, search, order detail page with itemized breakdown and status stepper
- **Customers** — customer list, profile page with order history and stats
- **Inventory** — stock levels overview, low-stock report, stock adjustment
- **Staff Management** (Admin-only) — add/edit/delete staff and admin accounts
- **Settings** — profile editing, store info, notification preferences
- **Reports** — date-range filtered sales summary with CSV export
- **Dark mode** — manual toggle, persisted preference
- **Fully responsive** — mobile drawer navigation, horizontally scrollable tables

## Demo Credentials

| Role  | Email               | Password  |
|-------|----------------------|-----------|
| Admin | admin@easyshop.com  | admin123  |
| Staff | staff@easyshop.com  | staff123  |

## Getting Started

**1. Install dependencies**
```bash
npm install
```

**2. Run the app (two terminals required)**

Terminal 1 — Next.js dev server:
```bash
npm run dev
```

Terminal 2 — mock API server:
```bash
npm run mock-api
```

**3. Open the app**

Visit `http://localhost:3000` — it will redirect to the login page.

## Project Structure