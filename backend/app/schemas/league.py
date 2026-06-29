from pydantic import BaseModel


class LeagueOut(BaseModel):
    model_config = {"from_attributes": True}

    id: str
    name: str
    country: str
    season: str | None = None


class LeagueProgressOut(BaseModel):
    league_id: str
    league_name: str
    total_stadiums: int
    visited_stadiums: int
    percentage: float
