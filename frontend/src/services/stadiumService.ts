import type {
  Stadium,
  StadiumCreate,
  StadiumListItem,
  StadiumSearchParams,
} from "@/types";
import { api } from "./apiClient";

function buildQuery(params: StadiumSearchParams): string {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== "",
  );
  if (entries.length === 0) return "";
  return "?" + new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString();
}

export const stadiumService = {
  search: (params: StadiumSearchParams = {}) =>
    api.get<StadiumListItem[]>(`/stadiums${buildQuery(params)}`),

  getById: (id: string) => api.get<Stadium>(`/stadiums/${id}`),

  create: (data: StadiumCreate) => api.post<Stadium>("/stadiums", data),
};
