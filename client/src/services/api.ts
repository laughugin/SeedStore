import axios, { AxiosResponse, AxiosError } from 'axios';
import { Product, Category, Manufacturer, Promotion } from '../types/database';
import { auth } from '../config/firebase';
import { toast } from 'react-toastify';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) { 
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    }
    return Promise.reject(error);
  }
);

// Add a request interceptor
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Products
export const getProducts = async (): Promise<Product[]> => {
  const response = await api.get('/products?include=manufacturer');
  return response.data as Product[];
};

export const getProduct = async (id: number) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  const response = await api.post('/products', product);
  return response.data as Product;
};

export const updateProduct = async (id: number, product: Partial<Product>): Promise<Product> => {
  const response = await api.put(`/products/${id}`, product);
  return response.data as Product;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await api.delete(`/products/${id}`);
};

// Categories
export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get('/categories');
  return response.data as Category[];
};

export const createCategory = async (categoryData: { name: string }): Promise<Category> => {
  try {
    const response = await api.post('/categories', categoryData);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 400) {
      throw new Error('Category with this name already exists');
    }
    throw error;
  }
};

export const deleteCategory = async (id: number): Promise<void> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  await api.delete(`/categories/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

// Reviews
export const getReviews = async (productId: number) => {
  const response = await api.get(`/reviews/product/${productId}`);
  return response.data;
};

export const createReview = async (reviewData: any) => {
  const response = await api.post('/reviews', reviewData);
  return response.data;
};

export const updateReview = async (reviewId: number, reviewData: any) => {
  const response = await api.put(`/reviews/${reviewId}`, reviewData);
  return response.data;
};

export const deleteReview = async (reviewId: number) => {
  const response = await api.delete(`/reviews/${reviewId}`);
  return response.data;
};

// Orders
export const getOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};

export const createOrder = async (orderData: any) => {
  try {
    const response = await api.post('/orders', orderData);
    toast.success('Заказ успешно создан!');
    return response.data;
  } catch (error) {
    toast.error('Не удалось создать заказ');
    throw error;
  }
};

export const updateOrder = async (id: number, orderData: any) => {
  const response = await api.put(`/orders/${id}`, orderData);
  return response.data;
};

export const deleteOrder = async (id: number) => {
  const response = await api.delete(`/orders/${id}`);
  return response.data;
};

export const getManufacturers = async (): Promise<Manufacturer[]> => {
  const response = await api.get('/manufacturers');
  return response.data as Manufacturer[];
};

export const getPromotions = async (): Promise<Promotion[]> => {
  const response = await api.get('/promotions');
  return response.data as Promotion[];
};

export const createManufacturer = async (manufacturerData: { name: string }): Promise<Manufacturer> => {
  try {
    const response = await api.post('/manufacturers', manufacturerData);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 400) {
      throw new Error('Manufacturer with this name already exists');
    }
    throw error;
  }
};

export const deleteManufacturer = async (id: number): Promise<void> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  await api.delete(`/manufacturers/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

// Order Comments
export const getOrderComments = async (orderId: number) => {
  const response = await api.get(`/order-comments/order/${orderId}`);
  return response.data;
};

export const createOrderComment = async (commentData: { order_id: number; comment: string }) => {
  const response = await api.post('/order-comments', commentData);
  return response.data;
}; 