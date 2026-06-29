import asyncio
import json
from pathlib import Path

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import settings
from app.models.stadium import Stadium, StadiumStatus
from app.models.team import Team

SEED_FILE = Path(__file__).parent / "stadiums.json"


async def seed(session: AsyncSession) -> None:
    data = json.loads(SEED_FILE.read_text())
    for entry in data:
        teams_data = entry.pop("teams", [])
        stadium = Stadium(
            **entry,
            status=StadiumStatus.approved,
            submitted_by_id=None,
        )
        session.add(stadium)
        await session.flush()  # get the generated id

        for t in teams_data:
            session.add(Team(stadium_id=stadium.id, **t))

    await session.commit()
    print(f"Seeded {len(data)} stadiums.")


async def main() -> None:
    engine = create_async_engine(settings.DATABASE_URL, echo=False)
    async_session = async_sessionmaker(engine, expire_on_commit=False)
    async with async_session() as session:
        await seed(session)
    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())
