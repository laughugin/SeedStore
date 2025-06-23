import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingCart, User, LogOut, Settings, Package, CreditCard, Truck, Info, Mail } from 'react-feather';
import { useTheme } from '../contexts/ThemeContext';
import { IconButton, AppBar, Toolbar, Typography, Box, useTheme as useMuiTheme, Menu, MenuItem, ListItemIcon, ListItemText, Divider, Badge } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useCartStore } from '../stores/cartStore';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { isDarkMode, toggleTheme } = useTheme();
  const theme = useMuiTheme();
  const { items, fetchCart } = useCartStore();

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user, fetchCart]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleMenuClose();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const navLinks = [
    { text: 'Семена', path: '/catalog' },
    { text: 'Оплата и доставка', path: '/payment' },
    { text: 'О компании', path: '/about' },
    { text: 'Контакты', path: '/contact' },
  ];

  const userMenuItems = [
    { text: 'Профиль', icon: <User size={18} />, path: '/profile' },
    { text: 'Мои заказы', icon: <Package size={18} />, path: '/orders' },
  ];

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        borderBottom: `1px solid ${theme.palette.divider}`,
        fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif',
      }}
    >
      <Toolbar>
        <Typography
          variant="h5"
          component={Link}
          to="/"
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 700,
            letterSpacing: '0.5px',
            fontFamily: '"Montserrat", sans-serif',
            '&:hover': {
              opacity: 0.8,
            },
          }}
        >
          SeedShop
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 4 }}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              <Typography 
                variant="body1"
                sx={{
                  fontWeight: 500,
                  padding: '8px 12px',
                  borderRadius: 1,
                  fontFamily: '"Montserrat", sans-serif',
                  '&:hover': {
                    backgroundColor: isDarkMode ? 'rgba(76, 175, 80, 0.1)' : 'rgba(46, 125, 50, 0.1)',
                  },
                }}
              >
                {link.text}
              </Typography>
            </Link>
          ))}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 'auto' }}>
          <Link to="/cart" style={{ color: 'inherit' }}>
            <IconButton 
              color="inherit"
              sx={{
                backgroundColor: isDarkMode ? 'rgba(76, 175, 80, 0.1)' : 'rgba(46, 125, 50, 0.1)',
                '&:hover': {
                  backgroundColor: isDarkMode ? 'rgba(76, 175, 80, 0.2)' : 'rgba(46, 125, 50, 0.2)',
                },
              }}
            >
              <Badge badgeContent={items.length} color="error">
                <ShoppingCart size={20} />
              </Badge>
            </IconButton>
          </Link>

          <IconButton 
            onClick={toggleTheme} 
            color="inherit"
            sx={{
              backgroundColor: isDarkMode ? 'rgba(76, 175, 80, 0.1)' : 'rgba(46, 125, 50, 0.1)',
              '&:hover': {
                backgroundColor: isDarkMode ? 'rgba(76, 175, 80, 0.2)' : 'rgba(46, 125, 50, 0.2)',
              },
            }}
          >
            {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>

          {user ? (
            <>
              <IconButton
                onClick={handleMenuOpen}
                color="inherit"
                sx={{
                  backgroundColor: isDarkMode ? 'rgba(76, 175, 80, 0.1)' : 'rgba(46, 125, 50, 0.1)',
                  '&:hover': {
                    backgroundColor: isDarkMode ? 'rgba(76, 175, 80, 0.2)' : 'rgba(46, 125, 50, 0.2)',
                  },
                }}
              >
                <User size={20} />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    mt: 1,
                    minWidth: 250,
                    borderRadius: 1,
                    backgroundColor: theme.palette.background.paper,
                    border: `1px solid ${theme.palette.divider}`,
                    '& .MuiMenuItem-root': {
                      color: theme.palette.text.primary,
                      fontFamily: '"Montserrat", sans-serif',
                      py: 1.5,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
                  <Typography 
                    variant="subtitle1" 
                    color="text.primary"
                    sx={{ fontWeight: 600, fontFamily: '"Montserrat", sans-serif' }}
                  >
                    {user.email}
                  </Typography>
                </Box>

                {userMenuItems.map((item) => (
                  <MenuItem 
                    key={item.path}
                    onClick={() => {
                      handleMenuClose();
                      navigate(item.path);
                    }}
                  >
                    <ListItemIcon>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                  </MenuItem>
                ))}

                {user?.is_superuser && (
                  <MenuItem
                    onClick={() => {
                      handleMenuClose();
                      navigate('/admin');
                    }}
                  >
                    <ListItemIcon>
                      <Settings size={18} />
                    </ListItemIcon>
                    <ListItemText primary="Админ-панель" />
                  </MenuItem>
                )}

                <Divider sx={{ my: 1 }} />

                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogOut size={18} color={theme.palette.text.primary} />
                  </ListItemIcon>
                  <ListItemText primary="Выйти" />
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Link
              to="/login"
              style={{
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              <Typography 
                variant="body1"
                sx={{
                  fontWeight: 500,
                  padding: '8px 16px',
                  backgroundColor: isDarkMode ? 'rgba(76, 175, 80, 0.1)' : 'rgba(46, 125, 50, 0.1)',
                  borderRadius: 1,
                  fontFamily: '"Montserrat", sans-serif',
                  '&:hover': {
                    backgroundColor: isDarkMode ? 'rgba(76, 175, 80, 0.2)' : 'rgba(46, 125, 50, 0.2)',
                  },
                }}
              >
                Войти
              </Typography>
            </Link>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;