from typing import List, Optional
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate

class CRUDProduct(CRUDBase[Product, ProductCreate, ProductUpdate]):
    def get_by_category(
        self, db: Session, *, category_id: int, skip: int = 0, limit: int = 100
    ) -> List[Product]:
        return (
            db.query(self.model)
            .filter(Product.category_id == category_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_name(
        self, db: Session, *, name: str, skip: int = 0, limit: int = 100
    ) -> List[Product]:
        return (
            db.query(self.model)
            .filter(Product.name.ilike(f"%{name}%"))
            .offset(skip)
            .limit(limit)
            .all()
        )

product = CRUDProduct(Product) 