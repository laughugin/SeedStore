from typing import List, Optional
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.review import Review
from app.schemas.review import ReviewCreate, ReviewUpdate

class CRUDReview(CRUDBase[Review, ReviewCreate, ReviewUpdate]):
    def create_with_user(
        self, db: Session, *, obj_in: ReviewCreate, user_id: int
    ) -> Review:
        obj_in_data = obj_in.dict()
        db_obj = self.model(**obj_in_data, user_id=user_id)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_by_product(
        self, db: Session, *, product_id: int, skip: int = 0, limit: int = 100
    ) -> List[Review]:
        return (
            db.query(self.model)
            .filter(Review.product_id == product_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_user(
        self, db: Session, *, user_id: int, skip: int = 0, limit: int = 100
    ) -> List[Review]:
        return (
            db.query(self.model)
            .filter(Review.user_id == user_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

review = CRUDReview(Review) 