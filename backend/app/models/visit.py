import uuid
import enum
from datetime import date, datetime, timezone

from sqlalchemy import Boolean, Date, DateTime, Enum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class VisitType(str, enum.Enum):
    matchday = "matchday"
    tour = "tour"


class TourImpression(str, enum.Enum):
    muy_bueno = "Muy bueno"
    bueno = "Bueno"
    normal = "Normal"
    malo = "Malo"


class TourGuideQuality(str, enum.Enum):
    excelente = "Excelente"
    bueno = "Bueno"
    regular = "Regular"
    sin_guia = "Sin guía"


class Visit(Base):
    __tablename__ = "visits"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False)
    stadium_id: Mapped[str] = mapped_column(ForeignKey("stadiums.id"), nullable=False)
    visit_type: Mapped[VisitType] = mapped_column(Enum(VisitType), nullable=False)
    date: Mapped[date] = mapped_column(Date, nullable=False)

    # Matchday fields
    match_home_team: Mapped[str | None] = mapped_column(String, nullable=True)
    match_away_team: Mapped[str | None] = mapped_column(String, nullable=True)
    match_competition: Mapped[str | None] = mapped_column(String, nullable=True)
    match_score: Mapped[str | None] = mapped_column(String, nullable=True)

    # Tour fields
    tour_overall_impression: Mapped[TourImpression | None] = mapped_column(Enum(TourImpression), nullable=True)
    tour_highlights: Mapped[str | None] = mapped_column(Text, nullable=True)
    tour_would_recommend: Mapped[bool | None] = mapped_column(Boolean, nullable=True)
    tour_guide_quality: Mapped[TourGuideQuality | None] = mapped_column(Enum(TourGuideQuality), nullable=True)
    tour_duration_minutes: Mapped[int | None] = mapped_column(Integer, nullable=True)

    # Shared
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    rating: Mapped[int | None] = mapped_column(Integer, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    user: Mapped["User"] = relationship("User", back_populates="visits")
    stadium: Mapped["Stadium"] = relationship("Stadium", back_populates="visits")
