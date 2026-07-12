import { api } from "../services/api";
import type { ApiResponse } from "../types";
import type { ExpenseRecord, CreateExpensePayload, VehicleSummary } from "../components/fuel-expenses/schemas";

export const expensesApi = {
  getAll: async () => {
    const res = await api.get<ApiResponse<ExpenseRecord[]>>("/expenses");
    return res.data;
  },

  create: async (data: CreateExpensePayload) => {
    // Map form payload to backend DTO
    const payload = {
      vehicleId: data.vehicleId,
      category: data.type,
      amount: data.amount,
      incurredAt: data.date,
    };
    const res = await api.post<ApiResponse<ExpenseRecord>>("/expenses", payload);
    return res.data;
  },

  getSummary: async () => {
    const res = await api.get<ApiResponse<VehicleSummary[]>>("/expenses/summary");
    return res.data;
  }
};
