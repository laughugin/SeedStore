from typing import Optional
from pydantic import BaseModel, AnyHttpUrl
from datetime import datetime

class ManufacturerBase(BaseModel):
    name: str
    website: Optional[str] = None
    country: Optional[str] = None

class ManufacturerCreate(ManufacturerBase):
    pass

class ManufacturerUpdate(ManufacturerBase):
    pass

class Manufacturer(ManufacturerBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True 