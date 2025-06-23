from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from .product import Product

class CartItemBase(BaseModel):
    product_id: int
    quantity: int = 1

class CartItemCreate(CartItemBase):
    pass

class CartItemUpdate(CartItemBase):
    quantity: Optional[int] = None

class CartItemInDBBase(CartItemBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    product: Optional[Product] = None

    class Config:
        orm_mode = True

class CartItem(CartItemInDBBase):
    pass

class CartItemList(BaseModel):
    items: List[CartItem]
    total: float 