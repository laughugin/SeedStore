import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    setSnackbar({
      open: true,
      message: 'Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.',
      severity: 'success',
    });
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 6 }}>
        Контакты
      </Typography>

      <Grid container spacing={4}>
        {/* Contact Information */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 4, height: '100%', border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h5" gutterBottom>
              Наши контакты
            </Typography>
            
            <Box sx={{ mt: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                <LocationIcon color="primary" sx={{ mr: 2, mt: 0.5 }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="medium">
                    Адрес
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    г. Минск, ул. Сурганова, 57Б
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                <PhoneIcon color="primary" sx={{ mr: 2, mt: 0.5 }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="medium">
                    Телефон
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    +375 (29) 123-45-67
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    +375 (29) 765-43-21
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                <EmailIcon color="primary" sx={{ mr: 2, mt: 0.5 }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="medium">
                    Email
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    info@agrosemena.by
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <TimeIcon color="primary" sx={{ mr: 2, mt: 0.5 }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="medium">
                    Режим работы
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Пн-Пт: 9:00 - 18:00
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Сб: 10:00 - 15:00
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Вс: выходной
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Map */}
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 4, height: '100%', border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h5" gutterBottom>
              Как нас найти
            </Typography>
            <Box sx={{ height: 400, width: '100%', mt: 2 }}>
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
          </Paper>
        </Grid>

        {/* Contact Form */}
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h5" gutterBottom>
              Напишите нам
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Ваше имя"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Телефон"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    multiline
                    rows={4}
                    label="Сообщение"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    sx={{ minWidth: 200 }}
                  >
                    Отправить
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Contact; 