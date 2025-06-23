import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Alert,
  useTheme,
  Paper,
  TextField,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  IconButton,
  Drawer,
  useMediaQuery,
  Button,
  Divider,
  Chip,
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Close as CloseIcon,
  Sort as SortIcon,
  Public as PublicIcon,
} from '@mui/icons-material';
import ProductCard from '../components/ProductCard';
import { Product, Category, Manufacturer } from '../types/database';
import { useApiStore } from '../stores/apiStore';

const Catalog: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { products, categories, manufacturers, loading, error, fetchProducts, fetchCategories, fetchManufacturers } = useApiStore();
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [selectedCategory, setSelectedCategory] = useState<number | ''>('');
  const [selectedManufacturer, setSelectedManufacturer] = useState<number | ''>('');
  const [selectedCountry, setSelectedCountry] = useState<string | ''>('');
  const [sortBy, setSortBy] = useState<string>('name');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Get unique countries from manufacturers
  const countries = Array.from(new Set(
    manufacturers
      .filter(m => m.country)
      .map(m => m.country)
  )).sort();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchManufacturers();
  }, [fetchProducts, fetchCategories, fetchManufacturers]);

  const handlePriceChange = (type: 'min' | 'max') => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (type === 'min') {
      setMinPrice(Math.min(value, maxPrice));
    } else {
      setMaxPrice(Math.max(value, minPrice));
    }
  };

  const handleSortChange = (event: any) => {
    setSortBy(event.target.value);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setMinPrice(0);
    setMaxPrice(1000);
    setSelectedCategory('');
    setSelectedManufacturer('');
    setSelectedCountry('');
    setSortBy('name');
  };

  // Enhance products with manufacturer info if missing
  const enhancedProducts = products.map(product => {
    if (!product.manufacturer && product.manufacturer_id) {
      const found = manufacturers.find(m => m.id === product.manufacturer_id);
      return { ...product, manufacturer: found };
    }
    return product;
  });

  const filteredProducts = enhancedProducts
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
      const matchesCategory = selectedCategory === '' || product.category_id === selectedCategory;
      const matchesManufacturer = selectedManufacturer === '' || product.manufacturer_id === selectedManufacturer;
      const matchesCountry = selectedCountry === '' || 
        (product.manufacturer?.country === selectedCountry);
      return matchesSearch && matchesPrice && matchesCategory && matchesManufacturer && matchesCountry;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const FilterSection = () => (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Фильтры
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={clearFilters}
          sx={{ mb: 2 }}
        >
          Сбросить фильтры
        </Button>
      </Box>

      <TextField
        fullWidth
        label="Поиск"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ mb: 3 }}
      />

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Категория</InputLabel>
        <Select
          value={selectedCategory}
          label="Категория"
          onChange={(e) => setSelectedCategory(e.target.value as number | '')}
        >
          <MenuItem value="">Все категории</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Производитель</InputLabel>
        <Select
          value={selectedManufacturer}
          label="Производитель"
          onChange={(e) => setSelectedManufacturer(e.target.value as number | '')}
        >
          <MenuItem value="">Все производители</MenuItem>
          {manufacturers.map((manufacturer) => (
            <MenuItem key={manufacturer.id} value={manufacturer.id}>
              {manufacturer.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Страна</InputLabel>
        <Select
          value={selectedCountry}
          label="Страна"
          onChange={(e) => setSelectedCountry(e.target.value as string)}
        >
          <MenuItem value="">Все страны</MenuItem>
          {countries.map((country) => (
            <MenuItem key={country} value={country}>
              {country}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom>Цена</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            type="number"
            label="От"
            value={minPrice}
            onChange={handlePriceChange('min')}
            size="small"
          />
          <TextField
            type="number"
            label="До"
            value={maxPrice}
            onChange={handlePriceChange('max')}
            size="small"
          />
        </Box>
      </Box>

      <FormControl fullWidth>
        <InputLabel>Сортировка</InputLabel>
        <Select
          value={sortBy}
          label="Сортировка"
          onChange={handleSortChange}
        >
          <MenuItem value="name">По названию</MenuItem>
          <MenuItem value="price_asc">По возрастанию цены</MenuItem>
          <MenuItem value="price_desc">По убыванию цены</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Каталог семян
        </Typography>
        {isMobile && (
          <IconButton onClick={() => setIsFilterDrawerOpen(true)}>
            <FilterIcon />
          </IconButton>
        )}
      </Box>

      <Grid container spacing={3}>
        {!isMobile && (
          <Grid item xs={12} md={3}>
            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <FilterSection />
            </Paper>
          </Grid>
        )}

        <Grid item xs={12} md={9}>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Найдено товаров: {filteredProducts.length}
            </Typography>
            {!isMobile && (
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Сортировка</InputLabel>
                <Select
                  value={sortBy}
                  label="Сортировка"
                  onChange={handleSortChange}
                  size="small"
                >
                  <MenuItem value="name">По названию</MenuItem>
                  <MenuItem value="price_asc">По возрастанию цены</MenuItem>
                  <MenuItem value="price_desc">По убыванию цены</MenuItem>
                </Select>
              </FormControl>
            )}
          </Box>

          <Grid container spacing={3}>
            {filteredProducts.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={4}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      <Drawer
        anchor="right"
        open={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
      >
        <Box sx={{ width: 300, p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Фильтры</Typography>
            <IconButton onClick={() => setIsFilterDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <FilterSection />
        </Box>
      </Drawer>
    </Container>
  );
};

export default Catalog; 