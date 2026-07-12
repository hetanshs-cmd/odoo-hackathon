import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { vehiclesService } from "../services/vehicles";
import { useToast } from "./use-toast";
import type { CreateVehiclePayload, UpdateVehiclePayload, UpdateVehicleStatusPayload } from "../schemas/vehicle.schema";

export function useVehicles() {
  return useQuery({
    queryKey: ["vehicles"],
    queryFn: async () => {
      const response = await vehiclesService.getAll();
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
  });
}

export function useAvailableVehicles() {
  return useQuery({
    queryKey: ["vehicles", "available"],
    queryFn: async () => {
      const response = await vehiclesService.getAvailable();
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
  });
}

export function useVehicle(id: number) {
  return useQuery({
    queryKey: ["vehicles", id],
    queryFn: async () => {
      const response = await vehiclesService.getById(id);
      if (!response.success) throw new Error(response.message);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateVehicle() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateVehiclePayload) => vehiclesService.create(data),
    onSuccess: (response) => {
      if (response.success) {
        toast({ title: "Success", description: "Vehicle created successfully." });
        queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create vehicle",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateVehicle() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateVehiclePayload }) =>
      vehiclesService.update(id, data),
    onSuccess: (response) => {
      if (response.success) {
        toast({ title: "Success", description: "Vehicle updated successfully." });
        queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update vehicle",
        variant: "destructive",
      });
    },
  });
}

export function useUpdateVehicleStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateVehicleStatusPayload }) =>
      vehiclesService.updateStatus(id, data),
    onSuccess: (response) => {
      if (response.success) {
        toast({ title: "Success", description: "Vehicle status updated." });
        queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      }
    },
  });
}

export function useDeleteVehicle() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => vehiclesService.delete(id),
    onSuccess: (response) => {
      if (response.success) {
        toast({ title: "Success", description: "Vehicle deleted successfully." });
        queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete vehicle",
        variant: "destructive",
      });
    },
  });
}
