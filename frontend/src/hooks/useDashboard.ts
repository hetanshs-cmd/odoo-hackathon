import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../services/dashboard";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: dashboardService.getStats,
  });
};
