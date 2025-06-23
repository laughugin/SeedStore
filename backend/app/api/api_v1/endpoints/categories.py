from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()

@router.get("/", response_model=List[schemas.Category])
def read_categories(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve categories.
    """
    categories = crud.category.get_multi(db, skip=skip, limit=limit)
    return [schemas.Category.from_orm(cat) for cat in categories]

@router.post("/", response_model=schemas.Category)
def create_category(
    *,
    db: Session = Depends(deps.get_db),
    category_in: schemas.CategoryCreate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Create new category.
    """
    # Check if category with same name exists
    existing_category = db.query(models.Category).filter(models.Category.name.ilike(category_in.name)).first()
    if existing_category:
        raise HTTPException(
            status_code=400,
            detail="Category with this name already exists"
        )
    category = crud.category.create(db, obj_in=category_in)
    return schemas.Category.from_orm(category)

@router.put("/{id}", response_model=schemas.Category)
def update_category(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    category_in: schemas.CategoryUpdate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Update a category.
    """
    category = crud.category.get(db, id=id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    category = crud.category.update(db, db_obj=category, obj_in=category_in)
    return schemas.Category.from_orm(category)

@router.get("/{id}", response_model=schemas.Category)
def read_category(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
) -> Any:
    """
    Get category by ID.
    """
    category = crud.category.get(db, id=id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return schemas.Category.from_orm(category)

@router.delete("/{id}", response_model=schemas.Category)
def delete_category(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Delete a category.
    """
    category = crud.category.get(db, id=id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    category = crud.category.remove(db, id=id)
    return schemas.Category.from_orm(category) 