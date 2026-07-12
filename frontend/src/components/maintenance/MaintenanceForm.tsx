import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { vehiclesService } from "@/services/vehicles";
import { maintenanceApi } from "@/api/maintenance";
import { createMaintenanceSchema, type CreateMaintenancePayload } from "@/schemas/maintenance.schema";

export function MaintenanceForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = useState("");

  const { data: response } = useQuery({
    queryKey: ["vehicles"],
    queryFn: vehiclesService.getAll,
  });

  // Filter out OUT_OF_SERVICE (Retired)
  const availableVehicles = (response?.data || []).filter(v => v.status !== "OUT_OF_SERVICE");

  const form = useForm<CreateMaintenancePayload>({
    resolver: zodResolver(createMaintenanceSchema) as any,
    defaultValues: {
      vehicleId: "" as unknown as number,
      description: "",
      cost: "" as unknown as number,
      startedAt: new Date().toISOString().split("T")[0],
    },
  });

  const createMutation = useMutation({
    mutationFn: maintenanceApi.create,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Maintenance record logged successfully",
      });
      form.reset({
        vehicleId: undefined as any,
        description: "",
        cost: 0,
        startedAt: new Date().toISOString().split("T")[0],
      });
      setErrorMsg("");
      queryClient.invalidateQueries({ queryKey: ["maintenance"] });
      // Invalidate vehicles since one is now IN_SHOP
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
    onError: (err: any) => {
      setErrorMsg(err?.response?.data?.message || err.message || "Failed to log maintenance record");
    },
  });

  const onSubmit = (data: CreateMaintenancePayload) => {
    createMutation.mutate(data);
  };

  return (
    <div className="rounded-lg border p-6 bg-card text-card-foreground shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Log Service Record</h3>
        <p className="text-sm text-muted-foreground">Record new maintenance or repair work.</p>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 bg-destructive/15 text-destructive rounded-md text-sm">
          {errorMsg}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control as any}
            name="vehicleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle</FormLabel>
                <FormControl>
                  <select
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...field}
                  >
                    <option value="" disabled>Select a vehicle...</option>
                    {availableVehicles.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.registrationNumber} - {v.nameModel}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control as any}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Type</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Oil change, Brake inspection" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control as any}
            name="cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cost ($)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" min="0" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control as any}
            name="startedAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={createMutation.isPending}>
            {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Record
          </Button>
        </form>
      </Form>
    </div>
  );
}
