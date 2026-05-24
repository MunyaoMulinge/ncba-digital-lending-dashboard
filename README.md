# NCBA Digital Lending Dashboard

> A production-grade frontend demo of a microservices-based loan management system architected for NCBA Bank Kenya. Built to showcase enterprise-level React patterns, data visualization, and role-based access control.

🔗 **Live Demo**: [https://ncba-demo.vercel.app](https://ncba-demo.vercel.app)  
👨‍💻 **Portfolio**: [vmulinge.dev](https://vmulinge.dev)

---

## Overview

This project simulates the frontend interface of a digital lending platform handling thousands of loan applications, customer records, and compliance audit trails. It was designed to mirror the architecture I implemented at **Tangazoletu Limited** for **NCBA Bank**, where Spring Boot microservices powered the backend.

**This is a frontend-only demo** — all data is generated via mock API routes with realistic Kenyan financial context:
- KES currency formatting
- M-Pesa style mobile numbers (`2547XX XXX XXX`)
- Kenyan names and ID numbers
- Seasonal disbursement trends (school fees in Jan/Apr, planting season in Aug)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS 4 + shadcn/ui |
| State Management | TanStack Query (React Query) |
| Data Visualization | Recharts |
| Tables | TanStack Table v8 |
| Virtualization | TanStack Virtual |
| Forms | React Hook Form + Zod |
| Notifications | Sonner |
| Icons | Lucide React |
| Animations | Framer Motion |

---

## Demo Credentials

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **ADMIN** | `admin@ncba.demo` | `admin123` | Full system access |
| **MANAGER** | `manager@ncba.demo` | `manager123` | Dashboard, Apps, Customers, Analytics, Audit |
| **LOAN OFFICER** | `officer@ncba.demo` | `officer123` | Dashboard, Apps, Customers |
| **AUDITOR** | `auditor@ncba.demo` | `auditor123` | Dashboard, Audit only |

> JWT tokens are stored **in memory only** (React Context) — on refresh, the session resets. This demonstrates secure token handling without localStorage vulnerabilities.

---

## Key Features

### Dashboard (`/`)
- 4 KPI cards with trend indicators (↑↓ vs last month)
- Recharts AreaChart: monthly disbursements (last 12 months)
- Recharts PieChart: risk distribution (LOW / MEDIUM / HIGH)
- Live activity feed polling every 10 seconds
- Quick action buttons: New Application, Export Report, View Audit

### Loan Applications (`/applications`)
- TanStack Table with sorting, filtering, pagination (25/50/100 rows)
- Column filters: Status dropdown, Risk dropdown, global search
- Export selected rows to CSV
- Row click → detail page with credit score ring and risk radar chart

### Application Detail (`/applications/[id]`)
- Credit score gauge (300-850) with color coding
- Risk profile radar chart (5 dimensions)
- Vertical timeline stepper showing status history
- **Role-aware actions**: Approve (Manager+), Reject (Manager+), Disburse (Admin only)

### Customer Directory (`/customers`)
- **Virtualized list** of 5,000 customers via `@tanstack/react-virtual`
- Debounced search (300ms) by name, phone, or ID
- Filters: KYC status, Employment type
- Profile detail with loan history mini-table

### Analytics (`/analytics`)
- ComposedChart: Disbursements vs Defaults (dual axis)
- BarChart: Top 5 loan purposes by volume
- LineChart: Average credit score trend (6 months)
- Date range picker: 30/90/365 days
- **Export to PNG** via `html-to-image`

### Audit Trail (`/audit`)
- Filter by date range, actor, action type
- Vertical timeline with role-colored badges
- Monospace IP addresses
- Export to CSV
- Auto-polling every 15 seconds

### Admin (`/admin`)
- User management table with mock Edit/Reset actions
- Role distribution pie chart
- System settings toggles (visual demo)

---

## Performance Optimizations

- `React.memo` on table rows and list items
- Virtualized rendering for 5,000 customer records
- Skeleton loaders on every async operation (no spinners)
- Lazy-loaded chart components
- Target Lighthouse scores: **90+ Performance**, **100 Accessibility**, **100 Best Practices**, **100 SEO**

---

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and log in with any demo account.

---

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Or connect your Git repository to Vercel for automatic deployments on push.

> **Note**: This project uses SSR API routes — do **not** use `output: 'export'`. Vercel handles serverless functions natively.

---

## Architecture

```
┌─────────────────────────────────────────┐
│           Next.js Frontend              │
│  (React 19 + TypeScript + Tailwind)     │
└─────────────────────────────────────────┘
                   │
    ┌──────────────┼──────────────┐
    ▼              ▼              ▼
┌────────┐   ┌──────────┐   ┌──────────┐
│  Auth  │   │  Mock    │   │  Charts  │
│Context │   │  API     │   │ Recharts │
│(Memory)│   │  Routes  │   │          │
└────────┘   └──────────┘   └──────────┘
                   │
         ┌─────────┴─────────┐
         ▼                   ▼
    ┌──────────┐       ┌──────────┐
    │  Mock    │       │  TanStack│
    │  Data    │       │  Query   │
    │  (500/5K │       │  (Cache) │
    │  /200)   │       │          │
    └──────────┘       └──────────┘
```

**Production Backend** (simulated):  
In the real system at Tangazoletu Limited, these API routes connected to:
- **Spring Boot** microservices (Loan, Customer, Audit, Auth)
- **PostgreSQL** databases per microservice
- **Redis** caching layer for session and query optimization
- **Kafka** event streaming for audit trail propagation

---

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/mock/           # Mock API route handlers
│   ├── (routes)/           # Protected app routes
│   ├── login/              # Auth page
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Dashboard
├── components/
│   ├── ui/                 # shadcn/ui primitives
│   ├── layout/             # Sidebar, TopBar, Breadcrumb
│   ├── dashboard/          # KPI, Charts, Activity
│   ├── applications/       # Table, Timeline, Score Ring
│   ├── customers/          # Virtualized List, Risk Radar
│   ├── audit/              # Audit Timeline
│   └── auth/               # RoleGate
├── hooks/                  # useAuth, useLoans, useCustomers, useAudit, useAnalytics
├── lib/
│   ├── utils.ts            # cn(), formatKES(), formatDate()
│   ├── mockData.ts         # 500 loans, 5000 customers, 200 audits
│   └── roles.ts            # RBAC constants and permissions
└── types/                  # TypeScript interfaces
```

---

## Screenshots

| Dashboard | Applications | Audit Trail |
|-----------|-------------|-------------|
| *Screenshot placeholder* | *Screenshot placeholder* | *Screenshot placeholder* |

---

## License

MIT — Built for portfolio demonstration purposes.

---

> **Built by [Victor Mulinge](https://vmulinge.dev)** — Software Engineer specializing in fintech systems, microservices architecture, and enterprise frontend development.
