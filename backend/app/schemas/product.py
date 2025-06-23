from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    image_url: Optional[str] = None
    category_id: Optional[int] = None
    manufacturer_id: Optional[int] = None
    average_rating: Optional[float] = 0.0
    in_stock: Optional[bool] = True

class ProductCreate(ProductBase):
    pass

class ProductUpdate(ProductBase):
    name: Optional[str] = None
    price: Optional[float] = None
    category_id: Optional[int] = None
    manufacturer_id: Optional[int] = None
    average_rating: Optional[float] = None
    in_stock: Optional[bool] = None

class ProductInDBBase(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class Product(ProductInDBBase):
    pass

class ProductInDB(ProductInDBBase):
    pass 