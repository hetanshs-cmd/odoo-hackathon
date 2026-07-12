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
import { expensesApi } from "@/api/expenses";
import { createExpenseSchema, type CreateExpensePayload } from "./schemas";

export function ExpenseForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = useState("");

  const { data: response } = useQuery({
    queryKey: ["vehicles"],
    queryFn: vehiclesService.getAll,
  });

  const availableVehicles = (response?.data || []).filter((v: any) => v.status !== "OUT_OF_SERVICE");

  const form = useForm<CreateExpensePayload>({
    resolver: zodResolver(createExpenseSchema) as any,
    defaultValues: {
      vehicleId: "" as unknown as number,
      type: "",
      amount: "" as unknown as number,
      date: new Date().toISOString().split("T")[0],
    },
  });

  const createMutation = useMutation({
    mutationFn: expensesApi.create,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Expense recorded successfully",
      });
      form.reset({
        vehicleId: undefined as any,
        type: "",
        amount: "" as any,
        date: new Date().toISOString().split("T")[0],
      });
      setErrorMsg("");
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
    onError: (err: any) => {
      setErrorMsg(err?.response?.data?.message || err.message || "Failed to log expense");
    },
  });

  const onSubmit = (data: CreateExpensePayload) => {
    createMutation.mutate(data);
  };

  return (
    <div className="rounded-lg border p-6 bg-card text-card-foreground shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Add Expense</h3>
        <p className="text-sm text-muted-foreground">Record toll, parking, or misc expenses.</p>
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
                     {availableVehicles.map((v: any) => (
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
            name="type"
            render={({ field }) => (
               <FormItem>
                 <FormLabel>Expense Type</FormLabel>
                 <FormControl>
                   <Input placeholder="e.g. Toll, Parking" {...field} />
                 </FormControl>
                 <FormMessage />
               </FormItem>
            )}
          />

          <FormField
            control={form.control as any}
            name="amount"
            render={({ field }) => (
               <FormItem>
                 <FormLabel>Amount ($)</FormLabel>
                 <FormControl>
                   <Input type="number" step="0.01" min="0" placeholder="0.00" {...field} />
                 </FormControl>
                 <FormMessage />
               </FormItem>
            )}
          />

          <FormField
            control={form.control as any}
            name="date"
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
            Save Expense
          </Button>
        </form>
      </Form>
    </div>
  );
}
