import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Order, OrderItem } from '../types/order';
import { toast } from 'react-toastify';
import OrderChat from '../components/OrderChat';

const AdminOrders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<Order['status'] | 'all'>('all');
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  useEffect(() => {
    console.log('Current user:', user);
    if (user?.is_superuser) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders/admin/all/');
      setOrders(response.data || []);
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
      await api.put(`/orders/admin/${orderId}/status/`, { status: newStatus });
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success('Статус заказа обновлен');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Ошибка при обновлении статуса');
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Управление заказами</h1>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as Order['status'] | 'all')}
          className="border rounded px-3 py-2"
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
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">ID ЗАКАЗА</th>
              <th className="px-4 py-2 border-b">ПОЛЬЗОВАТЕЛЬ</th>
              <th className="px-4 py-2 border-b">ДАТА</th>
              <th className="px-4 py-2 border-b">СУММА</th>
              <th className="px-4 py-2 border-b">СТАТУС</th>
              <th className="px-4 py-2 border-b">ДЕЙСТВИЯ</th>
              <th className="px-4 py-2 border-b">ЧАТ</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id} className="border-b">
                <td className="px-4 py-2">#{order.id}</td>
                <td className="px-4 py-2">{order.user ? (order.user.full_name || order.user.email) : '-'}</td>
                <td className="px-4 py-2">{formatDate(order.created_at)}</td>
                <td className="px-4 py-2">{order.total_amount} BYN</td>
                <td className="px-4 py-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                    className="px-2 py-1 rounded border"
                  >
                    <option value="pending">Ожидает обработки</option>
                    <option value="processing">В обработке</option>
                    <option value="shipped">Отправлен</option>
                    <option value="delivered">Доставлен</option>
                    <option value="cancelled">Отменен</option>
                  </select>
                </td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => setSelectedOrderId(selectedOrderId === order.id ? null : order.id)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Чат
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedOrderId && (
        <div className="mt-6">
          <OrderChat
            orderId={selectedOrderId}
            currentUserEmail={user?.email || ''}
            isAdmin={true}
          />
        </div>
      )}
    </div>
  );
};

export default AdminOrders; 