'use client';

import { useState, useEffect, useCallback } from 'react';
import { Trash2, Plus, X, Upload, Loader, Palette, Eye, Grid, LayoutGrid, Image, Truck, Shield, RefreshCw, Package, Clock, Star, Heart, Award, Zap, TrendingUp, Headphones, Gift, Leaf, Sun, Moon, Gem, Crown, Diamond, BadgeCheck, Phone, Mail, MapPin, Check, Sparkles, ShoppingBag, CreditCard, Users, ThumbsUp, MessageCircle, Globe, Lock, Percent, Tag, Bookmark, Calendar, Coffee, Music, Camera, Smile, Home, Settings, Bell, Search, FileText, Share2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { uploadImageToImageKit, validateImageFile } from '@/lib/image-upload';
import { getOptimizedImageUrl } from '@/lib/imagekit';
import { setFavicon } from '@/lib/favicon';

interface StoreDesign {
  logo_url: string;
  hero_text: string;
  hero_image: string;
  features: Array<{
    id?: string;
    title: string;
    description: string;
    icon: string;
  }>;
}

const lucideIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Truck, Shield, RefreshCw, Package, Clock, Star, Heart, Award, Zap, TrendingUp, 
  Headphones, Gift, Leaf, Sun, Moon, Gem, Crown, Diamond, BadgeCheck, Phone, 
  Mail, MapPin, Check, Sparkles, ShoppingBag, CreditCard, Users, ThumbsUp, 
  MessageCircle, Globe, Lock, Percent, Tag, Bookmark, Calendar, Coffee, Music, 
  Camera, Smile, Home, Settings, Bell, Search, FileText, Share2
};

const lucideIconOptions = [
  'Truck', 'Shield', 'RefreshCw', 'Package', 'Clock', 'Star', 'Heart', 'Award', 
  'Zap', 'TrendingUp', 'Headphones', 'Gift', 'Leaf', 'Sun', 'Moon', 'Gem', 
  'Crown', 'Diamond', 'BadgeCheck', 'Phone', 'Mail', 'MapPin', 'Check', 'Sparkles',
  'ShoppingBag', 'CreditCard', 'Users', 'ThumbsUp', 'MessageCircle', 'Globe',
  'Lock', 'Percent', 'Tag', 'Bookmark', 'Calendar', 'Coffee', 'Music', 'Camera',
  'Smile', 'Home', 'Settings', 'Bell', 'Search', 'FileText', 'Share2'
];

const emojiOptions = ['⭐', '🎁', '🚀', '💎', '🔥', '✨', '🎯', '💼', '🌟', '📦', '🛍️', '💳'];

function FeatureIconDisplay({ icon, className }: { icon: string; className?: string }) {
  const IconComponent = lucideIconMap[icon];
  if (IconComponent) {
    return <IconComponent className={className} />;
  }
  return <span className={className}>{icon}</span>;
}

const storeThemes = [
  { 
    id: 'medical',
    name: 'Medical Store',
    description: 'Professional healthcare design with trust-building elements',
    colors: { primary: '#0d9488', secondary: '#115e59', accent: '#14b8a6', text: '#0f172a', bg: '#f0fdfa' }
  },
  { 
    id: 'fashion',
    name: 'Fashion Boutique',
    description: 'Dark luxury aesthetic with premium feel',
    colors: { primary: '#9333ea', secondary: '#1e1e2e', accent: '#f472b6', text: '#ffffff', bg: '#0f0f17' }
  },
  { 
    id: 'general',
    name: 'General Store',
    description: 'Bold & vibrant design for retail stores',
    colors: { primary: '#2563eb', secondary: '#1e40af', accent: '#f59e0b', text: '#1e293b', bg: '#f8fafc' }
  },
  { 
    id: 'minimal',
    name: 'Minimal Modern',
    description: 'Ultra-clean monochrome elegance',
    colors: { primary: '#000000', secondary: '#171717', accent: '#737373', text: '#0a0a0a', bg: '#fafafa' }
  },
  { 
    id: 'petals',
    name: 'Petals',
    description: 'Soft pink, delicate design for gift & boutique shops',
    colors: { primary: '#ec4899', secondary: '#f9a8d4', accent: '#fce7f3', text: '#831843', bg: '#fff1f2' }
  },
];

const gridModes = [
  { id: 'compact', name: 'Compact', description: '4 products per row', icon: Grid },
  { id: 'standard', name: 'Standard', description: '3 products per row', icon: LayoutGrid },
  { id: 'large', name: 'Large', description: '2 products per row', icon: Image },
];

export default function DesignStorePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [design, setDesign] = useState<StoreDesign>({
    logo_url: '',
    hero_text: '',
    hero_image: '',
    features: [],
  });
  const [selectedTheme, setSelectedTheme] = useState('general');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [gridMode, setGridMode] = useState('standard');
  const [showCategoryImages, setShowCategoryImages] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');
  const [selectedFeatureIcon, setSelectedFeatureIcon] = useState<number | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState('');
  const [dragOverLogo, setDragOverLogo] = useState(false);
  const [dragOverHero, setDragOverHero] = useState(false);

  const loadDesign = useCallback(async () => {
    try {
      const response = await fetch(`/api/store?slug=${slug}`);
      const data = await response.json();
      
      if (data.data) {
        setStoreId(data.data.id);
        
        const features = (data.data.features || []).map((f: any, idx: number) => ({
          id: f.id || `feature-${idx}-${Date.now()}`,
          ...f,
        }));

        setDesign(prev => ({
          ...prev,
          logo_url: data.data.logo_url || '',
          hero_text: data.data.hero_text || '',
          hero_image: data.data.hero_image || '',
          features,
        }));

        if (data.data.logo_url) {
          setFavicon(data.data.logo_url);
        }

        setSelectedTheme(data.data.theme || 'general');
        setBgColor(data.data.bg_color || '#ffffff');
        setGridMode(data.data.image_display_mode || 'standard');
        setShowCategoryImages(data.data.show_category_images ?? true);

        localStorage.setItem(`design_${slug}`, JSON.stringify({
          logo_url: data.data.logo_url || '',
          hero_text: data.data.hero_text || '',
          hero_image: data.data.hero_image || '',
          features,
        }));
      }
    } catch (error) {
      console.error('Error loading design:', error);
      const cached = localStorage.getItem(`design_${slug}`);
      if (cached) {
        setDesign(JSON.parse(cached));
      }
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      loadDesign();
    }
  }, [slug, loadDesign]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSavedMessage('');

    try {
      const storeRes = await fetch(`/api/store?slug=${slug}`);
      const storeData = await storeRes.json();
      const storeId = storeData.data?.id;

      if (!storeId) {
        throw new Error('Could not find store');
      }

      const response = await fetch(`/api/store`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          store_id: storeId,
          logo_url: design.logo_url,
          hero_text: design.hero_text,
          hero_image: design.hero_image,
          features: design.features,
          theme: selectedTheme,
          bg_color: bgColor,
          image_display_mode: gridMode,
          show_category_images: showCategoryImages,
        }),
      });

      const currentTheme = storeThemes.find(t => t.id === selectedTheme);
      if (currentTheme) {
        localStorage.setItem(`theme_${slug}`, JSON.stringify({
          ...currentTheme.colors,
          bg: bgColor
        }));
      }

      if (response.ok) {
        localStorage.setItem(`design_${slug}`, JSON.stringify(design));
        if (design.logo_url) {
          setFavicon(design.logo_url);
        }
        setSavedMessage('Design saved successfully!');
        setTimeout(() => setSavedMessage(''), 3000);
      } else {
        localStorage.setItem(`design_${slug}`, JSON.stringify(design));
        setSavedMessage('Design saved locally (may not sync to server)');
        setTimeout(() => setSavedMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error saving design:', error);
      localStorage.setItem(`design_${slug}`, JSON.stringify(design));
      const currentTheme = storeThemes.find(t => t.id === selectedTheme);
      if (currentTheme) {
        localStorage.setItem(`theme_${slug}`, JSON.stringify({
          ...currentTheme.colors,
          bg: bgColor
        }));
      }
      setSavedMessage('Saved to local storage');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFeature = (index: number, field: string, value: string) => {
    const newFeatures = [...design.features];
    if (field === 'icon') {
      newFeatures[index].icon = value;
    } else if (field === 'title') {
      newFeatures[index].title = value;
    } else if (field === 'description') {
      newFeatures[index].description = value;
    }
    setDesign({ ...design, features: newFeatures });
  };

  const addFeature = () => {
    const newFeature = { title: '', description: '', icon: '⭐', id: `feature-${Date.now()}` };
    setDesign({ ...design, features: [...design.features, newFeature] });
  };

  const removeFeature = (index: number) => {
    const newFeatures = design.features.filter((_, i) => i !== index);
    setDesign({ ...design, features: newFeatures });
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !storeId) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || 'Invalid file');
      setTimeout(() => setUploadError(''), 3000);
      return;
    }

    setUploadingLogo(true);
    setUploadError('');
    try {
      const result = await uploadImageToImageKit(file, 'logos', storeId);
      if (result.success && result.url) {
        const updatedDesign = {...design, logo_url: result.url};
        setDesign(updatedDesign);
        
        const saveResponse = await fetch(`/api/store`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            store_id: storeId,
            logo_url: result.url,
            hero_text: updatedDesign.hero_text,
            hero_image: updatedDesign.hero_image,
            features: updatedDesign.features,
          }),
        });

        if (saveResponse.ok) {
          setFavicon(result.url);
          localStorage.setItem(`design_${slug}`, JSON.stringify(updatedDesign));
          setSavedMessage('Logo uploaded and saved successfully!');
        } else {
          setSavedMessage('Logo uploaded but failed to save. Trying again...');
          await fetch(`/api/store`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              store_id: storeId,
              logo_url: result.url,
            }),
          });
        }
      } else {
        setUploadError(result.error || 'Upload failed');
      }
    } catch (error: any) {
      setUploadError(error.message || 'Upload failed');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !storeId) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || 'Invalid file');
      setTimeout(() => setUploadError(''), 3000);
      return;
    }

    setUploadingHero(true);
    setUploadError('');
    try {
      const result = await uploadImageToImageKit(file, 'heroes', storeId);
      if (result.success && result.url) {
        const updatedDesign = {...design, hero_image: result.url};
        setDesign(updatedDesign);
        
        const saveResponse = await fetch(`/api/store`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            store_id: storeId,
            logo_url: updatedDesign.logo_url,
            hero_text: updatedDesign.hero_text,
            hero_image: result.url,
            features: updatedDesign.features,
          }),
        });

        if (saveResponse.ok) {
          localStorage.setItem(`design_${slug}`, JSON.stringify(updatedDesign));
          setSavedMessage('Hero image uploaded and saved successfully!');
        } else {
          setSavedMessage('Hero image uploaded but failed to save. Trying again...');
          await fetch(`/api/store`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              store_id: storeId,
              hero_image: result.url,
            }),
          });
        }
      } else {
        setUploadError(result.error || 'Upload failed');
      }
    } catch (error: any) {
      setUploadError(error.message || 'Upload failed');
    } finally {
      setUploadingHero(false);
    }
  };

  const autoSaveUrl = async (fieldName: 'logo_url' | 'hero_url' | 'hero_text', value: string) => {
    try {
      if (fieldName === 'logo_url') {
        setDesign({...design, logo_url: value});
        if (value) setFavicon(value);
      } else if (fieldName === 'hero_url') {
        setDesign({...design, hero_image: value});
      } else {
        setDesign({...design, hero_text: value});
      }

      const saveData: any = { store_id: storeId };
      if (fieldName === 'logo_url') saveData.logo_url = value;
      if (fieldName === 'hero_url') saveData.hero_image = value;
      if (fieldName === 'hero_text') saveData.hero_text = value;

      await fetch(`/api/store`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saveData),
      });
    } catch (error) {
      console.error('Error auto-saving:', error);
    }
  };

  const handleLogoDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOverLogo(true);
  };

  const handleLogoDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOverLogo(false);
  };

  const handleLogoDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOverLogo(false);
    
    const file = e.dataTransfer.files?.[0];
    if (!file || !storeId) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || 'Invalid file');
      setTimeout(() => setUploadError(''), 3000);
      return;
    }

    setUploadingLogo(true);
    setUploadError('');
    try {
      const result = await uploadImageToImageKit(file, 'logos', storeId);
      if (result.success && result.url) {
        const updatedDesign = {...design, logo_url: result.url};
        setDesign(updatedDesign);
        
        const saveResponse = await fetch(`/api/store`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            store_id: storeId,
            logo_url: result.url,
            hero_text: updatedDesign.hero_text,
            hero_image: updatedDesign.hero_image,
            features: updatedDesign.features,
          }),
        });

        if (saveResponse.ok) {
          setFavicon(result.url);
          localStorage.setItem(`design_${slug}`, JSON.stringify(updatedDesign));
          setSavedMessage('Logo uploaded and saved successfully!');
        }
      } else {
        setUploadError(result.error || 'Upload failed');
      }
    } catch (error: any) {
      setUploadError(error.message || 'Upload failed');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleHeroDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOverHero(true);
  };

  const handleHeroDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOverHero(false);
  };

  const handleHeroDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOverHero(false);
    
    const file = e.dataTransfer.files?.[0];
    if (!file || !storeId) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || 'Invalid file');
      setTimeout(() => setUploadError(''), 3000);
      return;
    }

    setUploadingHero(true);
    setUploadError('');
    try {
      const result = await uploadImageToImageKit(file, 'heroes', storeId);
      if (result.success && result.url) {
        const updatedDesign = {...design, hero_image: result.url};
        setDesign(updatedDesign);
        
        const saveResponse = await fetch(`/api/store`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            store_id: storeId,
            logo_url: updatedDesign.logo_url,
            hero_text: updatedDesign.hero_text,
            hero_image: result.url,
            features: updatedDesign.features,
          }),
        });

        if (saveResponse.ok) {
          localStorage.setItem(`design_${slug}`, JSON.stringify(updatedDesign));
          setSavedMessage('Hero image uploaded and saved successfully!');
        }
      } else {
        setUploadError(result.error || 'Upload failed');
      }
    } catch (error: any) {
      setUploadError(error.message || 'Upload failed');
    } finally {
      setUploadingHero(false);
    }
  };

  const currentTheme = storeThemes.find(t => t.id === selectedTheme);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl lg:text-2xl font-bold text-slate-900">Design Store</h1>
        <a 
          href={`/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          <Eye className="w-4 h-4" />
          Preview Store
        </a>
      </div>

      {savedMessage && (
        <div className={`mb-4 p-4 rounded-xl text-sm font-medium ${
          savedMessage.includes('Error') 
            ? 'bg-red-50 text-red-700 border border-red-200' 
            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
        }`}>
          {savedMessage}
        </div>
      )}

      {uploadError && (
        <div className="mb-4 p-4 rounded-xl bg-red-50 text-red-700 border border-red-200 text-sm font-medium">
          {uploadError}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 lg:p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-xl bg-violet-50">
              <Palette className="w-5 h-5 text-violet-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Store Theme</h2>
          </div>
          
          <p className="text-sm text-slate-500 mb-4">Choose a theme that fits your store type</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {storeThemes.map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => setSelectedTheme(theme.id)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  selectedTheme === theme.id 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex gap-1.5 mb-3">
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.colors.primary }}></div>
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.colors.secondary }}></div>
                  <div className="w-6 h-6 rounded-full" style={{ backgroundColor: theme.colors.accent }}></div>
                  <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: theme.colors.bg }}></div>
                </div>
                <p className="text-sm font-semibold text-slate-800">{theme.name}</p>
                <p className="text-xs text-slate-500 mt-1">{theme.description}</p>
              </button>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-5">
            <label className="block text-sm font-medium text-slate-700 mb-3">Background Color</label>
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-12 h-12 rounded-lg cursor-pointer border border-slate-200"
              />
              <input
                type="text"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="flex-1 max-w-[150px] text-sm border border-slate-200 rounded-lg px-3 py-2"
                placeholder="#ffffff"
              />
              <div className="flex gap-2">
                {['#ffffff', '#f8fafc', '#fdf2f8', '#f0fdfa', '#fafafa'].map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setBgColor(color)}
                    className={`w-8 h-8 rounded-lg border-2 transition-all ${bgColor === color ? 'border-indigo-500' : 'border-slate-200'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          {currentTheme && (
            <div className="mt-5 p-4 rounded-xl border border-slate-200" style={{ backgroundColor: bgColor }}>
              <p className="text-xs text-slate-500 mb-2">Preview</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: currentTheme.colors.primary }}>S</div>
                <div>
                  <p className="font-semibold" style={{ color: currentTheme.colors.text }}>Store Name</p>
                  <p className="text-sm" style={{ color: `${currentTheme.colors.text}80` }}>Sample subtitle</p>
                </div>
                <button type="button" className="ml-auto px-4 py-2 rounded-lg text-sm font-medium text-white" style={{ backgroundColor: currentTheme.colors.accent }}>
                  Button
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 lg:p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 rounded-xl bg-blue-50">
              <LayoutGrid className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Product Display</h2>
          </div>
          
          <p className="text-sm text-slate-500 mb-4">Choose how products appear on your storefront</p>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {gridModes.map((mode) => {
              const Icon = mode.icon;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setGridMode(mode.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-center ${
                    gridMode === mode.id 
                      ? 'border-indigo-500 bg-indigo-50' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Icon className={`w-8 h-8 mx-auto mb-2 ${gridMode === mode.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <p className="text-sm font-semibold text-slate-800">{mode.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{mode.description}</p>
                </button>
              );
            })}
          </div>

          <div className="border-t border-slate-100 pt-5">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-sm font-medium text-slate-700">Show Category Images</p>
                <p className="text-xs text-slate-500 mt-0.5">Display images alongside category names</p>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={showCategoryImages}
                  onChange={(e) => setShowCategoryImages(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </div>
            </label>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 lg:p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Store Logo</h2>
          <div className="space-y-3">
            <div
              onDragOver={handleLogoDragOver}
              onDragLeave={handleLogoDragLeave}
              onDrop={handleLogoDrop}
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                dragOverLogo
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-slate-200 bg-slate-50 hover:border-slate-300'
              }`}
            >
              <input
                type="file"
                id="logo-upload"
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={uploadingLogo}
                className="hidden"
              />
              <label htmlFor="logo-upload" className="cursor-pointer block">
                <div className="flex flex-col items-center gap-2">
                  {uploadingLogo ? (
                    <>
                      <Loader className="w-8 h-8 animate-spin text-indigo-600" />
                      <p className="text-sm text-slate-600">Uploading...</p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-slate-400" />
                      <p className="text-sm font-medium text-slate-700">Drag and drop logo here</p>
                      <p className="text-xs text-slate-500">or click to browse</p>
                    </>
                  )}
                </div>
              </label>
            </div>
            <p className="text-sm text-slate-500">Or enter URL manually:</p>
            <input
              type="url"
              value={design.logo_url}
              onChange={(e) => autoSaveUrl('logo_url', e.target.value)}
              placeholder="https://example.com/logo.png"
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            {design.logo_url && (
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm font-medium mb-2 text-slate-700">Preview:</p>
                  <img src={getOptimizedImageUrl(design.logo_url, { width: 200, height: 100 })} alt="Logo" className="h-16 object-contain rounded-lg" />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 lg:p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Hero Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Hero Text</label>
              <textarea
                value={design.hero_text}
                onChange={(e) => autoSaveUrl('hero_text', e.target.value)}
                placeholder="Welcome to our store!"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm h-20 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Hero Image</label>
              <div
                onDragOver={handleHeroDragOver}
                onDragLeave={handleHeroDragLeave}
                onDrop={handleHeroDrop}
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors mb-2 ${
                  dragOverHero
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                }`}
              >
                <input
                  type="file"
                  id="hero-upload"
                  accept="image/*"
                  onChange={handleHeroUpload}
                  disabled={uploadingHero}
                  className="hidden"
                />
                <label htmlFor="hero-upload" className="cursor-pointer block">
                  <div className="flex flex-col items-center gap-2">
                    {uploadingHero ? (
                      <>
                        <Loader className="w-8 h-8 animate-spin text-indigo-600" />
                        <p className="text-sm text-slate-600">Uploading...</p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-slate-400" />
                        <p className="text-sm font-medium text-slate-700">Drag and drop hero image here</p>
                        <p className="text-xs text-slate-500">or click to browse</p>
                      </>
                    )}
                  </div>
                </label>
              </div>
              <p className="text-sm text-slate-500 mb-2">Or enter URL manually:</p>
              <input
                type="url"
                value={design.hero_image}
                onChange={(e) => autoSaveUrl('hero_url', e.target.value)}
                placeholder="https://example.com/hero.jpg"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
            {design.hero_image && (
              <div>
                <p className="text-sm font-medium mb-2 text-slate-700">Preview:</p>
                <div className="relative w-full h-48 rounded-xl overflow-hidden">
                  <img src={getOptimizedImageUrl(design.hero_image, { width: 800, height: 400, quality: 90 })} alt="Hero" className="w-full h-full object-cover" />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 lg:p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-semibold text-slate-900">Store Features</h2>
            <button
              type="button"
              onClick={addFeature}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Feature
            </button>
          </div>
          <div className="space-y-4">
            {design.features.length === 0 ? (
              <p className="text-slate-500 text-center py-8 text-sm">No features added yet. Click &quot;Add Feature&quot; to get started.</p>
            ) : (
              design.features.map((feature, index) => (
                <div key={feature.id} className="border border-slate-200 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-slate-900 text-sm">Feature {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Remove feature"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">Icon</label>
                        <button
                          type="button"
                          onClick={() => setSelectedFeatureIcon(selectedFeatureIcon === index ? null : index)}
                          className="w-full border border-slate-200 rounded-xl px-3 py-3 text-center hover:bg-slate-50 transition flex items-center justify-center"
                        >
                          <FeatureIconDisplay icon={feature.icon} className="w-8 h-8 text-indigo-600" />
                        </button>
                        {selectedFeatureIcon === index && (
                          <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                            <p className="text-xs font-medium text-slate-500 mb-2">Lucide Icons</p>
                            <div className="grid grid-cols-8 gap-2 mb-3">
                              {lucideIconOptions.map(iconName => {
                                const IconComp = lucideIconMap[iconName];
                                return (
                                  <button
                                    key={iconName}
                                    type="button"
                                    onClick={() => {
                                      updateFeature(index, 'icon', iconName);
                                      setSelectedFeatureIcon(null);
                                    }}
                                    className="p-2 hover:bg-indigo-100 rounded-lg transition flex items-center justify-center"
                                    title={iconName}
                                  >
                                    {IconComp && <IconComp className="w-5 h-5 text-slate-700" />}
                                  </button>
                                );
                              })}
                            </div>
                            <p className="text-xs font-medium text-slate-500 mb-2">Emojis</p>
                            <div className="grid grid-cols-6 gap-2">
                              {emojiOptions.map(icon => (
                                <button
                                  key={icon}
                                  type="button"
                                  onClick={() => {
                                    updateFeature(index, 'icon', icon);
                                    setSelectedFeatureIcon(null);
                                  }}
                                  className="p-2 text-2xl hover:bg-indigo-100 rounded-lg transition flex items-center justify-center"
                                >
                                  {icon}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Title</label>
                      <input
                        type="text"
                        value={feature.title}
                        onChange={(e) => updateFeature(index, 'title', e.target.value)}
                        placeholder="Feature title"
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
                      <textarea
                        value={feature.description}
                        onChange={(e) => updateFeature(index, 'description', e.target.value)}
                        placeholder="Feature description"
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm h-16 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white py-3.5 rounded-xl hover:bg-indigo-700 disabled:opacity-50 font-semibold transition-all shadow-lg shadow-indigo-600/20"
        >
          {isLoading ? 'Saving...' : 'Save Design'}
        </button>
      </form>
    </div>
  );
}
