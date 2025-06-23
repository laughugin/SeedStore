import { create } from 'zustand';
import { Product } from '../types/database';
import { getProducts } from '../services/api';

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  loading: false,
  error: null,
  fetchProducts: async () => {
    try {
      set({ loading: true, error: null });
      const products = await getProducts();
      set({ products, loading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch products',
        loading: false 
      });
    }
  },
})); 