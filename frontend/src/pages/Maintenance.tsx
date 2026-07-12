import { useAuth } from "@/contexts/AuthContext";
import { MaintenanceForm } from "@/components/maintenance/MaintenanceForm";
import { MaintenanceTable } from "@/components/maintenance/MaintenanceTable";

export default function Maintenance() {
  const { user } = useAuth();
  
  // Roles allowed to view the page
  const canView = ["FleetManager", "SafetyOfficer", "FinancialAnalyst", "Dispatcher", "Driver"].includes(user?.role || "");
  // Roles allowed to edit/close
  const canEdit = ["FleetManager", "SafetyOfficer"].includes(user?.role || "");

  if (!canView) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] text-center">
        <h2 className="text-2xl font-bold text-destructive">Access Denied</h2>
        <p className="text-muted-foreground mt-2">You do not have permission to view the maintenance module.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Maintenance</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Create Form (Only for FleetManager and SafetyOfficer) */}
        {canEdit && (
          <div className="lg:col-span-1">
            <MaintenanceForm />
          </div>
        )}
        
        {/* Right Panel - Maintenance Table (Full width if no form) */}
        <div className={canEdit ? "lg:col-span-2" : "lg:col-span-3"}>
          <MaintenanceTable />
        </div>
      </div>
    </div>
  );
}
