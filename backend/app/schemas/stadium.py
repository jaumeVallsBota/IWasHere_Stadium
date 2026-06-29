from pydantic import BaseModel, Field

from app.models.stadium import StadiumStatus


class TeamOut(BaseModel):
    model_config = {"from_attributes": True}

    id: str
    name: str
    country: str
    years_at_stadium: str
    notes: str | None = None


class StadiumBase(BaseModel):
    name: str
    city: str
    country: str
    latitude: float
    longitude: float
    capacity: int | None = None
    year_opened: int | None = None
    history: str | None = None
    current_team: str | None = None


class StadiumCreate(StadiumBase):
    pass


class StadiumOut(StadiumBase):
    model_config = {"from_attributes": True}

    id: str
    status: StadiumStatus
    submitted_by_id: str | None = None
    teams: list[TeamOut] = []


class StadiumListItem(BaseModel):
    model_config = {"from_attributes": True}

    id: str
    name: str
    city: str
    country: str
    latitude: float
    longitude: float
    capacity: int | None = None
    current_team: str | None = None
    status: StadiumStatus


class StadiumSearchParams(BaseModel):
    name: str | None = None
    city: str | None = None
    country: str | None = None
    team: str | None = None
    capacity_min: int | None = None
    capacity_max: int | None = None
    year_min: int | None = None
    year_max: int | None = None
    limit: int = Field(default=20, le=100)
    offset: int = 0


class TeamCreate(BaseModel):
    name: str
    country: str
    years_at_stadium: str
    notes: str | None = None
