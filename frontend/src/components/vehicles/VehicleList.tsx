import { useVehicles } from "../../hooks/useVehicles";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
// Removed unused Badge and Skeleton imports

export function VehicleList() {
  const { data: vehicles, isLoading, isError, error } = useVehicles();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-24 bg-muted" />
            <CardContent className="h-32 bg-muted/50 mt-4" />
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 rounded-md bg-destructive/10 text-destructive text-sm font-medium">
        Error loading vehicles: {(error as Error).message}
      </div>
    );
  }

  if (!vehicles || !Array.isArray(vehicles) || vehicles.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm p-8 text-center h-[400px]">
        <div className="flex flex-col items-center gap-1">
          <h3 className="text-2xl font-bold tracking-tight">No vehicles found</h3>
          <p className="text-sm text-muted-foreground">
            You don't have any vehicles registered yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {vehicles.map((vehicle) => (
        <Card key={vehicle.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{vehicle.registrationNumber}</CardTitle>
                <CardDescription>{vehicle.nameModel}</CardDescription>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                vehicle.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                vehicle.status === 'ON_TRIP' ? 'bg-blue-100 text-blue-800' :
                vehicle.status === 'IN_SHOP' ? 'bg-amber-100 text-amber-800' :
                'bg-red-100 text-red-800'
              }`}>
                {vehicle.status.replace(/_/g, ' ')}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div>
                <dt className="text-muted-foreground">Type</dt>
                <dd className="font-medium">{vehicle.type || 'N/A'}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Odometer</dt>
                <dd className="font-medium">{vehicle.odometer} km</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Max Load</dt>
                <dd className="font-medium">{vehicle.maxLoadCapacity} kg</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
