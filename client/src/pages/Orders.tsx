import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Order, OrderItem } from '../types/order';
import { toast } from 'react-toastify';
import OrderChat from '../components/OrderChat';

const Orders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders/');
      setOrders(response.data || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Ожидает обработки';
      case 'processing':
        return 'В обработке';
      case 'shipped':
        return 'Отправлен';
      case 'delivered':
        return 'Доставлен';
      case 'cancelled':
        return 'Отменен';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="text-center py-8">Загрузка...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchOrders}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Мои заказы</h1>
        <div className="text-center py-8">
          <p className="text-gray-600">У вас пока нет заказов</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Мои заказы</h1>
      <div className="space-y-6">
        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">Заказ #{order.id}</h3>
                <p className="text-gray-600">
                  {formatDate(order.created_at)}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
                <button
                  onClick={() => setSelectedOrderId(selectedOrderId === order.id ? null : order.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  {selectedOrderId === order.id ? 'Скрыть чат' : 'Открыть чат'}
                </button>
              </div>
            </div>

            {selectedOrderId === order.id && (
              <div className="border-t mt-4 pt-4">
                <OrderChat orderId={order.id} currentUserEmail={user?.email || ''} />
              </div>
            )}

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Товары:</h4>
              <div className="space-y-2">
                {order.order_items && order.order_items.map((item: OrderItem) => (
                  <div key={item.id} className="flex items-center">
                    {item.product?.image_url && (
                      <img
                        src={item.product.image_url}
                        alt={item.product?.name || 'Product image'}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="ml-4">
                      <p className="font-medium">{item.product?.name}</p>
                      <p className="text-gray-600">
                        {item.quantity} x {item.price} BYN
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {order.delivery_address && (
              <div className="border-t mt-4 pt-4">
                <h4 className="font-semibold mb-2">Адрес доставки:</h4>
                <p>{order.delivery_address.address}</p>
                <p>{order.delivery_address.city}, {order.delivery_address.postal_code}</p>
                <p>Телефон: {order.delivery_address.phone}</p>
              </div>
            )}

            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Итого:</span>
                <span className="text-lg font-bold">{order.total_amount} BYN</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders; 
