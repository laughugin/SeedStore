from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app import crud, models, schemas
from app.api import deps
from app.models.product import Product
from app.models.category import Category
from app.models.manufacturer import Manufacturer

router = APIRouter()

@router.post("/search", response_model=List[schemas.Product])
def ai_search_products(
    *,
    db: Session = Depends(deps.get_db),
    prompt: str,
) -> Any:
    """
    AI-powered product search based on natural language prompt.
    The agent will analyze the prompt and return relevant products.
    """
    # Convert prompt to lowercase for case-insensitive search
    prompt = prompt.lower()
    
    # Split prompt into words for better matching
    words = prompt.split()
    
    # Initialize query
    query = db.query(Product)
    
    # Search in product names and descriptions
    name_conditions = [Product.name.ilike(f"%{word}%") for word in words]
    desc_conditions = [Product.description.ilike(f"%{word}%") for word in words]
    
    # Search in categories
    category_conditions = [Category.name.ilike(f"%{word}%") for word in words]
    
    # Search in manufacturers
    manufacturer_conditions = [Manufacturer.name.ilike(f"%{word}%") for word in words]
    
    # Combine all conditions
    query = query.join(Category).join(Manufacturer).filter(
        or_(
            *name_conditions,
            *desc_conditions,
            *category_conditions,
            *manufacturer_conditions
        )
    )
    
    # Get results
    products = query.all()
    
    if not products:
        raise HTTPException(
            status_code=404,
            detail="No products found matching your description"
        )
    
    return [schemas.Product.from_orm(product) for product in products]

@router.post("/recommend", response_model=List[schemas.Product])
def ai_recommend_products(
    *,
    db: Session = Depends(deps.get_db),
    prompt: str,
    limit: int = 5
) -> Any:
    """
    AI-powered product recommendations based on natural language prompt.
    The agent will analyze the prompt and recommend relevant products.
    """
    # First, get products based on search
    products = ai_search_products(db=db, prompt=prompt)
    
    # If we have fewer products than the limit, return all of them
    if len(products) <= limit:
        return products
    
    # Otherwise, return the top N products
    return products[:limit] 