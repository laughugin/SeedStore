from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserAddressBase(BaseModel):
    phone: str
    address: str
    city: str
    postal_code: str

class UserAddressCreate(UserAddressBase):
    pass

class UserAddressUpdate(UserAddressBase):
    phone: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None

class UserAddress(UserAddressBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = True
    is_superuser: bool = False
    full_name: Optional[str] = None
    theme: Optional[str] = "light"
    user_uid: Optional[str] = None
    verified: Optional[bool] = False

class UserCreate(UserBase):
    email: EmailStr
    password: str
    user_uid: str

class UserUpdate(UserBase):
    password: Optional[str] = None
    theme: Optional[str] = None
    verified: Optional[bool] = None

class UserInDBBase(UserBase):
    id: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    addresses: List[UserAddress] = []

    class Config:
        orm_mode = True
        populate_by_name = True
        json_encoders = {
            datetime: lambda v: v.isoformat() if v else None
        }

class User(UserInDBBase):
    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "full_name": "John Doe",
                "is_active": True,
                "is_superuser": False,
                "theme": "light",
                "user_uid": "user123",
                "verified": False,
                "id": 1,
                "created_at": "2024-04-11T00:00:00",
                "updated_at": "2024-04-11T00:00:00",
                "addresses": []
            }
        }

class UserInDB(UserInDBBase):
    hashed_password: str 