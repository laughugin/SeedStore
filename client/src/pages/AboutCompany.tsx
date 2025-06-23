import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  LocalFlorist as FloristIcon,
  EmojiEvents as AwardsIcon,
  Groups as TeamIcon,
  Science as ScienceIcon,
} from '@mui/icons-material';

const AboutCompany: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Hero Section */}
      <Box sx={{ mb: 8, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          ООО "АгроСемена"
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
          Ваш надежный партнер в мире семян с 1995 года
        </Typography>
      </Box>

      {/* Company Overview */}
      <Paper elevation={0} sx={{ p: 4, mb: 8, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h5" gutterBottom>
          О компании
        </Typography>
        <Typography paragraph>
          ООО "АгроСемена" - ведущий поставщик семян в Республике Беларусь. Наша компания была основана в 1995 году и за это время зарекомендовала себя как надежный партнер для садоводов и фермеров.
        </Typography>
        <Typography paragraph>
          Мы сотрудничаем с лучшими селекционными центрами Европы и России, что позволяет нам предлагать нашим клиентам только качественные семена с высоким процентом всхожести.
        </Typography>
        <Typography>
          Наша миссия - помогать людям выращивать здоровые и вкусные продукты, делая процесс садоводства доступным и приятным.
        </Typography>
      </Paper>

      {/* Our Advantages */}
      <Typography variant="h4" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
        Наши преимущества
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ height: '100%', border: '1px solid', borderColor: 'divider' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FloristIcon color="primary" sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="h6" gutterBottom>
                Качество семян
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Мы тщательно отбираем поставщиков и проверяем каждую партию семян на всхожесть и соответствие стандартам.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ height: '100%', border: '1px solid', borderColor: 'divider' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AwardsIcon color="primary" sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="h6" gutterBottom>
                Опыт работы
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Более 25 лет на рынке семян и тысячи довольных клиентов по всей Беларуси.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ height: '100%', border: '1px solid', borderColor: 'divider' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TeamIcon color="primary" sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="h6" gutterBottom>
                Профессионализм
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Наша команда состоит из опытных агрономов и консультантов, готовых помочь с выбором семян.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={0} sx={{ height: '100%', border: '1px solid', borderColor: 'divider' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ScienceIcon color="primary" sx={{ fontSize: 40 }} />
              </Box>
              <Typography variant="h6" gutterBottom>
                Инновации
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Мы постоянно обновляем ассортимент, предлагая новые сорта и гибриды с улучшенными характеристиками.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AboutCompany; 