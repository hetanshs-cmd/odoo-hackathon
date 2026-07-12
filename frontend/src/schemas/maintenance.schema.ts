import { z } from "zod";

export const createMaintenanceSchema = z.object({
  vehicleId: z.coerce.number().int().positive("Vehicle is required"),
  description: z.string().min(1, "Description is required"),
  cost: z.coerce.number().nonnegative("Cost must be non-negative"),
  startedAt: z.string().optional(),
});

export type CreateMaintenancePayload = z.infer<typeof createMaintenanceSchema>;

export type MaintenanceRecord = {
  id: number;
  vehicleId: number;
  description: string;
  cost: number;
  status: "SCHEDULED" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  startedAt: string;
  closedAt: string | null;
  createdAt: string;
  updatedAt: string;
  vehicle: {
    registrationNumber: string;
    nameModel: string;
  };
};
