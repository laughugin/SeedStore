from fastapi import APIRouter
from app.api.api_v1.endpoints import (
    auth, users, products, categories, manufacturers,
    cart, orders, order_comments, reviews
)

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(products.router, prefix="/products", tags=["products"])
api_router.include_router(categories.router, prefix="/categories", tags=["categories"])
api_router.include_router(manufacturers.router, prefix="/manufacturers", tags=["manufacturers"])
api_router.include_router(cart.router, prefix="/cart", tags=["cart"])
api_router.include_router(orders.router, prefix="/orders", tags=["orders"])
api_router.include_router(order_comments.router, prefix="/order-comments", tags=["order-comments"])
api_router.include_router(reviews.router, prefix="/reviews", tags=["reviews"]) 