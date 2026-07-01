import type { League, LeagueListItem, LeagueProgress } from "@/types";
import { api } from "./apiClient";

export const leagueService = {
  list: () => api.get<LeagueListItem[]>("/leagues"),

  getById: (id: string) => api.get<League>(`/leagues/${id}`),

  myLeagues: () => api.get<LeagueListItem[]>("/me/leagues"),

  join: (id: string) => api.post<void>(`/me/leagues/${id}`, {}),

  leave: (id: string) => api.delete<void>(`/me/leagues/${id}`),

  progress: (id: string) => api.get<LeagueProgress>(`/me/leagues/${id}/progress`),
};
