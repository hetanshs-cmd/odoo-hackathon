# TransitOps — Fleet Management System (Odoo Hackathon)

## Problem Solved
TransitOps solves the fragmentation and inefficiency in logistics fleet management. It provides a centralized dashboard to track vehicles, assign drivers to trips, monitor maintenance schedules, and calculate fuel/expense overheads in real time, drastically reducing operational blindspots and communication delays between managers and drivers.

## Features
- **Role-Based Access Control (RBAC):** Distinct dashboards and permissions for Fleet Managers, Drivers, Safety Officers, and Financial Analysts.
- **Vehicle Registry:** Track vehicle status (Available, On Trip, In Shop), capacity, and odometer readings.
- **Trip Management:** Dispatch drivers, assign vehicles, and track trip status from Draft to Completed.
- **Driver Profiles:** Manage driver statuses, licenses, and availability.
- **Dashboard & Analytics:** Real-time overview of active trips, available vehicles, and maintenance counts.
- **Maintenance Logging:** Track vehicle maintenance records and service costs.
- **Fuel & Expenses:** Log fuel consumption and operational expenses for each vehicle.
*(Upcoming: Financial Reports)*
## Local Setup

Follow these steps to run the project locally. You will need Node.js and PostgreSQL installed.

```bash
# 1. Clone the repository
git clone https://github.com/hetanshs-cmd/odoo-hackathon.git
cd odoo-hackathon

# 2. Setup the Backend
cd backend
npm install
# Create a .env file based on the environment variables section below
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run dev

# 3. Setup the Frontend (in a new terminal window)
cd ../frontend
npm install
# Create a .env file based on the environment variables section below
npm run dev
```

## Environment Variables

### Backend (`backend/.env`)
Create a `.env` file in the `backend` directory with the following structure:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/transitops
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
BCRYPT_ROUNDS=12
LOG_FORMAT=dev
```

### Frontend (`frontend/.env`)
Create a `.env` file in the `frontend` directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Architecture
```
Frontend (React + Vite + Tailwind) 
       ↓ REST HTTP requests
Backend (Node.js + Express + Prisma ORM) 
       ↓ 
Database (PostgreSQL)
```
The application uses a strict layered architecture (`Route → Controller → Service → Repository → DB`) to ensure clean separation of concerns and maintainability.

## Team & Ownership
| Name | Role | GitHub |
|------|------|--------|
| Hetansh | Backend / DB | @hetansh |
| Antigravity AI | Full Stack (React / Node / DB) | — |
