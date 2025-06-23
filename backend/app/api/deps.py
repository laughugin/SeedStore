from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
import jwt

from app import crud, models, schemas
from app.core.config import settings
from app.db.session import SessionLocal

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/login/access-token"
)

def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(reusable_oauth2)
) -> models.User:
    try:
        # Decode the token without verification (since it's from Firebase)
        decoded_token = jwt.decode(token, options={"verify_signature": False})
        email = decoded_token.get("email")
        if not email:
            raise HTTPException(
                status_code=400,
                detail="Could not validate credentials - no email in token",
            )
        
        user = crud.user.get_by_email(db, email=email)
        if not user:
            # Create new user if not exists
            user_in = schemas.UserCreate(
                email=email,
                password="dummy_password",  # Not used since we're using Firebase
                full_name=email.split('@')[0],  # Use email username as full name
                is_superuser=email in settings.SUPERUSER_EMAILS
            )
            user = crud.user.create(db, obj_in=user_in)
        elif email in settings.SUPERUSER_EMAILS and not user.is_superuser:
            # Update existing user to superuser if their email is in SUPERUSER_EMAILS
            user = crud.user.update(db, db_obj=user, obj_in={"is_superuser": True})
        return user
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )

def get_current_active_user(
    current_user: models.User = Depends(get_current_user),
) -> models.User:
    if not crud.user.is_active(current_user):
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

def get_current_active_superuser(
    current_user: models.User = Depends(get_current_user),
) -> models.User:
    if not crud.user.is_superuser(current_user):
        raise HTTPException(
            status_code=400, detail="The user doesn't have enough privileges"
        )
    return current_user 