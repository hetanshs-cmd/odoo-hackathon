import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createVehicleSchema, type CreateVehiclePayload } from "../../schemas/vehicle.schema";
import { useCreateVehicle } from "../../hooks/useVehicles";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

export function VehicleForm({ onSuccess }: { onSuccess?: () => void }) {
  const { mutateAsync: createVehicle, isPending } = useCreateVehicle();

  const form = useForm<CreateVehiclePayload>({
    resolver: zodResolver(createVehicleSchema),
    defaultValues: {
      registrationNumber: "",
      nameModel: "",
      type: "",
      maxLoadCapacity: 0,
      acquisitionCost: 0,
    },
  });

  const onSubmit = async (values: CreateVehiclePayload) => {
    try {
      await createVehicle(values);
      form.reset();
      onSuccess?.();
    } catch (error) {
      // Error is handled by the hook's toast
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="registrationNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Registration Number</FormLabel>
              <FormControl>
                <Input placeholder="e.g. ABC-1234" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nameModel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Make / Model</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Ford Transit" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vehicle Type</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Van, Truck" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="maxLoadCapacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Load (kg)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="acquisitionCost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Acquisition Cost</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Saving..." : "Save Vehicle"}
        </Button>
      </form>
    </Form>
  );
}
