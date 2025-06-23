import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Rating,
  Button,
  Divider,
  Chip,
  TextField,
  Avatar,
  IconButton,
  useTheme,
  Stack,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Factory,
  Public,
  Language,
  LocalShipping,
  Security,
  Star,
  Add,
  Remove,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { useCartStore } from '../stores/cartStore';
import { useApiStore } from '../stores/apiStore';
import { api } from '../services/api';
import { Product, Review } from '../types/database';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [tabValue, setTabValue] = useState(0);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
  });
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const { addToCart } = useCartStore();
  const { categories, manufacturers, fetchCategories, fetchManufacturers } = useApiStore();

  useEffect(() => {
    fetchProductData();
    fetchCategories();
    fetchManufacturers();
  }, [id, fetchCategories, fetchManufacturers]);

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const [productData, reviewsData] = await Promise.all([
        api.get(`/products/${id}`),
        api.get(`/reviews/product/${id}`)
      ]);
      setProduct(productData.data);
      setReviews(reviewsData.data);
      setError(null);
    } catch (err) {
      console.error('Ошибка при загрузке данных:', err);
      setError('Не удалось загрузить данные товара. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (product) {
      try {
        await addToCart(product.id, quantity);
        toast.success('Товар добавлен в корзину!');
      } catch (err) {
        toast.error('Не удалось добавить товар в корзину');
      }
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setShowLoginDialog(true);
      return;
    }

    try {
      await api.post('/reviews', {
        product_id: Number(id),
        rating: newReview.rating,
        comment: newReview.comment
      });
      await fetchProductData();
      setNewReview({ rating: 5, comment: '' });
      toast.success('Отзыв успешно добавлен!');
    } catch (err) {
      console.error('Ошибка при отправке отзыва:', err);
      setError('Не удалось отправить отзыв. Пожалуйста, попробуйте позже.');
      toast.error('Не удалось отправить отзыв');
    }
  };

  const handleLoginRedirect = () => {
    setShowLoginDialog(false);
    navigate('/login', { state: { from: `/product/${id}` } });
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getCategoryCharacteristics = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return [];
    
    // Get characteristics from category
    const characteristics = [];
    if (category.name) {
      characteristics.push({ name: 'Категория', value: category.name });
    }
    if (category.description) {
      characteristics.push({ name: 'Описание категории', value: category.description });
    }
    return characteristics;
  };

  const getManufacturerCharacteristics = (manufacturerId: number) => {
    const manufacturer = manufacturers.find(m => m.id === manufacturerId);
    if (!manufacturer) return [];
    
    // Get characteristics from manufacturer
    const characteristics = [];
    if (manufacturer.name) {
      characteristics.push({ name: 'Производитель', value: manufacturer.name });
    }
    if (manufacturer.country) {
      characteristics.push({ name: 'Страна', value: manufacturer.country });
    }
    if (manufacturer.description) {
      characteristics.push({ name: 'Описание производителя', value: manufacturer.description });
    }
    if (manufacturer.website) {
      characteristics.push({ name: 'Веб-сайт', value: manufacturer.website });
    }
    return characteristics;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error || 'Товар не найден'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        {/* Product Image */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'background.paper',
            }}
          >
            <img
              src={product.image_url}
              alt={product.name}
              style={{
                maxWidth: '100%',
                maxHeight: '500px',
                objectFit: 'contain',
              }}
            />
          </Paper>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {product.name}
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
              <Rating value={product.average_rating} precision={0.5} readOnly />
              <Typography variant="body2" color="text.secondary">
                ({product.average_rating.toFixed(1)})
              </Typography>
              <Chip
                label={product.in_stock ? 'В наличии' : 'Нет в наличии'}
                color={product.in_stock ? 'success' : 'error'}
                size="small"
              />
            </Stack>

            <Typography variant="h5" color="primary" gutterBottom>
              {product.price.toFixed(2)} BYN
            </Typography>

            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>

            {product.manufacturer && (
              <Box sx={{ mb: 3 }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <Factory sx={{ color: 'text.secondary' }} />
                  <Typography variant="body1">
                    Производитель: {product.manufacturer.name}
                  </Typography>
                </Stack>
                {product.manufacturer.country && (
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <Public sx={{ color: 'text.secondary' }} />
                    <Typography variant="body1">
                      Страна: {product.manufacturer.country}
                    </Typography>
                  </Stack>
                )}
                {product.manufacturer.website && (
                  <Button
                    startIcon={<Language />}
                    href={product.manufacturer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ textTransform: 'none' }}
                  >
                    Сайт производителя
                  </Button>
                )}
              </Box>
            )}

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Количество:
              </Typography>
              <Box
                display="flex"
                alignItems="center"
                sx={{
                  backgroundColor: 'action.hover',
                  borderRadius: 1,
                  p: 0.5,
                  width: 'fit-content',
                }}
              >
                <IconButton
                  size="small"
                  onClick={() => handleQuantityChange(quantity - 1)}
                >
                  <Remove />
                </IconButton>
                <Typography sx={{ mx: 2 }}>{quantity}</Typography>
                <IconButton
                  size="small"
                  onClick={() => handleQuantityChange(quantity + 1)}
                >
                  <Add />
                </IconButton>
              </Box>
            </Box>

            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={!product.in_stock}
              onClick={handleAddToCart}
              sx={{ mb: 3 }}
            >
              {product.in_stock ? 'Добавить в корзину' : 'Нет в наличии'}
            </Button>

            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
              <Chip
                icon={<LocalShipping />}
                label="Бесплатная доставка"
                variant="outlined"
              />
              <Chip
                icon={<Security />}
                label="Гарантия качества"
                variant="outlined"
              />
            </Stack>
          </Box>
        </Grid>

        {/* Tabs Section */}
        <Grid item xs={12}>
          <Paper sx={{ width: '100%' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="product tabs"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Описание" />
              <Tab label="Характеристики" />
              <Tab label="Отзывы" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <Typography variant="body1" paragraph>
                {product.description}
              </Typography>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CategoryIcon color="primary" />
                    Характеристики категории
                  </Typography>
                  <Stack spacing={2}>
                    {product?.category_id && getCategoryCharacteristics(product.category_id).map((char, index) => (
                      <Box key={index}>
                        <Typography variant="body2" color="text.secondary">
                          {char.name}:
                        </Typography>
                        <Typography variant="body1">
                          {char.value}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Factory color="primary" />
                    Характеристики производителя
                  </Typography>
                  <Stack spacing={2}>
                    {product?.manufacturer_id && getManufacturerCharacteristics(product.manufacturer_id).map((char, index) => (
                      <Box key={index}>
                        <Typography variant="body2" color="text.secondary">
                          {char.name}:
                        </Typography>
                        <Typography variant="body1">
                          {char.value}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Общие характеристики:
                  </Typography>
                  <Stack spacing={1}>
                    <Typography variant="body2">
                      • Рейтинг: {product?.average_rating.toFixed(1)}
                    </Typography>
                    <Typography variant="body2">
                      • Наличие: {product?.in_stock ? 'В наличии' : 'Нет в наличии'}
                    </Typography>
                    <Typography variant="body2">
                      • Цена: {product?.price.toFixed(2)} BYN
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Оставить отзыв
                </Typography>
                {user ? (
                  <form onSubmit={handleReviewSubmit}>
                    <Box sx={{ mb: 2 }}>
                      <Typography component="legend">Оценка</Typography>
                      <Rating
                        value={newReview.rating}
                        onChange={(_, value) => setNewReview(prev => ({ ...prev, rating: value || 5 }))}
                      />
                    </Box>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Ваш отзыв"
                      value={newReview.comment}
                      onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                      sx={{ mb: 2 }}
                    />
                    <Button type="submit" variant="contained" color="primary">
                      Отправить отзыв
                    </Button>
                  </form>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                      Чтобы оставить отзыв, необходимо войти в систему
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setShowLoginDialog(true)}
                    >
                      Войти
                    </Button>
                  </Box>
                )}
              </Box>

              <Divider sx={{ my: 4 }} />

              <Typography variant="h6" gutterBottom>
                Отзывы покупателей
              </Typography>
              {reviews.length > 0 ? (
                <Stack spacing={3}>
                  {reviews.map((review) => (
                    <Paper key={review.id} sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar sx={{ mr: 2 }}>
                          {review.user_name?.[0] || 'U'}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1">
                            {review.user_name || 'Анонимный пользователь'}
                          </Typography>
                          <Rating value={review.rating} readOnly size="small" />
                        </Box>
                      </Box>
                      <Typography variant="body1" paragraph>
                        {review.comment}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(review.created_at).toLocaleDateString()}
                      </Typography>
                    </Paper>
                  ))}
                </Stack>
              ) : (
                <Typography color="text.secondary">
                  Пока нет отзывов. Будьте первым!
                </Typography>
              )}
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>

      {/* Login Dialog */}
      <Dialog
        open={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
      >
        <DialogTitle>Вход в систему</DialogTitle>
        <DialogContent>
          <Typography>
            Для того чтобы оставить отзыв, необходимо войти в систему.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLoginDialog(false)}>
            Отмена
          </Button>
          <Button onClick={handleLoginRedirect} variant="contained" color="primary">
            Войти
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProductPage; 