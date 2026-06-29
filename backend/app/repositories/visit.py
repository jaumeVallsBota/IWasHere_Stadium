from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.visit import Visit
from app.schemas.visit import VisitCreate, VisitUpdate


class VisitRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, visit_id: str) -> Visit | None:
        result = await self.db.execute(select(Visit).where(Visit.id == visit_id))
        return result.scalar_one_or_none()

    async def list_by_stadium(self, stadium_id: str, user_id: str) -> list[Visit]:
        result = await self.db.execute(
            select(Visit)
            .where(Visit.stadium_id == stadium_id, Visit.user_id == user_id)
            .order_by(Visit.date.desc())
        )
        return list(result.scalars().all())

    async def list_by_user(self, user_id: str) -> list[Visit]:
        result = await self.db.execute(
            select(Visit).where(Visit.user_id == user_id).order_by(Visit.date.desc())
        )
        return list(result.scalars().all())

    async def create(self, stadium_id: str, user_id: str, data: VisitCreate) -> Visit:
        visit = Visit(stadium_id=stadium_id, user_id=user_id, **data.model_dump())
        self.db.add(visit)
        await self.db.commit()
        await self.db.refresh(visit)
        return visit

    async def update(self, visit: Visit, data: VisitUpdate) -> Visit:
        for field, value in data.model_dump(exclude_none=True).items():
            setattr(visit, field, value)
        await self.db.commit()
        await self.db.refresh(visit)
        return visit

    async def delete(self, visit: Visit) -> None:
        await self.db.delete(visit)
        await self.db.commit()
