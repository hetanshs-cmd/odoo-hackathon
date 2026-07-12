import { api } from "../services/api";
import type { ApiResponse } from "../types";
import type { FuelLogRecord, CreateFuelLogPayload } from "../components/fuel-expenses/schemas";

export const fuelLogsApi = {
  getAll: async () => {
    const res = await api.get<ApiResponse<FuelLogRecord[]>>("/fuel-logs");
    return res.data;
  },

  create: async (data: CreateFuelLogPayload) => {
    // Map form payload to backend DTO
    const payload = {
      vehicleId: data.vehicleId,
      fuelQuantity: data.liters,
      cost: data.cost,
      loggedAt: data.date,
    };
    const res = await api.post<ApiResponse<FuelLogRecord>>("/fuel-logs", payload);
    return res.data;
  },
};
