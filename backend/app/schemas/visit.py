from datetime import date as DateType, datetime

from pydantic import BaseModel, Field, model_validator

from app.models.visit import TourGuideQuality, TourImpression, VisitType


class VisitCreate(BaseModel):
    visit_type: VisitType
    date: DateType
    # Matchday
    match_home_team: str | None = None
    match_away_team: str | None = None
    match_competition: str | None = None
    match_score: str | None = None
    # Tour
    tour_overall_impression: TourImpression | None = None
    tour_highlights: str | None = None
    tour_would_recommend: bool | None = None
    tour_guide_quality: TourGuideQuality | None = None
    tour_duration_minutes: int | None = None
    # Shared
    notes: str | None = None
    rating: int | None = Field(default=None, ge=1, le=5)

    @model_validator(mode="after")
    def validate_type_fields(self):
        if self.visit_type == VisitType.tour and self.tour_overall_impression is None:
            raise ValueError("tour_overall_impression es obligatorio para visitas de tipo tour")
        return self


class VisitUpdate(BaseModel):
    date: DateType | None = None
    match_home_team: str | None = None
    match_away_team: str | None = None
    match_competition: str | None = None
    match_score: str | None = None
    tour_overall_impression: TourImpression | None = None
    tour_highlights: str | None = None
    tour_would_recommend: bool | None = None
    tour_guide_quality: TourGuideQuality | None = None
    tour_duration_minutes: int | None = None
    notes: str | None = None
    rating: int | None = Field(default=None, ge=1, le=5)


class VisitOut(BaseModel):
    model_config = {"from_attributes": True}

    id: str
    user_id: str
    stadium_id: str
    visit_type: VisitType
    date: DateType
    match_home_team: str | None = None
    match_away_team: str | None = None
    match_competition: str | None = None
    match_score: str | None = None
    tour_overall_impression: TourImpression | None = None
    tour_highlights: str | None = None
    tour_would_recommend: bool | None = None
    tour_guide_quality: TourGuideQuality | None = None
    tour_duration_minutes: int | None = None
    notes: str | None = None
    rating: int | None = None
    created_at: datetime
