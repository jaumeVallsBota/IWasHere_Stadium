from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import auth, stadiums, visits, leagues, me

app = FastAPI(title="Stadium Presence Tracker API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_PREFIX = "/api/v1"

app.include_router(auth.router, prefix=f"{API_PREFIX}/auth", tags=["auth"])
app.include_router(stadiums.router, prefix=f"{API_PREFIX}/stadiums", tags=["stadiums"])
app.include_router(visits.stadium_visits_router, prefix=f"{API_PREFIX}/stadiums", tags=["visits"])
app.include_router(visits.router, prefix=f"{API_PREFIX}/visits", tags=["visits"])
app.include_router(leagues.router, prefix=f"{API_PREFIX}/leagues", tags=["leagues"])
app.include_router(me.router, prefix=f"{API_PREFIX}/me", tags=["me"])
