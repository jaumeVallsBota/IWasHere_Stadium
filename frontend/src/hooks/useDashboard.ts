"use client";

import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/userService";

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: userService.dashboard,
    staleTime: 30 * 1000,
  });
}

export function useMapPins() {
  return useQuery({
    queryKey: ["mapPins"],
    queryFn: userService.mapPins,
    staleTime: 60 * 1000,
  });
}
