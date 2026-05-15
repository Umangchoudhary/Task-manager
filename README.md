# Team Task Manager (Full-Stack)

A complete production-ready full-stack SaaS application built with the MERN stack (MongoDB, Express, React, Node.js).

## Key Features
- **Authentication:** JWT-based signup/login with roles.
- **Role-Based Access Control (RBAC):** Admin vs. Member roles.
- **Project Management:** Create projects and manage team members (Admin only).
- **Task Management:** Create, assign, and track task status.
- **Dashboard:** Rich analytics with real-time stats and charts.
- **Premium UI:** Glassmorphism design with Tailwind CSS and Framer Motion.

## Setup Instructions

### Backend
1. `cd backend`
2. `npm install`
3. Update `.env` with your `MONGO_URI` and `JWT_SECRET`.
4. (Optional) Run `npm run seed` to populate the database with demo data.
5. Run `npm run dev`.

### Frontend
1. `cd frontend`
2. `npm install`
3. Run `npm run dev`.

## Default Credentials (after seeding)
- **Admin:** admin@example.com / password123
- **Member:** member@example.com / password123

## Deployment
- **Backend:** Deployed using Railway (config included in `backend/railway.json`).
- **Frontend:** Deployed using Vercel (config included in `frontend/vercel.json`).

*Built with ❤️ by Antigravity*
