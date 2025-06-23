"""add in stock to products

Revision ID: b748717c5cbc
Revises: 10d21bf445d4
Create Date: 2024-03-19 12:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b748717c5cbc'
down_revision: Union[str, None] = '10d21bf445d4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add in_stock column to products table
    op.add_column('products', sa.Column('in_stock', sa.Boolean(), nullable=False, server_default='true'))


def downgrade() -> None:
    # Remove in_stock column from products table
    op.drop_column('products', 'in_stock')
