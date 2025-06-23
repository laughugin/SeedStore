export interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
  description?: string;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  created_at?: string;
  updated_at?: string;
} 