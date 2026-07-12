import { useState } from "react";
import { useTrips, useUpdateTripStatus } from "../hooks/useTrips";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Route, MapPin, MapPinned, Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import { TripForm } from "../components/trips/TripForm";
import { useAuth } from "../contexts/AuthContext";

export default function Trips() {
  const { data: trips, isLoading, isError, error } = useTrips();
  const updateStatus = useUpdateTripStatus();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { user } = useAuth();

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
        Error loading trips: {(error as Error).message}
      </div>
    );
  }

  if (!trips || trips.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">Trips</h1>
        </div>
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm p-8 text-center h-[400px]">
          <div className="flex flex-col items-center gap-1">
            <h3 className="text-2xl font-bold tracking-tight">No trips found</h3>
            <p className="text-sm text-muted-foreground">
              You don't have any trips registered yet.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Trips</h1>
        {user?.role === "FleetManager" && (
          <Button onClick={() => setIsFormOpen(!isFormOpen)} className="gap-2">
            {isFormOpen ? "Cancel" : <><Plus className="w-4 h-4" /> Add Trip</>}
          </Button>
        )}
      </div>

      {isFormOpen ? (
        <div className="max-w-xl border rounded-lg p-6 bg-card shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Create New Trip</h2>
          <TripForm onSuccess={() => setIsFormOpen(false)} onCancel={() => setIsFormOpen(false)} />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {trips.map((trip) => (
            <Card key={trip.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Route className="w-5 h-5 text-primary" />
                  <CardTitle className="text-base">Trip #{trip.id}</CardTitle>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  trip.status === "COMPLETED" ? "bg-green-100 text-green-800" :
                  trip.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-800" : 
                  "bg-gray-100 text-gray-800"
                }`}>
                  {trip.status.replace(/_/g, " ")}
                </span>
              </div>
              <CardDescription className="mt-2">
                Vehicle: {trip.vehicle?.registrationNumber || "N/A"} • Driver: {trip.driver?.user?.name || "Unassigned"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mt-2">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Origin</p>
                    <p className="text-sm text-muted-foreground">{trip.source}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPinned className="w-4 h-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Destination</p>
                    <p className="text-sm text-muted-foreground">{trip.destination}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t text-sm">
                  <div>
                    <span className="text-muted-foreground">Distance:</span>{" "}
                    <span className="font-medium">{trip.plannedDistance} km</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Cargo:</span>{" "}
                    <span className="font-medium">{trip.cargoWeight} kg</span>
                  </div>
                </div>
                
                {user?.role === "FleetManager" && trip.status !== "COMPLETED" && (
                  <div className="mt-4 pt-4 border-t flex justify-end">
                    <Button 
                      size="sm"
                      onClick={() => updateStatus.mutate({ 
                        id: trip.id, 
                        status: trip.status === "DRAFT" ? "IN_PROGRESS" : "COMPLETED" 
                      })}
                      disabled={updateStatus.isPending}
                    >
                      {trip.status === "DRAFT" ? "Start Trip" : "Complete Trip"}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      )}
    </div>
  );
}
