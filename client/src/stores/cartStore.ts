import { create } from 'zustand';
import { api } from '../services/api';
import { toast } from 'react-toastify';

interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    image_url: string;
  };
}

interface CartStore {
  items: CartItem[];
  total: number;
  loading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  total: 0,
  loading: false,
  error: null,

  fetchCart: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/cart/');
      set({ items: response.data.items, total: response.data.total });
    } catch (error) {
      set({ error: 'Failed to fetch cart' });
      toast.error('Не удалось загрузить корзину');
      console.error('Error fetching cart:', error);
    } finally {
      set({ loading: false });
    }
  },

  addToCart: async (productId: number, quantity: number) => {
    set({ loading: true, error: null });
    try {
      await api.post('/cart/', { product_id: productId, quantity });
      await get().fetchCart();
      toast.success('Товар добавлен в корзину');
    } catch (error) {
      set({ error: 'Failed to add item to cart' });
      toast.error('Не удалось добавить товар в корзину');
      console.error('Error adding to cart:', error);
    } finally {
      set({ loading: false });
    }
  },

  updateQuantity: async (cartItemId: number, quantity: number) => {
    set({ loading: true, error: null });
    try {
      await api.put(`/cart/${cartItemId}`, { quantity });
      await get().fetchCart();
      toast.success('Количество обновлено');
    } catch (error) {
      set({ error: 'Failed to update cart item' });
      toast.error('Не удалось обновить количество');
      console.error('Error updating cart item:', error);
    } finally {
      set({ loading: false });
    }
  },

  removeFromCart: async (cartItemId: number) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/cart/item/${cartItemId}`);
      await get().fetchCart();
      toast.success('Товар удален из корзины');
    } catch (error) {
      set({ error: 'Failed to remove item from cart' });
      toast.error('Не удалось удалить товар из корзины');
      console.error('Error removing from cart:', error);
    } finally {
      set({ loading: false });
    }
  },

  clearCart: async () => {
    set({ loading: true, error: null });
    try {
      await api.delete('/cart/');
      set({ items: [], total: 0 });
      toast.success('Корзина очищена');
    } catch (error) {
      set({ error: 'Failed to clear cart' });
      toast.error('Не удалось очистить корзину');
      console.error('Error clearing cart:', error);
    } finally {
      set({ loading: false });
    }
  },
})); 