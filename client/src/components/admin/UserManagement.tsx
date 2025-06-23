import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { User } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/');
      setUsers(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId: number, currentStatus: boolean) => {
    try {
      await api.put(`/users/${userId}/block`, {
        is_active: !currentStatus
      });
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, is_active: !currentStatus } : user
        )
      );
      toast.success(`Пользователь ${!currentStatus ? 'разблокирован' : 'заблокирован'}`);
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Ошибка при обновлении статуса пользователя');
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
          onClick={fetchUsers}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Управление пользователями</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
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
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.is_active ? 'Активен' : 'Заблокирован'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {!user.is_superuser && (
                    <button
                      onClick={() => handleBlockUser(user.id, user.is_active)}
                      className={`${
                        user.is_active
                          ? 'text-red-600 hover:text-red-900'
                          : 'text-green-600 hover:text-green-900'
                      }`}
                    >
                      {user.is_active ? 'Заблокировать' : 'Разблокировать'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement; 