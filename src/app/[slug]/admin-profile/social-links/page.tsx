'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Plus, Edit2, Trash2, X, ExternalLink, Share2 } from 'lucide-react';
import { getCookie } from '@/lib/utils';

interface SocialLink {
  id: string;
  display_text: string;
  url: string;
  store_id: string;
}

export default function SocialLinksPage() {
  const params = useParams();
  const storeSlug = params.slug as string;

  const [links, setLinks] = useState<SocialLink[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    display_text: '',
    url: '',
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

  const loadLinks = useCallback(async () => {
    if (!storeId) return;
    try {
      const response = await fetch(`/api/social-links?store_id=${storeId}`);
      const data = await response.json();
      if (data.data) {
        setLinks(data.data);
      }
    } catch (error) {
      console.error('Error loading social links:', error);
    }
  }, [storeId]);

  useEffect(() => {
    if (storeId) {
      loadLinks();
    }
  }, [storeId, loadLinks]);

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeId) return;

    setIsLoading(true);
    try {
      const endpoint = editingLink ? `/api/social-links/${editingLink.id}` : '/api/social-links';
      const method = editingLink ? 'PUT' : 'POST';
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
        loadLinks();
        setShowModal(false);
        setEditingLink(null);
        setFormData({ display_text: '', url: '' });
      }
    } catch (error) {
      console.error('Error saving social link:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLink = async (id: string) => {
    if (!window.confirm('Delete this link?')) return;

    try {
      const token = getCookie('auth_token');

      const response = await fetch(`/api/social-links/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (response.ok) {
        setLinks(links.filter(l => l.id !== id));
      }
    } catch (error) {
      console.error('Error deleting social link:', error);
    }
  };

  const openEditModal = (link: SocialLink) => {
    setEditingLink(link);
    setFormData({
      display_text: link.display_text,
      url: link.url,
    });
    setShowModal(true);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-slate-900">Social Links</h1>
          <p className="text-sm text-slate-500 mt-0.5">{links.length} links</p>
        </div>
        <button
          onClick={() => {
            setEditingLink(null);
            setFormData({ display_text: '', url: '' });
            setShowModal(true);
          }}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20 text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Link
        </button>
      </div>

      <div className="space-y-3">
        {links.map(link => (
          <div key={link.id} className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:shadow-md transition-all">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-slate-900 text-sm lg:text-base">{link.display_text}</p>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-700 text-xs lg:text-sm flex items-center gap-1 truncate"
              >
                <span className="truncate">{link.url}</span>
                <ExternalLink className="w-3 h-3 flex-shrink-0" />
              </a>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openEditModal(link)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                <span className="sm:hidden">Edit</span>
              </button>
              <button
                onClick={() => handleDeleteLink(link.id)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span className="sm:hidden">Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {links.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <Share2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No social links yet</p>
          <p className="text-slate-400 text-sm mt-1">Add links to your social profiles</p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center p-5 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">
                {editingLink ? 'Edit Link' : 'Add Link'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleAddLink} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Display Text</label>
                <input
                  type="text"
                  required
                  value={formData.display_text}
                  onChange={(e) => setFormData({...formData, display_text: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  placeholder="e.g., Instagram, Facebook, WhatsApp"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">URL</label>
                <input
                  type="url"
                  required
                  value={formData.url}
                  onChange={(e) => setFormData({...formData, url: e.target.value})}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  placeholder="https://example.com"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-lg shadow-indigo-600/20"
              >
                {isLoading ? 'Saving...' : 'Save Link'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
