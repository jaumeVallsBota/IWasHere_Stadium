"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { stadiumService } from "@/services/stadiumService";
import type { StadiumCreate, StadiumSearchParams } from "@/types";

export function useStadiums(params: StadiumSearchParams = {}) {
  return useQuery({
    queryKey: ["stadiums", params],
    queryFn: () => stadiumService.search(params),
    staleTime: 60 * 1000,
  });
}

export function useStadium(id: string) {
  return useQuery({
    queryKey: ["stadiums", id],
    queryFn: () => stadiumService.getById(id),
    enabled: !!id,
    staleTime: 60 * 1000,
  });
}

export function useCreateStadium() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: StadiumCreate) => stadiumService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stadiums"] });
    },
  });
}
