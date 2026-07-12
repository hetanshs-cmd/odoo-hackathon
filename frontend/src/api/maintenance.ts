import { api } from "../services/api";
import type { ApiResponse } from "../types";
import type { MaintenanceRecord, CreateMaintenancePayload } from "../schemas/maintenance.schema";

export const maintenanceApi = {
  getAll: async () => {
    const res = await api.get<ApiResponse<MaintenanceRecord[]>>("/maintenance");
    return res.data;
  },

  create: async (data: CreateMaintenancePayload) => {
    const res = await api.post<ApiResponse<MaintenanceRecord>>("/maintenance", data);
    return res.data;
  },

  closeRecord: async (id: number) => {
    const res = await api.patch<ApiResponse<MaintenanceRecord>>(`/maintenance/${id}/close`);
    return res.data;
  },
};
