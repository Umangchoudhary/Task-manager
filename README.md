# Team Task Manager (Full-Stack)

A complete production-ready full-stack SaaS application built with the MERN stack (MongoDB, Express, React, Node.js).

## Key Features
- **Authentication:** JWT-based signup/login with roles.
- **Role-Based Access Control (RBAC):** Admin vs. Member roles.
- **Team Vault:** Securely store and manage project credentials (IDs, passwords, URLs) with one-click copy functionality.
- **Project Management:** Create projects and manage team members (Admin only).
- **Task Management:** Create, assign, and track task status.
- **Dashboard:** Rich analytics with real-time stats and charts (Bar Charts, Pie Charts).
- **Premium UI:** Modern glassmorphism design with Tailwind CSS, Framer Motion, and Lucide Icons.

## Setup Instructions

### Backend
1. `cd backend`
2. `npm install`
3. Update `.env` with your `MONGODB_URI` and `JWT_SECRET`.
4. (Optional) Run `npm run seed` to populate the database with demo data.
5. Run `npm run dev`.

### Frontend
1. `cd frontend`
2. `npm install`
3. Update `VITE_API_URL` in your environment to point to your backend.
4. Run `npm run dev`.

## Default Credentials (after seeding)
- **Admin:** admin@example.com / password123
- **Member:** member@example.com / password123

## Deployment
This application is optimized for deployment on **Railway**:

- **Backend:** Deployed as a Node.js service using `backend/railway.json`.
- **Frontend:** Deployed as a static service using `frontend/railway.json`.

### Production Environment Variables
| Service | Variable | Description |
|---------|----------|-------------|
| Backend | `MONGODB_URI` | MongoDB Atlas Connection String |
| Backend | `JWT_SECRET` | Secret key for token signing |
| Frontend | `VITE_API_URL` | Full URL of the backend API (e.g. `https://xxx.up.railway.app/api`) |
