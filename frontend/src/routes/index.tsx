import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { RoleRoute } from "./RoleRoute";
import { DashboardLayout } from "../components/layout/DashboardLayout";

// Auth Pages
import Register from "../pages/auth/Register";
import VerifyRegister from "../pages/auth/VerifyRegister";
import Login from "../pages/auth/Login";
import VerifyLogin from "../pages/auth/VerifyLogin";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

// Main Pages
import Dashboard from "../pages/Dashboard";
import Vehicles from "../pages/Vehicles";
import Drivers from "../pages/Drivers";
import Trips from "../pages/Trips";
import Maintenance from "../pages/Maintenance";
import FuelExpenses from "../pages/FuelExpenses";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/register/verify",
    element: <VerifyRegister />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/login/verify",
    element: <VerifyLogin />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <DashboardLayout />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            element: <RoleRoute allowedRoles={["FleetManager", "SafetyOfficer", "FinancialAnalyst"]} />,
            children: [
              {
                path: "vehicles",
                element: <Vehicles />,
              },
            ]
          },
          {
            element: <RoleRoute allowedRoles={["FleetManager", "SafetyOfficer"]} />,
            children: [
              {
                path: "drivers",
                element: <Drivers />,
              },
              {
                path: "maintenance",
                element: <Maintenance />,
              },
            ]
          },
          {
            element: <RoleRoute allowedRoles={["FleetManager", "Driver", "SafetyOfficer"]} />,
            children: [
              {
                path: "trips",
                element: <Trips />,
              },
            ]
          },
          {
            element: <RoleRoute allowedRoles={["FleetManager", "FinancialAnalyst", "Driver"]} />,
            children: [
              {
                path: "fuel-expenses",
                element: <FuelExpenses />,
              },
            ]
          },
          {
            element: <RoleRoute allowedRoles={["FleetManager", "FinancialAnalyst", "SafetyOfficer"]} />,
            children: [
              {
                path: "reports",
                element: <Reports />,
              },
            ]
          },
          {
            element: <RoleRoute allowedRoles={["FleetManager"]} />,
            children: [
              {
                path: "settings",
                element: <Settings />,
              },
            ]
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
]);
