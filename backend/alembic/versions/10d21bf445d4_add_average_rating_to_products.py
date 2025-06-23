"""add average rating to products

Revision ID: 10d21bf445d4
Revises: 163602f9e53d
Create Date: 2024-03-19 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '10d21bf445d4'
down_revision: Union[str, None] = '163602f9e53d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add average_rating column to products table
    op.add_column('products', sa.Column('average_rating', sa.Float(), nullable=True, server_default='0.0'))
    
    # Update existing products with average ratings from reviews
    op.execute("""
        UPDATE products p
        SET average_rating = (
            SELECT COALESCE(AVG(r.rating), 0.0)
            FROM reviews r
            WHERE r.product_id = p.id
        )
    """)


def downgrade() -> None:
    # Remove average_rating column from products table
    op.drop_column('products', 'average_rating')
