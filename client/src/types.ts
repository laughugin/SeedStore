export interface PackagingOption {
  weight: string;
  price: number;
  inStock: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  manufacturer: string;
  imageUrl: string;
  rating: number;
  inStock: boolean;
  packagingOptions: PackagingOption[];
  createdAt: Date;
} 