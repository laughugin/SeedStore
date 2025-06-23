import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Payment as PaymentIcon,
  LocalShipping as ShippingIcon,
  Security as SecurityIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

const Payment: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 6 }}>
        Оплата и доставка
      </Typography>

      <Grid container spacing={4}>
        {/* Payment Information */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 4, height: '100%', border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PaymentIcon color="primary" />
              Способы оплаты
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <PaymentIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Наложенный платеж" 
                  secondary={
                    <Box>
                      <Typography variant="body2" paragraph>
                        Оплата производится при получении заказа в отделении почты. Это самый удобный и безопасный способ оплаты для наших клиентов.
                      </Typography>
                      <Typography variant="body2">
                        • Вы оплачиваете заказ только после проверки его содержимого
                      </Typography>
                      <Typography variant="body2">
                        • Комиссия за перевод денег включена в стоимость заказа
                      </Typography>
                      <Typography variant="body2">
                        • При получении заказа необходимо иметь при себе паспорт
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem>
                <ListItemIcon>
                  <SecurityIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Безопасность платежей" 
                  secondary={
                    <Box>
                      <Typography variant="body2" paragraph>
                        Мы гарантируем полную безопасность всех платежей. При оплате наложенным платежом вы можете быть уверены в сохранности ваших средств.
                      </Typography>
                      <Typography variant="body2">
                        • Деньги переводятся только после проверки заказа
                      </Typography>
                      <Typography variant="body2">
                        • Все платежи проходят через официальные каналы Белпочты
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Delivery Information */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 4, height: '100%', border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ShippingIcon color="primary" />
              Доставка
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <LocationIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Доставка по Беларуси" 
                  secondary={
                    <Box>
                      <Typography variant="body2" paragraph>
                        Мы осуществляем доставку во все регионы Беларуси через Белпочту. Это позволяет нам гарантировать надежную доставку в любой населенный пункт страны.
                      </Typography>
                      <Typography variant="body2">
                        • Доставка в любой населенный пункт Беларуси
                      </Typography>
                      <Typography variant="body2">
                        • Возможность получения в ближайшем почтовом отделении
                      </Typography>
                      <Typography variant="body2">
                        • Отслеживание посылки через систему Белпочты
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              <Divider variant="inset" component="li" />
              <ListItem>
                <ListItemIcon>
                  <TimeIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Сроки доставки" 
                  secondary={
                    <Box>
                      <Typography variant="body2" paragraph>
                        Мы стремимся обеспечить максимально быструю доставку ваших заказов. Сроки доставки зависят от региона и обычно составляют:
                      </Typography>
                      <Typography variant="body2">
                        • Минск и областные центры: 1-2 рабочих дня
                      </Typography>
                      <Typography variant="body2">
                        • Районные центры: 2-3 рабочих дня
                      </Typography>
                      <Typography variant="body2">
                        • Отдаленные населенные пункты: 3-5 рабочих дней
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Additional Information */}
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <InfoIcon color="primary" />
              Важная информация
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <CheckCircleIcon color="success" />
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Гарантии качества
                    </Typography>
                    <Typography variant="body2" paragraph>
                      • Все семена проходят тщательную проверку перед отправкой
                    </Typography>
                    <Typography variant="body2" paragraph>
                      • Мы гарантируем соответствие заявленным характеристикам
                    </Typography>
                    <Typography variant="body2">
                      • При обнаружении брака возможен возврат или замена
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <WarningIcon color="warning" />
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      Обратите внимание
                    </Typography>
                    <Typography variant="body2" paragraph>
                      • При оформлении заказа проверьте правильность указания адреса
                    </Typography>
                    <Typography variant="body2" paragraph>
                      • Сохраняйте чек до получения заказа
                    </Typography>
                    <Typography variant="body2">
                      • При получении проверьте целостность упаковки
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Payment; 