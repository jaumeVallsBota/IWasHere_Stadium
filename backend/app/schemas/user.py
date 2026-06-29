from datetime import datetime

from pydantic import BaseModel, EmailStr


class UserPublic(BaseModel):
    model_config = {"from_attributes": True}

    id: str
    email: EmailStr
    created_at: datetime


class UserUpdate(BaseModel):
    email: EmailStr | None = None
