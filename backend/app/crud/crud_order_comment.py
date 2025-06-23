from typing import List, Optional
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.order_comment import OrderComment
from app.schemas.order_comment import OrderCommentCreate, OrderCommentUpdate

class CRUDOrderComment(CRUDBase[OrderComment, OrderCommentCreate, OrderCommentUpdate]):
    def get_by_order(
        self, db: Session, *, order_id: int, skip: int = 0, limit: int = 100
    ) -> List[OrderComment]:
        return (
            db.query(self.model)
            .filter(OrderComment.order_id == order_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def create_with_user(
        self, db: Session, *, obj_in: OrderCommentCreate, user_id: int
    ) -> OrderComment:
        db_obj = OrderComment(
            comment=obj_in.comment,
            order_id=obj_in.order_id,
            user_id=user_id
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

order_comment = CRUDOrderComment(OrderComment) 