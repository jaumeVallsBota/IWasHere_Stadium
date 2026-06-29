from fastapi import APIRouter, Depends, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.stadium import Stadium
from app.models.user import User
from app.models.visit import Visit
from app.repositories.visit import VisitRepository
from app.repositories.league import LeagueRepository
from app.schemas.league import LeagueOut, LeagueProgressOut
from app.schemas.stadium import StadiumListItem
from app.schemas.user import UserPublic, UserUpdate
from app.schemas.visit import VisitOut
from app.services import league as league_service

router = APIRouter()


@router.get("", response_model=UserPublic)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.patch("", response_model=UserPublic)
async def update_me(
    data: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    from app.repositories.user import UserRepository
    repo = UserRepository(db)
    if data.email:
        current_user = await repo.update_email(current_user, data.email)
    return current_user


@router.get("/dashboard")
async def get_dashboard(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    visits = await VisitRepository(db).list_by_user(current_user.id)
    stadium_ids = list({v.stadium_id for v in visits})
    countries = list({v.stadium.country for v in visits if v.stadium})

    recent = sorted(visits, key=lambda v: v.created_at, reverse=True)[:10]

    return {
        "total_stadiums_visited": len(stadium_ids),
        "total_visits": len(visits),
        "countries_covered": len(countries),
        "recent_visits": [VisitOut.model_validate(v) for v in recent],
    }


@router.get("/stadiums", response_model=list[StadiumListItem])
async def get_my_stadiums(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Stadium)
        .join(Visit, Visit.stadium_id == Stadium.id)
        .where(Visit.user_id == current_user.id)
        .distinct()
    )
    return list(result.scalars().all())


@router.get("/visits", response_model=list[VisitOut])
async def get_my_visits(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await VisitRepository(db).list_by_user(current_user.id)


@router.get("/map")
async def get_map_pins(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    result = await db.execute(
        select(Stadium.id, Stadium.name, Stadium.latitude, Stadium.longitude)
        .join(Visit, Visit.stadium_id == Stadium.id)
        .where(Visit.user_id == current_user.id)
        .distinct()
    )
    rows = result.all()
    return [
        {"id": r.id, "name": r.name, "latitude": r.latitude, "longitude": r.longitude}
        for r in rows
    ]


@router.get("/leagues", response_model=list[LeagueOut])
async def get_my_leagues(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await league_service.get_user_leagues(current_user.id, db)


@router.post("/leagues/{league_id}", status_code=status.HTTP_204_NO_CONTENT)
async def opt_in_league(
    league_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    await league_service.opt_in_league(current_user.id, league_id, db)


@router.delete("/leagues/{league_id}", status_code=status.HTTP_204_NO_CONTENT)
async def opt_out_league(
    league_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    await league_service.opt_out_league(current_user.id, league_id, db)


@router.get("/leagues/{league_id}/progress", response_model=LeagueProgressOut)
async def get_league_progress(
    league_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await league_service.get_league_progress(current_user.id, league_id, db)
