export type StadiumStatus = "approved" | "pending_review";

export type VisitType = "matchday" | "tour";

export type TourImpression = "Muy bueno" | "Bueno" | "Normal" | "Malo";

export type TourGuideQuality = "Excelente" | "Bueno" | "Regular" | "Sin guía";

export interface Team {
  id: string;
  name: string;
  country: string;
  years_at_stadium: string;
  notes?: string | null;
}

export interface Stadium {
  id: string;
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  capacity?: number | null;
  year_opened?: number | null;
  history?: string | null;
  current_team?: string | null;
  status: StadiumStatus;
  submitted_by_id?: string | null;
  teams: Team[];
}

export interface StadiumListItem {
  id: string;
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  capacity?: number | null;
  current_team?: string | null;
  status: StadiumStatus;
}

export interface StadiumCreate {
  name: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  capacity?: number | null;
  year_opened?: number | null;
  history?: string | null;
  current_team?: string | null;
}

export interface StadiumSearchParams {
  name?: string;
  city?: string;
  country?: string;
  team?: string;
  capacity_min?: number;
  capacity_max?: number;
  year_min?: number;
  year_max?: number;
  limit?: number;
  offset?: number;
}

export interface Visit {
  id: string;
  user_id: string;
  stadium_id: string;
  visit_type: VisitType;
  date: string;
  match_home_team?: string | null;
  match_away_team?: string | null;
  match_competition?: string | null;
  match_score?: string | null;
  tour_overall_impression?: TourImpression | null;
  tour_highlights?: string | null;
  tour_would_recommend?: boolean | null;
  tour_guide_quality?: TourGuideQuality | null;
  tour_duration_minutes?: number | null;
  notes?: string | null;
  rating?: number | null;
  created_at: string;
}

export interface VisitCreate {
  visit_type: VisitType;
  date: string;
  match_home_team?: string | null;
  match_away_team?: string | null;
  match_competition?: string | null;
  match_score?: string | null;
  tour_overall_impression?: TourImpression | null;
  tour_highlights?: string | null;
  tour_would_recommend?: boolean | null;
  tour_guide_quality?: TourGuideQuality | null;
  tour_duration_minutes?: number | null;
  notes?: string | null;
  rating?: number | null;
}

export interface VisitUpdate extends Partial<Omit<VisitCreate, "visit_type">> {}

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface League {
  id: string;
  name: string;
  country: string;
  season?: string | null;
  stadiums: StadiumListItem[];
}

export interface LeagueListItem {
  id: string;
  name: string;
  country: string;
  season?: string | null;
}

export interface LeagueProgress {
  league_id: string;
  league_name: string;
  total: number;
  visited: number;
  percentage: number;
}

export interface DashboardStats {
  total_stadiums_visited: number;
  total_visit_entries: number;
  countries_covered: number;
  recent_visits: (Visit & { stadium_name: string; stadium_city: string })[];
  league_progress: LeagueProgress[];
}

export interface MapPin {
  stadium_id: string;
  name: string;
  latitude: number;
  longitude: number;
  visit_types: VisitType[];
}

export interface ApiError {
  detail: string;
}
