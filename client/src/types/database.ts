import { Timestamp } from 'firebase/firestore';

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category_id?: number;
  image_url: string;
  manufacturer_id?: number;
  average_rating: number;
  in_stock: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
  manufacturer?: Manufacturer;
  packagingOptions?: PackagingOption[];
}

export interface User {
  id: string;
  email: string;
  displayName: string | null;
  photoURL?: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface Order {
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

export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  user_name?: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

export interface Manufacturer {
  id: number;
  name: string;
  website?: string;
  country?: string;
  description?: string;
}

export interface PackagingOption {
  id: number;
  name: string;
  price: number;
  product_id: number;
  weight: string;
  inStock: boolean;
}

export interface Promotion {
  id: number;
  name: string;
  description: string;
  discount_percentage: number;
  start_date: string;
  end_date: string;
  product_ids: number[];
} 