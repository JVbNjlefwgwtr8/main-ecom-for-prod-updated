'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Plus, Edit2, Trash2, X, Zap } from 'lucide-react';
import { getCookie } from '@/lib/utils';

interface Banner {
  id: string;
  text: string;
  background_color: string;
  text_color: string;
  store_id: string;
}

export default function DiscountsPage() {
  const params = useParams();
  const storeSlug = params.slug as string;

  const [banners, setBanners] = useState<Banner[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    text: '',
    background_color: '#10b981',
    text_color: '#ffffff',
  });

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

  const loadBanners = useCallback(async () => {
    if (!storeId) return;
    try {
      const response = await fetch(`/api/banners?store_id=${storeId}`);
      const data = await response.json();
      if (data.data) {
        setBanners(data.data);
      }
    } catch (error) {
      console.error('Error loading banners:', error);
    }
  }, [storeId]);

  useEffect(() => {
    if (storeId) {
      loadBanners();
    }
  }, [storeId, loadBanners]);

  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeId) return;

    setIsLoading(true);
    try {
      const endpoint = editingBanner ? `/api/banners/${editingBanner.id}` : '/api/banners';
      const method = editingBanner ? 'PUT' : 'POST';
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
        loadBanners();
        setShowModal(false);
        setEditingBanner(null);
        setFormData({
          text: '',
          background_color: '#10b981',
          text_color: '#ffffff',
        });
      }
    } catch (error) {
      console.error('Error saving banner:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (!window.confirm('Delete this banner?')) return;

    try {
      const token = getCookie('auth_token');

      const response = await fetch(`/api/banners/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (response.ok) {
        setBanners(banners.filter(b => b.id !== id));
      }
    } catch (error) {
      console.error('Error deleting banner:', error);
    }
  };

  const openEditModal = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      text: banner.text,
      background_color: banner.background_color,
      text_color: banner.text_color,
    });
    setShowModal(true);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-slate-900">Discount Banners</h1>
          <p className="text-sm text-slate-500 mt-0.5">{banners.length} banners</p>
        </div>
        <button
          onClick={() => {
            setEditingBanner(null);
            setFormData({
              text: '',
              background_color: '#10b981',
              text_color: '#ffffff',
            });
            setShowModal(true);
          }}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20 text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Banner
        </button>
      </div>

      <div className="space-y-3">
        {banners.map(banner => (
          <div
            key={banner.id}
            className="relative rounded-2xl overflow-hidden shadow-sm"
          >
            <div
              className="p-4 lg:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              style={{
                backgroundColor: banner.background_color,
                color: banner.text_color,
              }}
            >
              <p className="font-semibold text-sm lg:text-base">{banner.text}</p>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => openEditModal(banner)}
                  className="p-2 rounded-lg transition-all hover:scale-105"
                  style={{
                    backgroundColor: `${banner.text_color}20`,
                    color: banner.text_color,
                  }}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteBanner(banner.id)}
                  className="p-2 rounded-lg transition-all hover:scale-105"
                  style={{
                    backgroundColor: `${banner.text_color}20`,
                    color: banner.text_color,
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {banners.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <Zap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No banners yet</p>
          <p className="text-slate-400 text-sm mt-1">Create your first discount banner</p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center p-5 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">
                {editingBanner ? 'Edit Banner' : 'Add Banner'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleAddBanner} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Banner Text</label>
                <input
                  type="text"
                  required
                  value={formData.text}
                  onChange={(e) => setFormData({...formData, text: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  placeholder="e.g., 50% OFF on all items!"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Background</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.background_color}
                      onChange={(e) => setFormData({...formData, background_color: e.target.value})}
                      className="w-full h-10 border border-slate-200 rounded-xl cursor-pointer"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Text Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.text_color}
                      onChange={(e) => setFormData({...formData, text_color: e.target.value})}
                      className="w-full h-10 border border-slate-200 rounded-xl cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div
                className="p-4 rounded-xl text-center font-semibold text-sm"
                style={{
                  backgroundColor: formData.background_color,
                  color: formData.text_color,
                }}
              >
                {formData.text || 'Preview your banner'}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-lg shadow-indigo-600/20"
              >
                {isLoading ? 'Saving...' : 'Save Banner'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
