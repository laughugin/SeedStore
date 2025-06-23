export interface Product {
  id: number;
  name: string;
  image_url?: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id?: number;
  quantity: number;
  price: number;
  product?: Product;
}

export interface User {
  id: number;
  email: string;
  full_name?: string;
}

export interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  status_display: string;
  created_at: string;
  updated_at: string;
  order_items: OrderItem[];
  user?: User;
  delivery_address?: {
    address: string;
    city: string;
    postal_code: string;
    phone: string;
  };
} 