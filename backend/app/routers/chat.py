from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from ..db.session import get_db
from sqlalchemy.orm import Session
from ..models.product import Product
import logging
import re

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(tags=["chat"])

class ChatRequest(BaseModel):
    prompt: str

class ChatResponse(BaseModel):
    response: str
    products: List[dict]

def extract_search_criteria(text: str) -> dict:
    criteria = {
        'max_price': None,
        'min_price': None,
        'country': None,
        'category': None,
        'manufacturer': None,
        'product_type': None,
        'exact_match': False
    }
    
    text = text.lower()
    
    # Extract price range
    price_patterns = [
        r'(\d+)\s*руб',  # "5 руб"
        r'до\s*(\d+)\s*руб',  # "до 5 руб"
        r'дешевле\s*(\d+)\s*руб',  # "дешевле 5 руб"
        r'от\s*(\d+)\s*руб',  # "от 5 руб"
        r'больше\s*(\d+)\s*руб',  # "больше 5 руб"
        r'(\d+)\s*-\s*(\d+)\s*руб'  # "5-10 руб"
    ]
    
    for pattern in price_patterns:
        matches = re.findall(pattern, text)
        if matches:
            if len(matches[0]) == 2:  # Range pattern
                criteria['min_price'] = float(matches[0][0])
                criteria['max_price'] = float(matches[0][1])
            else:
                if 'от' in text or 'больше' in text:
                    criteria['min_price'] = float(matches[0])
                else:
                    criteria['max_price'] = float(matches[0])
            break
    
    # Extract country with more variations
    countries = {
        'германия': ['германия', 'немецкий', 'немецкие', 'немецкая', 'немецкое'],
        'голландия': ['голландия', 'голландский', 'голландские', 'голландская', 'голландское'],
        'россия': ['россия', 'российский', 'российские', 'российская', 'российское'],
        'франция': ['франция', 'французский', 'французские', 'французская', 'французское'],
        'италия': ['италия', 'итальянский', 'итальянские', 'итальянская', 'итальянское'],
        'испания': ['испания', 'испанский', 'испанские', 'испанская', 'испанское']
    }
    
    for country, variations in countries.items():
        if any(var in text for var in variations):
            criteria['country'] = country
            break
    
    # Extract category with more variations
    categories = {
        'овощи': ['овощи', 'овощной', 'овощные', 'овощная'],
        'фрукты': ['фрукты', 'фруктовый', 'фруктовые', 'фруктовая'],
        'цветы': ['цветы', 'цветочный', 'цветочные', 'цветочная'],
        'семена': ['семена', 'семенной', 'семенные', 'семенная'],
        'растения': ['растения', 'растительный', 'растительные', 'растительная'],
        'деревья': ['деревья', 'дерево', 'деревце'],
        'кустарники': ['кустарники', 'кустарник', 'куст'],
        'травы': ['травы', 'трава', 'травка']
    }
    
    for category, variations in categories.items():
        if any(var in text for var in variations):
            criteria['category'] = category
            break
    
    # Extract product type with more variations
    product_types = {
        'яблоко': ['яблоко', 'яблоки', 'яблоня', 'яблони'],
        'лук': ['лук', 'луковица', 'луковицы'],
        'томат': ['томат', 'томаты', 'помидор', 'помидоры'],
        'огурец': ['огурец', 'огурцы'],
        'перец': ['перец', 'перцы'],
        'морковь': ['морковь', 'морковка'],
        'картофель': ['картофель', 'картошка'],
        'капуста': ['капуста', 'капустка'],
        'свекла': ['свекла', 'свеклу'],
        'редис': ['редис', 'редиска'],
        'петрушка': ['петрушка', 'петрушку'],
        'укроп': ['укроп', 'укропчик'],
        'базилик': ['базилик', 'базилика'],
        'розы': ['роза', 'розы'],
        'тюльпаны': ['тюльпан', 'тюльпаны'],
        'ромашки': ['ромашка', 'ромашки'],
        'лилии': ['лилия', 'лилии']
    }
    
    for product_type, variations in product_types.items():
        if any(var in text for var in variations):
            criteria['product_type'] = product_type
            # Если пользователь явно запрашивает конкретный продукт, используем точное совпадение
            if any(var in text for var in ['только', 'именно', 'конкретно']):
                criteria['exact_match'] = True
            break
    
    # Extract manufacturer
    manufacturers = {
        'агро': ['агро', 'агрофирма'],
        'семко': ['семко', 'семко-юниор'],
        'аэлита': ['аэлита'],
        'гавриш': ['гавриш'],
        'поиск': ['поиск'],
        'русский огород': ['русский огород', 'русскийогород']
    }
    
    for manufacturer, variations in manufacturers.items():
        if any(var in text for var in variations):
            criteria['manufacturer'] = manufacturer
            break
    
    return criteria

def filter_products(products: List[Product], criteria: dict) -> List[dict]:
    filtered = []
    for product in products:
        matches = True
        
        # Price filtering
        if criteria['max_price'] and product.price > criteria['max_price']:
            matches = False
        if criteria['min_price'] and product.price < criteria['min_price']:
            matches = False
        
        # Country filtering
        if criteria['country'] and product.manufacturer:
            country_match = False
            for variation in [criteria['country'], criteria['country'].capitalize()]:
                if variation in product.manufacturer.country.lower():
                    country_match = True
                    break
            if not country_match:
                matches = False
        
        # Category filtering
        if criteria['category'] and product.category:
            category_match = False
            for variation in [criteria['category'], criteria['category'].capitalize()]:
                if variation in product.category.name.lower():
                    category_match = True
                    break
            if not category_match:
                matches = False
        
        # Product type filtering
        if criteria['product_type'] and product.name:
            product_match = False
            if criteria['exact_match']:
                # Точное совпадение для конкретного продукта
                if criteria['product_type'] in product.name.lower():
                    product_match = True
            else:
                # Более гибкое совпадение
                for variation in [criteria['product_type'], criteria['product_type'].capitalize()]:
                    if variation in product.name.lower() or variation in product.description.lower():
                        product_match = True
                        break
            if not product_match:
                matches = False
        
        # Manufacturer filtering
        if criteria['manufacturer'] and product.manufacturer:
            manufacturer_match = False
            for variation in [criteria['manufacturer'], criteria['manufacturer'].capitalize()]:
                if variation in product.manufacturer.name.lower():
                    manufacturer_match = True
                    break
            if not manufacturer_match:
                matches = False
        
        if matches:
            filtered.append({
                "id": product.id,
                "name": product.name,
                "description": product.description,
                "price": product.price,
                "image_url": product.image_url,
                "manufacturer": {
                    "name": product.manufacturer.name if product.manufacturer else None,
                    "country": product.manufacturer.country if product.manufacturer else None
                } if product.manufacturer else None,
                "category": {
                    "name": product.category.name if product.category else None
                } if product.category else None
            })
    
    return filtered

@router.post("/search", response_model=ChatResponse)
async def process_chat_request(request: ChatRequest, db: Session = Depends(get_db)):
    try:
        logger.info(f"Received request with prompt: {request.prompt}")

        # Extract search criteria from the prompt
        criteria = extract_search_criteria(request.prompt)
        logger.info(f"Extracted search criteria: {criteria}")

        # Query products based on the criteria
        products = db.query(Product).all()
        logger.info(f"Found {len(products)} total products in database")
        
        # Filter products based on the criteria
        filtered_products = filter_products(products, criteria)
        logger.info(f"Filtered {len(filtered_products)} products")

        # Generate response based on the results
        if not filtered_products:
            response = "К сожалению, я не нашел товаров, соответствующих вашему запросу. Попробуйте изменить критерии поиска."
        else:
            response = f"Я нашел {len(filtered_products)} товар(ов), которые соответствуют вашему запросу:"

        return ChatResponse(
            response=response,
            products=filtered_products
        )

    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e)) 