import uuid
import enum
from datetime import datetime, timezone

from sqlalchemy import DateTime, Enum, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class StadiumStatus(str, enum.Enum):
    approved = "approved"
    pending_review = "pending_review"


class Stadium(Base):
    __tablename__ = "stadiums"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String, nullable=False)
    city: Mapped[str] = mapped_column(String, nullable=False)
    country: Mapped[str] = mapped_column(String, nullable=False)
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    capacity: Mapped[int | None] = mapped_column(Integer, nullable=True)
    year_opened: Mapped[int | None] = mapped_column(Integer, nullable=True)
    history: Mapped[str | None] = mapped_column(Text, nullable=True)
    current_team: Mapped[str | None] = mapped_column(String, nullable=True)
    status: Mapped[StadiumStatus] = mapped_column(
        Enum(StadiumStatus), nullable=False, default=StadiumStatus.approved
    )
    submitted_by_id: Mapped[str | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    submitted_by_user: Mapped["User | None"] = relationship("User", back_populates="submitted_stadiums")
    teams: Mapped[list["Team"]] = relationship("Team", back_populates="stadium", cascade="all, delete-orphan")
    visits: Mapped[list["Visit"]] = relationship("Visit", back_populates="stadium", cascade="all, delete-orphan")
    league_entries: Mapped[list["LeagueStadium"]] = relationship("LeagueStadium", back_populates="stadium", cascade="all, delete-orphan")
