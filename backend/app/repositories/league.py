from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.league import League, LeagueStadium, UserLeague
from app.models.visit import Visit


class LeagueRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self) -> list[League]:
        result = await self.db.execute(select(League).order_by(League.name))
        return list(result.scalars().all())

    async def get_by_id(self, league_id: str) -> League | None:
        result = await self.db.execute(
            select(League)
            .where(League.id == league_id)
            .options(selectinload(League.stadiums))
        )
        return result.scalar_one_or_none()

    async def get_user_leagues(self, user_id: str) -> list[League]:
        result = await self.db.execute(
            select(League)
            .join(UserLeague, UserLeague.league_id == League.id)
            .where(UserLeague.user_id == user_id)
        )
        return list(result.scalars().all())

    async def is_tracking(self, user_id: str, league_id: str) -> bool:
        result = await self.db.execute(
            select(UserLeague).where(
                UserLeague.user_id == user_id, UserLeague.league_id == league_id
            )
        )
        return result.scalar_one_or_none() is not None

    async def add_user_league(self, user_id: str, league_id: str) -> None:
        entry = UserLeague(user_id=user_id, league_id=league_id)
        self.db.add(entry)
        await self.db.commit()

    async def remove_user_league(self, user_id: str, league_id: str) -> bool:
        result = await self.db.execute(
            select(UserLeague).where(
                UserLeague.user_id == user_id, UserLeague.league_id == league_id
            )
        )
        entry = result.scalar_one_or_none()
        if not entry:
            return False
        await self.db.delete(entry)
        await self.db.commit()
        return True

    async def get_progress(self, user_id: str, league_id: str) -> dict:
        total_result = await self.db.execute(
            select(func.count()).where(LeagueStadium.league_id == league_id)
        )
        total = total_result.scalar_one()

        visited_result = await self.db.execute(
            select(func.count(func.distinct(Visit.stadium_id)))
            .join(LeagueStadium, LeagueStadium.stadium_id == Visit.stadium_id)
            .where(Visit.user_id == user_id, LeagueStadium.league_id == league_id)
        )
        visited = visited_result.scalar_one()

        return {
            "total_stadiums": total,
            "visited_stadiums": visited,
            "percentage": round((visited / total * 100) if total > 0 else 0.0, 1),
        }
