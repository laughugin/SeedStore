import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, getCategories } from '../services/api';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  image_url: string;
  category: {
    name: string;
  };
}

interface Category {
  id: number;
  name: string;
}

const Catalog: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories()
      ]);
      setProducts(productsData as Product[]);
      setCategories(categoriesData as Category[]);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch data');
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory ? product.category_id === selectedCategory : true;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Catalog</h1>
        
        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border rounded flex-grow"
          />
          <select
            value={selectedCategory || ''}
            onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
            className="p-2 border rounded"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">${product.price}</span>
                  <span className="text-sm text-gray-500">
                    {product.category.name}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog; 