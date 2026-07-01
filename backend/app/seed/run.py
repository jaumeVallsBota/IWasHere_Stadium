import asyncio
import json
from pathlib import Path

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import settings
from app.models.league import League, LeagueStadium
from app.models.stadium import Stadium, StadiumStatus
from app.models.team import Team

SEED_FILE = Path(__file__).parent / "stadiums.json"
LEAGUES_FILE = Path(__file__).parent / "leagues.json"


async def seed(session: AsyncSession) -> None:
    stadiums_data = json.loads(SEED_FILE.read_text())
    stadium_map: dict[str, str] = {}  # name → id

    for entry in stadiums_data:
        teams_data = entry.pop("teams", [])
        stadium = Stadium(
            **entry,
            status=StadiumStatus.approved,
            submitted_by_id=None,
        )
        session.add(stadium)
        await session.flush()

        stadium_map[stadium.name] = stadium.id

        for t in teams_data:
            session.add(Team(stadium_id=stadium.id, **t))

    print(f"Seeded {len(stadiums_data)} stadiums.")

    leagues_data = json.loads(LEAGUES_FILE.read_text())
    for entry in leagues_data:
        stadium_names: list[str] = entry.pop("stadium_names", [])
        league = League(**entry)
        session.add(league)
        await session.flush()

        for name in stadium_names:
            sid = stadium_map.get(name)
            if sid:
                session.add(LeagueStadium(league_id=league.id, stadium_id=sid))
            else:
                print(f"  Warning: stadium '{name}' not found for league '{league.name}'")

    await session.commit()
    print(f"Seeded {len(leagues_data)} leagues.")


async def main() -> None:
    engine = create_async_engine(settings.DATABASE_URL, echo=False)
    async_session = async_sessionmaker(engine, expire_on_commit=False)
    async with async_session() as session:
        await seed(session)
    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())
