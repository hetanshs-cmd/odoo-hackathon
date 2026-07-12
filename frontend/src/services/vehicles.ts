import { api } from "./api";
import type { ApiResponse } from "../types";
import type { Vehicle } from "../types/vehicle";
import type { CreateVehiclePayload, UpdateVehiclePayload, UpdateVehicleStatusPayload } from "../schemas/vehicle.schema";

export const vehiclesService = {
  getAll: async () => {
    const res = await api.get<ApiResponse<Vehicle[]>>("/vehicles");
    return res.data;
  },
  
  getAvailable: async () => {
    const res = await api.get<ApiResponse<Vehicle[]>>("/vehicles/available");
    return res.data;
  },

  getById: async (id: number) => {
    const res = await api.get<ApiResponse<Vehicle>>(`/vehicles/${id}`);
    return res.data;
  },

  create: async (data: CreateVehiclePayload) => {
    const res = await api.post<ApiResponse<Vehicle>>("/vehicles", data);
    return res.data;
  },

  update: async (id: number, data: UpdateVehiclePayload) => {
    const res = await api.put<ApiResponse<Vehicle>>(`/vehicles/${id}`, data);
    return res.data;
  },

  updateStatus: async (id: number, data: UpdateVehicleStatusPayload) => {
    const res = await api.patch<ApiResponse<Vehicle>>(`/vehicles/${id}/status`, data);
    return res.data;
  },

  delete: async (id: number) => {
    const res = await api.delete<ApiResponse<null>>(`/vehicles/${id}`);
    return res.data;
  }
};
