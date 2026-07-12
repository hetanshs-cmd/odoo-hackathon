import { z } from "zod";

export const createFuelLogSchema = z.object({
  vehicleId: z.coerce.number().int().positive("Vehicle is required"),
  liters: z.coerce.number().nonnegative("Liters must be at least 0"),
  cost: z.coerce.number().nonnegative("Cost must be at least 0"),
  date: z.string().min(1, "Date is required"),
});

export const createExpenseSchema = z.object({
  vehicleId: z.coerce.number().int().positive("Vehicle is required"),
  type: z.string().min(1, "Type is required").max(50),
  amount: z.coerce.number().nonnegative("Amount must be at least 0"),
  date: z.string().min(1, "Date is required"),
});

export type CreateFuelLogPayload = z.infer<typeof createFuelLogSchema>;
export type CreateExpensePayload = z.infer<typeof createExpenseSchema>;

export interface FuelLogRecord {
  id: number;
  vehicleId: number;
  fuelQuantity: string | number; // Decimal comes back as string from api
  cost: string | number;
  loggedAt: string;
  vehicle: {
    registrationNumber: string;
    nameModel: string;
  };
}

export interface ExpenseRecord {
  id: number;
  vehicleId: number;
  category: string;
  amount: string | number;
  incurredAt: string;
  vehicle: {
    registrationNumber: string;
    nameModel: string;
  };
}

export interface VehicleSummary {
  vehicleId: number;
  registrationNumber: string;
  nameModel: string;
  totalFuelCost: number;
  totalMaintenanceCost: number;
  totalOperationalCost: number;
}
