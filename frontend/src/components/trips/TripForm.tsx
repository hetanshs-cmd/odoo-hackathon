import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "../../services/api";
import { useVehicles } from "../../hooks/useVehicles";
import { useDrivers } from "../../hooks/useDrivers";

interface TripFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function TripForm({ onSuccess, onCancel }: TripFormProps) {
  const queryClient = useQueryClient();
  const { data: vehicles } = useVehicles();
  const { data: drivers } = useDrivers();
  
  const [formData, setFormData] = useState({
    source: "",
    destination: "",
    cargoWeight: "",
    plannedDistance: "",
    vehicleId: "",
    driverId: "",
  });
  
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await api.post("/trips", {
        ...formData,
        cargoWeight: Number(formData.cargoWeight),
        plannedDistance: Number(formData.plannedDistance),
        vehicleId: Number(formData.vehicleId),
        driverId: Number(formData.driverId),
      });
      
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create trip");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-sm font-medium rounded-md bg-destructive/10 text-destructive">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="source">Source (Origin)</Label>
        <Input
          id="source"
          name="source"
          value={formData.source}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="destination">Destination</Label>
        <Input
          id="destination"
          name="destination"
          value={formData.destination}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cargoWeight">Cargo Weight (kg)</Label>
          <Input
            id="cargoWeight"
            name="cargoWeight"
            type="number"
            value={formData.cargoWeight}
            onChange={handleChange}
            required
            min="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="plannedDistance">Planned Distance (km)</Label>
          <Input
            id="plannedDistance"
            name="plannedDistance"
            type="number"
            value={formData.plannedDistance}
            onChange={handleChange}
            required
            min="0"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="vehicleId">Assign Vehicle</Label>
        <select
          id="vehicleId"
          name="vehicleId"
          value={formData.vehicleId}
          onChange={handleChange}
          required
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Select a vehicle...</option>
          {vehicles?.map(v => (
            <option key={v.id} value={v.id}>{v.registrationNumber} - {v.nameModel}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="driverId">Assign Driver</Label>
        <select
          id="driverId"
          name="driverId"
          value={formData.driverId}
          onChange={handleChange}
          required
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Select a driver...</option>
          {drivers?.map(d => (
            <option key={d.id} value={d.id}>{d.user?.name} ({d.licenseNumber})</option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Trip"}
        </Button>
      </div>
    </form>
  );
}
