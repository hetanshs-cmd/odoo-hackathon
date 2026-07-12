import { useDrivers } from "../hooks/useDrivers";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { UserCircle } from "lucide-react";

export default function Drivers() {
  const { data: drivers, isLoading, isError, error } = useDrivers();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 rounded-md bg-destructive/10 text-destructive text-sm font-medium">
        Error loading drivers: {(error as Error).message}
      </div>
    );
  }

  if (!drivers || drivers.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">Drivers</h1>
        </div>
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm p-8 text-center h-[400px]">
          <div className="flex flex-col items-center gap-1">
            <h3 className="text-2xl font-bold tracking-tight">No drivers found</h3>
            <p className="text-sm text-muted-foreground">
              You don't have any drivers registered yet.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Drivers</h1>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {drivers.map((driver) => (
          <Card key={driver.id}>
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <UserCircle className="w-8 h-8 text-muted-foreground" />
              <div className="flex-1">
                <CardTitle className="text-base">{driver.user?.name || "Unknown Driver"}</CardTitle>
                <div className="text-sm text-muted-foreground">{driver.user?.email}</div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mt-4 text-sm">
                <div className="font-medium text-muted-foreground">
                  License: <span className="text-foreground">{driver.licenseNumber}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  driver.status === "AVAILABLE" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                }`}>
                  {driver.status.replace(/_/g, " ")}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
