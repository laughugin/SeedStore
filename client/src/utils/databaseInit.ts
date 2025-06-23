import { db } from '../config/firebase';
import { collection, getDocs, doc, setDoc, Timestamp } from 'firebase/firestore';

// Types
interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  imageUrl: string;
  stock: number;
  manufacturer: string;
  specifications: {
    [key: string]: string;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'user' | 'admin';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface Order {
  id: string;
  userId: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Sample data
const categories: Category[] = [
  {
    id: 'cat1',
    name: 'Electronics',
    description: 'Latest electronic devices and gadgets',
    imageUrl: 'https://example.com/electronics.jpg',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: 'cat2',
    name: 'Clothing',
    description: 'Fashionable clothing for all seasons',
    imageUrl: 'https://example.com/clothing.jpg',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  }
];

const products: Product[] = [
  {
    id: 'prod1',
    name: 'Smartphone X',
    description: 'Latest smartphone with advanced features',
    price: 999.99,
    categoryId: 'cat1',
    imageUrl: 'https://example.com/smartphone.jpg',
    stock: 100,
    manufacturer: 'TechCorp',
    specifications: {
      'Screen': '6.5" OLED',
      'RAM': '8GB',
      'Storage': '128GB'
    },
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: 'prod2',
    name: 'Laptop Pro',
    description: 'High-performance laptop for professionals',
    price: 1499.99,
    categoryId: 'cat1',
    imageUrl: 'https://example.com/laptop.jpg',
    stock: 50,
    manufacturer: 'TechCorp',
    specifications: {
      'Processor': 'Intel i7',
      'RAM': '16GB',
      'Storage': '512GB SSD'
    },
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  }
];

const users: User[] = [
  {
    id: 'user1',
    email: 'admin@example.com',
    displayName: 'Admin User',
    role: 'admin',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: 'user2',
    email: 'user@example.com',
    displayName: 'Regular User',
    role: 'user',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  }
];

const orders: Order[] = [
  {
    id: 'order1',
    userId: 'user2',
    items: [
      {
        productId: 'prod1',
        quantity: 1,
        price: 999.99
      }
    ],
    total: 999.99,
    status: 'pending',
    shippingAddress: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  }
];

const reviews: Review[] = [
  {
    id: 'rev1',
    productId: 'prod1',
    userId: 'user2',
    rating: 5,
    comment: 'Great product! Very satisfied with my purchase.',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  }
];

export const initializeDatabase = async () => {
  try {
    console.log('Starting database initialization...');

    // Initialize categories
    const categoriesSnapshot = await getDocs(collection(db, 'categories'));
    if (categoriesSnapshot.empty) {
      console.log('Initializing categories...');
      for (const category of categories) {
        await setDoc(doc(db, 'categories', category.id), category);
      }
    }

    // Initialize products
    const productsSnapshot = await getDocs(collection(db, 'products'));
    if (productsSnapshot.empty) {
      console.log('Initializing products...');
      for (const product of products) {
        await setDoc(doc(db, 'products', product.id), product);
      }
    }

    // Initialize users
    const usersSnapshot = await getDocs(collection(db, 'users'));
    if (usersSnapshot.empty) {
      console.log('Initializing users...');
      for (const user of users) {
        await setDoc(doc(db, 'users', user.id), user);
      }
    }

    // Initialize orders
    const ordersSnapshot = await getDocs(collection(db, 'orders'));
    if (ordersSnapshot.empty) {
      console.log('Initializing orders...');
      for (const order of orders) {
        await setDoc(doc(db, 'orders', order.id), order);
      }
    }

    // Initialize reviews
    const reviewsSnapshot = await getDocs(collection(db, 'reviews'));
    if (reviewsSnapshot.empty) {
      console.log('Initializing reviews...');
      for (const review of reviews) {
        await setDoc(doc(db, 'reviews', review.id), review);
      }
    }

    console.log('Database initialization completed successfully');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
};

export const checkDatabaseStatus = async () => {
  try {
    const collections = ['categories', 'products', 'users', 'orders', 'reviews'];
    const status: { [key: string]: number } = {};

    for (const collectionName of collections) {
      const snapshot = await getDocs(collection(db, collectionName));
      status[collectionName] = snapshot.size;
    }

    console.log('Database status:', status);
    return status;
  } catch (error) {
    console.error('Error checking database status:', error);
    return null;
  }
}; 