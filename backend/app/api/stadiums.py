from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.repositories.stadium import StadiumRepository
from app.schemas.stadium import StadiumCreate, StadiumListItem, StadiumOut, StadiumSearchParams, TeamOut
from app.services import stadium as stadium_service

router = APIRouter()


@router.get("", response_model=list[StadiumListItem])
async def search_stadiums(
    name: str | None = Query(default=None),
    city: str | None = Query(default=None),
    country: str | None = Query(default=None),
    team: str | None = Query(default=None),
    capacity_min: int | None = Query(default=None),
    capacity_max: int | None = Query(default=None),
    year_min: int | None = Query(default=None),
    year_max: int | None = Query(default=None),
    limit: int = Query(default=20, le=100),
    offset: int = Query(default=0),
    db: AsyncSession = Depends(get_db),
):
    params = StadiumSearchParams(
        name=name, city=city, country=country, team=team,
        capacity_min=capacity_min, capacity_max=capacity_max,
        year_min=year_min, year_max=year_max,
        limit=limit, offset=offset,
    )
    return await stadium_service.search_stadiums(params, db)


@router.post("", response_model=StadiumOut, status_code=status.HTTP_201_CREATED)
async def submit_stadium(
    data: StadiumCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await stadium_service.submit_stadium(data, submitted_by_id=current_user.id, db=db)


@router.get("/{stadium_id}", response_model=StadiumOut)
async def get_stadium(stadium_id: str, db: AsyncSession = Depends(get_db)):
    return await stadium_service.get_stadium(stadium_id, db)


@router.get("/{stadium_id}/teams", response_model=list[TeamOut])
async def get_stadium_teams(stadium_id: str, db: AsyncSession = Depends(get_db)):
    await stadium_service.get_stadium(stadium_id, db)  # 404 if not found
    return await StadiumRepository(db).get_teams(stadium_id)


@router.get("/{stadium_id}/history", response_model=StadiumOut)
async def get_stadium_history(stadium_id: str, db: AsyncSession = Depends(get_db)):
    return await stadium_service.get_stadium(stadium_id, db)
