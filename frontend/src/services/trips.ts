import { api } from "./api";

export interface Trip {
  id: number;
  source: string;
  destination: string;
  status: "DRAFT" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  cargoWeight: number;
  plannedDistance: number;
  vehicleId: number;
  driverId: number;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  
  vehicle?: {
    id: number;
    registrationNumber: string;
    nameModel: string;
  };
  
  driver?: {
    id: number;
    user?: {
      name: string;
    };
  };
}

export const tripsService = {
  getAll: async (): Promise<Trip[]> => {
    const response = await api.get<{ success: boolean; data: Trip[] }>("/trips");
    return response.data.data;
  },
};
