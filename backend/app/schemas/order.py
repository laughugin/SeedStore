from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime

class ProductBase(BaseModel):
    id: int
    name: str
    image_url: Optional[str] = None

    class Config:
        orm_mode = True

class OrderItemBase(BaseModel):
    product_id: Optional[int] = None
    quantity: int
    price: float

class OrderItemCreate(OrderItemBase):
    product_id: int  # Required for creation

class OrderItem(OrderItemBase):
    id: int
    order_id: int
    product: Optional[ProductBase] = None

    class Config:
        orm_mode = True

class OrderBase(BaseModel):
    user_id: int
    total_amount: float
    status: str

class OrderCreate(OrderBase):
    items: List[OrderItemCreate]

class OrderUpdate(OrderBase):
    status: Optional[str] = None
    total_amount: Optional[float] = None

class OrderInDBBase(OrderBase):
    id: int
    created_at: datetime
    updated_at: datetime
    order_items: List[OrderItem]

    class Config:
        orm_mode = True

class Order(BaseModel):
    id: int
    user_id: int
    total_amount: float
    status: str
    created_at: datetime
    updated_at: datetime
    order_items: List[OrderItem]

    class Config:
        orm_mode = True

    @property
    def status_display(self) -> str:
        status_map = {
            'pending': 'Ожидает обработки',
            'processing': 'В обработке',
            'shipped': 'Отправлен',
            'delivered': 'Доставлен',
            'cancelled': 'Отменен'
        }
        return status_map.get(self.status, self.status)

class OrderInDB(OrderInDBBase):
    pass 