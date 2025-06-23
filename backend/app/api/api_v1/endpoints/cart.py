from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()

@router.get("/", response_model=schemas.CartItemList)
def get_cart(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get current user's cart items.
    """
    cart_items = crud.cart.get_cart_items(db, user_id=current_user.id)
    total = crud.cart.get_cart_total(db, user_id=current_user.id)
    return {"items": cart_items, "total": total}

@router.post("/", response_model=schemas.CartItem)
def add_to_cart(
    *,
    db: Session = Depends(deps.get_db),
    cart_item_in: schemas.CartItemCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Add item to cart.
    """
    cart_item = crud.cart.create_cart_item(
        db=db,
        cart_item=cart_item_in,
        user_id=current_user.id
    )
    return cart_item

@router.put("/{cart_item_id}", response_model=schemas.CartItem)
def update_cart_item(
    *,
    db: Session = Depends(deps.get_db),
    cart_item_id: int,
    cart_item_in: schemas.CartItemUpdate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update cart item quantity.
    """
    cart_item = crud.cart.update_cart_item(
        db=db,
        cart_item_id=cart_item_id,
        cart_item=cart_item_in,
        user_id=current_user.id
    )
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    return cart_item

@router.delete("/item/{cart_item_id}")
def delete_cart_item(
    *,
    db: Session = Depends(deps.get_db),
    cart_item_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Delete cart item.
    """
    success = crud.cart.delete_cart_item(
        db=db,
        cart_item_id=cart_item_id,
        user_id=current_user.id
    )
    if not success:
        raise HTTPException(status_code=404, detail="Cart item not found")
    return {"status": "success"}

@router.delete("/clear")
def clear_cart(
    *,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Clear all items from cart.
    """
    crud.cart.clear_cart(db=db, user_id=current_user.id)
    return {"status": "success"} 