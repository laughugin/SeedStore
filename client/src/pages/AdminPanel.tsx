import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProductManagement from '../components/admin/ProductManagement';
import UserManagement from '../components/admin/UserManagement';
import AdminOrders from '../components/admin/AdminOrders';
import CategoryManagement from '../components/admin/CategoryManagement';
import ManufacturerManagement from '../components/admin/ManufacturerManagement';

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'products' | 'users' | 'orders' | 'categories' | 'manufacturers'>('products');

  if (!user?.is_superuser) {
    navigate('/');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Панель администратора</h1>
      
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('products')}
              className={`${
                activeTab === 'products'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Товары
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`${
                activeTab === 'categories'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Категории
            </button>
            <button
              onClick={() => setActiveTab('manufacturers')}
              className={`${
                activeTab === 'manufacturers'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Производители
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Пользователи
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`${
                activeTab === 'orders'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Заказы
            </button>
          </nav>
        </div>
      </div>

      <div className="mt-6">
        {activeTab === 'products' && <ProductManagement />}
        {activeTab === 'categories' && <CategoryManagement />}
        {activeTab === 'manufacturers' && <ManufacturerManagement />}
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'orders' && <AdminOrders />}
      </div>
    </div>
  );
};

export default AdminPanel; 