import type { DashboardStats, MapPin, StadiumListItem, User, Visit } from "@/types";
import { api } from "./apiClient";

export const userService = {
  me: () => api.get<User>("/me"),

  updateMe: (data: { email?: string }) => api.patch<User>("/me", data),

  dashboard: () => api.get<DashboardStats>("/me/dashboard"),

  visitedStadiums: () => api.get<StadiumListItem[]>("/me/stadiums"),

  allVisits: () => api.get<Visit[]>("/me/visits"),

  mapPins: () => api.get<MapPin[]>("/me/map"),
};
