import { useAuth } from "@/contexts/AuthContext";
import { FuelLogForm } from "@/components/fuel-expenses/FuelLogForm";
import { ExpenseForm } from "@/components/fuel-expenses/ExpenseForm";
import { FuelLogsTable } from "@/components/fuel-expenses/FuelLogsTable";
import { ExpensesTable } from "@/components/fuel-expenses/ExpensesTable";
import { SummaryTable } from "@/components/fuel-expenses/SummaryTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function FuelExpenses() {
  const { user } = useAuth();
  
  // Handle potential nested role object from backend
  const userRole = typeof user?.role === "object" && user?.role !== null
    ? (user.role as any).name 
    : user?.role || "";

  // Roles allowed to view the page (all roles)
  const canView = ["FleetManager", "SafetyOfficer", "FinancialAnalyst", "Dispatcher", "Driver"].includes(userRole);
  // Roles allowed to edit
  const canEdit = ["FleetManager", "FinancialAnalyst"].includes(userRole);

  if (!canView) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] text-center">
        <h2 className="text-2xl font-bold text-destructive">Access Denied</h2>
        <p className="text-muted-foreground mt-2">You do not have permission to view fuel and expenses.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Fuel & Expenses</h1>
      </div>

      {canEdit && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FuelLogForm />
          <ExpenseForm />
        </div>
      )}

      <Tabs defaultValue="fuel" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="fuel">Fuel Logs</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="summary">Operational Cost Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="fuel" className="mt-0">
          <FuelLogsTable />
        </TabsContent>

        <TabsContent value="expenses" className="mt-0">
          <ExpensesTable />
        </TabsContent>

        <TabsContent value="summary" className="mt-0">
          <SummaryTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
