# ProManage — Project Management System

A full-stack, role-based Project Management System built with React 18, TypeScript, Vite, Tailwind CSS, Node.js/Express, PostgreSQL, and Prisma ORM.

---

## 📁 Project Structure

```
project-management-system/
├── frontend/                  # React + Vite + Tailwind CSS
│   └── src/
│       ├── components/
│       │   ├── auth/          # PrivateRoute, role guards
│       │   ├── layout/        # Sidebar, Topbar, AppLayout
│       │   └── files/         # FileCard
│       ├── lib/api.ts         # Axios client + interceptors
│       ├── pages/             # Dashboard, Projects, Clients, Tasks, Team
│       └── store/             # Redux Toolkit + auth slice
│
├── backend/                   # Node.js + Express + TypeScript
│   ├── prisma/
│   │   ├── schema.prisma      # Full DB schema (all 5 modules)
│   │   └── seed.ts            # Demo data seed
│   └── src/
│       ├── controllers/       # auth, admin, client, project, task, file
│       ├── middleware/        # auth, role, activity logger
│       ├── routes/            # All API route files
│       └── utils/             # jwt.ts
│
└── package.json               # Root workspace with concurrently
```

---

## 🚀 Quick Start

### 1. Prerequisites

- **Node.js** ≥ 18
- **PostgreSQL** ≥ 14 running locally

### 2. Clone & Install

```bash
git clone <your-repo>
cd project-management-system
npm install          # installs root concurrently
npm run setup        # installs both backend & frontend deps
```

### 3. Configure Backend Environment

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env`:

```env
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/project_management"
JWT_SECRET="your_very_long_secret_here"
JWT_REFRESH_SECRET="your_refresh_secret_here"
PORT=5000
CLIENT_URL="http://localhost:5173"
```

### 4. Database Setup

Create the database in PostgreSQL:

```sql
CREATE DATABASE project_management;
```

Run migrations and seed:

```bash
cd backend
npx prisma migrate dev --name init
npm run seed
```

### 5. Start Development

From the **root** directory:

```bash
npm run dev
```

This runs both servers concurrently:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api

---

## 🔐 Demo Credentials (after seeding)

| Role      | Email                  | Password       |
|-----------|------------------------|----------------|
| Admin     | admin@promange.io      | password123    |
| Manager   | manager@promange.io    | password123    |
| Developer | dev@promange.io        | password123    |
| Sales     | sales@promange.io      | password123    |

---

## 🎨 Color Theme

| Token     | Color     | Usage                              |
|-----------|-----------|------------------------------------|
| Primary   | `#534AB7` | Sidebar, nav, buttons, badges      |
| Success   | `#1D9E75` | Live stage, completed, active      |
| Warning   | `#BA7517` | Delays, medium priority, deadlines |
| Danger    | `#D85A30` | Overdue, critical, errors          |
| Info      | `#378ADD` | Developer role, info states        |
| Neutral   | `#888780` | Secondary text, borders            |
| BG        | `#F1EFE8` | Page background                    |

---

## 🏗️ Modules

| Module              | Status | Features |
|---------------------|--------|----------|
| Auth & Users        | ✅     | JWT, refresh tokens, 4 roles, activity log |
| Client Management   | ✅     | CRUD, communications timeline, attachments |
| Project Management  | ✅     | 6-stage pipeline, team, notes, filters     |
| Task & Workflow     | ✅     | Kanban DnD, subtasks, comments, notifications |
| File Storage        | ✅     | Upload, versioning, folder tree, role access |
| Dashboard           | ✅     | Stats, Recharts bar chart, deadlines, activity |
| Reports             | 🔜    | Phase 4 — CSV/PDF export                   |
| Email Notifications | 🔜    | Phase 4 — Nodemailer                       |
| Mobile Responsive   | 🔜    | Phase 4 — Sidebar hamburger                |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint          | Description       |
|--------|-------------------|-------------------|
| POST   | /api/auth/login   | Login             |
| POST   | /api/auth/logout  | Logout            |
| POST   | /api/auth/refresh | Refresh tokens    |
| GET    | /api/auth/me      | Current user      |

### Admin (Admin only)
| Method | Endpoint                   | Description      |
|--------|----------------------------|------------------|
| GET    | /api/admin/users           | List users       |
| POST   | /api/admin/users           | Create user      |
| PATCH  | /api/admin/users/:id       | Update user      |
| DELETE | /api/admin/users/:id       | Delete user      |
| GET    | /api/admin/activity-logs   | Activity feed    |

### Projects
| Method | Endpoint                   | Description        |
|--------|----------------------------|--------------------|
| GET    | /api/projects              | List (role-scoped) |
| POST   | /api/projects              | Create             |
| GET    | /api/projects/:id          | Detail             |
| PATCH  | /api/projects/:id          | Update             |
| PATCH  | /api/projects/:id/stage    | Move stage         |
| GET    | /api/projects/:id/team     | Team members       |
| POST   | /api/projects/:id/team     | Add member         |

### Tasks
| Method | Endpoint                         | Description      |
|--------|----------------------------------|------------------|
| GET    | /api/projects/:id/tasks          | Project tasks    |
| POST   | /api/projects/:id/tasks          | Create task      |
| GET    | /api/tasks/:id                   | Task detail      |
| PATCH  | /api/tasks/:id/status            | Update status    |
| POST   | /api/tasks/:id/subtasks          | Add subtask      |
| POST   | /api/tasks/:id/comments          | Add comment      |
| GET    | /api/my-tasks                    | My tasks         |
| GET    | /api/notifications               | Notifications    |
| PATCH  | /api/notifications/read-all      | Mark all read    |

---

## 🛠️ Tech Stack

| Layer      | Technology                                        |
|------------|---------------------------------------------------|
| Frontend   | React 18, TypeScript, Vite, Tailwind CSS v4       |
| State      | Redux Toolkit                                      |
| Routing    | React Router v6                                   |
| Charts     | Recharts                                          |
| DnD        | @dnd-kit (Kanban board)                           |
| Backend    | Node.js, Express, TypeScript                      |
| Database   | PostgreSQL + Prisma ORM v7                        |
| Auth       | JWT (access 15m + refresh 7d) + bcrypt            |
| Files      | Multer + local disk                               |
| Dev tools  | ts-node-dev, concurrently                         |
