from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.league import LeagueOut
from app.services import league as league_service

router = APIRouter()


@router.get("", response_model=list[LeagueOut])
async def list_leagues(db: AsyncSession = Depends(get_db)):
    return await league_service.get_all_leagues(db)


@router.get("/{league_id}", response_model=LeagueOut)
async def get_league(league_id: str, db: AsyncSession = Depends(get_db)):
    return await league_service.get_league(league_id, db)
