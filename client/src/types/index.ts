import { Timestamp } from 'firebase/firestore';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  order: number;
  active: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  manufacturerId: string;
  imageUrl: string;
  rating: number;
  inStock: boolean;
  weight: string;
  packagingOptions: {
    weight: string;
    price: number;
    inStock: boolean;
  }[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  featured: boolean;
  isNew: boolean;
  onSale: boolean;
  tags: string[];
  growingInstructions: string;
  germinationTime: string;
  harvestTime: string;
  sunRequirements: string;
  waterRequirements: string;
  hardinessZones: string[];
}

export interface PackagingOption {
  weight: string;
  price: number;
  inStock: boolean;
}

export interface CartItem {
  productId: string;
  packagingOption: string;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Manufacturer {
  id: string;
  name: string;
  description: string;
  logo: string;
  website: string;
  email: string;
  phone: string;
  active: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Promotion {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  startDate: Timestamp;
  endDate: Timestamp;
  active: boolean;
  currentUses: number;
  singleUse: boolean;
  minimumPurchase: number;
} 