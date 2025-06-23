import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { toast } from 'react-toastify';
import OrderChat from '../OrderChat';
import { auth } from '../../config/firebase';

interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  product_name: string;
}

interface Order {
  id: number;
  user_id: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  created_at: string;
  items: OrderItem[];
  delivery_address: string;
  user_email: string;
}

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<Order['status'] | 'all'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders/admin/');
      setOrders(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: Order['status']) => {
    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) return;

      await api.put(`/orders/admin/${orderId}`, {
        user_id: order.user_id,
        total_amount: order.total_amount,
        status: newStatus
      });
      
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success('Статус заказа обновлен');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Ошибка при обновлении статуса заказа');
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = selectedStatus === 'all'
    ? orders
    : orders.filter(order => order.status === selectedStatus);

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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Управление заказами</h2>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as Order['status'] | 'all')}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="all">Все заказы</option>
          <option value="pending">Ожидает обработки</option>
          <option value="processing">В обработке</option>
          <option value="shipped">Отправлен</option>
          <option value="delivered">Доставлен</option>
          <option value="cancelled">Отменен</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID заказа
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Пользователь
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Дата
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Сумма
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.user_email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatDate(order.created_at)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{order.total_amount} ₽</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {order.status === 'pending' && 'Ожидает обработки'}
                    {order.status === 'processing' && 'В обработке'}
                    {order.status === 'shipped' && 'Отправлен'}
                    {order.status === 'delivered' && 'Доставлен'}
                    {order.status === 'cancelled' && 'Отменен'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                      className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="pending">Ожидает обработки</option>
                      <option value="processing">В обработке</option>
                      <option value="shipped">Отправлен</option>
                      <option value="delivered">Доставлен</option>
                      <option value="cancelled">Отменен</option>
                    </select>
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setIsChatOpen(true);
                      }}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Чат
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isChatOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Чат с клиентом (Заказ #{selectedOrder.id})
              </h3>
              <button
                onClick={() => {
                  setIsChatOpen(false);
                  setSelectedOrder(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <OrderChat
              orderId={selectedOrder.id}
              currentUserEmail={auth.currentUser?.email || ''}
              isAdmin={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders; 