import React, { useState, useEffect } from 'react';
import { Product, Category, Manufacturer, PackagingOption } from '../types/database';
// import { useApiStore } from '../stores/apiStore';
import { Combobox } from '@headlessui/react';
import { api } from '../services/api';

interface ProductFormProps {
  product?: Product;
  onSubmit: (product: Omit<Product, 'id'>) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit, onCancel }) => {
  // Remove useApiStore
  // const { categories = [], manufacturers = [], loading } = useApiStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get('/categories/'),
      api.get('/manufacturers/')
    ]).then(([catRes, manRes]) => {
      setCategories(catRes.data);
      setManufacturers(manRes.data);
    }).finally(() => setLoading(false));
  }, []);

  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    category_id: product?.category_id || 0,
    image_url: product?.image_url || '',
    manufacturer_id: product?.manufacturer_id || 0,
    in_stock: product?.in_stock ?? true,
    average_rating: product?.average_rating || 0,
    created_at: product?.created_at || new Date().toISOString(),
    updated_at: product?.updated_at || new Date().toISOString(),
    packagingOptions: product?.packagingOptions || []
  });

  const [categoryQuery, setCategoryQuery] = useState('');
  const [manufacturerQuery, setManufacturerQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    product ? categories.find(c => c.id === product.category_id) || null : null
  );
  const [selectedManufacturer, setSelectedManufacturer] = useState<Manufacturer | null>(
    product ? manufacturers.find(m => m.id === product.manufacturer_id) || null : null
  );

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category_id: product.category_id,
        image_url: product.image_url,
        manufacturer_id: product.manufacturer_id,
        in_stock: product.in_stock,
        average_rating: product.average_rating,
        created_at: product.created_at,
        updated_at: product.updated_at,
        packagingOptions: product.packagingOptions || []
      });
      setSelectedCategory(categories.find(c => c.id === product.category_id) || null);
      setSelectedManufacturer(manufacturers.find(m => m.id === product.manufacturer_id) || null);
    }
  }, [product, categories, manufacturers]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleAddPackagingOption = () => {
    setFormData({
      ...formData,
      packagingOptions: [
        ...(formData.packagingOptions || []),
        { id: 0, name: '', price: 0, product_id: 0, weight: '', inStock: true }
      ]
    });
  };

  const handleRemovePackagingOption = (index: number) => {
    setFormData({
      ...formData,
      packagingOptions: (formData.packagingOptions || []).filter((_, i: number) => i !== index)
    });
  };

  const handlePackagingOptionChange = (index: number, field: keyof PackagingOption, value: string | number) => {
    const updatedOptions = [...(formData.packagingOptions || [])];
    updatedOptions[index] = {
      ...updatedOptions[index],
      [field]: value
    };
    setFormData({
      ...formData,
      packagingOptions: updatedOptions
    });
  };

  const handleCategoryChange = (value: Category | null) => {
    if (!value) return;
    setSelectedCategory(value);
    setFormData({ ...formData, category_id: value.id });
  };

  const handleManufacturerChange = (value: Manufacturer | null) => {
    if (!value) return;
    setSelectedManufacturer(value);
    setFormData({ ...formData, manufacturer_id: value.id });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Price</label>
        <input
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div className="relative">
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <Combobox<Category | null> value={selectedCategory} onChange={handleCategoryChange}>
          <div className="relative mt-1">
            <Combobox.Input
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setCategoryQuery(event.target.value)}
              displayValue={(category: Category | null) => category?.name || ''}
            />
            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredCategories.map((category) => (
                <Combobox.Option
                  key={category.id}
                  value={category}
                  className={({ active }: { active: boolean }) =>
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

      <div className="relative">
        <label className="block text-sm font-medium text-gray-700">Manufacturer</label>
        <Combobox<Manufacturer | null> value={selectedManufacturer} onChange={handleManufacturerChange}>
          <div className="relative mt-1">
            <Combobox.Input
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setManufacturerQuery(event.target.value)}
              displayValue={(manufacturer: Manufacturer | null) => manufacturer?.name || ''}
            />
            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredManufacturers.map((manufacturer) => (
                <Combobox.Option
                  key={manufacturer.id}
                  value={manufacturer}
                  className={({ active }: { active: boolean }) =>
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
          type="text"
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="in_stock"
          checked={formData.in_stock}
          onChange={(e) => setFormData({ ...formData, in_stock: e.target.checked })}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <label htmlFor="in_stock" className="ml-2 block text-sm text-gray-900">
          В наличии
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Packaging Options</label>
        {(formData.packagingOptions || []).map((option: PackagingOption, index: number) => (
          <div key={index} className="flex space-x-4 mt-2">
            <input
              type="text"
              value={option.name}
              onChange={(e) => handlePackagingOptionChange(index, 'name', e.target.value)}
              placeholder="Option name"
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <input
              type="number"
              value={option.price}
              onChange={(e) => handlePackagingOptionChange(index, 'price', Number(e.target.value))}
              placeholder="Price"
              className="w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => handleRemovePackagingOption(index)}
              className="text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddPackagingOption}
          className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
        >
          Add Packaging Option
        </button>
      </div>

      <div className="flex justify-end space-x-4">
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
          {product && product.id ? 'Update Product' : 'Add Product'}
        </button>
      </div>
    </form>
  );
}

export default ProductForm; 