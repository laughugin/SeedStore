from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class OrderCommentBase(BaseModel):
    comment: str

class OrderCommentCreate(OrderCommentBase):
    order_id: int

class OrderCommentUpdate(OrderCommentBase):
    pass

class OrderCommentInDBBase(OrderCommentBase):
    id: int
    order_id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class OrderComment(OrderCommentInDBBase):
    user_email: Optional[str] = None
    user_full_name: Optional[str] = None 