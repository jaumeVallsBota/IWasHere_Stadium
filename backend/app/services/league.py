from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.league import LeagueRepository
from app.schemas.league import LeagueProgressOut


async def get_all_leagues(db: AsyncSession):
    return await LeagueRepository(db).get_all()


async def get_league(league_id: str, db: AsyncSession):
    league = await LeagueRepository(db).get_by_id(league_id)
    if not league:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Liga no encontrada")
    return league


async def get_user_leagues(user_id: str, db: AsyncSession):
    return await LeagueRepository(db).get_user_leagues(user_id)


async def opt_in_league(user_id: str, league_id: str, db: AsyncSession) -> None:
    repo = LeagueRepository(db)
    if not await repo.get_by_id(league_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Liga no encontrada")
    if await repo.is_tracking(user_id, league_id):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Ya sigues esta liga")
    await repo.add_user_league(user_id, league_id)


async def opt_out_league(user_id: str, league_id: str, db: AsyncSession) -> None:
    removed = await LeagueRepository(db).remove_user_league(user_id, league_id)
    if not removed:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No sigues esta liga")


async def get_league_progress(user_id: str, league_id: str, db: AsyncSession) -> LeagueProgressOut:
    repo = LeagueRepository(db)
    league = await repo.get_by_id(league_id)
    if not league:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Liga no encontrada")
    progress = await repo.get_progress(user_id, league_id)
    return LeagueProgressOut(league_id=league_id, league_name=league.name, **progress)
