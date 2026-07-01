from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.stadium import Stadium, StadiumStatus
from app.models.team import Team
from app.schemas.stadium import StadiumCreate, StadiumSearchParams, TeamCreate


class StadiumRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, stadium_id: str, include_teams: bool = False) -> Stadium | None:
        query = select(Stadium).where(Stadium.id == stadium_id)
        if include_teams:
            query = query.options(selectinload(Stadium.teams))
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def search(self, params: StadiumSearchParams, user_id: str | None = None) -> list[Stadium]:
        query = select(Stadium)

        # Unauthenticated users only see approved; authenticated also see their own pending
        if user_id:
            query = query.where(
                or_(Stadium.status == StadiumStatus.approved, Stadium.submitted_by_id == user_id)
            )
        else:
            query = query.where(Stadium.status == StadiumStatus.approved)

        if params.name:
            query = query.where(Stadium.name.ilike(f"%{params.name}%"))
        if params.city:
            query = query.where(Stadium.city.ilike(f"%{params.city}%"))
        if params.country:
            query = query.where(Stadium.country.ilike(f"%{params.country}%"))
        if params.team:
            team_subquery = (
                select(Team.id)
                .where(Team.stadium_id == Stadium.id, Team.name.ilike(f"%{params.team}%"))
                .exists()
            )
            query = query.where(
                or_(
                    Stadium.current_team.ilike(f"%{params.team}%"),
                    team_subquery,
                )
            )
        if params.capacity_min is not None:
            query = query.where(Stadium.capacity >= params.capacity_min)
        if params.capacity_max is not None:
            query = query.where(Stadium.capacity <= params.capacity_max)
        if params.year_min is not None:
            query = query.where(Stadium.year_opened >= params.year_min)
        if params.year_max is not None:
            query = query.where(Stadium.year_opened <= params.year_max)

        query = query.offset(params.offset).limit(params.limit)
        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def create(self, data: StadiumCreate, submitted_by_id: str | None = None) -> Stadium:
        status = StadiumStatus.pending_review if submitted_by_id else StadiumStatus.approved
        stadium = Stadium(**data.model_dump(), submitted_by_id=submitted_by_id, status=status)
        self.db.add(stadium)
        await self.db.commit()
        result = await self.db.execute(
            select(Stadium).where(Stadium.id == stadium.id).options(selectinload(Stadium.teams))
        )
        return result.scalar_one()

    async def add_team(self, stadium_id: str, data: TeamCreate) -> Team:
        team = Team(stadium_id=stadium_id, **data.model_dump())
        self.db.add(team)
        await self.db.commit()
        await self.db.refresh(team)
        return team

    async def get_teams(self, stadium_id: str) -> list[Team]:
        result = await self.db.execute(select(Team).where(Team.stadium_id == stadium_id))
        return list(result.scalars().all())
