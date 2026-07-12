import { useQuery } from "@tanstack/react-query";
import { driversService } from "../services/drivers";

export const useDrivers = () => {
  return useQuery({
    queryKey: ["drivers"],
    queryFn: driversService.getAll,
  });
};
