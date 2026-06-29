from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.stadium import Stadium
from app.repositories.stadium import StadiumRepository
from app.schemas.stadium import StadiumCreate, StadiumSearchParams


async def search_stadiums(params: StadiumSearchParams, db: AsyncSession, user_id: str | None = None) -> list[Stadium]:
    return await StadiumRepository(db).search(params, user_id=user_id)


async def get_stadium(stadium_id: str, db: AsyncSession) -> Stadium:
    stadium = await StadiumRepository(db).get_by_id(stadium_id, include_teams=True)
    if not stadium:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Estadio no encontrado")
    return stadium


async def submit_stadium(data: StadiumCreate, submitted_by_id: str, db: AsyncSession) -> Stadium:
    return await StadiumRepository(db).create(data, submitted_by_id=submitted_by_id)
