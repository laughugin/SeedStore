from app.db.base import Base
from app.db.session import engine
from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import get_password_hash

# Import all models here so SQLAlchemy knows about them
from app.models.category import Category
from app.models.manufacturer import Manufacturer
from app.models.product import Product
from app.models.review import Review
from app.models.order import Order

def init_db(db: Session) -> None:
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    # Create admin user
    admin = User(
        email="admin@example.com",
        hashed_password=get_password_hash("admin123"),
        full_name="Admin User",
        is_superuser=True,
        is_active=True
    )
    db.add(admin)
    
    db.commit()

if __name__ == "__main__":
    init_db() 