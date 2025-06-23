from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()

@router.get("/", response_model=List[schemas.Product])
def read_products(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve products.
    """
    products = crud.product.get_multi(db, skip=skip, limit=limit)
    return [schemas.Product.from_orm(p) for p in products]

@router.post("/", response_model=schemas.Product)
def create_product(
    *,
    db: Session = Depends(deps.get_db),
    product_in: schemas.ProductCreate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Create new product.
    """
    product = crud.product.create(db, obj_in=product_in)
    return schemas.Product.from_orm(product)

@router.put("/{id}", response_model=schemas.Product)
def update_product(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    product_in: schemas.ProductUpdate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Update a product.
    """
    product = crud.product.get(db, id=id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product = crud.product.update(db, db_obj=product, obj_in=product_in)
    return schemas.Product.from_orm(product)

@router.get("/{id}", response_model=schemas.Product)
def read_product(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
) -> Any:
    """
    Get product by ID.
    """
    product = crud.product.get(db, id=id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return schemas.Product.from_orm(product)

@router.delete("/{id}", response_model=schemas.Product)
def delete_product(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Delete a product.
    """
    product = crud.product.get(db, id=id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    product = crud.product.remove(db, id=id)
    return schemas.Product.from_orm(product) 