import { useQuery } from "@tanstack/react-query";
import { expensesApi } from "@/api/expenses";
import { Skeleton } from "@/components/ui/skeleton";
import type { VehicleSummary } from "./schemas";

export function SummaryTable() {
  const { data: response, isLoading } = useQuery({
    queryKey: ["fuel-expenses-summary"],
    queryFn: expensesApi.getSummary,
  });

  if (isLoading) {
    return <div className="space-y-2"><Skeleton className="h-8 w-full" /><Skeleton className="h-20 w-full" /></div>;
  }

  const summaries: VehicleSummary[] = response?.data || [];

  if (summaries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg border-dashed">
        <h3 className="text-xl font-bold tracking-tight text-muted-foreground">No vehicle operational data found</h3>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-muted text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Vehicle</th>
            <th className="px-4 py-3 font-medium text-right">Fuel Cost</th>
            <th className="px-4 py-3 font-medium text-right">Maintenance Cost</th>
            <th className="px-4 py-3 font-medium text-right font-bold">Total Operational Cost</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {summaries.map((summary) => (
            <tr key={summary.vehicleId} className="hover:bg-muted/50">
              <td className="px-4 py-3">
                {summary.registrationNumber} - {summary.nameModel}
              </td>
              <td className="px-4 py-3 text-right">${Number(summary.totalFuelCost).toFixed(2)}</td>
              <td className="px-4 py-3 text-right">${Number(summary.totalMaintenanceCost).toFixed(2)}</td>
              <td className="px-4 py-3 text-right font-bold">${Number(summary.totalOperationalCost).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
