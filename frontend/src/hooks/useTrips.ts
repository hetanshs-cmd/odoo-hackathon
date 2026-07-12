import { useQuery } from "@tanstack/react-query";
import { tripsService } from "../services/trips";

export const useTrips = () => {
  return useQuery({
    queryKey: ["trips"],
    queryFn: tripsService.getAll,
  });
};
