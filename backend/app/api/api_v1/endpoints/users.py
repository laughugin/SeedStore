from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app import crud, models, schemas
from app.api import deps

router = APIRouter()

class ThemeUpdate(BaseModel):
    theme: str

class ProfileUpdate(BaseModel):
    surname: str
    phone: str
    address: str
    city: str
    postal_code: str

class UserBlockUpdate(BaseModel):
    is_active: bool

@router.get("/", response_model=List[schemas.User])
def read_users(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Retrieve users.
    """
    users = crud.user.get_multi(db, skip=skip, limit=limit)
    return users

@router.post("/", response_model=schemas.User)
def create_user(
    *,
    db: Session = Depends(deps.get_db),
    user_in: schemas.UserCreate,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Create new user.
    """
    user = crud.user.get_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    user = crud.user.create(db, obj_in=user_in)
    return user

@router.put("/me", response_model=schemas.User)
def update_user_me(
    *,
    db: Session = Depends(deps.get_db),
    user_in: schemas.UserUpdate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update own user.
    """
    user = crud.user.update(db, db_obj=current_user, obj_in=user_in)
    return user.dict()

@router.put("/profile", response_model=schemas.User)
def update_user_profile(
    *,
    db: Session = Depends(deps.get_db),
    profile_in: ProfileUpdate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update user profile and handle verification.
    """
    # Validate phone number format
    import re
    phone_pattern = r'^\+375\s[0-9]{2}\s[0-9]{3}-[0-9]{2}-[0-9]{2}$'
    if not re.match(phone_pattern, profile_in.phone):
        raise HTTPException(
            status_code=400,
            detail="Invalid phone number format. Use format: +375 XX XXX-XX-XX"
        )

    # Validate postal code format
    postal_code_pattern = r'^[0-9]{6}$'
    if not re.match(postal_code_pattern, profile_in.postal_code):
        raise HTTPException(
            status_code=400,
            detail="Invalid postal code format. Use format: XXXXXX"
        )

    # Check if all required fields are filled
    is_verified = all([
        profile_in.surname.strip(),
        profile_in.phone.strip(),
        profile_in.address.strip(),
        profile_in.city.strip(),
        profile_in.postal_code.strip()
    ])

    # Update user profile
    update_data = {
        "full_name": profile_in.surname,
        "verified": is_verified
    }
    
    user = crud.user.update(db, db_obj=current_user, obj_in=update_data)
    
    # Update or create address
    address_data = {
        "phone": profile_in.phone,
        "address": profile_in.address,
        "city": profile_in.city,
        "postal_code": profile_in.postal_code
    }

    # Check if user already has an address
    existing_address = db.query(models.UserAddress).filter(
        models.UserAddress.user_id == current_user.id
    ).first()

    if existing_address:
        # Update existing address
        for key, value in address_data.items():
            setattr(existing_address, key, value)
    else:
        # Create new address
        new_address = models.UserAddress(
            user_id=current_user.id,
            **address_data
        )
        db.add(new_address)

    db.commit()
    db.refresh(user)
    
    return user.dict()

@router.get("/me", response_model=schemas.User)
def read_user_me(
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get current user.
    """
    return current_user.dict()

@router.get("/{user_id}", response_model=schemas.User)
def read_user_by_id(
    user_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get a specific user by id.
    """
    user = crud.user.get(db, id=user_id)
    if user == current_user:
        return user.dict()
    if not crud.user.is_superuser(current_user):
        raise HTTPException(
            status_code=400, detail="The user doesn't have enough privileges"
        )
    return user.dict()

@router.post("/theme", response_model=schemas.User)
def update_user_theme(
    *,
    db: Session = Depends(deps.get_db),
    theme_in: ThemeUpdate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update user theme preference.
    """
    if theme_in.theme not in ["light", "dark"]:
        raise HTTPException(
            status_code=400,
            detail="Theme must be either 'light' or 'dark'"
        )
    
    user = crud.user.update(
        db,
        db_obj=current_user,
        obj_in={"theme": theme_in.theme}
    )
    return user 

@router.put("/{user_id}/block", response_model=schemas.User)
def block_user(
    user_id: int,
    block_data: UserBlockUpdate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    """
    Block or unblock a user.
    """
    user = crud.user.get(db, id=user_id)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    # Prevent blocking superusers
    if user.is_superuser:
        raise HTTPException(
            status_code=400,
            detail="Cannot block superusers"
        )
    
    user = crud.user.update(db, db_obj=user, obj_in={"is_active": block_data.is_active})
    return user.dict() 