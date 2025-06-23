import { create } from 'zustand';
import { Product, Category, Manufacturer, Promotion } from '../types/database';
import { 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  getProducts,
  getCategories,
  getManufacturers,
  getPromotions,
  createCategory,
  createManufacturer
} from '../services/api';

interface ApiStore {
  products: Product[];
  categories: Category[];
  manufacturers: Manufacturer[];
  promotions: Promotion[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchManufacturers: () => Promise<void>;
  fetchPromotions: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: number, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  createCategory: (data: { name: string }) => Promise<Category>;
  createManufacturer: (data: { name: string }) => Promise<Manufacturer>;
}

type SetState = (fn: (state: ApiStore) => Partial<ApiStore>) => void;

export const useApiStore = create<ApiStore>((set: SetState) => ({
  products: [],
  categories: [],
  manufacturers: [],
  promotions: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set((state) => ({ ...state, loading: true, error: null }));
    try {
      const products = await getProducts();
      set((state) => ({ ...state, products, loading: false }));
    } catch (error) {
      set((state) => ({ ...state, error: 'Failed to fetch products', loading: false }));
    }
  },

  fetchCategories: async () => {
    set((state) => ({ ...state, loading: true, error: null }));
    try {
      const categories = await getCategories();
      set((state) => ({ ...state, categories, loading: false }));
    } catch (error) {
      set((state) => ({ ...state, error: 'Failed to fetch categories', loading: false }));
    }
  },

  fetchManufacturers: async () => {
    set((state) => ({ ...state, loading: true, error: null }));
    try {
      const manufacturers = await getManufacturers();
      set((state) => ({ ...state, manufacturers, loading: false }));
    } catch (error) {
      set((state) => ({ ...state, error: 'Failed to fetch manufacturers', loading: false }));
    }
  },

  fetchPromotions: async () => {
    set((state) => ({ ...state, loading: true, error: null }));
    try {
      const promotions = await getPromotions();
      set((state) => ({ ...state, promotions, loading: false }));
    } catch (error) {
      set((state) => ({ ...state, error: 'Failed to fetch promotions', loading: false }));
    }
  },

  addProduct: async (product: Omit<Product, 'id'>) => {
    set((state) => ({ ...state, loading: true, error: null }));
    try {
      await createProduct(product);
      set((state) => ({ 
        ...state,
        loading: false,
        products: [...state.products, { ...product, id: state.products.length + 1 }]
      }));
    } catch (error) {
      set((state) => ({ ...state, error: 'Failed to add product', loading: false }));
    }
  },

  updateProduct: async (id: number, product: Partial<Product>) => {
    set((state) => ({ ...state, loading: true, error: null }));
    try {
      await updateProduct(id, product);
      set((state) => ({
        ...state,
        loading: false,
        products: state.products.map((p: Product) => 
          p.id === id ? { ...p, ...product } : p
        )
      }));
    } catch (error) {
      set((state) => ({ ...state, error: 'Failed to update product', loading: false }));
    }
  },

  deleteProduct: async (id: number) => {
    set((state) => ({ ...state, loading: true, error: null }));
    try {
      await deleteProduct(id);
      set((state) => ({
        ...state,
        loading: false,
        products: state.products.filter((p: Product) => p.id !== id)
      }));
    } catch (error) {
      set((state) => ({ ...state, error: 'Failed to delete product', loading: false }));
    }
  },

  createCategory: async (data: { name: string }) => {
    set((state) => ({ ...state, loading: true, error: null }));
    try {
      const category = await createCategory(data);
      set((state) => ({
        ...state,
        loading: false,
        categories: [...state.categories, category]
      }));
      return category;
    } catch (error) {
      set((state) => ({ ...state, error: 'Failed to create category', loading: false }));
      throw error;
    }
  },

  createManufacturer: async (data: { name: string }) => {
    set((state) => ({ ...state, loading: true, error: null }));
    try {
      const manufacturer = await createManufacturer(data);
      set((state) => ({
        ...state,
        loading: false,
        manufacturers: [...state.manufacturers, manufacturer]
      }));
      return manufacturer;
    } catch (error) {
      set((state) => ({ ...state, error: 'Failed to create manufacturer', loading: false }));
      throw error;
    }
  },
})); 