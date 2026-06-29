import asyncio

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine

from app.core.config import settings
from app.core.database import Base, get_db
from main import app

TEST_DATABASE_URL = settings.TEST_DATABASE_URL or settings.DATABASE_URL.replace(
    "/stadium_tracker", "/stadium_tracker_test"
)


@pytest.fixture(scope="session", autouse=True)
def setup_database():
    """Create tables once synchronously before all tests; drop them after."""
    async def _create():
        engine = create_async_engine(TEST_DATABASE_URL, echo=False)
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
            await conn.run_sync(Base.metadata.create_all)
        await engine.dispose()

    async def _drop():
        engine = create_async_engine(TEST_DATABASE_URL, echo=False)
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
        await engine.dispose()

    asyncio.run(_create())
    yield
    asyncio.run(_drop())


@pytest_asyncio.fixture
async def db() -> AsyncSession:
    """
    Each test runs inside an open connection transaction.
    session.commit() creates/releases savepoints; the outer rollback at the
    end of the test undoes everything — real DB isolation without dropping tables.
    """
    engine = create_async_engine(TEST_DATABASE_URL, echo=False)
    conn = await engine.connect()
    await conn.begin()
    session = AsyncSession(
        bind=conn,
        expire_on_commit=False,
        join_transaction_mode="create_savepoint",
    )
    try:
        yield session
    finally:
        await session.close()
        await conn.rollback()
        await conn.close()
    await engine.dispose()


@pytest_asyncio.fixture
async def client(db: AsyncSession) -> AsyncClient:
    async def override_get_db():
        yield db

    app.dependency_overrides[get_db] = override_get_db
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as c:
        yield c
    app.dependency_overrides.clear()


@pytest_asyncio.fixture
async def auth_client(client: AsyncClient) -> AsyncClient:
    await client.post("/api/v1/auth/register", json={"email": "test@example.com", "password": "password123"})
    await client.post("/api/v1/auth/login", json={"email": "test@example.com", "password": "password123"})
    return client


@pytest_asyncio.fixture
async def stadium_payload() -> dict:
    return {
        "name": "Camp Nou",
        "city": "Barcelona",
        "country": "España",
        "latitude": 41.3809,
        "longitude": 2.1228,
        "capacity": 99354,
        "year_opened": 1957,
        "current_team": "FC Barcelona",
    }
