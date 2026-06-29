import uuid

from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class League(Base):
    __tablename__ = "leagues"

    id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String, nullable=False)
    country: Mapped[str] = mapped_column(String, nullable=False)
    season: Mapped[str | None] = mapped_column(String, nullable=True)

    stadiums: Mapped[list["LeagueStadium"]] = relationship("LeagueStadium", back_populates="league", cascade="all, delete-orphan")
    user_entries: Mapped[list["UserLeague"]] = relationship("UserLeague", back_populates="league", cascade="all, delete-orphan")


class LeagueStadium(Base):
    __tablename__ = "league_stadiums"

    league_id: Mapped[str] = mapped_column(ForeignKey("leagues.id"), primary_key=True)
    stadium_id: Mapped[str] = mapped_column(ForeignKey("stadiums.id"), primary_key=True)

    league: Mapped["League"] = relationship("League", back_populates="stadiums")
    stadium: Mapped["Stadium"] = relationship("Stadium", back_populates="league_entries")


class UserLeague(Base):
    __tablename__ = "user_leagues"

    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), primary_key=True)
    league_id: Mapped[str] = mapped_column(ForeignKey("leagues.id"), primary_key=True)

    user: Mapped["User"] = relationship("User", back_populates="tracked_leagues")
    league: Mapped["League"] = relationship("League", back_populates="user_entries")
