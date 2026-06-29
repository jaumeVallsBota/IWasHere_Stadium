from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.visit import Visit
from app.repositories.stadium import StadiumRepository
from app.repositories.visit import VisitRepository
from app.schemas.visit import VisitCreate, VisitUpdate


async def list_stadium_visits(stadium_id: str, user_id: str, db: AsyncSession) -> list[Visit]:
    if not await StadiumRepository(db).get_by_id(stadium_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Estadio no encontrado")
    return await VisitRepository(db).list_by_stadium(stadium_id, user_id)


async def create_visit(stadium_id: str, user_id: str, data: VisitCreate, db: AsyncSession) -> Visit:
    if not await StadiumRepository(db).get_by_id(stadium_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Estadio no encontrado")
    return await VisitRepository(db).create(stadium_id, user_id, data)


async def get_visit(visit_id: str, user_id: str, db: AsyncSession) -> Visit:
    visit = await VisitRepository(db).get_by_id(visit_id)
    if not visit:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Visita no encontrada")
    if visit.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Sin permiso")
    return visit


async def update_visit(visit_id: str, user_id: str, data: VisitUpdate, db: AsyncSession) -> Visit:
    visit = await get_visit(visit_id, user_id, db)
    return await VisitRepository(db).update(visit, data)


async def delete_visit(visit_id: str, user_id: str, db: AsyncSession) -> None:
    visit = await get_visit(visit_id, user_id, db)
    await VisitRepository(db).delete(visit)
