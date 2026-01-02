'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Plus, Edit2, Trash2, X, Upload, Tag, Loader } from 'lucide-react';
import { getCookie } from '@/lib/utils';
import { getOptimizedImageUrl } from '@/lib/imagekit';

interface Category {
  id: string;
  name: string;
  image_url: string;
  store_id: string;
}

export default function CategoriesPage() {
  const params = useParams();
  const storeSlug = params.slug as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    image_url: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (storeId) {
      loadCategories();
    }
  }, [storeId, loadCategories]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !storeId) return;

    setIsUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('fileName', file.name);
      formDataUpload.append('folder', 'categories');
      formDataUpload.append('store_id', storeId);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      const data = await response.json();
      if (data.url) {
        setFormData(prev => ({ ...prev, image_url: data.url }));
      } else {
        alert('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeId) return;

    setIsLoading(true);
    try {
      const endpoint = editingCategory ? `/api/categories/${editingCategory.id}` : '/api/categories';
      const method = editingCategory ? 'PUT' : 'POST';
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
        loadCategories();
        setShowModal(false);
        setEditingCategory(null);
        setFormData({ name: '', image_url: '' });
      }
    } catch (error) {
      console.error('Error saving category:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Delete this category?')) return;

    try {
      const token = getCookie('auth_token');

      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (response.ok) {
        setCategories(categories.filter(c => c.id !== id));
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      image_url: category.image_url,
    });
    setShowModal(true);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-slate-900">Categories</h1>
          <p className="text-sm text-slate-500 mt-0.5">{categories.length} categories</p>
        </div>
        <button
          onClick={() => {
            setEditingCategory(null);
            setFormData({ name: '', image_url: '' });
            setShowModal(true);
          }}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20 text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
        {categories.map(category => (
          <div key={category.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all group">
            {category.image_url ? (
              <div className="relative aspect-[4/3] bg-slate-100">
                <img
                  src={getOptimizedImageUrl(category.image_url, { width: 300, height: 225, quality: 80 })}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-[4/3] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <Tag className="w-8 h-8 text-slate-300" />
              </div>
            )}
            <div className="p-3 lg:p-4">
              <h3 className="font-semibold text-slate-900 text-sm lg:text-base truncate">{category.name}</h3>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => openEditModal(category)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs lg:text-sm font-medium text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs lg:text-sm font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <Tag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No categories yet</p>
          <p className="text-slate-400 text-sm mt-1">Create your first category</p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center p-5 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">
                {editingCategory ? 'Edit Category' : 'Add Category'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Category Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Category Image</label>
                <div className="space-y-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-xl py-6 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all disabled:opacity-50"
                  >
                    {isUploading ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin text-indigo-600" />
                        <span className="text-sm text-slate-600">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 text-slate-400" />
                        <span className="text-sm text-slate-600">Upload Image</span>
                      </>
                    )}
                  </button>

                  <p className="text-center text-slate-400 text-xs">or enter URL</p>

                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    placeholder="https://example.com/image.jpg"
                  />

                  {formData.image_url && (
                    <div className="relative">
                      <img
                        src={getOptimizedImageUrl(formData.image_url, { width: 400, height: 200, quality: 80 })}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-xl border border-slate-200"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, image_url: ''})}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-lg shadow-indigo-600/20"
              >
                {isLoading ? 'Saving...' : 'Save Category'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
