import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  IconButton,
  useTheme,
  Rating,
  Chip,
  Tooltip,
  Divider,
  Stack,
} from '@mui/material';
import { Add, Remove, Language, Public, Factory } from '@mui/icons-material';
import { useCartStore } from '../stores/cartStore';
import { Product } from '../types/database';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCartStore();
  const theme = useTheme();
  const navigate = useNavigate();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking add to cart
    await addToCart(product.id, quantity);
    setQuantity(1);
  };

  const handleQuantityChange = (e: React.MouseEvent, newQuantity: number) => {
    e.stopPropagation(); // Prevent navigation when changing quantity
    if (newQuantity > 0) {
      setQuantity(newQuantity);
    }
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.palette.mode === 'dark' ? 'background.paper' : 'background.default',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: theme.shadows[8],
          cursor: 'pointer',
        },
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={product.image_url}
          alt={product.name}
          sx={{ 
            objectFit: 'contain', 
            p: 2,
            backgroundColor: 'background.paper',
          }}
        />
        {product.manufacturer && (
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              display: 'flex',
              gap: 1,
            }}
          >
            {product.manufacturer.country && (
              <Chip
                size="small"
                label={product.manufacturer.country}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(4px)',
                  fontWeight: 500,
                }}
              />
            )}
          </Box>
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
        <Typography gutterBottom variant="h6" component="h2" sx={{ 
          fontWeight: 600,
          fontSize: '1.1rem',
          lineHeight: 1.4,
        }}>
          {product.name}
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {product.description}
        </Typography>

        {product.manufacturer && (
          <Box sx={{ mb: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
              <Factory sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                Производитель: {product.manufacturer.name}
              </Typography>
            </Stack>
            {product.manufacturer.country && (
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <Public sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Страна: {product.manufacturer.country}
                </Typography>
              </Stack>
            )}
            {product.manufacturer.website && (
              <Tooltip title="Перейти на сайт производителя">
                <Button
                  size="small"
                  startIcon={<Language />}
                  href={product.manufacturer.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ 
                    textTransform: 'none',
                    fontSize: '0.75rem',
                    color: 'primary.main',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  Сайт производителя
                </Button>
              </Tooltip>
            )}
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mt: 'auto' }}>
          <Typography 
            variant="h6" 
            color="primary" 
            gutterBottom 
            sx={{ 
              fontWeight: 600,
              fontSize: '1.25rem',
            }}
          >
            {product.price.toFixed(2)} BYN
          </Typography>
          
          <Box 
            display="flex" 
            alignItems="center" 
            mb={2}
            sx={{
              backgroundColor: 'action.hover',
              borderRadius: 1,
              p: 0.5,
              width: 'fit-content',
            }}
          >
            <IconButton
              size="small"
              onClick={(e) => handleQuantityChange(e, quantity - 1)}
              sx={{ 
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'action.selected',
                },
              }}
            >
              <Remove />
            </IconButton>
            <Typography sx={{ mx: 2, fontWeight: 500 }}>{quantity}</Typography>
            <IconButton
              size="small"
              onClick={(e) => handleQuantityChange(e, quantity + 1)}
              sx={{ 
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'action.selected',
                },
              }}
            >
              <Add />
            </IconButton>
          </Box>

          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Rating 
              value={product.average_rating} 
              precision={0.5} 
              readOnly 
              size="small"
              sx={{ color: 'warning.main' }}
            />
            <Typography variant="body2" color="text.secondary">
              ({product.average_rating.toFixed(1)})
            </Typography>
          </Stack>

          <Chip
            label={product.in_stock ? 'В наличии' : 'Нет в наличии'}
            color={product.in_stock ? 'success' : 'error'}
            size="small"
            sx={{ 
              fontWeight: 500,
              mb: 2,
            }}
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            disabled={!product.in_stock}
            onClick={handleAddToCart}
            sx={{ 
              py: 1.5,
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: 1,
              boxShadow: 2,
              '&:hover': {
                boxShadow: 4,
              },
            }}
          >
            {product.in_stock ? 'В корзину' : 'Нет в наличии'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard; 