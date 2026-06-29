from httpx import AsyncClient


async def test_submit_stadium_requires_auth(client: AsyncClient, stadium_payload: dict):
    response = await client.post("/api/v1/stadiums", json=stadium_payload)
    assert response.status_code == 401


async def test_submit_stadium_authenticated(auth_client: AsyncClient, stadium_payload: dict):
    response = await auth_client.post("/api/v1/stadiums", json=stadium_payload)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == stadium_payload["name"]
    assert data["status"] == "pending_review"


async def test_get_stadium(auth_client: AsyncClient, stadium_payload: dict):
    create = await auth_client.post("/api/v1/stadiums", json=stadium_payload)
    stadium_id = create.json()["id"]

    response = await auth_client.get(f"/api/v1/stadiums/{stadium_id}")
    assert response.status_code == 200
    assert response.json()["id"] == stadium_id


async def test_get_stadium_not_found(client: AsyncClient):
    response = await client.get("/api/v1/stadiums/nonexistent-id")
    assert response.status_code == 404


async def test_search_stadiums(auth_client: AsyncClient, stadium_payload: dict):
    await auth_client.post("/api/v1/stadiums", json=stadium_payload)
    # Pending stadiums are visible to the submitting user
    response = await auth_client.get("/api/v1/stadiums?name=Camp")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


async def test_get_stadium_teams(auth_client: AsyncClient, stadium_payload: dict):
    create = await auth_client.post("/api/v1/stadiums", json=stadium_payload)
    stadium_id = create.json()["id"]

    response = await auth_client.get(f"/api/v1/stadiums/{stadium_id}/teams")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
