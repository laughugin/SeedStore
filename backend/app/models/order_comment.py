from sqlalchemy import Column, Integer, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base

class OrderComment(Base):
    __tablename__ = "order_comments"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    comment = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    order = relationship("Order", back_populates="comments")
    user = relationship("User", back_populates="order_comments") 