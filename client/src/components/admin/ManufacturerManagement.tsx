import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { toast } from 'react-toastify';
import { Manufacturer } from '../../types/database';

const ManufacturerManagement: React.FC = () => {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingManufacturer, setEditingManufacturer] = useState<Manufacturer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchManufacturers();
  }, []);

  const fetchManufacturers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/manufacturers/');
      setManufacturers(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching manufacturers:', error);
      setError('Failed to load manufacturers');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (manufacturer: Manufacturer) => {
    setEditingManufacturer(manufacturer);
    setIsModalOpen(true);
  };

  const handleDelete = async (manufacturerId: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого производителя?')) {
      return;
    }

    try {
      await api.delete(`/manufacturers/${manufacturerId}`);
      setManufacturers(prevManufacturers => prevManufacturers.filter(m => m.id !== manufacturerId));
      toast.success('Производитель успешно удален');
    } catch (error) {
      console.error('Error deleting manufacturer:', error);
      toast.error('Ошибка при удалении производителя');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingManufacturer) return;

    try {
      if (editingManufacturer.id) {
        // Update existing manufacturer
        await api.put(`/manufacturers/${editingManufacturer.id}`, editingManufacturer);
        setManufacturers(prevManufacturers =>
          prevManufacturers.map(m => (m.id === editingManufacturer.id ? editingManufacturer : m))
        );
        toast.success('Производитель успешно обновлен');
      } else {
        // Create new manufacturer
        const response = await api.post('/manufacturers/', editingManufacturer);
        setManufacturers(prevManufacturers => [...prevManufacturers, response.data]);
        toast.success('Производитель успешно создан');
      }
      setIsModalOpen(false);
      setEditingManufacturer(null);
    } catch (error) {
      console.error('Error saving manufacturer:', error);
      toast.error('Ошибка при сохранении производителя');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editingManufacturer) return;
    const { name, value } = e.target;
    setEditingManufacturer(prev => ({
      ...prev!,
      [name]: value
    }));
  };

  if (loading) {
    return <div className="text-center py-8">Загрузка...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchManufacturers}
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
        <h2 className="text-xl font-semibold">Управление производителями</h2>
        <button
          onClick={() => {
            setEditingManufacturer({
              id: 0,
              name: '',
              website: '',
              country: ''
            });
            setIsModalOpen(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Добавить производителя
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Название
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Страна
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Веб-сайт
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {manufacturers.map((manufacturer) => (
              <tr key={manufacturer.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{manufacturer.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{manufacturer.country}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {manufacturer.website && (
                    <a
                      href={manufacturer.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-900"
                    >
                      {manufacturer.website}
                    </a>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(manufacturer)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Редактировать
                  </button>
                  <button
                    onClick={() => handleDelete(manufacturer.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingManufacturer?.id ? 'Редактировать производителя' : 'Добавить производителя'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Название</label>
                <input
                  type="text"
                  name="name"
                  value={editingManufacturer?.name || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Страна</label>
                <input
                  type="text"
                  name="country"
                  value={editingManufacturer?.country || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Веб-сайт</label>
                <input
                  type="url"
                  name="website"
                  value={editingManufacturer?.website || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingManufacturer(null);
                  }}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManufacturerManagement; 