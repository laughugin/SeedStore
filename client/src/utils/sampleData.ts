import { 
  Product, 
  Category, 
  Manufacturer, 
  Promotion 
} from '../types/database';

export const categories = [
  {
    id: 'cat1',
    name: 'Овощи',
    slug: 'vegetables',
    description: 'Семена овощных культур',
    order: 1,
    active: true
  },
  {
    id: 'cat2',
    name: 'Зелень',
    slug: 'greens',
    description: 'Семена зеленных культур',
    order: 2,
    active: true
  },
  {
    id: 'cat3',
    name: 'Цветы',
    slug: 'flowers',
    description: 'Семена цветочных культур',
    order: 3,
    active: true
  }
];

export const manufacturers = [
  {
    id: 'man1',
    name: 'SeedCo',
    description: 'Ведущий производитель семян',
    logo: 'https://example.com/seedco-logo.png',
    website: 'https://seedco.com',
    email: 'info@seedco.com',
    phone: '+1234567890',
    active: true
  },
  {
    id: 'man2',
    name: 'GardenPro',
    description: 'Профессиональные семена для сада',
    logo: 'https://example.com/gardenpro-logo.png',
    website: 'https://gardenpro.com',
    email: 'info@gardenpro.com',
    phone: '+0987654321',
    active: true
  }
];

export const products = [
  {
    id: 'prod1',
    name: 'Базилик Дольче',
    description: 'Ароматный сорт базилика с нежным вкусом',
    categoryId: 'cat2',
    manufacturerId: 'man1',
    images: ['https://example.com/basil.jpg'],
    price: 150,
    rating: 4.5,
    stock: 100,
    weight: 0.5,
    packaging: ['пакет', 'коробка'],
    createdAt: new Date(),
    updatedAt: new Date(),
    featured: true,
    new: true,
    onSale: false,
    tags: ['зелень', 'пряности', 'кулинария'],
    growingInstructions: 'Выращивать на солнечном месте',
    germinationTime: 7,
    harvestTime: 60,
    sunRequirements: 'полное солнце',
    waterRequirements: 'умеренный полив',
    hardinessZones: ['5', '6', '7', '8', '9']
  },
  {
    id: 'prod2',
    name: 'Томат Бычье сердце',
    description: 'Крупноплодный сорт томата',
    categoryId: 'cat1',
    manufacturerId: 'man2',
    images: ['https://example.com/tomato.jpg'],
    price: 200,
    rating: 4.8,
    stock: 50,
    weight: 1,
    packaging: ['пакет', 'коробка'],
    createdAt: new Date(),
    updatedAt: new Date(),
    featured: true,
    new: false,
    onSale: true,
    tags: ['овощи', 'томаты', 'крупноплодные'],
    growingInstructions: 'Выращивать в теплице или открытом грунте',
    germinationTime: 10,
    harvestTime: 90,
    sunRequirements: 'полное солнце',
    waterRequirements: 'регулярный полив',
    hardinessZones: ['6', '7', '8', '9']
  }
];

export const promotions = [
  {
    id: 'promo1',
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    active: true,
    currentUses: 0,
    singleUse: true,
    minimumPurchase: 1000
  },
  {
    id: 'promo2',
    code: 'FREESHIP',
    type: 'fixed',
    value: 500,
    startDate: new Date(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    active: true,
    currentUses: 0,
    singleUse: false,
    minimumPurchase: 2000
  }
]; 