import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
import {
  LayoutDashboard,
  Truck,
  Users,
  Route,
  Wrench,
  Fuel,
  BarChart3,
  Settings
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["FleetManager", "Driver", "SafetyOfficer", "FinancialAnalyst"] },
  { name: "Vehicles", href: "/vehicles", icon: Truck, roles: ["FleetManager", "SafetyOfficer", "FinancialAnalyst"] },
  { name: "Drivers", href: "/drivers", icon: Users, roles: ["FleetManager", "SafetyOfficer"] },
  { name: "Trips", href: "/trips", icon: Route, roles: ["FleetManager", "Driver", "SafetyOfficer"] },
  { name: "Maintenance", href: "/maintenance", icon: Wrench, roles: ["FleetManager", "SafetyOfficer"] },
  { name: "Fuel & Expenses", href: "/fuel-expenses", icon: Fuel, roles: ["FleetManager", "FinancialAnalyst", "Driver"] },
  { name: "Reports", href: "/reports", icon: BarChart3, roles: ["FleetManager", "FinancialAnalyst", "SafetyOfficer"] },
  { name: "Settings", href: "/settings", icon: Settings, roles: ["FleetManager"] },
];

import { useAuth } from "../../contexts/AuthContext";

export function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();
  
  const filteredNav = navigation.filter(item => 
    !user || !user.role || item.roles.includes(user.role)
  );

  return (
    <div className="hidden border-r bg-muted/40 md:block md:w-64">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold text-primary">
            <Truck className="h-6 w-6" />
            <span className="">TransitOps</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4 mt-4">
            {filteredNav.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                    isActive
                      ? "bg-primary text-primary-foreground hover:text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
