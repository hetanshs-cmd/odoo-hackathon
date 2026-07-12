import { api } from "./api";
import type { ApiResponse } from "../types";

// --- Revenue Report ---
export interface RevenueReport {
  totalRevenue: number;
  revenueByDate: Record<string, number>;
}

// --- Expenses Report ---
export interface ExpensesReport {
  totalExpenses: number;
  expensesByCategory: Record<string, number>;
}

// --- Fuel Report ---
export interface FuelVehicle {
  vehicleName: string;
  registration: string;
  totalFuel: number;
  totalCost: number;
  logCount: number;
}
export interface FuelReport {
  totalFuel: number;
  totalCost: number;
  byVehicle: FuelVehicle[];
}

// --- Trip Summary ---
export interface TripStatusItem {
  status: string;
  count: number;
}
export interface TripSummary {
  total: number;
  byStatus: TripStatusItem[];
  totalRevenue: number;
  totalDistance: number;
}

// --- Fleet Utilization ---
export interface FleetStatusItem {
  status: string;
  count: number;
  color: string;
}
export interface FleetUtilization {
  total: number;
  byStatus: FleetStatusItem[];
  totalAcquisitionCost: number;
}

// --- Driver Performance ---
export interface DriverPerformanceItem {
  name: string;
  safetyScore: number;
  status: string;
  completedTrips: number;
  totalDistance: number;
  totalRevenue: number;
  totalFuel: number;
  efficiency: number;
}

// --- Maintenance Report ---
export interface MaintenanceStatusItem {
  status: string;
  count: number;
}
export interface MaintenanceVehicle {
  vehicleName: string;
  registration: string;
  totalCost: number;
  recordCount: number;
  active: number;
  completed: number;
}
export interface MaintenanceReport {
  totalCost: number;
  totalRecords: number;
  byStatus: MaintenanceStatusItem[];
  byVehicle: MaintenanceVehicle[];
}

export const reportsService = {
  getRevenue: async (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    const res = await api.get<ApiResponse<RevenueReport>>(`/reports/revenue?${params}`);
    return res.data;
  },

  getExpenses: async (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    const res = await api.get<ApiResponse<ExpensesReport>>(`/reports/expenses?${params}`);
    return res.data;
  },

  getFuel: async () => {
    const res = await api.get<ApiResponse<FuelReport>>("/reports/fuel");
    return res.data;
  },

  getTrips: async () => {
    const res = await api.get<ApiResponse<TripSummary>>("/reports/trips");
    return res.data;
  },

  getFleet: async () => {
    const res = await api.get<ApiResponse<FleetUtilization>>("/reports/fleet");
    return res.data;
  },

  getDrivers: async () => {
    const res = await api.get<ApiResponse<DriverPerformanceItem[]>>("/reports/drivers");
    return res.data;
  },

  getMaintenance: async () => {
    const res = await api.get<ApiResponse<MaintenanceReport>>("/reports/maintenance");
    return res.data;
  },
};
