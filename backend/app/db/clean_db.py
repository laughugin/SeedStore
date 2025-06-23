from app.db.base import Base
from app.db.session import engine
from sqlalchemy.orm import Session
from app.db.init_db import init_db

def clean_db() -> None:
    # Drop all tables
    Base.metadata.drop_all(bind=engine)
    
    # Recreate all tables
    Base.metadata.create_all(bind=engine)
    
    # Initialize with default data
    db = Session(engine)
    init_db(db)
    db.close()

if __name__ == "__main__":
    clean_db() 