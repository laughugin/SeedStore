from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base

class Manufacturer(Base):
    __tablename__ = "manufacturers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    website = Column(String, nullable=True)
    country = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    products = relationship("Product", back_populates="manufacturer")

    def __init__(self, **kwargs):
        for key, value in kwargs.items():
            setattr(self, key, value)
        if not self.created_at:
            self.created_at = datetime.utcnow()
        if not self.updated_at:
            self.updated_at = datetime.utcnow()

    def dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "website": self.website,
            "country": self.country,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        } 