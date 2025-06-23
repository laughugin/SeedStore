import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { toast } from 'react-toastify';

interface Category {
  id: number;
  name: string;
  description?: string;
}

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/categories/');
      setCategories(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (categoryId: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту категорию?')) {
      return;
    }

    try {
      await api.delete(`/categories/${categoryId}`);
      setCategories(prevCategories => prevCategories.filter(c => c.id !== categoryId));
      toast.success('Категория успешно удалена');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Ошибка при удалении категории');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingCategory) return;

    try {
      if (editingCategory.id) {
        // Update existing category
        await api.put(`/categories/${editingCategory.id}`, editingCategory);
        setCategories(prevCategories =>
          prevCategories.map(c => (c.id === editingCategory.id ? editingCategory : c))
        );
        toast.success('Категория успешно обновлена');
      } else {
        // Create new category
        const response = await api.post('/categories/', editingCategory);
        setCategories(prevCategories => [...prevCategories, response.data]);
        toast.success('Категория успешно создана');
      }
      setIsModalOpen(false);
      setEditingCategory(null);
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Ошибка при сохранении категории');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editingCategory) return;
    const { name, value } = e.target;
    setEditingCategory(prev => ({
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
          onClick={fetchCategories}
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
        <h2 className="text-xl font-semibold">Управление категориями</h2>
        <button
          onClick={() => {
            setEditingCategory({
              id: 0,
              name: '',
              description: ''
            });
            setIsModalOpen(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Добавить категорию
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
                Описание
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{category.name}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{category.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(category)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Редактировать
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
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
              {editingCategory?.id ? 'Редактировать категорию' : 'Добавить категорию'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Название</label>
                <input
                  type="text"
                  name="name"
                  value={editingCategory?.name || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Описание</label>
                <textarea
                  name="description"
                  value={editingCategory?.description || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingCategory(null);
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

export default CategoryManagement; 