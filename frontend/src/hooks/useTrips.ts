import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tripsService } from "../services/trips";
import { api } from "../services/api";

export const useTrips = () => {
  return useQuery({
    queryKey: ["trips"],
    queryFn: tripsService.getAll,
  });
};

export const useCreateTrip = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: any) => api.post("/trips", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

export const useUpdateTripStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => 
      api.patch(`/trips/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};
