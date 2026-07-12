import { useQuery } from "@tanstack/react-query";
import { fuelLogsApi } from "@/api/fuelLogs";
import { Skeleton } from "@/components/ui/skeleton";
import type { FuelLogRecord } from "./schemas";

export function FuelLogsTable() {
  const { data: response, isLoading } = useQuery({
    queryKey: ["fuel-logs"],
    queryFn: fuelLogsApi.getAll,
  });

  if (isLoading) {
    return <div className="space-y-2"><Skeleton className="h-8 w-full" /><Skeleton className="h-20 w-full" /></div>;
  }

  const fuelLogs: FuelLogRecord[] = response?.data || [];

  if (fuelLogs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg border-dashed">
        <h3 className="text-xl font-bold tracking-tight text-muted-foreground">No fuel logs found</h3>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-muted text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium">Vehicle</th>
            <th className="px-4 py-3 font-medium">Quantity (L)</th>
            <th className="px-4 py-3 font-medium">Cost</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {fuelLogs.map((log) => (
            <tr key={log.id} className="hover:bg-muted/50">
              <td className="px-4 py-3">{new Date(log.loggedAt).toLocaleDateString()}</td>
              <td className="px-4 py-3">
                {log.vehicle.registrationNumber} - {log.vehicle.nameModel}
              </td>
              <td className="px-4 py-3">{log.fuelQuantity}</td>
              <td className="px-4 py-3">${Number(log.cost).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
