from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime
from app.db.base import Base

class UserAddress(Base):
    __tablename__ = "user_addresses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    phone = Column(String)
    address = Column(String)
    city = Column(String)
    postal_code = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="addresses")

    def dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "phone": self.phone,
            "address": self.address,
            "city": self.city,
            "postal_code": self.postal_code,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        }

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    theme = Column(String, default="light")
    user_uid = Column(String, unique=True, index=True)
    verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Use string references for relationships to avoid circular imports
    reviews = relationship("Review", back_populates="user", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="user", cascade="all, delete-orphan")
    cart_items = relationship("CartItem", back_populates="user", cascade="all, delete-orphan")
    addresses = relationship("UserAddress", back_populates="user", cascade="all, delete-orphan")
    order_comments = relationship("OrderComment", back_populates="user", cascade="all, delete-orphan")

    def __init__(self, **kwargs):
        for key, value in kwargs.items():
            setattr(self, key, value)

    def dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "full_name": self.full_name,
            "is_active": self.is_active,
            "is_superuser": self.is_superuser,
            "theme": self.theme,
            "user_uid": self.user_uid,
            "verified": self.verified,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "addresses": [address.dict() for address in self.addresses] if self.addresses else []
        } 