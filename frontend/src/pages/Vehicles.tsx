import { useState } from "react";
import { VehicleList } from "../components/vehicles/VehicleList";
import { VehicleForm } from "../components/vehicles/VehicleForm";
import { Button } from "../components/ui/button";
import { useAuth } from "../contexts/AuthContext";

export default function Vehicles() {
  const [isAdding, setIsAdding] = useState(false);
  const { user } = useAuth();

  // Only FleetManagers should be allowed to add vehicles
  const canAddVehicle = user?.role === "FleetManager";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold md:text-2xl">Vehicles</h1>
          <p className="text-sm text-muted-foreground">
            Manage your fleet of vehicles, capacities, and statuses.
          </p>
        </div>
        {canAddVehicle && (
          <Button onClick={() => setIsAdding(!isAdding)}>
            {isAdding ? "Cancel" : "Add Vehicle"}
          </Button>
        )}
      </div>

      {isAdding ? (
        <div className="max-w-xl border rounded-lg p-6 bg-card shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Register New Vehicle</h2>
          <VehicleForm onSuccess={() => setIsAdding(false)} />
        </div>
      ) : (
        <VehicleList />
      )}
    </div>
  );
}
