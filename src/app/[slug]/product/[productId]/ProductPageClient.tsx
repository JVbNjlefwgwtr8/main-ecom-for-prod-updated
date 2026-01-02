'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingCart, Heart, ArrowLeft, Check, Share2, Minus, Plus
} from 'lucide-react';
import { getOptimizedImageUrl } from '@/lib/imagekit';

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
}

interface Store {
  id: string;
  name: string;
  slug: string;
  logo_url: string;
  phone: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface ProductPageClientProps {
  store: Store;
  product: Product;
  relatedProducts: Product[];
  slug: string;
}

export default function ProductPageClient({ store, product, relatedProducts, slug }: ProductPageClientProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem(`cart_${slug}`);
    const savedWishlist = localStorage.getItem(`wishlist_${slug}`);
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    setHydrated(true);
  }, [slug]);

  useEffect(() => {
    if (slug && hydrated) {
      localStorage.setItem(`cart_${slug}`, JSON.stringify(cart));
    }
  }, [cart, slug, hydrated]);

  useEffect(() => {
    if (slug && hydrated) {
      localStorage.setItem(`wishlist_${slug}`, JSON.stringify(wishlist));
    }
  }, [wishlist, slug, hydrated]);

  const addToCart = () => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const toggleWishlist = () => {
    setWishlist(prev =>
      prev.includes(product.id) ? prev.filter(id => id !== product.id) : [...prev, product.id]
    );
  };

  const shareProduct = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} at ${store?.name}`,
          url,
        });
      } catch {
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
      }
    } else if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const discount = product.mrp > product.price 
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href={`/${slug}`}
                className="p-2 hover:bg-stone-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-stone-700" />
              </Link>
              <Link href={`/${slug}`} className="flex items-center gap-3">
                {store?.logo_url ? (
                  <img
                    src={getOptimizedImageUrl(store.logo_url, { width: 40, height: 40, quality: 90 })}
                    alt={store.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center text-white font-bold">
                    {store?.name?.[0]?.toUpperCase()}
                  </div>
                )}
                <span className="font-semibold text-stone-900 hidden sm:block">{store?.name}</span>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleWishlist}
                className={`p-2.5 rounded-full transition-colors ${
                  wishlist.includes(product.id)
                    ? 'bg-red-100 text-red-600'
                    : 'hover:bg-stone-100 text-stone-600'
                }`}
              >
                <Heart className={`w-5 h-5 ${wishlist.includes(product.id) ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={shareProduct}
                className="p-2.5 hover:bg-stone-100 rounded-full text-stone-600 transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <Link
                href={`/${slug}`}
                className="relative p-2.5 hover:bg-stone-100 rounded-full text-stone-600 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <div className="relative">
            <div className="aspect-square bg-gradient-to-br from-stone-100 to-stone-200 rounded-3xl overflow-hidden shadow-xl">
              <img
                src={getOptimizedImageUrl(product.image_url, { width: 800, height: 800, quality: 90 })}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            {discount > 0 && (
              <div className="absolute top-6 left-6 bg-gradient-to-r from-red-600 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                {discount}% OFF
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <div className="mb-2">
              <span className="text-xs text-stone-500 uppercase tracking-widest font-semibold">{product.category}</span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-stone-900 mb-6 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl md:text-5xl font-bold text-stone-900">₹{product.price.toLocaleString()}</span>
              {product.mrp > product.price && (
                <span className="text-xl text-stone-400 line-through">₹{product.mrp.toLocaleString()}</span>
              )}
            </div>

            <div className="mb-8">
              {product.in_stock ? (
                <span className="inline-flex items-center gap-2 text-emerald-600 font-semibold bg-emerald-50 px-4 py-2 rounded-full">
                  <Check className="w-5 h-5" /> In Stock
                </span>
              ) : (
                <span className="inline-flex items-center text-red-600 font-semibold bg-red-50 px-4 py-2 rounded-full">
                  Out of Stock
                </span>
              )}
            </div>

            {product.description && (
              <div className="mb-8">
                <h2 className="font-semibold text-stone-900 mb-3 text-lg">Description</h2>
                <p className="text-stone-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            <div className="flex items-center gap-4 mb-8">
              <span className="font-semibold text-stone-700">Quantity:</span>
              <div className="flex items-center border border-stone-300 rounded-full">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-stone-100 rounded-l-full transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-6 font-semibold text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-stone-100 rounded-r-full transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

              <div className="flex gap-4 mt-auto">
                <button
                  onClick={addToCart}
                  disabled={!product.in_stock}
                  className="flex-1 bg-gradient-to-r from-stone-900 to-stone-800 text-white py-4 px-8 rounded-full font-bold hover:from-stone-800 hover:to-stone-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
                <button
                  onClick={toggleWishlist}
                  className={`px-6 py-4 rounded-full font-bold transition-all border-2 flex items-center justify-center ${
                    wishlist.includes(product.id)
                      ? 'bg-red-50 border-red-200 text-red-600'
                      : 'bg-white border-stone-300 text-stone-700 hover:border-stone-400'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${wishlist.includes(product.id) ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          </div>

        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-8" style={{ fontFamily: 'Georgia, serif' }}>
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map(relProduct => (
                <Link
                  key={relProduct.id}
                  href={`/${slug}/product/${relProduct.id}`}
                  className="group"
                >
                  <div className="aspect-square bg-gradient-to-br from-stone-100 to-stone-200 rounded-2xl overflow-hidden mb-4 shadow-md group-hover:shadow-xl transition-shadow">
                    <img
                      src={getOptimizedImageUrl(relProduct.image_url, { width: 300, height: 300, quality: 85 })}
                      alt={relProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-semibold text-stone-900 mb-1 line-clamp-2 group-hover:text-amber-600 transition-colors">{relProduct.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900">₹{relProduct.price}</span>
                    {relProduct.mrp > relProduct.price && (
                      <span className="text-sm text-stone-400 line-through">₹{relProduct.mrp}</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="bg-stone-900 text-white py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <p className="text-stone-400 text-sm">
            © {new Date().getFullYear()} {store?.name}. All rights reserved.
          </p>
          <p className="text-stone-500 text-xs mt-2">Powered by Codetoli Commerce</p>
        </div>
      </footer>
    </div>
  );
}
