import { api } from "./api";

export interface DashboardStats {
  vehicles: { total: number; available: number; onTrip: number };
  drivers: { total: number; available: number; onTrip: number };
  trips: { active: number; completed: number };
  maintenance: { active: number };
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get<{ success: boolean; data: DashboardStats }>("/dashboard/stats");
    return response.data.data;
  },
};
