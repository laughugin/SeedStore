from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, DateTime, func, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base
from app.models.review import Review

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(Text)
    price = Column(Float)
    image_url = Column(String)
    category_id = Column(Integer, ForeignKey("categories.id"))
    manufacturer_id = Column(Integer, ForeignKey("manufacturers.id"))
    average_rating = Column(Float, default=0.0)
    in_stock = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    category = relationship("Category", back_populates="products")
    manufacturer = relationship("Manufacturer", back_populates="products")
    reviews = relationship("Review", back_populates="product")
    order_items = relationship("OrderItem", back_populates="product")
    cart_items = relationship("CartItem", back_populates="product", cascade="all, delete-orphan")

    def update_average_rating(self, db):
        """Update the average rating based on reviews"""
        avg = db.query(func.avg(Review.rating)).filter(Review.product_id == self.id).scalar()
        self.average_rating = avg if avg is not None else 0.0
        db.commit()

    def dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "price": self.price,
            "image_url": self.image_url,
            "category_id": self.category_id,
            "manufacturer_id": self.manufacturer_id,
            "average_rating": self.average_rating,
            "in_stock": self.in_stock,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "category": self.category.dict() if self.category else None,
            "manufacturer": self.manufacturer.dict() if self.manufacturer else None
        } 