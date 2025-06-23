import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from '@mui/material';
import {
  LocalFlorist as FloristIcon,
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const theme = useTheme();

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box sx={{ 
        position: 'relative',
        height: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(45deg, rgba(46, 125, 50, 0.85) 30%, rgba(76, 175, 80, 0.85) 90%)',
        color: 'white',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url(/images/hero-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.15,
          zIndex: 0,
        }
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <Typography 
            variant="h1" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            АгроСемена
          </Typography>
          <Typography 
            variant="h4" 
            sx={{ 
              mb: 4,
              opacity: 0.9,
              fontSize: { xs: '1.25rem', md: '1.5rem' },
              maxWidth: '800px',
              mx: 'auto',
            }}
          >
            Ваш надежный партнер в мире семян с 1995 года
          </Typography>
          <Button
            component={Link}
            to="/catalog"
            variant="contained"
            size="large"
            sx={{
              backgroundColor: 'white',
              color: theme.palette.primary.main,
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Перейти в каталог
          </Button>
        </Container>
      </Box>

      {/* Company Overview */}
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography 
              variant="h3" 
              gutterBottom 
              sx={{ 
                fontWeight: 700,
                color: theme.palette.primary.main,
                mb: 4,
              }}
            >
              О компании
            </Typography>
            <Typography 
              variant="h6" 
              paragraph 
              sx={{ 
                color: 'text.secondary',
                lineHeight: 1.8,
                mb: 4,
              }}
            >
              ООО "АгроСемена" - ведущий поставщик семян в Республике Беларусь. Мы предлагаем широкий ассортимент качественных семян от лучших производителей Европы и России.
            </Typography>
            <Button
              component={Link}
              to="/about"
              variant="outlined"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1.5,
                '&:hover': {
                  transform: 'translateX(4px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Подробнее о нас
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 3,
            }}>
              {[
                { icon: <FloristIcon sx={{ fontSize: 40 }} />, text: 'Качество семян' },
                { icon: <ShippingIcon sx={{ fontSize: 40 }} />, text: 'Быстрая доставка' },
                { icon: <PaymentIcon sx={{ fontSize: 40 }} />, text: 'Удобная оплата' },
                { icon: <TimeIcon sx={{ fontSize: 40 }} />, text: 'Поддержка 24/7' },
              ].map((item, index) => (
                <Paper
                  key={index}
                  elevation={0}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  <Box sx={{ color: 'primary.main', mb: 2 }}>{item.icon}</Box>
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    {item.text}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Delivery and Payment */}
      <Box sx={{ bgcolor: 'grey.50', py: 12 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 4, 
                  height: '100%',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                }}
              >
                <Typography variant="h4" gutterBottom sx={{ color: theme.palette.primary.main, mb: 4 }}>
                  Доставка
                </Typography>
                <List>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <ShippingIcon color="primary" sx={{ fontSize: 32 }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={
                        <Typography variant="h6" sx={{ fontWeight: 500 }}>
                          Доставка по всей Беларуси
                        </Typography>
                      }
                      secondary="Отправка в день заказа"
                    />
                  </ListItem>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <TimeIcon color="primary" sx={{ fontSize: 32 }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={
                        <Typography variant="h6" sx={{ fontWeight: 500 }}>
                          Сроки доставки
                        </Typography>
                      }
                      secondary="1-3 рабочих дня"
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 4, 
                  height: '100%',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                }}
              >
                <Typography variant="h4" gutterBottom sx={{ color: theme.palette.primary.main, mb: 4 }}>
                  Оплата
                </Typography>
                <List>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <PaymentIcon color="primary" sx={{ fontSize: 32 }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={
                        <Typography variant="h6" sx={{ fontWeight: 500 }}>
                          Наложенный платеж
                        </Typography>
                      }
                      secondary="Оплата при получении"
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              component={Link}
              to="/payment"
              variant="outlined"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1.5,
                '&:hover': {
                  transform: 'translateX(4px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Подробнее о доставке и оплате
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Contact Information */}
      <Container maxWidth="lg" sx={{ py: 12 }}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Typography variant="h3" gutterBottom sx={{ color: theme.palette.primary.main, mb: 4 }}>
              Контакты
            </Typography>
            <List>
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon>
                  <LocationIcon color="primary" sx={{ fontSize: 32 }} />
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                      Адрес
                    </Typography>
                  }
                  secondary="г. Минск, ул. Сурганова, 57Б"
                />
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon>
                  <PhoneIcon color="primary" sx={{ fontSize: 32 }} />
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                      Телефон
                    </Typography>
                  }
                  secondary="+375 (29) 123-45-67"
                />
              </ListItem>
              <ListItem sx={{ px: 0 }}>
                <ListItemIcon>
                  <EmailIcon color="primary" sx={{ fontSize: 32 }} />
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                      Email
                    </Typography>
                  }
                  secondary="info@agrosemena.by"
                />
              </ListItem>
            </List>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              height: 400, 
              width: '100%',
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2350.692510629!2d27.5673!3d53.9023!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46dbcfd35b0e6793%3A0x0!2z0YPQuy4g0KHRg9GA0LPQsNC90L7QstCwIDU3LCDQnNC40L3RgdC6!5e0!3m2!1sru!2sby!4v1620000000000!5m2!1sru!2sby"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Company Location"
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home; 