import pytest
from httpx import AsyncClient


@pytest.fixture
async def stadium_id(auth_client: AsyncClient, stadium_payload: dict) -> str:
    response = await auth_client.post("/api/v1/stadiums", json=stadium_payload)
    return response.json()["id"]


@pytest.fixture
def matchday_payload() -> dict:
    return {
        "visit_type": "matchday",
        "date": "2024-11-23",
        "match_home_team": "FC Barcelona",
        "match_away_team": "Real Madrid",
        "match_competition": "La Liga",
        "match_score": "3-2",
        "rating": 5,
    }


@pytest.fixture
def tour_payload() -> dict:
    return {
        "visit_type": "tour",
        "date": "2024-06-15",
        "tour_overall_impression": "Muy bueno",
        "tour_highlights": "Las vistas desde la tribuna son increíbles",
        "tour_would_recommend": True,
        "tour_guide_quality": "Excelente",
        "tour_duration_minutes": 90,
        "rating": 5,
    }


async def test_create_matchday_visit(auth_client: AsyncClient, stadium_id: str, matchday_payload: dict):
    response = await auth_client.post(f"/api/v1/stadiums/{stadium_id}/visits", json=matchday_payload)
    assert response.status_code == 201
    data = response.json()
    assert data["visit_type"] == "matchday"
    assert data["match_home_team"] == "FC Barcelona"


async def test_create_tour_visit(auth_client: AsyncClient, stadium_id: str, tour_payload: dict):
    response = await auth_client.post(f"/api/v1/stadiums/{stadium_id}/visits", json=tour_payload)
    assert response.status_code == 201
    data = response.json()
    assert data["visit_type"] == "tour"
    assert data["tour_overall_impression"] == "Muy bueno"


async def test_tour_requires_impression(auth_client: AsyncClient, stadium_id: str):
    response = await auth_client.post(
        f"/api/v1/stadiums/{stadium_id}/visits",
        json={"visit_type": "tour", "date": "2024-06-15"},
    )
    assert response.status_code == 422


async def test_list_stadium_visits(auth_client: AsyncClient, stadium_id: str, matchday_payload: dict):
    await auth_client.post(f"/api/v1/stadiums/{stadium_id}/visits", json=matchday_payload)
    response = await auth_client.get(f"/api/v1/stadiums/{stadium_id}/visits")
    assert response.status_code == 200
    assert len(response.json()) >= 1


async def test_get_visit(auth_client: AsyncClient, stadium_id: str, matchday_payload: dict):
    create = await auth_client.post(f"/api/v1/stadiums/{stadium_id}/visits", json=matchday_payload)
    visit_id = create.json()["id"]

    response = await auth_client.get(f"/api/v1/visits/{visit_id}")
    assert response.status_code == 200
    assert response.json()["id"] == visit_id


async def test_update_visit(auth_client: AsyncClient, stadium_id: str, matchday_payload: dict):
    create = await auth_client.post(f"/api/v1/stadiums/{stadium_id}/visits", json=matchday_payload)
    visit_id = create.json()["id"]

    response = await auth_client.patch(f"/api/v1/visits/{visit_id}", json={"rating": 3, "notes": "Buen partido"})
    assert response.status_code == 200
    assert response.json()["rating"] == 3


async def test_delete_visit(auth_client: AsyncClient, stadium_id: str, matchday_payload: dict):
    create = await auth_client.post(f"/api/v1/stadiums/{stadium_id}/visits", json=matchday_payload)
    visit_id = create.json()["id"]

    response = await auth_client.delete(f"/api/v1/visits/{visit_id}")
    assert response.status_code == 204

    response = await auth_client.get(f"/api/v1/visits/{visit_id}")
    assert response.status_code == 404


async def test_visit_rating_out_of_range(auth_client: AsyncClient, stadium_id: str, matchday_payload: dict):
    matchday_payload["rating"] = 6
    response = await auth_client.post(f"/api/v1/stadiums/{stadium_id}/visits", json=matchday_payload)
    assert response.status_code == 422


async def test_cannot_access_other_users_visit(client: AsyncClient, auth_client: AsyncClient, stadium_id: str, matchday_payload: dict):
    create = await auth_client.post(f"/api/v1/stadiums/{stadium_id}/visits", json=matchday_payload)
    visit_id = create.json()["id"]

    # Register a second user and try to access the visit
    await client.post("/api/v1/auth/register", json={"email": "other@example.com", "password": "password123"})
    await client.post("/api/v1/auth/login", json={"email": "other@example.com", "password": "password123"})
    response = await client.get(f"/api/v1/visits/{visit_id}")
    assert response.status_code == 403
