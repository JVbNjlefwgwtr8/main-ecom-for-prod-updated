'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Copy, Check, CreditCard, Image, Settings2, Store, LogOut, Trash2, Globe, Mail, Phone, QrCode, LayoutGrid, Grid3X3, Rows3, AlertTriangle, X } from 'lucide-react';

interface StoreData {
  id: string;
  name: string;
  description: string;
  slug: string;
  phone?: string;
  showcase_email?: string;
  login_email?: string;
  upi_id?: string;
  upi_enabled?: boolean;
  show_category_images?: boolean;
  image_display_mode?: string;
}

type ImageDisplayMode = 'grid' | 'compact' | 'list';

export default function SettingsPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  
  const [store, setStore] = useState<StoreData | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    showcase_email: '',
    address: '',
    whatsapp_number: '',
    upi_id: '',
    upi_enabled: false,
    show_category_images: true,
    image_display_mode: 'grid' as ImageDisplayMode,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');
  const [copiedField, setCopiedField] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const loadStore = useCallback(async () => {
    try {
      const response = await fetch(`/api/store?slug=${slug}`);
      const data = await response.json();
      
      if (data.data) {
        setStore(data.data);
        setFormData({
          name: data.data.name,
          phone: data.data.phone || '',
          showcase_email: data.data.showcase_email || '',
          address: localStorage.getItem(`${slug}_address`) || '',
          whatsapp_number: data.data.phone || '',
          upi_id: data.data.upi_id || '',
          upi_enabled: data.data.upi_enabled || false,
          show_category_images: data.data.show_category_images !== false,
          image_display_mode: data.data.image_display_mode || 'grid',
        });
      }
    } catch (error) {
      console.error('Error loading store:', error);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      loadStore();
    }
  }, [slug, loadStore]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSavedMessage('');

    try {
      if (!store?.id) {
        throw new Error('Store ID not found');
      }

      const response = await fetch(`/api/store`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          store_id: store.id,
          name: formData.name,
          phone: formData.phone || formData.whatsapp_number,
          showcase_email: formData.showcase_email,
          upi_id: formData.upi_id,
          upi_enabled: formData.upi_enabled,
          show_category_images: formData.show_category_images,
          image_display_mode: formData.image_display_mode,
        }),
      });

      const responseData = await response.json();
      
      if (response.ok && responseData.success) {
        localStorage.setItem(`${slug}_address`, formData.address);
        setSavedMessage('Settings saved successfully!');
        loadStore();
        setTimeout(() => setSavedMessage(''), 3000);
      } else {
        setSavedMessage('Error: ' + (responseData.error || 'Failed to save'));
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setSavedMessage('Error saving settings');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(''), 2000);
  };

  const handleDeleteStore = async () => {
    try {
      if (!store?.id) {
        throw new Error('Store ID not found');
      }
      const response = await fetch(`/api/store`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ store_id: store.id }),
      });

      if (response.ok) {
        localStorage.removeItem('store_id');
        localStorage.removeItem('store_slug');
        router.push('/onboarding');
      }
    } catch (error) {
      console.error('Error deleting store:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('store_id');
    localStorage.removeItem('store_slug');
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    document.cookie = 'user_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    document.cookie = 'user_email=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    router.push('/auth/login');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl lg:text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-500 mt-0.5">Manage your store configuration</p>
      </div>

      {savedMessage && (
        <div className={`mb-5 p-4 rounded-xl text-sm font-medium ${
          savedMessage.includes('Error') 
            ? 'bg-red-50 text-red-700 border border-red-100' 
            : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
        }`}>
          {savedMessage}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 lg:p-6 mb-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <Store className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Store Details</h2>
            <p className="text-xs text-slate-500">Basic information about your store</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Store Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-slate-400" />
                  Store Email
                </div>
              </label>
              <input
                type="email"
                value={formData.showcase_email}
                onChange={(e) => setFormData({...formData, showcase_email: e.target.value})}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                placeholder="store@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-slate-400" />
                  Phone / WhatsApp
                </div>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Store Address</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm h-20 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              placeholder="Enter your store address..."
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-lg shadow-indigo-600/20 text-sm"
          >
            {isLoading ? 'Saving...' : 'Save Store Details'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 lg:p-6 mb-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
            <Settings2 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Display Settings</h2>
            <p className="text-xs text-slate-500">Configure how your store looks</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div className="flex items-center gap-3">
              <Image className="w-5 h-5 text-slate-600" />
              <div>
                <label className="block font-medium text-slate-900 text-sm">Show Category Images</label>
                <p className="text-xs text-slate-500">Display images in category pills</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.show_category_images}
                onChange={(e) => setFormData({...formData, show_category_images: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl">
            <label className="block font-medium text-slate-900 text-sm mb-3">Product Display Mode</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormData({...formData, image_display_mode: 'grid'})}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  formData.image_display_mode === 'grid' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <LayoutGrid className="w-5 h-5" />
                <span className="text-xs font-medium">Grid</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, image_display_mode: 'compact'})}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  formData.image_display_mode === 'compact' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <Grid3X3 className="w-5 h-5" />
                <span className="text-xs font-medium">Compact</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, image_display_mode: 'list'})}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  formData.image_display_mode === 'list' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <Rows3 className="w-5 h-5" />
                <span className="text-xs font-medium">List</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-lg shadow-blue-600/20 text-sm"
          >
            {isLoading ? 'Saving...' : 'Save Display Settings'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 lg:p-6 mb-5 border-l-4 border-l-violet-500">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
            <QrCode className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">UPI Payment</h2>
            <p className="text-xs text-slate-500">Accept payments via UPI QR code</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-violet-50 rounded-xl">
            <div>
              <label className="block font-medium text-violet-900 text-sm">Enable UPI Payments</label>
              <p className="text-xs text-violet-700">Show QR code during checkout</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.upi_enabled}
                onChange={(e) => setFormData({...formData, upi_enabled: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:ring-4 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">UPI ID</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.upi_id}
                onChange={(e) => setFormData({...formData, upi_id: e.target.value})}
                className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                placeholder="yourname@bankname"
              />
              {formData.upi_id && (
                <button
                  type="button"
                  onClick={() => copyToClipboard(formData.upi_id, 'upi')}
                  className="px-4 py-2.5 bg-slate-100 rounded-xl hover:bg-slate-200 flex items-center gap-2 text-sm font-medium text-slate-700 transition-colors"
                >
                  {copiedField === 'upi' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1.5">This UPI ID will be used to generate QR codes</p>
          </div>

          {formData.upi_enabled && !formData.upi_id && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              Please enter your UPI ID to enable QR payments
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-violet-600 text-white py-3 rounded-xl font-semibold hover:bg-violet-700 disabled:opacity-50 transition-colors shadow-lg shadow-violet-600/20 text-sm"
          >
            {isLoading ? 'Saving...' : 'Save Payment Settings'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 lg:p-6 mb-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
            <Globe className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Store URL</h2>
            <p className="text-xs text-slate-500">Share this link with your customers</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-xl">
            <label className="block text-xs font-medium text-slate-500 mb-1">Your Store URL</label>
            <div className="flex items-center gap-2">
              <p className="text-sm font-mono text-indigo-600 flex-1 break-all">
                {typeof window !== 'undefined' && `${window.location.origin}/${store?.slug}`}
              </p>
              <button
                type="button"
                onClick={() => copyToClipboard(`${window.location.origin}/${store?.slug}`, 'url')}
                className="flex-shrink-0 px-3 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
              >
                {copiedField === 'url' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 lg:p-6 border-l-4 border-l-red-500">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-red-600">Danger Zone</h2>
            <p className="text-xs text-slate-500">Irreversible actions</p>
          </div>
        </div>

        <div className="space-y-4">
            <div className="p-4 bg-red-50 rounded-xl">
              <h3 className="font-semibold text-red-900 text-sm mb-1">Delete Store</h3>
              <p className="text-xs text-red-700 mb-3">
                Permanently delete your store and all data. This cannot be undone.
              </p>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium text-sm transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete Store
              </button>
            </div>

          <div className="p-4 bg-slate-50 rounded-xl">
            <h3 className="font-semibold text-slate-900 text-sm mb-1">Logout</h3>
            <p className="text-xs text-slate-500 mb-3">
              Sign out from your account.
            </p>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-xl hover:bg-slate-700 font-medium text-sm transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Delete Store</h3>
              </div>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to delete your store? This will permanently remove all your products, categories, and settings. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium text-sm hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDeleteStore();
                  setShowDeleteConfirm(false);
                }}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-medium text-sm hover:bg-red-700 transition-colors"
              >
                Delete Store
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
