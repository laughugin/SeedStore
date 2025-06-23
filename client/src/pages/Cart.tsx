import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { CartItem } from '../types/cart';
import CheckoutConfirmation from '../components/CheckoutConfirmation';
import { toast } from 'react-toastify';
import { useCartStore } from '../stores/cartStore';

const Cart: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { items: cartItems, fetchCart, updateQuantity, removeFromCart, clearCart } = useCartStore();
  const [loading, setLoading] = useState(true);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      await fetchCart();
      setError(null);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setError('Failed to load cart items');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      await updateQuantity(itemId, newQuantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await removeFromCart(itemId);
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    if (!user?.verified) {
      toast.error('Пожалуйста, заполните профиль для оформления заказа');
      navigate('/profile');
      return;
    }
    setIsCheckoutOpen(true);
  };

  const handleConfirmOrder = async () => {
    try {
      if (!user?.addresses || user.addresses.length === 0) {
        toast.error('Пожалуйста, добавьте адрес доставки в профиле');
        navigate('/profile');
        return;
      }

      const deliveryAddress = user.addresses[0]; // Using the first address for now
      
      await api.post('/orders/', {
        user_id: user.id,
        status: 'pending',
        items: cartItems.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        })),
        delivery_address: {
          address: deliveryAddress.address,
          city: deliveryAddress.city,
          postal_code: deliveryAddress.postal_code,
          phone: deliveryAddress.phone
        },
        total_amount: calculateTotal()
      });
      
      // Clear cart after successful order
      await clearCart();
      setIsCheckoutOpen(false);
      
      toast.success('Заказ успешно оформлен!');
      navigate('/orders');
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Ошибка при оформлении заказа');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Загрузка...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchCartItems}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">Корзина пуста</h2>
        <button
          onClick={() => navigate('/catalog')}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Перейти к каталогу
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Корзина</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {cartItems.map(item => (
            <div key={item.id} className="flex items-center border-b py-4">
              <img
                src={item.product.image_url}
                alt={item.product.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="ml-4 flex-grow">
                <h3 className="font-semibold">{item.product.name}</h3>
                <p className="text-gray-600">{item.product.price} BYN</p>
                <div className="flex items-center mt-2">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="px-2 py-1 border rounded-l"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border-t border-b">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="px-2 py-1 border rounded-r"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="ml-4 text-red-600 hover:text-red-800"
                  >
                    Удалить
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  {item.product.price * item.quantity} BYN
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Итого</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Товары ({cartItems.length})</span>
                <span>{calculateTotal()} BYN</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>К оплате</span>
                <span>{calculateTotal()} BYN</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full mt-6 bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Оформить заказ
            </button>
          </div>
        </div>
      </div>

      <CheckoutConfirmation
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onConfirm={handleConfirmOrder}
        cartItems={cartItems}
        user={user!}
        totalAmount={calculateTotal()}
      />
    </div>
  );
};

export default Cart; 