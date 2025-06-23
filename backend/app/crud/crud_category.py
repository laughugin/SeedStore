from typing import List, Optional
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryUpdate

class CRUDCategory(CRUDBase[Category, CategoryCreate, CategoryUpdate]):
    def get_by_name(
        self, db: Session, *, name: str, skip: int = 0, limit: int = 100
    ) -> List[Category]:
        return (
            db.query(self.model)
            .filter(Category.name.ilike(f"%{name}%"))
            .offset(skip)
            .limit(limit)
            .all()
        )

category = CRUDCategory(Category) 