from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()

@router.get("/", response_model=List[schemas.Review])
def read_reviews(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve reviews.
    """
    reviews = crud.review.get_multi(db, skip=skip, limit=limit)
    return reviews

@router.post("/", response_model=schemas.Review)
def create_review(
    *,
    db: Session = Depends(deps.get_db),
    review_in: schemas.ReviewCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new review.
    """
    # Check if product exists
    product = crud.product.get(db, id=review_in.product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Create review
    review = crud.review.create_with_user(
        db=db, obj_in=review_in, user_id=current_user.id
    )
    
    # Update product's average rating
    product.update_average_rating(db)
    
    # Add user info to review
    review.user_name = current_user.full_name
    review.user_email = current_user.email
    
    return schemas.Review.from_orm(review)

@router.get("/product/{product_id}", response_model=List[schemas.Review])
def read_product_reviews(
    *,
    db: Session = Depends(deps.get_db),
    product_id: int,
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Get reviews for a specific product.
    """
    reviews = crud.review.get_by_product(
        db=db, product_id=product_id, skip=skip, limit=limit
    )
    
    # Add user info to each review
    for review in reviews:
        user = crud.user.get(db=db, id=review.user_id)
        if user:
            review.user_name = user.full_name
            review.user_email = user.email
    
    return [schemas.Review.from_orm(review) for review in reviews]

@router.put("/{id}", response_model=schemas.Review)
def update_review(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    review_in: schemas.ReviewUpdate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update a review.
    """
    review = crud.review.get(db, id=id)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    if review.user_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    review = crud.review.update(db, db_obj=review, obj_in=review_in)
    
    # Update product's average rating
    product = crud.product.get(db, id=review.product_id)
    if product:
        product.update_average_rating(db)
    
    # Add user info to review
    user = crud.user.get(db=db, id=review.user_id)
    if user:
        review.user_name = user.full_name
        review.user_email = user.email
    
    return schemas.Review.from_orm(review)

@router.get("/{id}", response_model=schemas.Review)
def read_review(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get review by ID.
    """
    review = crud.review.get(db=db, id=id)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    
    # Add user info to review
    user = crud.user.get(db=db, id=review.user_id)
    if user:
        review.user_name = user.full_name
        review.user_email = user.email
    
    return schemas.Review.from_orm(review)

@router.delete("/{id}", response_model=schemas.Review)
def delete_review(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Delete a review.
    """
    review = crud.review.get(db, id=id)
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    if review.user_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    # Get product before deleting review
    product = crud.product.get(db, id=review.product_id)
    
    review = crud.review.remove(db, id=id)
    
    # Update product's average rating
    if product:
        product.update_average_rating(db)
    
    return schemas.Review.from_orm(review) 