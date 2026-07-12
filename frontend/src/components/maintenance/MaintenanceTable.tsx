import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { maintenanceApi } from "@/api/maintenance";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export function MaintenanceTable() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [closingId, setClosingId] = useState<number | null>(null);

  const { data: response, isLoading } = useQuery({
    queryKey: ["maintenance"],
    queryFn: maintenanceApi.getAll,
  });

  const records = response?.data || [];
  const canEdit = ["FleetManager", "SafetyOfficer"].includes(user?.role || "");

  const closeMutation = useMutation({
    mutationFn: maintenanceApi.closeRecord,
    onMutate: (id) => setClosingId(id),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Maintenance record closed successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["maintenance"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
    onError: (err: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: err?.response?.data?.message || err.message || "Failed to close record",
      });
    },
    onSettled: () => {
      setClosingId(null);
    },
  });

  const handleClose = (id: number) => {
    if (confirm("Are you sure you want to close this record?")) {
      closeMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-md border border-dashed shadow-sm p-8 h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm p-8 text-center h-[400px]">
        <div className="flex flex-col items-center gap-1">
          <h3 className="text-2xl font-bold tracking-tight">No maintenance records</h3>
          <p className="text-sm text-muted-foreground">
            You don't have any maintenance records.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border shadow-sm overflow-hidden bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Vehicle</th>
              <th className="px-4 py-3 font-medium">Service Type</th>
              <th className="px-4 py-3 font-medium">Cost</th>
              <th className="px-4 py-3 font-medium">Status</th>
              {canEdit && <th className="px-4 py-3 font-medium text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y">
            {records.map((record) => (
              <tr key={record.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">
                  {record.vehicle.registrationNumber}
                </td>
                <td className="px-4 py-3">{record.description}</td>
                <td className="px-4 py-3">{formatCurrency(record.cost)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                      record.status === "ACTIVE"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500"
                        : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-500"
                    }`}
                  >
                    {record.status}
                  </span>
                </td>
                {canEdit && (
                  <td className="px-4 py-3 text-right">
                    {record.status === "ACTIVE" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleClose(record.id)}
                        disabled={closingId === record.id}
                      >
                        {closingId === record.id ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : null}
                        Close
                      </Button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
