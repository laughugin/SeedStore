import React, { useState, useEffect } from 'react';
import { itemService } from '../../services/itemService';

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const data = await itemService.getAllItems();
      setItems(data);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(data.map(item => item.category))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = selectedCategory === 'all'
    ? items
    : items.filter(item => item.category === selectedCategory);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Our Products</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-md ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-md ${
                selectedCategory === category
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
              <p className="text-gray-600 mb-2">{item.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">${item.price}</span>
                <span className="text-sm text-gray-500">{item.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemList; 