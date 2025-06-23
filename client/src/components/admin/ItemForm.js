import React, { useState, useEffect } from 'react';
import { itemService } from '../../services/itemService';
import { api } from '../../services/api';
import { Combobox } from '@headlessui/react';

const ItemForm = ({ item, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    manufacturer_id: '',
    imageUrl: '',
    ...item
  });

  const [categories, setCategories] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [categoryQuery, setCategoryQuery] = useState('');
  const [manufacturerQuery, setManufacturerQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedManufacturer, setSelectedManufacturer] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, manRes] = await Promise.all([
          api.get('/categories/'),
          api.get('/manufacturers/')
        ]);
        setCategories(catRes.data);
        setManufacturers(manRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (item) {
      setSelectedCategory(categories.find(c => c.id === item.category_id) || null);
      setSelectedManufacturer(manufacturers.find(m => m.id === item.manufacturer_id) || null);
    } else {
      setSelectedCategory(categories.find(c => c.id === formData.category_id) || null);
      setSelectedManufacturer(manufacturers.find(m => m.id === formData.manufacturer_id) || null);
    }
  }, [item, categories, manufacturers, formData.category_id, formData.manufacturer_id]);

  const filteredCategories = categoryQuery === ''
    ? categories
    : categories.filter((category) =>
        category.name.toLowerCase().includes(categoryQuery.toLowerCase())
      );

  const filteredManufacturers = manufacturerQuery === ''
    ? manufacturers
    : manufacturers.filter((manufacturer) =>
        manufacturer.name.toLowerCase().includes(manufacturerQuery.toLowerCase())
      );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setFormData(prev => ({ ...prev, category_id: value ? value.id : '' }));
  };

  const handleManufacturerChange = (value) => {
    setSelectedManufacturer(value);
    setFormData(prev => ({ ...prev, manufacturer_id: value ? value.id : '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (item?.id) {
        await itemService.updateItem(item.id, formData);
      } else {
        await itemService.addItem(formData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Price</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <Combobox value={selectedCategory} onChange={handleCategoryChange}>
          <div className="relative mt-1">
            <Combobox.Input
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              onChange={event => setCategoryQuery(event.target.value)}
              displayValue={category => category?.name || ''}
              required
            />
            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredCategories.map((category) => (
                <Combobox.Option
                  key={category.id}
                  value={category}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-3 pr-9 ${
                      active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                    }`
                  }
                >
                  {category.name}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </div>
        </Combobox>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Manufacturer</label>
        <Combobox value={selectedManufacturer} onChange={handleManufacturerChange}>
          <div className="relative mt-1">
            <Combobox.Input
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              onChange={event => setManufacturerQuery(event.target.value)}
              displayValue={manufacturer => manufacturer?.name || ''}
              required
            />
            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredManufacturers.map((manufacturer) => (
                <Combobox.Option
                  key={manufacturer.id}
                  value={manufacturer}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-3 pr-9 ${
                      active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                    }`
                  }
                >
                  {manufacturer.name}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          </div>
        </Combobox>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Image URL</label>
        <input
          type="url"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
        >
          {item ? (item.id ? 'Update' : 'Add') : 'Add'} Item
        </button>
      </div>
    </form>
  );
};

export default ItemForm; 