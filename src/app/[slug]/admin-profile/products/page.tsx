'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Plus, Edit2, Trash2, Search, X, Upload, Loader, Package, Check, AlertCircle } from 'lucide-react';
import { uploadImageToImageKit, validateImageFile } from '@/lib/image-upload';
import { getOptimizedImageUrl } from '@/lib/imagekit';
import { getCookie } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  mrp: number;
  category: string;
  image_url: string;
  in_stock: boolean;
  store_id: string;
  variant_options?: VariantOptions;
}

type VariantOptions = Record<string, string[]>;

const variantPresets: VariantOptions = {
  colors: ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Grey', 'Brown'],
  sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'],
  variants: ['Standard', 'Basic', 'Premium', 'Pro', 'Plus', 'Max', 'Model A', 'Model B'],
};

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  mrp: number;
  category: string;
  image_url: string;
  in_stock: boolean;
  variant_options: VariantOptions;
}

interface Category {
  id: string;
  name: string;
}

export default function ProductsPage() {
  const params = useParams();
  const storeSlug = params.slug as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [dragOverProduct, setDragOverProduct] = useState(false);
  const [customVariantInputs, setCustomVariantInputs] = useState<Record<string, string>>({
    colors: '',
    sizes: '',
    variants: '',
  });
  const [newOptionName, setNewOptionName] = useState('');
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    mrp: 0,
    category: '',
    image_url: '',
    in_stock: true,
    variant_options: { colors: [], sizes: [], variants: [] },
  });

  const addCustomVariantOptions = (key: string) => {
    const values = customVariantInputs[key]
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);

    if (values.length === 0) return;

    setFormData(prev => ({
      ...prev,
      variant_options: {
        ...prev.variant_options,
        [key]: Array.from(new Set([...prev.variant_options[key], ...values])),
      },
    }));

    setCustomVariantInputs(prev => ({ ...prev, [key]: '' }));
  };

  const removeVariantOption = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      variant_options: {
        ...prev.variant_options,
        [key]: prev.variant_options[key].filter(item => item !== value),
      },
    }));
  };

  const toggleVariantPreset = (key: string, value: string) => {
    setFormData(prev => {
      const currentValues = prev.variant_options[key];
      const nextValues = currentValues.includes(value)
        ? currentValues.filter(item => item !== value)
        : [...currentValues, value];

      return {
        ...prev,
        variant_options: {
          ...prev.variant_options,
          [key]: nextValues,
        },
      };
    });
  };

  const addOptionGroup = () => {
    const optionName = newOptionName.trim();
    if (!optionName) return;

    setFormData(prev => ({
      ...prev,
      variant_options: {
        ...prev.variant_options,
        [optionName]: prev.variant_options[optionName] || [],
      },
    }));
    setCustomVariantInputs(prev => ({ ...prev, [optionName]: '' }));
    setNewOptionName('');
  };

  const removeOptionGroup = (key: string) => {
    if (variantPresets[key]) return;

    setFormData(prev => {
      const nextOptions = { ...prev.variant_options };
      delete nextOptions[key];
      return { ...prev, variant_options: nextOptions };
    });
    setCustomVariantInputs(prev => {
      const nextInputs = { ...prev };
      delete nextInputs[key];
      return nextInputs;
    });
  };

  const resetVariantEditor = () => {
    setCustomVariantInputs({ colors: '', sizes: '', variants: '' });
    setNewOptionName('');
  };

  useEffect(() => {
    const fetchStoreId = async () => {
      if (!storeSlug) return;
      try {
        const response = await fetch(`/api/store?slug=${storeSlug}`);
        const data = await response.json();
        if (data.data?.id) {
          setStoreId(data.data.id);
        }
      } catch (error) {
        console.error('Error fetching store:', error);
      }
    };
    fetchStoreId();
  }, [storeSlug]);

  const loadProducts = useCallback(async () => {
    if (!storeSlug) return;
    try {
      const response = await fetch(`/api/products?store_slug=${storeSlug}`);
      const data = await response.json();
      if (data.data) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    }
  }, [storeSlug]);

  const loadCategories = useCallback(async () => {
    if (!storeId) return;
    try {
      const response = await fetch(`/api/categories?store_id=${storeId}`);
      const data = await response.json();
      if (data.data) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }, [storeId]);

  useEffect(() => {
    if (storeSlug) {
      loadProducts();
    }
  }, [storeSlug, loadProducts]);

  useEffect(() => {
    if (storeId) {
      loadCategories();
    }
  }, [storeId, loadCategories]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeId) return;

    setIsLoading(true);
    try {
      const endpoint = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';
      const token = getCookie('auth_token');

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          ...formData,
          store_id: storeId,
        }),
      });

      if (response.ok) {
        loadProducts();
        setShowModal(false);
        setEditingProduct(null);
        setFormData({
          name: '',
          description: '',
          price: 0,
          mrp: 0,
          category: '',
          image_url: '',
          in_stock: true,
          variant_options: { colors: [], sizes: [], variants: [] },
        });
        resetVariantEditor();
      }
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Delete this product?')) return;

    try {
      const token = getCookie('auth_token');
      
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (response.ok) {
        setProducts(products.filter(p => p.id !== id));
        await loadProducts();
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error || 'Failed to delete product'}`);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateDiscount = (mrp: number, price: number) =>
    Math.round(((mrp - price) / mrp) * 100);

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      mrp: product.mrp,
      category: product.category,
      image_url: product.image_url,
      in_stock: product.in_stock,
      variant_options: product.variant_options || { colors: [], sizes: [], variants: [] },
    });
    setCustomVariantInputs(
      Object.keys(product.variant_options || {}).reduce<Record<string, string>>(
        (inputs, key) => ({ ...inputs, [key]: '' }),
        { colors: '', sizes: '', variants: '' }
      )
    );
    setNewOptionName('');
    setShowModal(true);
  };

  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !storeId) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || 'Invalid file');
      setTimeout(() => setUploadError(''), 3000);
      return;
    }

    setUploadingImage(true);
    setUploadError('');
    try {
      const result = await uploadImageToImageKit(file, 'products', storeId);
      if (result.success && result.url) {
        setFormData({...formData, image_url: result.url});
      } else {
        setUploadError(result.error || 'Upload failed');
      }
    } catch (error: any) {
      setUploadError(error.message || 'Upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleProductDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverProduct(true);
  };

  const handleProductDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverProduct(false);
  };

  const handleProductDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverProduct(false);

    const files = e.dataTransfer.files;
    if (!files.length || !storeId) return;

    const file = files[0];
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || 'Invalid file');
      setTimeout(() => setUploadError(''), 3000);
      return;
    }

    setUploadingImage(true);
    setUploadError('');
    try {
      const result = await uploadImageToImageKit(file, 'products', storeId);
      if (result.success && result.url) {
        setFormData({...formData, image_url: result.url});
      } else {
        setUploadError(result.error || 'Upload failed');
      }
    } catch (error: any) {
      setUploadError(error.message || 'Upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-slate-900">Products</h1>
          <p className="text-sm text-slate-500 mt-0.5">{products.length} products</p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null);
            setFormData({
              name: '',
              description: '',
              price: 0,
              mrp: 0,
              category: '',
              image_url: '',
              in_stock: true,
              variant_options: { colors: [], sizes: [], variants: [] },
            });
            resetVariantEditor();
            setShowModal(true);
          }}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20 text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      <div className="mb-5">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Product</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Category</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Price</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Discount</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Stock</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredProducts.map(product => (
              <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    {product.image_url ? (
                      <img src={getOptimizedImageUrl(product.image_url, { width: 60, height: 60, quality: 80 })} alt={product.name} className="w-12 h-12 object-cover rounded-xl border border-slate-200" />
                    ) : (
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                        <Package className="w-5 h-5 text-slate-400" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 text-sm truncate">{product.name}</p>
                      <p className="text-xs text-slate-500 truncate max-w-[200px]">{product.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">{product.category}</span>
                </td>
                <td className="px-5 py-4">
                  <div>
                    <p className="font-bold text-slate-900">₹{product.price.toLocaleString()}</p>
                    {product.mrp > product.price && (
                      <p className="text-xs text-slate-400 line-through">₹{product.mrp.toLocaleString()}</p>
                    )}
                  </div>
                </td>
                <td className="px-5 py-4">
                  {product.mrp > product.price ? (
                    <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-lg text-xs font-semibold">
                      {calculateDiscount(product.mrp, product.price)}% OFF
                    </span>
                  ) : (
                    <span className="text-slate-400 text-xs">—</span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                    product.in_stock 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {product.in_stock ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    {product.in_stock ? 'In Stock' : 'Out'}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(product)}
                      className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No products found</p>
            <p className="text-slate-400 text-sm mt-1">Add your first product to get started</p>
          </div>
        )}
      </div>

      <div className="lg:hidden space-y-3">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="flex gap-3">
              {product.image_url ? (
                <img src={getOptimizedImageUrl(product.image_url, { width: 80, height: 80, quality: 80 })} alt={product.name} className="w-20 h-20 object-cover rounded-xl border border-slate-200 flex-shrink-0" />
              ) : (
                <div className="w-20 h-20 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Package className="w-6 h-6 text-slate-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 text-sm line-clamp-1">{product.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{product.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-bold text-slate-900">₹{product.price.toLocaleString()}</span>
                  {product.mrp > product.price && (
                    <>
                      <span className="text-xs text-slate-400 line-through">₹{product.mrp.toLocaleString()}</span>
                      <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded text-xs font-semibold">
                        {calculateDiscount(product.mrp, product.price)}% OFF
                      </span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{product.category}</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${product.in_stock ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                    {product.in_stock ? 'In Stock' : 'Out'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => openEditModal(product)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors"
              >
                <Edit2 className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={() => handleDeleteProduct(product.id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        ))}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No products found</p>
            <p className="text-slate-400 text-sm mt-1">Add your first product</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 flex justify-between items-center p-5 border-b border-slate-200 bg-white rounded-t-2xl">
              <h2 className="text-lg font-bold text-slate-900">
                {editingProduct ? 'Edit Product' : 'Add Product'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="p-5 space-y-4">
              {uploadError && (
                <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100">
                  {uploadError}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Product Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm h-20 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">MRP (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.mrp}
                    onChange={(e) => setFormData({...formData, mrp: parseFloat(e.target.value)})}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Product Options</p>
                  <p className="text-xs text-slate-500 mt-0.5">Choose presets or add your own options. Selected values appear as chips.</p>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newOptionName}
                    onChange={(e) => setNewOptionName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addOptionGroup();
                      }
                    }}
                    className="min-w-0 flex-1 border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    placeholder="New option name, e.g. Material or Finish"
                  />
                  <button
                    type="button"
                    onClick={addOptionGroup}
                    className="inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add option
                  </button>
                </div>
                {Object.keys(formData.variant_options).map(key => (
                  <div key={key}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {key === 'variants' ? 'Variants / Models' : key}
                      </p>
                      {!variantPresets[key] && (
                        <button
                          type="button"
                          onClick={() => removeOptionGroup(key)}
                          className="text-xs font-medium text-red-500 hover:text-red-700"
                        >
                          Remove option
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(variantPresets[key] || []).map(value => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => toggleVariantPreset(key, value)}
                          className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
                            formData.variant_options[key].includes(value)
                              ? 'border-indigo-600 bg-indigo-600 text-white'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300'
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                    {formData.variant_options[key].length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.variant_options[key].map(value => (
                          <span key={value} className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-3 py-1.5 text-xs font-medium text-indigo-700">
                            {value}
                            <button
                              type="button"
                              onClick={() => removeVariantOption(key, value)}
                              className="rounded-full p-0.5 hover:bg-indigo-200"
                              aria-label={`Remove ${value}`}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        value={customVariantInputs[key]}
                        onChange={(e) => setCustomVariantInputs(prev => ({ ...prev, [key]: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addCustomVariantOptions(key);
                          }
                        }}
                        className="min-w-0 flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        placeholder={key === 'variants' ? 'e.g. Model X or Premium' : `Add custom ${key}`}
                      />
                      <button
                        type="button"
                        onClick={() => addCustomVariantOptions(key)}
                        className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-700"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Product Image</label>
                <div
                  onDragOver={handleProductDragOver}
                  onDragLeave={handleProductDragLeave}
                  onDrop={handleProductDrop}
                  className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                    dragOverProduct
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="file"
                    id="product-image-upload"
                    accept="image/*"
                    onChange={handleProductImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                  <label htmlFor="product-image-upload" className="cursor-pointer block">
                    <div className="flex flex-col items-center gap-2">
                      {uploadingImage ? (
                        <>
                          <Loader className="w-8 h-8 animate-spin text-indigo-600" />
                          <p className="text-sm text-slate-600">Uploading...</p>
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-slate-400" />
                          <p className="text-sm font-medium text-slate-700">Drop image here or click to upload</p>
                          <p className="text-xs text-slate-500">PNG, JPG up to 5MB</p>
                        </>
                      )}
                    </div>
                  </label>
                </div>
                <p className="text-xs text-slate-500 mt-2 mb-1.5">Or enter URL:</p>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  placeholder="https://example.com/image.jpg"
                />
                {formData.image_url && (
                  <div className="mt-3">
                    <img src={getOptimizedImageUrl(formData.image_url, { width: 300, height: 300, quality: 80 })} alt="Preview" className="w-full h-40 object-cover rounded-xl border border-slate-200" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <input
                  type="checkbox"
                  id="in_stock"
                  checked={formData.in_stock}
                  onChange={(e) => setFormData({...formData, in_stock: e.target.checked})}
                  className="w-4 h-4 border-slate-300 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="in_stock" className="text-sm font-medium text-slate-700">In Stock</label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-lg shadow-indigo-600/20"
              >
                {isLoading ? 'Saving...' : 'Save Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
