"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { visitService } from "@/services/visitService";
import type { VisitCreate, VisitUpdate } from "@/types";

export function useStadiumVisits(stadiumId: string) {
  return useQuery({
    queryKey: ["visits", "stadium", stadiumId],
    queryFn: () => visitService.listForStadium(stadiumId),
    enabled: !!stadiumId,
  });
}

export function useVisit(visitId: string) {
  return useQuery({
    queryKey: ["visits", visitId],
    queryFn: () => visitService.getById(visitId),
    enabled: !!visitId,
  });
}

export function useCreateVisit(stadiumId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: VisitCreate) => visitService.create(stadiumId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visits", "stadium", stadiumId] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useUpdateVisit(visitId: string, stadiumId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: VisitUpdate) => visitService.update(visitId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visits"] });
      queryClient.invalidateQueries({ queryKey: ["visits", "stadium", stadiumId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useDeleteVisit(stadiumId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (visitId: string) => visitService.remove(visitId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visits", "stadium", stadiumId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
