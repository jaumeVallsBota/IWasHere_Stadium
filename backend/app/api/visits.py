from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User
from app.schemas.visit import VisitCreate, VisitOut, VisitUpdate
from app.services import visit as visit_service

# Mounted at /api/v1/visits — handles /{visit_id}
router = APIRouter()

# Mounted at /api/v1/stadiums — handles /{stadium_id}/visits
stadium_visits_router = APIRouter()


@stadium_visits_router.get("/{stadium_id}/visits", response_model=list[VisitOut])
async def list_stadium_visits(
    stadium_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await visit_service.list_stadium_visits(stadium_id, current_user.id, db)


@stadium_visits_router.post("/{stadium_id}/visits", response_model=VisitOut, status_code=status.HTTP_201_CREATED)
async def create_visit(
    stadium_id: str,
    data: VisitCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await visit_service.create_visit(stadium_id, current_user.id, data, db)


@router.get("/{visit_id}", response_model=VisitOut)
async def get_visit(
    visit_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await visit_service.get_visit(visit_id, current_user.id, db)


@router.patch("/{visit_id}", response_model=VisitOut)
async def update_visit(
    visit_id: str,
    data: VisitUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return await visit_service.update_visit(visit_id, current_user.id, data, db)


@router.delete("/{visit_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_visit(
    visit_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    await visit_service.delete_visit(visit_id, current_user.id, db)
