import { api } from "./api";

export interface Driver {
  id: number;
  userId: number;
  licenseNumber: string;
  status: "AVAILABLE" | "ON_TRIP" | "ON_LEAVE" | "SUSPENDED";
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export const driversService = {
  getAll: async (): Promise<Driver[]> => {
    const response = await api.get<{ success: boolean; data: Driver[] }>("/drivers");
    return response.data.data;
  },
};
