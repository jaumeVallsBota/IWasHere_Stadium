import type { Visit, VisitCreate, VisitUpdate } from "@/types";
import { api } from "./apiClient";

export const visitService = {
  listForStadium: (stadiumId: string) =>
    api.get<Visit[]>(`/stadiums/${stadiumId}/visits`),

  create: (stadiumId: string, data: VisitCreate) =>
    api.post<Visit>(`/stadiums/${stadiumId}/visits`, data),

  getById: (visitId: string) => api.get<Visit>(`/visits/${visitId}`),

  update: (visitId: string, data: VisitUpdate) =>
    api.patch<Visit>(`/visits/${visitId}`, data),

  remove: (visitId: string) => api.delete<void>(`/visits/${visitId}`),
};
