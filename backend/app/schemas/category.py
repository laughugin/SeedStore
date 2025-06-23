from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class CategoryBase(BaseModel):
    name: str

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class CategoryInDB(Category):
    pass 