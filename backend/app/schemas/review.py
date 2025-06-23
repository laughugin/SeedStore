from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class ReviewBase(BaseModel):
    product_id: int
    rating: int
    comment: Optional[str] = None

class ReviewCreate(ReviewBase):
    pass

class ReviewUpdate(ReviewBase):
    rating: Optional[int] = None
    comment: Optional[str] = None

class ReviewInDBBase(ReviewBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class Review(ReviewInDBBase):
    user_name: Optional[str] = None
    user_email: Optional[str] = None

class ReviewInDB(ReviewInDBBase):
    pass 