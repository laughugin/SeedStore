import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { toast } from 'react-toastify';
import ProductForm from '../ProductForm';
import { Product } from '../../types/database';

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products/');
      setProducts(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (productId: number) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      return;
    }

    try {
      await api.delete(`/products/${productId}`);
      setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
      toast.success('Товар успешно удален');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Ошибка при удалении товара');
    }
  };

  const handleSubmit = async (productData: Omit<Product, 'id'>) => {
    try {
      if (editingProduct?.id) {
        // Update existing product
        const response = await api.put(`/products/${editingProduct.id}`, productData);
        setProducts(prevProducts =>
          prevProducts.map(p => (p.id === editingProduct.id ? response.data : p))
        );
        toast.success('Товар успешно обновлен');
      } else {
        // Create new product
        const response = await api.post('/products/', {
          ...productData,
          average_rating: 0,
          in_stock: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        setProducts(prevProducts => [...prevProducts, response.data]);
        toast.success('Товар успешно создан');
      }
      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Ошибка при сохранении товара');
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
          onClick={fetchProducts}
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
        <h2 className="text-xl font-semibold">Управление товарами</h2>
        <button
          onClick={() => {
            setEditingProduct({
              id: 0,
              name: '',
              description: '',
              price: 0,
              category_id: undefined,
              image_url: '',
              manufacturer_id: undefined,
              packagingOptions: [],
              average_rating: 0,
              in_stock: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });
            setIsModalOpen(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Добавить товар
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
                Цена
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Категория
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Производитель
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Наличие
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{product.price} BYN</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{product.category?.name || 'Не указана'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{product.manufacturer?.name || 'Не указан'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.in_stock 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.in_stock ? 'В наличии' : 'Нет в наличии'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Редактировать
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
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
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold mb-4">
              {editingProduct?.id ? 'Редактировать товар' : 'Добавить товар'}
            </h3>
            <ProductForm
              product={editingProduct || undefined}
              onSubmit={handleSubmit}
              onCancel={() => {
                setIsModalOpen(false);
                setEditingProduct(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement; 