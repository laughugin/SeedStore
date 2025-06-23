from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from app.crud.base import CRUDBase
from app.models.order import Order, OrderItem
from app.schemas.order import OrderCreate, OrderUpdate, Order as OrderSchema

class CRUDOrder(CRUDBase[Order, OrderCreate, OrderUpdate]):
    def get_multi(
        self, db: Session, *, skip: int = 0, limit: int = 100
    ) -> List[Order]:
        orders = (
            db.query(self.model)
            .options(joinedload(Order.order_items).joinedload(OrderItem.product))
            .offset(skip)
            .limit(limit)
            .all()
        )
        # Ensure product_id is set for each order item
        for order in orders:
            for item in order.order_items:
                if item.product:
                    item.product_id = item.product.id
        return orders

    def get_multi_by_owner(
        self, db: Session, *, owner_id: int, skip: int = 0, limit: int = 100
    ) -> List[Order]:
        orders = (
            db.query(self.model)
            .filter(Order.user_id == owner_id)
            .options(joinedload(Order.order_items).joinedload(OrderItem.product))
            .offset(skip)
            .limit(limit)
            .all()
        )
        # Ensure product_id is set for each order item
        for order in orders:
            for item in order.order_items:
                if item.product:
                    item.product_id = item.product.id
        return orders

    def get_by_user(
        self, db: Session, *, user_id: int, skip: int = 0, limit: int = 100
    ) -> List[Order]:
        orders = (
            db.query(self.model)
            .filter(Order.user_id == user_id)
            .options(joinedload(Order.order_items).joinedload(OrderItem.product))
            .offset(skip)
            .limit(limit)
            .all()
        )
        # Ensure product_id is set for each order item
        for order in orders:
            for item in order.order_items:
                if item.product:
                    item.product_id = item.product.id
        return orders

    def get_by_status(
        self, db: Session, *, status: str, skip: int = 0, limit: int = 100
    ) -> List[Order]:
        orders = (
            db.query(self.model)
            .filter(Order.status == status)
            .options(joinedload(Order.order_items).joinedload(OrderItem.product))
            .offset(skip)
            .limit(limit)
            .all()
        )
        # Ensure product_id is set for each order item
        for order in orders:
            for item in order.order_items:
                if item.product:
                    item.product_id = item.product.id
        return orders

    def create_with_owner(
        self, db: Session, *, obj_in: OrderCreate, owner_id: int
    ) -> OrderSchema:
        # Create the order
        order_data = obj_in.dict(exclude={'items'})
        order_data['user_id'] = owner_id
        db_order = Order(**order_data)
        db.add(db_order)
        db.flush()  # Flush to get the order ID

        # Create order items
        for item in obj_in.items:
            db_item = OrderItem(
                order_id=db_order.id,
                product_id=item.product_id,
                quantity=item.quantity,
                price=item.price
            )
            db.add(db_item)

        db.commit()
        
        # Reload the order with its items
        db_order = (
            db.query(Order)
            .options(joinedload(Order.order_items).joinedload(OrderItem.product))
            .filter(Order.id == db_order.id)
            .first()
        )
        
        # Ensure product_id is set for each order item
        if db_order:
            for item in db_order.order_items:
                if item.product:
                    item.product_id = item.product.id
        
        # Convert to Pydantic model
        return OrderSchema.from_orm(db_order)

order = CRUDOrder(Order) 