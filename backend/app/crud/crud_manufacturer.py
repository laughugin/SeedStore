from typing import List, Optional
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.manufacturer import Manufacturer
from app.schemas.manufacturer import ManufacturerCreate, ManufacturerUpdate

class CRUDManufacturer(CRUDBase[Manufacturer, ManufacturerCreate, ManufacturerUpdate]):
    def get_by_name(
        self, db: Session, *, name: str, skip: int = 0, limit: int = 100
    ) -> List[Manufacturer]:
        return (
            db.query(self.model)
            .filter(Manufacturer.name.ilike(f"%{name}%"))
            .offset(skip)
            .limit(limit)
            .all()
        )

manufacturer = CRUDManufacturer(Manufacturer) 