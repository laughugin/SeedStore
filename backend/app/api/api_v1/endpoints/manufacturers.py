from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.crud import crud_manufacturer
from app.schemas.manufacturer import Manufacturer, ManufacturerCreate, ManufacturerUpdate
from app.models.manufacturer import Manufacturer as ManufacturerModel

router = APIRouter()

@router.get("/", response_model=List[Manufacturer])
def read_manufacturers(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
):
    manufacturers = crud_manufacturer.manufacturer.get_multi(db, skip=skip, limit=limit)
    return [Manufacturer.from_orm(m) for m in manufacturers]

@router.post("/", response_model=Manufacturer)
def create_manufacturer(
    *,
    db: Session = Depends(deps.get_db),
    manufacturer_in: ManufacturerCreate,
):
    # Check if manufacturer with same name exists
    existing_manufacturer = db.query(ManufacturerModel).filter(ManufacturerModel.name.ilike(manufacturer_in.name)).first()
    if existing_manufacturer:
        raise HTTPException(
            status_code=400,
            detail="Manufacturer with this name already exists"
        )
    manufacturer = crud_manufacturer.manufacturer.create(db, obj_in=manufacturer_in)
    return Manufacturer.from_orm(manufacturer)

@router.put("/{manufacturer_id}", response_model=Manufacturer)
def update_manufacturer(
    *,
    db: Session = Depends(deps.get_db),
    manufacturer_id: int,
    manufacturer_in: ManufacturerUpdate,
):
    manufacturer = crud_manufacturer.manufacturer.get(db, id=manufacturer_id)
    if not manufacturer:
        raise HTTPException(status_code=404, detail="Manufacturer not found")
    manufacturer = crud_manufacturer.manufacturer.update(
        db, db_obj=manufacturer, obj_in=manufacturer_in
    )
    return Manufacturer.from_orm(manufacturer)

@router.delete("/{manufacturer_id}", response_model=Manufacturer)
def delete_manufacturer(
    *,
    db: Session = Depends(deps.get_db),
    manufacturer_id: int,
):
    manufacturer = crud_manufacturer.manufacturer.get(db, id=manufacturer_id)
    if not manufacturer:
        raise HTTPException(status_code=404, detail="Manufacturer not found")
    manufacturer = crud_manufacturer.manufacturer.remove(db, id=manufacturer_id)
    return Manufacturer.from_orm(manufacturer) 