from typing import List, Optional
from sqlalchemy.orm import Session
from app import models, schemas

class CRUDCart:
    def get_cart_items(self, db: Session, user_id: int) -> List[models.CartItem]:
        return db.query(models.CartItem).filter(models.CartItem.user_id == user_id).all()

    def get_cart_item(self, db: Session, cart_item_id: int, user_id: int) -> Optional[models.CartItem]:
        return db.query(models.CartItem).filter(
            models.CartItem.id == cart_item_id,
            models.CartItem.user_id == user_id
        ).first()

    def create_cart_item(self, db: Session, cart_item: schemas.CartItemCreate, user_id: int) -> models.CartItem:
        # Check if item already exists in cart
        existing_item = db.query(models.CartItem).filter(
            models.CartItem.user_id == user_id,
            models.CartItem.product_id == cart_item.product_id
        ).first()

        if existing_item:
            # Update quantity if item exists
            existing_item.quantity += cart_item.quantity
            db.commit()
            db.refresh(existing_item)
            return existing_item

        # Create new cart item
        db_cart_item = models.CartItem(
            user_id=user_id,
            product_id=cart_item.product_id,
            quantity=cart_item.quantity
        )
        db.add(db_cart_item)
        db.commit()
        db.refresh(db_cart_item)
        return db_cart_item

    def update_cart_item(
        self,
        db: Session,
        cart_item_id: int,
        cart_item: schemas.CartItemUpdate,
        user_id: int
    ) -> Optional[models.CartItem]:
        db_cart_item = self.get_cart_item(db, cart_item_id, user_id)
        if not db_cart_item:
            return None

        if cart_item.quantity is not None:
            db_cart_item.quantity = cart_item.quantity

        db.commit()
        db.refresh(db_cart_item)
        return db_cart_item

    def delete_cart_item(self, db: Session, cart_item_id: int, user_id: int) -> bool:
        db_cart_item = self.get_cart_item(db, cart_item_id, user_id)
        if not db_cart_item:
            return False

        db.delete(db_cart_item)
        db.commit()
        return True

    def clear_cart(self, db: Session, user_id: int) -> bool:
        db.query(models.CartItem).filter(models.CartItem.user_id == user_id).delete()
        db.commit()
        return True

    def get_cart_total(self, db: Session, user_id: int) -> float:
        cart_items = self.get_cart_items(db, user_id)
        total = 0.0
        for item in cart_items:
            if item.product:
                total += item.product.price * item.quantity
        return total

cart = CRUDCart() 