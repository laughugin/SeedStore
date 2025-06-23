from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()

@router.get("/order/{order_id}", response_model=List[schemas.OrderComment])
def get_order_comments(
    order_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get comments for a specific order.
    """
    # Check if user has access to the order
    order = crud.order.get(db=db, id=order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if not crud.user.is_superuser(current_user) and order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    comments = crud.order_comment.get_by_order(db=db, order_id=order_id)
    # Add user info to comments
    for comment in comments:
        user = crud.user.get(db=db, id=comment.user_id)
        if user:
            comment.user_email = user.email
            comment.user_full_name = user.full_name
    return comments

@router.post("/", response_model=schemas.OrderComment)
def create_order_comment(
    *,
    db: Session = Depends(deps.get_db),
    comment_in: schemas.OrderCommentCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create a new comment for an order.
    """
    # Check if user has access to the order
    order = crud.order.get(db=db, id=comment_in.order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if not crud.user.is_superuser(current_user) and order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    comment = crud.order_comment.create_with_user(
        db=db, obj_in=comment_in, user_id=current_user.id
    )
    # Add user info to comment
    comment.user_email = current_user.email
    comment.user_full_name = current_user.full_name
    return comment 