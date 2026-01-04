'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { ShoppingCart, Plus, Minus, X, Search, Phone, Mail, ExternalLink, Package, Shield, Clock, Store, Heart, ShoppingBag, Trash2, QrCode, Check, ChevronRight, Star, Sparkles, Activity, Pill, Stethoscope, HeartPulse, MapPin, Truck, Award, Zap, TrendingUp, Eye, Grid3X3, LayoutGrid, Menu, ArrowRight, Instagram, Facebook, Twitter, Flower2, Gift, Leaf, Sun, Moon, Gem, Crown, Diamond, BadgeCheck, Headphones, RefreshCw, CreditCard, Users, ThumbsUp, MessageCircle, Globe, Lock, Percent, Tag, Bookmark, Calendar, Coffee, Music, Camera, Smile, Home, Settings, Bell, FileText, Share2 } from 'lucide-react';
import { setFavicon } from '@/lib/favicon';
import { getOptimizedImageUrl } from '@/lib/imagekit';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';

interface Product {
  id: string;
  name: string;
  price: number;
  mrp?: number;
  image_url: string;
  category_id?: string;
  category?: string;
  in_stock: boolean;
  description?: string;
}

interface Category {
  id: string;
  name: string;
  image_url?: string;
}

interface StoreData {
  id: string;
  name: string;
  slug: string;
  logo_url: string;
  hero_text: string;
  hero_image: string;
  phone?: string;
  showcase_email?: string;
  upi_id?: string;
  upi_enabled?: boolean;
  show_category_images?: boolean;
  image_display_mode?: string;
  theme?: string;
  bg_color?: string;
  features?: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
  }>;
}

interface CartItem extends Product {
  quantity: number;
}

interface SocialLink {
  id: string;
  display_text: string;
  url: string;
}

interface Banner {
  id: string;
  text: string;
  background_color: string;
  text_color: string;
}

interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: string;
  customerName: string;
  customerPhone: string;
}

interface StorefrontClientProps {
  store: StoreData;
  products: Product[];
  categories: Category[];
  socialLinks: SocialLink[];
  banners: Banner[];
  slug: string;
}

const storeThemes: Record<string, { primary: string; secondary: string; accent: string; text: string; bg: string; card: string }> = {
  medical: { primary: '#0d9488', secondary: '#115e59', accent: '#14b8a6', text: '#0f172a', bg: '#f0fdfa', card: '#ffffff' },
  fashion: { primary: '#9333ea', secondary: '#1e1e2e', accent: '#f472b6', text: '#ffffff', bg: '#0f0f17', card: '#1a1a2e' },
  general: { primary: '#2563eb', secondary: '#1e40af', accent: '#f59e0b', text: '#1e293b', bg: '#f8fafc', card: '#ffffff' },
  minimal: { primary: '#000000', secondary: '#171717', accent: '#737373', text: '#0a0a0a', bg: '#fafafa', card: '#ffffff' },
  petals: { primary: '#ec4899', secondary: '#f9a8d4', accent: '#fce7f3', text: '#831843', bg: '#fff1f2', card: '#ffffff' },
  default: { primary: '#6366f1', secondary: '#4f46e5', accent: '#f59e0b', text: '#1e293b', bg: '#f8fafc', card: '#ffffff' }
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Truck, Shield, RefreshCw, Package, Clock, Star, Heart, Award, Zap, TrendingUp, 
  Headphones, Gift, Leaf, Sun, Moon, Gem, Crown, Diamond, BadgeCheck, Phone, 
  Mail, MapPin, Check, Sparkles, Store, ShoppingBag, ShoppingCart, CreditCard, 
  Users, ThumbsUp, MessageCircle, Globe, Lock, Percent, Tag, Bookmark, Calendar, 
  Coffee, Music, Camera, Smile, Home, Settings, Bell, Search, FileText, Share2
};

function FeatureIcon({ name, className }: { name: string; className?: string }) {
  const IconComponent = iconMap[name];
  if (IconComponent) return <IconComponent className={className} />;
  return <span className={className}>{name}</span>;
}

export default function StorefrontClient({ 
  store: initialStore, 
  products: initialProducts, 
  categories: initialCategories, 
  socialLinks: initialSocialLinks, 
  banners: initialBanners,
  slug 
}: StorefrontClientProps) {
  const params = useParams();
  const storeSlug = slug || (params.slug as string);

  const [store] = useState<StoreData>(initialStore);
  const [products] = useState<Product[]>(initialProducts);
  const [categories] = useState<Category[]>(initialCategories);
  const [socialLinks] = useState<SocialLink[]>(initialSocialLinks);
  const [banners] = useState<Banner[]>(initialBanners);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showUpiQr, setShowUpiQr] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [showPaymentComplete, setShowPaymentComplete] = useState(false);

  const themeId = store?.theme || 'default';
  const theme = useMemo(() => {
    const baseTheme = storeThemes[themeId] || storeThemes.default;
    return {
      ...baseTheme,
      bg: store?.bg_color || baseTheme.bg
    };
  }, [themeId, store?.bg_color]);

  const gridMode = store?.image_display_mode || 'standard';

  useEffect(() => {
    setFavicon(store?.logo_url, store?.name);
    
    const savedCart = localStorage.getItem(`cart_${storeSlug}`);
    if (savedCart) {
      try { setCart(JSON.parse(savedCart)); } catch (e) { console.error('Error parsing cart:', e); }
    }

    const savedWishlist = localStorage.getItem(`wishlist_${storeSlug}`);
    if (savedWishlist) {
      try { setWishlist(JSON.parse(savedWishlist)); } catch (e) { console.error('Error parsing wishlist:', e); }
    }

    const savedOrders = localStorage.getItem(`orders_${storeSlug}`);
    if (savedOrders) {
      try { setOrders(JSON.parse(savedOrders)); } catch (e) { console.error('Error parsing orders:', e); }
    }
  }, [storeSlug, store?.logo_url, store?.name]);

  useEffect(() => {
    if (cart.length > 0) localStorage.setItem(`cart_${storeSlug}`, JSON.stringify(cart));
    else localStorage.removeItem(`cart_${storeSlug}`);
  }, [cart, storeSlug]);

  useEffect(() => {
    if (wishlist.length > 0) localStorage.setItem(`wishlist_${storeSlug}`, JSON.stringify(wishlist));
    else localStorage.removeItem(`wishlist_${storeSlug}`);
  }, [wishlist, storeSlug]);

  useEffect(() => {
    if (orders.length > 0) localStorage.setItem(`orders_${storeSlug}`, JSON.stringify(orders));
  }, [orders, storeSlug]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (productId: string) => setCart(prev => prev.filter(item => item.id !== productId));

  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.find(item => item.id === product.id);
      return exists ? prev.filter(item => item.id !== product.id) : [...prev, product];
    });
  };

  const isInWishlist = (productId: string) => wishlist.some(item => item.id === productId);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const generateOrderId = () => `ORD${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  const generateUpiUrl = (orderIdVal: string) => {
    const orderItems = cart.map(item => `${item.name} x${item.quantity} ₹${item.price * item.quantity}`).join(', ');
    const note = `Order: ${orderIdVal} | ${customerName} | Ph: ${customerPhone} | Items: ${orderItems} | Total: ₹${cartTotal}`;
    return `upi://pay?pa=${store.upi_id}&pn=${encodeURIComponent(store.name)}&am=${cartTotal}&cu=INR&tn=${encodeURIComponent(note.substring(0, 80))}`;
  };

  const handleProceedToPayment = () => {
    const newOrderId = generateOrderId();
    setOrderId(newOrderId);
    setShowUpiQr(true);
    setShowPaymentComplete(false);
    setTimeout(() => setShowPaymentComplete(true), 10000);
  };

  const handlePaymentCompleted = () => {
    if (!store?.phone) return;
    
    const orderText = cart.map(item => `${item.name} x${item.quantity} - ₹${(item.price * item.quantity).toLocaleString('en-IN')}`).join('\n');
    const message = `🧾 *Order ID: ${orderId}*\n\n🛒 *Order Details*\n${orderText}\n\n*Total: ₹${cartTotal.toLocaleString('en-IN')}*\n\n*Customer:* ${customerName}\n*Phone:* ${customerPhone}\n*Address:* ${customerAddress}\n\n✅ Payment completed via UPI`;
    
    const newOrder: Order = { id: orderId, date: new Date().toISOString(), items: [...cart], total: cartTotal, status: 'paid', customerName, customerPhone };
    setOrders(prev => [newOrder, ...prev]);
    
    const phoneNumber = store.phone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    try { window.open(whatsappUrl, '_blank'); } catch { window.parent.postMessage({ type: "OPEN_EXTERNAL_URL", data: { url: whatsappUrl } }, "*"); }
    
    setCart([]);
    setShowCart(false);
    setShowCheckout(false);
    setShowUpiQr(false);
    setShowPaymentComplete(false);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    // Filter by category - check if product's category matches the selected category ID
    let matchesCategory = true;
    if (selectedCategory) {
      // Find the category object to get its name
      const selectedCategoryObj = categories.find(cat => cat.id === selectedCategory);
      if (selectedCategoryObj) {
        // Match products by category name
        matchesCategory = product.category === selectedCategoryObj.name || product.category_id === selectedCategory;
      } else {
        matchesCategory = false;
      }
    }
    return matchesSearch && matchesCategory;
  });

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    // Scroll to products section smoothly
    setTimeout(() => {
      const productsSection = document.getElementById('products');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);
  };

  const handleWhatsAppOrder = () => {
    if (!store?.phone) return;
    
    const orderText = cart.map(item => `${item.name} x${item.quantity} - ₹${(item.price * item.quantity).toLocaleString('en-IN')}`).join('\n');
    const message = `🛒 *New Order*\n\n${orderText}\n\n*Total: ₹${cartTotal.toLocaleString('en-IN')}*\n\n*Customer:* ${customerName}\n*Phone:* ${customerPhone}\n*Address:* ${customerAddress}`;
    
    const newOrder: Order = { id: Date.now().toString(), date: new Date().toISOString(), items: [...cart], total: cartTotal, status: 'pending', customerName, customerPhone };
    setOrders(prev => [newOrder, ...prev]);
    
    const phoneNumber = store.phone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    try { window.open(whatsappUrl, '_blank'); } catch { window.parent.postMessage({ type: "OPEN_EXTERNAL_URL", data: { url: whatsappUrl } }, "*"); }
    
    setCart([]);
    setShowCart(false);
    setShowCheckout(false);
  };

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Store className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Store Not Found</h1>
          <p className="text-gray-500">This store doesn&apos;t exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const themeProps = {
    store, products, categories, socialLinks, banners, theme, gridMode, storeSlug, cart, setCart: setCart as React.Dispatch<React.SetStateAction<CartItem[]>>, wishlist, setWishlist: setWishlist as React.Dispatch<React.SetStateAction<Product[]>>, orders, setOrders: setOrders as React.Dispatch<React.SetStateAction<Order[]>>, showCart, setShowCart, showWishlist, setShowWishlist, showOrders, setShowOrders, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, handleCategorySelect, showCheckout, setShowCheckout, showUpiQr, setShowUpiQr, orderId, setOrderId, customerName, setCustomerName, customerPhone, setCustomerPhone, customerAddress, setCustomerAddress, showPaymentComplete, setShowPaymentComplete, addToCart, updateQuantity, removeFromCart, toggleWishlist, isInWishlist, cartTotal, cartCount, generateOrderId, generateUpiUrl, handleProceedToPayment, handlePaymentCompleted, filteredProducts, handleWhatsAppOrder
  };

  if (themeId === 'medical') return <MedicalTheme {...themeProps} />;
  if (themeId === 'fashion') return <FashionTheme {...themeProps} />;
  if (themeId === 'minimal') return <MinimalTheme {...themeProps} />;
  if (themeId === 'petals') return <PetalsTheme {...themeProps} />;
  return <GeneralTheme {...themeProps} />;
}

interface ThemeProps {
  store: StoreData;
  products: Product[];
  categories: Category[];
  socialLinks: SocialLink[];
  banners: Banner[];
  theme: { primary: string; secondary: string; accent: string; text: string; bg: string; card: string };
  gridMode: string;
  storeSlug: string;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  wishlist: Product[];
  setWishlist: React.Dispatch<React.SetStateAction<Product[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  showCart: boolean;
  setShowCart: React.Dispatch<React.SetStateAction<boolean>>;
  showWishlist: boolean;
  setShowWishlist: React.Dispatch<React.SetStateAction<boolean>>;
  showOrders: boolean;
  setShowOrders: React.Dispatch<React.SetStateAction<boolean>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  selectedCategory: string | null;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | null>>;
  handleCategorySelect: (categoryId: string | null) => void;
  showCheckout: boolean;
  setShowCheckout: React.Dispatch<React.SetStateAction<boolean>>;
  showUpiQr: boolean;
  setShowUpiQr: React.Dispatch<React.SetStateAction<boolean>>;
  orderId: string;
  setOrderId: React.Dispatch<React.SetStateAction<string>>;
  customerName: string;
  setCustomerName: React.Dispatch<React.SetStateAction<string>>;
  customerPhone: string;
  setCustomerPhone: React.Dispatch<React.SetStateAction<string>>;
  customerAddress: string;
  setCustomerAddress: React.Dispatch<React.SetStateAction<string>>;
  showPaymentComplete: boolean;
  setShowPaymentComplete: React.Dispatch<React.SetStateAction<boolean>>;
  addToCart: (product: Product) => void;
  updateQuantity: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  cartTotal: number;
  cartCount: number;
  generateOrderId: () => string;
  generateUpiUrl: (orderIdVal: string) => string;
  handleProceedToPayment: () => void;
  handlePaymentCompleted: () => void;
  filteredProducts: Product[];
  handleWhatsAppOrder: () => void;
}

function PetalsTheme({ store, products, categories, socialLinks, banners, theme, gridMode, storeSlug, cart, wishlist, orders, showCart, setShowCart, showWishlist, setShowWishlist, showOrders, setShowOrders, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, handleCategorySelect, showCheckout, setShowCheckout, showUpiQr, setShowUpiQr, orderId, customerName, setCustomerName, customerPhone, setCustomerPhone, customerAddress, setCustomerAddress, showPaymentComplete, addToCart, updateQuantity, removeFromCart, toggleWishlist, isInWishlist, cartTotal, cartCount, handleProceedToPayment, handlePaymentCompleted, filteredProducts, handleWhatsAppOrder, generateUpiUrl }: ThemeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-pink-50 to-white">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');
        body { font-family: 'Quicksand', sans-serif; }
        .font-display { font-family: 'Playfair Display', serif; }
        
        .petal-card {
          position: relative;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .petal-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 2px;
          background: linear-gradient(135deg, #fce7f3, #fbcfe8, #f9a8d4);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .petal-card:hover::before { opacity: 1; }
        .petal-card:hover { transform: translateY(-8px); box-shadow: 0 25px 50px -12px rgba(236, 72, 153, 0.15); }
        
        .bloom-btn {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .bloom-btn::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: -100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s ease;
        }
        .bloom-btn:hover::after { left: 100%; }
        .bloom-btn:hover { transform: scale(1.02); }
        
        .float-animation {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .petal-gradient {
          background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%);
        }
      `}</style>

      {banners.length > 0 && (
        <div className="bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 text-white text-center py-3">
          <div className="flex items-center justify-center gap-2 text-sm font-medium tracking-wide">
            <Flower2 className="w-4 h-4 animate-pulse" />
            <span>{banners[0].text}</span>
            <Flower2 className="w-4 h-4 animate-pulse" />
          </div>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-pink-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link href={`/${storeSlug}`} className="flex items-center gap-3 group">
              {store.logo_url ? (
                <img src={getOptimizedImageUrl(store.logo_url, { width: 100, height: 100 })} alt={store.name} className="h-10 w-10 object-contain rounded-xl group-hover:scale-110 transition-transform duration-300" />
              ) : (
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-display text-xl group-hover:scale-110 transition-transform duration-300">
                  {store.name[0]}
                </div>
              )}
              <div>
                <h1 className="font-display text-xl font-semibold text-rose-900 group-hover:text-pink-600 transition-colors">{store.name}</h1>
              </div>
            </Link>

            <div className="hidden md:flex flex-1 max-w-sm mx-8">
              <div className="relative w-full group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-300 group-focus-within:text-pink-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Find something beautiful..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-pink-50/50 border border-pink-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent focus:bg-white transition-all placeholder-pink-300"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setShowWishlist(true)} className="relative p-2.5 rounded-full hover:bg-pink-50 transition-colors group">
                <Heart className={`w-5 h-5 transition-all duration-300 ${wishlist.length > 0 ? 'fill-pink-500 text-pink-500 scale-110' : 'text-pink-400 group-hover:text-pink-500 group-hover:scale-110'}`} />
                {wishlist.length > 0 && <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">{wishlist.length}</span>}
              </button>
              <button onClick={() => setShowOrders(true)} className="relative p-2.5 rounded-full hover:bg-pink-50 transition-colors group">
                <ShoppingBag className="w-5 h-5 text-pink-400 group-hover:text-pink-500 group-hover:scale-110 transition-all duration-300" />
                {orders.length > 0 && <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{orders.length}</span>}
              </button>
              <button onClick={() => setShowCart(true)} className="relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300 bloom-btn">
                <ShoppingCart className="w-5 h-5" />
                <span className="font-semibold text-sm">₹{cartTotal.toLocaleString('en-IN')}</span>
                {cartCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-pink-500 text-xs font-bold rounded-full flex items-center justify-center shadow-md">{cartCount}</span>}
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="py-8 lg:py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            {store.hero_text && (
              <p className="text-pink-600 text-sm font-medium mb-3">{store.hero_text}</p>
            )}
            <h2 className="font-display text-3xl lg:text-4xl text-rose-900 mb-3">Explore Collections</h2>
          </div>

          {categories.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-12">
              {categories.slice(0, 4).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(selectedCategory === cat.id ? null : cat.id)}
                  className={`petal-card group relative aspect-[4/5] rounded-2xl overflow-hidden ${selectedCategory === cat.id ? 'ring-2 ring-pink-400 ring-offset-2' : ''}`}
                >
                  {cat.image_url ? (
                    <img src={getOptimizedImageUrl(cat.image_url, { width: 400, height: 500 })} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full petal-gradient flex items-center justify-center">
                      <Flower2 className="w-16 h-16 text-pink-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-rose-900/80 via-rose-900/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="font-display text-xl lg:text-2xl text-white mb-1">{cat.name}</h3>
                    <p className="text-pink-200 text-sm flex items-center gap-1">
                      Explore <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {categories.length > 4 && (
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-8">
              <button onClick={() => handleCategorySelect(null)} className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${!selectedCategory ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30' : 'bg-pink-50 text-pink-600 hover:bg-pink-100'}`}>
                All Items
              </button>
              {categories.slice(4).map(cat => (
                <button key={cat.id} onClick={() => handleCategorySelect(cat.id)} className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${selectedCategory === cat.id ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30' : 'bg-pink-50 text-pink-600 hover:bg-pink-100'}`}>
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="products" className="pb-16 lg:pb-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-2xl lg:text-3xl text-rose-900">
                {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : 'All Products'}
              </h2>
              <p className="text-pink-400 text-sm mt-1">{filteredProducts.length} items</p>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full petal-gradient flex items-center justify-center float-animation">
                <Flower2 className="w-12 h-12 text-pink-300" />
              </div>
              <p className="text-pink-400 text-lg font-medium">No products found</p>
            </div>
          ) : (
            <div className={`grid ${gridMode === 'compact' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4' : gridMode === 'large' ? 'grid-cols-1 sm:grid-cols-2 gap-8' : 'grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-8'}`}>
              {filteredProducts.map((product) => {
                const cartItem = cart.find(item => item.id === product.id);
                const discount = product.mrp ? Math.round((1 - product.price / product.mrp) * 100) : 0;
                const inWishlist = isInWishlist(product.id);

                return (
                  <div key={product.id} className="petal-card bg-white rounded-2xl overflow-hidden shadow-sm">
                    <div className={`relative ${gridMode === 'large' ? 'aspect-square' : 'aspect-[3/4]'} bg-pink-50/50`}>
                      <Link href={`/${storeSlug}/product/${product.id}`}>
                        {product.image_url ? (
                          <img src={getOptimizedImageUrl(product.image_url, { width: 500, height: 650 })} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center petal-gradient">
                            <Gift className="w-16 h-16 text-pink-200" />
                          </div>
                        )}
                      </Link>
                      {discount > 0 && (
                        <span className="absolute top-3 left-3 px-3 py-1.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold rounded-full shadow-lg">
                          {discount}% OFF
                        </span>
                      )}
                      <button onClick={() => toggleWishlist(product)} className={`absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md transition-all duration-300 hover:scale-110 ${inWishlist ? 'text-pink-500' : 'text-pink-300 hover:text-pink-500'}`}>
                        <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                      </button>
                      {!product.in_stock && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                          <span className="px-4 py-2 bg-rose-500 text-white text-sm font-medium rounded-full">Sold Out</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 lg:p-5">
                      <Link href={`/${storeSlug}/product/${product.id}`}>
                        <h3 className="font-medium text-rose-900 mb-2 line-clamp-2 hover:text-pink-600 transition-colors">{product.name}</h3>
                      </Link>
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-xl font-bold text-pink-600">₹{product.price.toLocaleString('en-IN')}</span>
                        {product.mrp && product.mrp > product.price && (
                          <span className="text-sm text-pink-300 line-through">₹{product.mrp.toLocaleString('en-IN')}</span>
                        )}
                      </div>
                      {product.in_stock && (
                        cartItem ? (
                          <div className="flex items-center justify-between bg-pink-50 rounded-xl p-1">
                            <button onClick={() => updateQuantity(product.id, -1)} className="p-2.5 text-pink-600 hover:bg-pink-100 rounded-lg transition"><Minus className="w-4 h-4" /></button>
                            <span className="font-bold text-pink-600 text-lg">{cartItem.quantity}</span>
                            <button onClick={() => updateQuantity(product.id, 1)} className="p-2.5 text-pink-600 hover:bg-pink-100 rounded-lg transition"><Plus className="w-4 h-4" /></button>
                          </div>
                        ) : (
                          <button onClick={() => addToCart(product)} className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300 bloom-btn flex items-center justify-center gap-2">
                            <Plus className="w-4 h-4" />
                            Add to Cart
                          </button>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

          <footer className="bg-gradient-to-b from-pink-50 to-rose-100 border-t border-pink-100 py-12 lg:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                {store.logo_url ? (
                  <img src={getOptimizedImageUrl(store.logo_url, { width: 80, height: 80 })} alt={store.name} className="h-12 w-12 object-contain rounded-xl" />
                ) : (
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white font-display text-xl">{store.name[0]}</div>
                )}
                <span className="font-display text-2xl text-rose-900">{store.name}</span>
              </div>
              <p className="text-pink-600/70 text-sm leading-relaxed">
                Thank you for being part of our journey.
              </p>
            </div>
            <div>
              <h4 className="font-display text-lg text-rose-900 mb-4">Get in Touch</h4>
              <div className="space-y-3 text-sm text-pink-600">
                {store.phone && <a href={`tel:${store.phone}`} className="flex items-center gap-3 hover:text-pink-800 transition-colors group"><Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />{store.phone}</a>}
                {store.showcase_email && <a href={`mailto:${store.showcase_email}`} className="flex items-center gap-3 hover:text-pink-800 transition-colors group"><Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />{store.showcase_email}</a>}
              </div>
            </div>
            {socialLinks.length > 0 && (
              <div>
                <h4 className="font-display text-lg text-rose-900 mb-4">Follow Us</h4>
                <div className="flex flex-wrap gap-2">
                  {socialLinks.map(link => (
                    <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-white rounded-full text-sm text-pink-600 hover:bg-gradient-to-r hover:from-pink-500 hover:to-rose-500 hover:text-white transition-all duration-300 flex items-center gap-2 shadow-sm">
                      {link.display_text}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="mt-12 pt-6 border-t border-pink-200 text-center">
            <p className="text-pink-400 text-sm flex items-center justify-center gap-2">
              Made with <Heart className="w-4 h-4 fill-pink-400 text-pink-400" /> © {new Date().getFullYear()} {store.name}
            </p>
          </div>
        </div>
      </footer>

      <CartDrawer show={showCart} onClose={() => setShowCart(false)} cart={cart} cartTotal={cartTotal} updateQuantity={updateQuantity} removeFromCart={removeFromCart} showCheckout={showCheckout} setShowCheckout={setShowCheckout} showUpiQr={showUpiQr} setShowUpiQr={setShowUpiQr} orderId={orderId} customerName={customerName} setCustomerName={setCustomerName} customerPhone={customerPhone} setCustomerPhone={setCustomerPhone} customerAddress={customerAddress} setCustomerAddress={setCustomerAddress} showPaymentComplete={showPaymentComplete} store={store} handleProceedToPayment={handleProceedToPayment} handlePaymentCompleted={handlePaymentCompleted} handleWhatsAppOrder={handleWhatsAppOrder} generateUpiUrl={generateUpiUrl} theme={{ primary: '#ec4899', text: '#831843' }} />
      <WishlistDrawer show={showWishlist} onClose={() => setShowWishlist(false)} wishlist={wishlist} addToCart={addToCart} toggleWishlist={toggleWishlist} theme={{ primary: '#ec4899', text: '#831843' }} />
      <OrdersDrawer show={showOrders} onClose={() => setShowOrders(false)} orders={orders} theme={{ primary: '#ec4899', text: '#831843' }} />
    </div>
  );
}

function MedicalTheme({ store, products, categories, socialLinks, banners, theme, gridMode, storeSlug, cart, wishlist, orders, showCart, setShowCart, showWishlist, setShowWishlist, showOrders, setShowOrders, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, handleCategorySelect, showCheckout, setShowCheckout, showUpiQr, setShowUpiQr, orderId, customerName, setCustomerName, customerPhone, setCustomerPhone, customerAddress, setCustomerAddress, showPaymentComplete, addToCart, updateQuantity, removeFromCart, toggleWishlist, isInWishlist, cartTotal, cartCount, handleProceedToPayment, handlePaymentCompleted, filteredProducts, handleWhatsAppOrder, generateUpiUrl }: ThemeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .font-display { font-family: 'Plus Jakarta Sans', sans-serif; }
        
        .med-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid transparent;
        }
        .med-card:hover {
          transform: translateY(-4px);
          border-color: #14b8a6;
          box-shadow: 0 20px 40px -12px rgba(13, 148, 136, 0.15);
        }
        
        .pulse-badge {
          animation: pulse-ring 2s infinite;
        }
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(20, 184, 166, 0.4); }
          70% { box-shadow: 0 0 0 8px rgba(20, 184, 166, 0); }
          100% { box-shadow: 0 0 0 0 rgba(20, 184, 166, 0); }
        }
      `}</style>

      {banners.length > 0 && (
        <div className="bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500 text-white text-center py-2.5">
          <div className="flex items-center justify-center gap-2 text-sm font-medium">
            <HeartPulse className="w-4 h-4 animate-pulse" />
            <span>{banners[0].text}</span>
          </div>
        </div>
      )}

      <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-teal-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between px-4 py-3 lg:py-4">
            <Link href={`/${storeSlug}`} className="flex items-center gap-3 group">
              {store.logo_url ? (
                <img src={getOptimizedImageUrl(store.logo_url, { width: 80, height: 80 })} alt={store.name} className="h-12 w-12 object-contain rounded-xl group-hover:scale-105 transition-transform" />
              ) : (
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/30">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
              )}
              <div>
                <h1 className="font-display font-bold text-xl text-gray-900 group-hover:text-teal-600 transition-colors">{store.name}</h1>
                <div className="flex items-center gap-1.5 text-xs text-teal-600">
                  <Shield className="w-3 h-3" />
                  <span>Certified Healthcare Partner</span>
                </div>
              </div>
            </Link>

            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-teal-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search medicines, wellness products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              {store.phone && (
                <a href={`tel:${store.phone}`} className="hidden lg:flex items-center gap-2 px-4 py-2.5 text-sm text-teal-700 bg-teal-50 rounded-xl hover:bg-teal-100 transition font-medium">
                  <Phone className="w-4 h-4" />
                  <span>{store.phone}</span>
                </a>
              )}
              <button onClick={() => setShowOrders(true)} className="relative p-2.5 rounded-xl hover:bg-gray-100 transition">
                <Package className="w-5 h-5 text-gray-600" />
                {orders.length > 0 && <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-teal-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center pulse-badge">{orders.length}</span>}
              </button>
              <button onClick={() => setShowWishlist(true)} className="relative p-2.5 rounded-xl hover:bg-gray-100 transition">
                <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                {wishlist.length > 0 && <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{wishlist.length}</span>}
              </button>
              <button onClick={() => setShowCart(true)} className="relative flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl hover:shadow-lg hover:shadow-teal-500/30 transition-all">
                <ShoppingCart className="w-5 h-5" />
                <span className="font-bold">₹{cartTotal.toLocaleString('en-IN')}</span>
                {cartCount > 0 && <span className="absolute -top-1 -right-1 w-6 h-6 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">{cartCount}</span>}
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border-t border-teal-100">
            <div className="flex overflow-x-auto px-4 py-3 gap-2 scrollbar-hide">
              <button onClick={() => handleCategorySelect(null)} className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${!selectedCategory ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg shadow-teal-500/30' : 'bg-white text-gray-700 hover:bg-teal-100 border border-teal-100'}`}>
                All Products
              </button>
              {categories.map(cat => (
                <button key={cat.id} onClick={() => handleCategorySelect(cat.id)} className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${selectedCategory === cat.id ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg shadow-teal-500/30' : 'bg-white text-gray-700 hover:bg-teal-100 border border-teal-100'}`}>
                  {store.show_category_images && cat.image_url && <img src={getOptimizedImageUrl(cat.image_url, { width: 24, height: 24 })} alt={cat.name} className="w-5 h-5 rounded-full object-cover" />}
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-br from-teal-600 via-teal-500 to-cyan-500 py-12 lg:py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="text-white">
              <h1 className="font-display text-3xl lg:text-5xl font-extrabold mb-4 leading-tight">
                {store.hero_text || store.name}
              </h1>
              <div className="flex flex-wrap gap-4">
                <a href="#products" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-teal-600 rounded-xl font-bold hover:bg-teal-50 transition shadow-lg shadow-teal-900/20">
                  <Pill className="w-5 h-5" />
                  Browse Products
                </a>
                {store.phone && (
                  <a href={`https://wa.me/${store.phone.replace(/\D/g, '')}`} className="inline-flex items-center gap-2 px-6 py-3 bg-teal-700/50 backdrop-blur-sm text-white rounded-xl font-bold hover:bg-teal-700 transition">
                    <Phone className="w-5 h-5" />
                    Get Help
                  </a>
                )}
              </div>
            </div>
            {store.hero_image && (
              <div className="hidden lg:block">
                <img src={getOptimizedImageUrl(store.hero_image, { width: 600, height: 400 })} alt="Healthcare" className="rounded-3xl shadow-2xl shadow-teal-900/30" />
              </div>
            )}
          </div>
        </div>
      </section>

      {store.features && store.features.length > 0 && (
        <section className="py-8 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {store.features.slice(0, 4).map((feature) => (
                <div key={feature.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition group">
                  <FeatureIcon name={feature.icon} className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{feature.title}</p>
                    <p className="text-xs text-gray-500">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="products" className="py-10 lg:py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-gray-900">
                {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : 'Healthcare Products'}
              </h2>
              <p className="text-gray-500 mt-1">{filteredProducts.length} products</p>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-teal-50 flex items-center justify-center">
                <Package className="w-12 h-12 text-teal-300" />
              </div>
              <p className="text-gray-500 text-lg">No products found</p>
            </div>
          ) : (
            <div className={`grid ${gridMode === 'compact' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4' : gridMode === 'large' ? 'grid-cols-1 sm:grid-cols-2 gap-8' : 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'}`}>
              {filteredProducts.map((product) => {
                const cartItem = cart.find(item => item.id === product.id);
                const discount = product.mrp ? Math.round((1 - product.price / product.mrp) * 100) : 0;
                const inWishlist = isInWishlist(product.id);

                return (
                  <div key={product.id} className="med-card bg-white rounded-2xl overflow-hidden shadow-sm">
                    <div className={`relative bg-gray-50 ${gridMode === 'large' ? 'aspect-square' : 'aspect-[4/3]'}`}>
                      <Link href={`/${storeSlug}/product/${product.id}`}>
                        {product.image_url ? (
                          <img src={getOptimizedImageUrl(product.image_url, { width: 400, height: 300 })} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><Pill className="w-12 h-12 text-teal-200" /></div>
                        )}
                      </Link>
                      {discount > 0 && (
                        <span className="absolute top-3 left-3 px-3 py-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold rounded-lg shadow-lg">
                          {discount}% OFF
                        </span>
                      )}
                      <button onClick={() => toggleWishlist(product)} className={`absolute top-3 right-3 p-2.5 bg-white rounded-xl shadow-md hover:scale-110 transition ${inWishlist ? 'text-red-500' : 'text-gray-400'}`}>
                        <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                      </button>
                      {!product.in_stock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-bold">Out of Stock</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <Link href={`/${storeSlug}/product/${product.id}`}>
                        <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 hover:text-teal-600 transition">{product.name}</h3>
                      </Link>
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-xl font-extrabold text-teal-600">₹{product.price.toLocaleString('en-IN')}</span>
                        {product.mrp && product.mrp > product.price && (
                          <span className="text-sm text-gray-400 line-through">₹{product.mrp.toLocaleString('en-IN')}</span>
                        )}
                      </div>
                      {product.in_stock && (
                        cartItem ? (
                          <div className="flex items-center justify-between bg-teal-50 rounded-xl p-1">
                            <button onClick={() => updateQuantity(product.id, -1)} className="p-2.5 text-teal-600 hover:bg-teal-100 rounded-lg transition"><Minus className="w-4 h-4" /></button>
                            <span className="font-bold text-teal-600 text-lg">{cartItem.quantity}</span>
                            <button onClick={() => updateQuantity(product.id, 1)} className="p-2.5 text-teal-600 hover:bg-teal-100 rounded-lg transition"><Plus className="w-4 h-4" /></button>
                          </div>
                        ) : (
                          <button onClick={() => addToCart(product)} className="w-full py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-teal-500/30 transition-all flex items-center justify-center gap-2">
                            <Plus className="w-4 h-4" />
                            Add to Cart
                          </button>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

          <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                {store.logo_url ? (
                  <img src={getOptimizedImageUrl(store.logo_url, { width: 60, height: 60 })} alt={store.name} className="h-10 w-10 object-contain rounded-xl" />
                ) : (
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center"><Stethoscope className="w-5 h-5" /></div>
                )}
                <span className="font-display font-bold text-lg">{store.name}</span>
              </div>
              <p className="text-gray-400 text-sm">Your trusted healthcare partner.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-teal-400">Contact</h4>
              <div className="space-y-2 text-sm text-gray-400">
                {store.phone && <a href={`tel:${store.phone}`} className="flex items-center gap-2 hover:text-white transition"><Phone className="w-4 h-4" />{store.phone}</a>}
                {store.showcase_email && <a href={`mailto:${store.showcase_email}`} className="flex items-center gap-2 hover:text-white transition"><Mail className="w-4 h-4" />{store.showcase_email}</a>}
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-teal-400">Links</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <a href="#products" className="block hover:text-white transition">Products</a>
                <Link href="/terms" className="block hover:text-white transition">Terms</Link>
                <Link href="/privacy" className="block hover:text-white transition">Privacy</Link>
              </div>
            </div>
            {socialLinks.length > 0 && (
              <div>
                <h4 className="font-bold mb-4 text-teal-400">Follow</h4>
                <div className="flex flex-wrap gap-2">
                  {socialLinks.map(link => (
                    <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="px-3 py-2 bg-gray-800 rounded-lg text-sm hover:bg-teal-600 transition">
                      {link.display_text}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="mt-10 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} {store.name}
          </div>
        </div>
      </footer>

      <CartDrawer show={showCart} onClose={() => setShowCart(false)} cart={cart} cartTotal={cartTotal} updateQuantity={updateQuantity} removeFromCart={removeFromCart} showCheckout={showCheckout} setShowCheckout={setShowCheckout} showUpiQr={showUpiQr} setShowUpiQr={setShowUpiQr} orderId={orderId} customerName={customerName} setCustomerName={setCustomerName} customerPhone={customerPhone} setCustomerPhone={setCustomerPhone} customerAddress={customerAddress} setCustomerAddress={setCustomerAddress} showPaymentComplete={showPaymentComplete} store={store} handleProceedToPayment={handleProceedToPayment} handlePaymentCompleted={handlePaymentCompleted} handleWhatsAppOrder={handleWhatsAppOrder} generateUpiUrl={generateUpiUrl} theme={{ primary: '#0d9488', text: '#0f172a' }} />
      <WishlistDrawer show={showWishlist} onClose={() => setShowWishlist(false)} wishlist={wishlist} addToCart={addToCart} toggleWishlist={toggleWishlist} theme={{ primary: '#0d9488', text: '#0f172a' }} />
      <OrdersDrawer show={showOrders} onClose={() => setShowOrders(false)} orders={orders} theme={{ primary: '#0d9488', text: '#0f172a' }} />
    </div>
  );
}

function FashionTheme({ store, products, categories, socialLinks, banners, theme, gridMode, storeSlug, cart, wishlist, orders, showCart, setShowCart, showWishlist, setShowWishlist, showOrders, setShowOrders, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, handleCategorySelect, showCheckout, setShowCheckout, showUpiQr, setShowUpiQr, orderId, customerName, setCustomerName, customerPhone, setCustomerPhone, customerAddress, setCustomerAddress, showPaymentComplete, addToCart, updateQuantity, removeFromCart, toggleWishlist, isInWishlist, cartTotal, cartCount, handleProceedToPayment, handlePaymentCompleted, filteredProducts, handleWhatsAppOrder, generateUpiUrl }: ThemeProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Syne:wght@400;500;600;700;800&display=swap');
        body { font-family: 'Syne', sans-serif; }
        .font-display { font-family: 'Cormorant Garamond', serif; }
        
        .luxury-card {
          position: relative;
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .luxury-card::before {
          content: '';
          position: absolute;
          inset: -1px;
          background: linear-gradient(135deg, transparent 40%, rgba(147, 51, 234, 0.5), rgba(244, 114, 182, 0.5), transparent 60%);
          border-radius: inherit;
          opacity: 0;
          transition: opacity 0.5s ease;
          z-index: -1;
        }
        .luxury-card:hover::before { opacity: 1; }
        .luxury-card:hover { transform: translateY(-8px) scale(1.02); }
        
        .glow-text {
          text-shadow: 0 0 40px rgba(147, 51, 234, 0.3);
        }
      `}</style>

      {banners.length > 0 && (
        <div className="bg-gradient-to-r from-purple-900 via-fuchsia-800 to-pink-800 text-white text-center py-3">
          <p className="text-xs tracking-[0.3em] uppercase font-medium">{banners[0].text}</p>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-[#0a0a0f]/95 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href={`/${storeSlug}`} className="flex items-center gap-4 group">
              {store.logo_url ? (
                <img src={getOptimizedImageUrl(store.logo_url, { width: 100, height: 100 })} alt={store.name} className="h-12 w-12 object-contain rounded-lg group-hover:scale-110 transition-transform duration-500" />
              ) : (
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-600 via-fuchsia-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Crown className="w-6 h-6 text-white" />
                </div>
              )}
              <h1 className="font-display text-3xl font-light text-white tracking-wide glow-text">{store.name}</h1>
            </Link>

            <nav className="hidden lg:flex items-center gap-10">
              <button onClick={() => handleCategorySelect(null)} className={`text-xs tracking-[0.2em] uppercase transition-all duration-300 ${!selectedCategory ? 'text-white' : 'text-white/40 hover:text-white'}`}>
                All
              </button>
              {categories.slice(0, 5).map(cat => (
                <button key={cat.id} onClick={() => handleCategorySelect(cat.id)} className={`text-xs tracking-[0.2em] uppercase transition-all duration-300 ${selectedCategory === cat.id ? 'text-white' : 'text-white/40 hover:text-white'}`}>
                  {cat.name}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <div className="hidden md:block relative">
                <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-48 bg-white/5 border border-white/10 rounded-full px-5 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all" />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              </div>
              <button onClick={() => setShowWishlist(true)} className="relative p-2.5 text-white/60 hover:text-white transition-colors">
                <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'fill-pink-500 text-pink-500' : ''}`} />
                {wishlist.length > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{wishlist.length}</span>}
              </button>
              <button onClick={() => setShowOrders(true)} className="relative p-2.5 text-white/60 hover:text-white transition-colors">
                <ShoppingBag className="w-5 h-5" />
                {orders.length > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{orders.length}</span>}
              </button>
              <button onClick={() => setShowCart(true)} className="relative flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-white rounded-full hover:opacity-90 transition-all shadow-lg shadow-purple-500/25">
                <ShoppingCart className="w-5 h-5" />
                <span className="font-medium">₹{cartTotal.toLocaleString('en-IN')}</span>
                {cartCount > 0 && <span className="absolute -top-1 -right-1 w-6 h-6 bg-white text-purple-600 text-xs font-bold rounded-full flex items-center justify-center shadow-lg">{cartCount}</span>}
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-transparent to-pink-900/30" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-[120px]" />
        </div>
        {store.hero_image && (
          <div className="absolute inset-0">
            <img src={getOptimizedImageUrl(store.hero_image, { width: 1920, height: 1080 })} alt="Hero" className="w-full h-full object-cover opacity-20" />
          </div>
        )}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl">
            <h1 className="font-display text-5xl lg:text-7xl text-white font-light leading-[0.9] mb-8 glow-text">
              {store.hero_text || store.name}
            </h1>
            <div className="flex flex-wrap gap-4">
              <a href="#products" className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-semibold tracking-wide hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white transition-all duration-500">
                <span>Shop Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="py-16 bg-[#0f0f15]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-3xl lg:text-4xl text-white text-center mb-12">Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {categories.slice(0, 4).map(cat => (
                <button key={cat.id} onClick={() => handleCategorySelect(cat.id)} className="luxury-card group relative aspect-[3/4] overflow-hidden rounded-xl">
                  {cat.image_url ? (
                    <img src={getOptimizedImageUrl(cat.image_url, { width: 400, height: 500 })} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-900/50 to-pink-900/50" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-display text-2xl text-white">{cat.name}</h3>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="products" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <h2 className="font-display text-3xl lg:text-4xl text-white">
              {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : 'All Products'}
            </h2>
            <p className="text-white/30 text-sm">{filteredProducts.length} items</p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-32">
              <Diamond className="w-16 h-16 mx-auto mb-6 text-purple-400/50" />
              <p className="text-white/30 text-lg">No products found</p>
            </div>
          ) : (
            <div className={`grid ${gridMode === 'compact' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4' : gridMode === 'large' ? 'grid-cols-1 sm:grid-cols-2 gap-10' : 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'}`}>
              {filteredProducts.map((product) => {
                const cartItem = cart.find(item => item.id === product.id);
                const discount = product.mrp ? Math.round((1 - product.price / product.mrp) * 100) : 0;
                const inWishlist = isInWishlist(product.id);

                return (
                  <div key={product.id} className="luxury-card group bg-[#151520] rounded-xl overflow-hidden">
                    <div className="relative aspect-[3/4]">
                      <Link href={`/${storeSlug}/product/${product.id}`}>
                        {product.image_url ? (
                          <img src={getOptimizedImageUrl(product.image_url, { width: 600, height: 800 })} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/30 to-pink-900/30">
                            <Gem className="w-16 h-16 text-purple-400/30" />
                          </div>
                        )}
                      </Link>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      {discount > 0 && (
                        <span className="absolute top-4 left-4 px-3 py-1.5 bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white text-xs font-bold tracking-wider rounded">
                          -{discount}%
                        </span>
                      )}
                      <button onClick={() => toggleWishlist(product)} className={`absolute top-4 right-4 p-3 bg-black/30 backdrop-blur-sm rounded-full transition-all hover:scale-110 ${inWishlist ? 'text-pink-500' : 'text-white/60 hover:text-white'}`}>
                        <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                      </button>
                      {!product.in_stock && (
                        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                          <span className="text-white/80 tracking-[0.2em] text-xs uppercase">Sold Out</span>
                        </div>
                      )}
                      {product.in_stock && (
                        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                          {cartItem ? (
                            <div className="flex items-center justify-between bg-white/10 backdrop-blur-md rounded-lg p-1">
                              <button onClick={() => updateQuantity(product.id, -1)} className="p-3 text-white hover:bg-white/10 rounded transition"><Minus className="w-4 h-4" /></button>
                              <span className="font-bold text-white text-lg">{cartItem.quantity}</span>
                              <button onClick={() => updateQuantity(product.id, 1)} className="p-3 text-white hover:bg-white/10 rounded transition"><Plus className="w-4 h-4" /></button>
                            </div>
                          ) : (
                            <button onClick={() => addToCart(product)} className="w-full py-4 bg-white text-black font-semibold tracking-wide hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white transition-all duration-300">
                              Add to Bag
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <Link href={`/${storeSlug}/product/${product.id}`}>
                        <h3 className="text-white font-medium text-sm mb-2 hover:text-purple-400 transition">{product.name}</h3>
                      </Link>
                      <div className="flex items-center gap-3">
                        <span className="text-white font-light text-lg">₹{product.price.toLocaleString('en-IN')}</span>
                        {product.mrp && product.mrp > product.price && (
                          <span className="text-white/30 text-sm line-through">₹{product.mrp.toLocaleString('en-IN')}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <footer className="bg-[#05050a] border-t border-white/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                {store.logo_url ? (
                  <img src={getOptimizedImageUrl(store.logo_url, { width: 80, height: 80 })} alt={store.name} className="h-12 w-12 object-contain rounded-lg" />
                ) : (
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center"><Crown className="w-6 h-6 text-white" /></div>
                )}
                <span className="font-display text-3xl text-white">{store.name}</span>
              </div>
            </div>
            <div>
              <h4 className="text-white font-medium tracking-wider text-sm uppercase mb-5">Contact</h4>
              <div className="space-y-3 text-white/40 text-sm">
                {store.phone && <a href={`tel:${store.phone}`} className="flex items-center gap-3 hover:text-white transition"><Phone className="w-4 h-4" />{store.phone}</a>}
                {store.showcase_email && <a href={`mailto:${store.showcase_email}`} className="flex items-center gap-3 hover:text-white transition"><Mail className="w-4 h-4" />{store.showcase_email}</a>}
              </div>
            </div>
            <div>
              <h4 className="text-white font-medium tracking-wider text-sm uppercase mb-5">Follow</h4>
              <div className="flex gap-3">
                {socialLinks.map(link => (
                  <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-lg text-white/50 hover:text-white hover:bg-purple-600 transition-all">
                    <ExternalLink className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-white/5 text-center text-white/20 text-sm">
            © {new Date().getFullYear()} {store.name}
          </div>
        </div>
      </footer>

      <CartDrawer show={showCart} onClose={() => setShowCart(false)} cart={cart} cartTotal={cartTotal} updateQuantity={updateQuantity} removeFromCart={removeFromCart} showCheckout={showCheckout} setShowCheckout={setShowCheckout} showUpiQr={showUpiQr} setShowUpiQr={setShowUpiQr} orderId={orderId} customerName={customerName} setCustomerName={setCustomerName} customerPhone={customerPhone} setCustomerPhone={setCustomerPhone} customerAddress={customerAddress} setCustomerAddress={setCustomerAddress} showPaymentComplete={showPaymentComplete} store={store} handleProceedToPayment={handleProceedToPayment} handlePaymentCompleted={handlePaymentCompleted} handleWhatsAppOrder={handleWhatsAppOrder} generateUpiUrl={generateUpiUrl} theme={{ primary: '#9333ea', text: '#ffffff' }} dark />
      <WishlistDrawer show={showWishlist} onClose={() => setShowWishlist(false)} wishlist={wishlist} addToCart={addToCart} toggleWishlist={toggleWishlist} theme={{ primary: '#9333ea', text: '#ffffff' }} dark />
      <OrdersDrawer show={showOrders} onClose={() => setShowOrders(false)} orders={orders} theme={{ primary: '#9333ea', text: '#ffffff' }} dark />
    </div>
  );
}

function GeneralTheme({ store, products, categories, socialLinks, banners, theme, gridMode, storeSlug, cart, wishlist, orders, showCart, setShowCart, showWishlist, setShowWishlist, showOrders, setShowOrders, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, handleCategorySelect, showCheckout, setShowCheckout, showUpiQr, setShowUpiQr, orderId, customerName, setCustomerName, customerPhone, setCustomerPhone, customerAddress, setCustomerAddress, showPaymentComplete, addToCart, updateQuantity, removeFromCart, toggleWishlist, isInWishlist, cartTotal, cartCount, handleProceedToPayment, handlePaymentCompleted, filteredProducts, handleWhatsAppOrder, generateUpiUrl }: ThemeProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Archivo:wght@400;500;600;700;800;900&display=swap');
        body { font-family: 'DM Sans', sans-serif; }
        .font-display { font-family: 'Archivo', sans-serif; }
        
        .gen-card {
          transition: all 0.3s ease;
        }
        .gen-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 25px 50px -12px rgba(37, 99, 235, 0.12);
        }
      `}</style>

      {banners.length > 0 && (
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white text-center py-3">
          <div className="flex items-center justify-center gap-2 text-sm font-semibold">
            <Zap className="w-4 h-4 animate-pulse" />
            <span>{banners[0].text}</span>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 lg:h-20">
            <Link href={`/${storeSlug}`} className="flex items-center gap-3 group">
              {store.logo_url ? (
                <img src={getOptimizedImageUrl(store.logo_url, { width: 100, height: 100 })} alt={store.name} className="h-12 w-12 object-contain rounded-2xl group-hover:scale-105 transition-transform" />
              ) : (
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-display font-bold text-xl shadow-lg shadow-blue-500/30">
                  {store.name[0]}
                </div>
              )}
              <h1 className="font-display font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors">{store.name}</h1>
            </Link>

            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setShowOrders(true)} className="relative p-3 rounded-xl hover:bg-gray-100 transition">
                <Package className="w-5 h-5 text-gray-600" />
                {orders.length > 0 && <span className="absolute top-1 right-1 w-5 h-5 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{orders.length}</span>}
              </button>
              <button onClick={() => setShowWishlist(true)} className="relative p-3 rounded-xl hover:bg-gray-100 transition">
                <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                {wishlist.length > 0 && <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{wishlist.length}</span>}
              </button>
              <button onClick={() => setShowCart(true)} className="relative flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all">
                <ShoppingCart className="w-5 h-5" />
                <span className="font-bold hidden sm:inline">₹{cartTotal.toLocaleString('en-IN')}</span>
                {cartCount > 0 && <span className="absolute -top-1 -right-1 w-6 h-6 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">{cartCount}</span>}
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 py-12 lg:py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300 rounded-full blur-[150px]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="text-white">
              <h1 className="font-display text-3xl lg:text-5xl font-black mb-4 leading-tight">
                {store.hero_text || store.name}
              </h1>
              <div className="flex flex-wrap gap-4">
                <a href="#products" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition shadow-xl">
                  <ShoppingBag className="w-5 h-5" />
                  Shop Now
                </a>
                {store.phone && (
                  <a href={`https://wa.me/${store.phone.replace(/\D/g, '')}`} className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl font-bold hover:bg-white/20 transition">
                    <Phone className="w-5 h-5" />
                    Contact
                  </a>
                )}
              </div>
            </div>
            {store.hero_image && (
              <div className="hidden lg:block">
                <img src={getOptimizedImageUrl(store.hero_image, { width: 600, height: 400 })} alt="Featured" className="rounded-3xl shadow-2xl" />
              </div>
            )}
          </div>
        </div>
      </section>

      {store.features && store.features.length > 0 && (
        <section className="py-10 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {store.features.slice(0, 4).map((feature) => (
                <div key={feature.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition group">
                  <FeatureIcon name={feature.icon} className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{feature.title}</p>
                    <p className="text-xs text-gray-500">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {categories.length > 0 && (
        <section className="py-10 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-6">Categories</h2>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <button onClick={() => handleCategorySelect(null)} className={`flex-shrink-0 px-5 py-3 rounded-xl font-semibold text-sm transition-all ${!selectedCategory ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'}`}>
                All Products
              </button>
              {categories.map(cat => (
                <button key={cat.id} onClick={() => handleCategorySelect(cat.id)} className={`flex-shrink-0 px-5 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${selectedCategory === cat.id ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'}`}>
                  {store.show_category_images && cat.image_url && <img src={getOptimizedImageUrl(cat.image_url, { width: 32, height: 32 })} alt={cat.name} className="w-6 h-6 rounded-full object-cover" />}
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="products" className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-gray-900">
                {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : 'All Products'}
              </h2>
              <p className="text-gray-500 mt-1">{filteredProducts.length} items</p>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-24">
              <Package className="w-16 h-16 mx-auto mb-6 text-blue-300" />
              <p className="text-gray-500 text-lg">No products found</p>
            </div>
          ) : (
            <div className={`grid ${gridMode === 'compact' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4' : gridMode === 'large' ? 'grid-cols-1 sm:grid-cols-2 gap-8' : 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'}`}>
              {filteredProducts.map((product) => {
                const cartItem = cart.find(item => item.id === product.id);
                const discount = product.mrp ? Math.round((1 - product.price / product.mrp) * 100) : 0;
                const inWishlist = isInWishlist(product.id);

                return (
                  <div key={product.id} className="gen-card bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                    <div className={`relative bg-gray-50 ${gridMode === 'large' ? 'aspect-square' : 'aspect-[4/3]'}`}>
                      <Link href={`/${storeSlug}/product/${product.id}`}>
                        {product.image_url ? (
                          <img src={getOptimizedImageUrl(product.image_url, { width: 400, height: 300 })} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><Package className="w-12 h-12 text-gray-200" /></div>
                        )}
                      </Link>
                      {discount > 0 && (
                        <span className="absolute top-3 left-3 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-lg shadow-lg">
                          {discount}% OFF
                        </span>
                      )}
                      <button onClick={() => toggleWishlist(product)} className={`absolute top-3 right-3 p-2.5 bg-white rounded-xl shadow-md hover:scale-110 transition ${inWishlist ? 'text-red-500' : 'text-gray-400'}`}>
                        <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                      </button>
                      {!product.in_stock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-bold">Out of Stock</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <Link href={`/${storeSlug}/product/${product.id}`}>
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition">{product.name}</h3>
                      </Link>
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-2xl font-bold text-blue-600">₹{product.price.toLocaleString('en-IN')}</span>
                        {product.mrp && product.mrp > product.price && (
                          <span className="text-sm text-gray-400 line-through">₹{product.mrp.toLocaleString('en-IN')}</span>
                        )}
                      </div>
                      {product.in_stock && (
                        cartItem ? (
                          <div className="flex items-center justify-between bg-blue-50 rounded-xl p-1">
                            <button onClick={() => updateQuantity(product.id, -1)} className="p-3 text-blue-600 hover:bg-blue-100 rounded-lg transition"><Minus className="w-4 h-4" /></button>
                            <span className="font-bold text-blue-600 text-xl">{cartItem.quantity}</span>
                            <button onClick={() => updateQuantity(product.id, 1)} className="p-3 text-blue-600 hover:bg-blue-100 rounded-lg transition"><Plus className="w-4 h-4" /></button>
                          </div>
                        ) : (
                          <button onClick={() => addToCart(product)} className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2">
                            <ShoppingCart className="w-4 h-4" />
                            Add to Cart
                          </button>
                        )
                      )}
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                {store.logo_url ? (
                  <img src={getOptimizedImageUrl(store.logo_url, { width: 80, height: 80 })} alt={store.name} className="h-12 w-12 object-contain rounded-xl" />
                ) : (
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-display font-bold text-xl">{store.name[0]}</div>
                )}
                <span className="font-display font-bold text-xl">{store.name}</span>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-blue-400 mb-4">Contact</h4>
              <div className="space-y-3 text-gray-400 text-sm">
                {store.phone && <a href={`tel:${store.phone}`} className="flex items-center gap-2 hover:text-white transition"><Phone className="w-4 h-4" />{store.phone}</a>}
                {store.showcase_email && <a href={`mailto:${store.showcase_email}`} className="flex items-center gap-2 hover:text-white transition"><Mail className="w-4 h-4" />{store.showcase_email}</a>}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-blue-400 mb-4">Links</h4>
              <div className="space-y-2 text-gray-400 text-sm">
                <a href="#products" className="block hover:text-white transition">Products</a>
                <Link href="/terms" className="block hover:text-white transition">Terms</Link>
                <Link href="/privacy" className="block hover:text-white transition">Privacy</Link>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} {store.name}
          </div>
        </div>
      </footer>

      <CartDrawer show={showCart} onClose={() => setShowCart(false)} cart={cart} cartTotal={cartTotal} updateQuantity={updateQuantity} removeFromCart={removeFromCart} showCheckout={showCheckout} setShowCheckout={setShowCheckout} showUpiQr={showUpiQr} setShowUpiQr={setShowUpiQr} orderId={orderId} customerName={customerName} setCustomerName={setCustomerName} customerPhone={customerPhone} setCustomerPhone={setCustomerPhone} customerAddress={customerAddress} setCustomerAddress={setCustomerAddress} showPaymentComplete={showPaymentComplete} store={store} handleProceedToPayment={handleProceedToPayment} handlePaymentCompleted={handlePaymentCompleted} handleWhatsAppOrder={handleWhatsAppOrder} generateUpiUrl={generateUpiUrl} theme={{ primary: '#2563eb', text: '#1e293b' }} />
      <WishlistDrawer show={showWishlist} onClose={() => setShowWishlist(false)} wishlist={wishlist} addToCart={addToCart} toggleWishlist={toggleWishlist} theme={{ primary: '#2563eb', text: '#1e293b' }} />
      <OrdersDrawer show={showOrders} onClose={() => setShowOrders(false)} orders={orders} theme={{ primary: '#2563eb', text: '#1e293b' }} />
    </div>
  );
}

function MinimalTheme({ store, products, categories, socialLinks, banners, theme, gridMode, storeSlug, cart, wishlist, orders, showCart, setShowCart, showWishlist, setShowWishlist, showOrders, setShowOrders, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, handleCategorySelect, showCheckout, setShowCheckout, showUpiQr, setShowUpiQr, orderId, customerName, setCustomerName, customerPhone, setCustomerPhone, customerAddress, setCustomerAddress, showPaymentComplete, addToCart, updateQuantity, removeFromCart, toggleWishlist, isInWishlist, cartTotal, cartCount, handleProceedToPayment, handlePaymentCompleted, filteredProducts, handleWhatsAppOrder, generateUpiUrl }: ThemeProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=Newsreader:wght@300;400;500;600&display=swap');
        body { font-family: 'Instrument Sans', sans-serif; }
        .font-display { font-family: 'Newsreader', Georgia, serif; }
        
        .minimal-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .minimal-card:hover {
          transform: translateY(-4px);
        }
      `}</style>

      {banners.length > 0 && (
        <div className="bg-black text-white text-center py-2.5">
          <p className="text-xs tracking-[0.25em] uppercase">{banners[0].text}</p>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-2xl border-b border-black/5">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 -ml-2 hover:bg-black/5 rounded-lg transition">
              <Menu className="w-5 h-5" />
            </button>
            
            <Link href={`/${storeSlug}`} className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 group">
              {store.logo_url ? (
                <img src={getOptimizedImageUrl(store.logo_url, { width: 120, height: 40 })} alt={store.name} className="h-8 object-contain group-hover:opacity-70 transition-opacity" />
              ) : (
                <h1 className="font-display text-2xl font-medium tracking-tight group-hover:opacity-70 transition-opacity">{store.name}</h1>
              )}
            </Link>

            <nav className="hidden lg:flex items-center gap-10">
              <button onClick={() => handleCategorySelect(null)} className={`text-sm transition ${!selectedCategory ? 'font-medium' : 'text-black/50 hover:text-black'}`}>
                All
              </button>
              {categories.slice(0, 5).map(cat => (
                <button key={cat.id} onClick={() => handleCategorySelect(cat.id)} className={`text-sm transition ${selectedCategory === cat.id ? 'font-medium' : 'text-black/50 hover:text-black'}`}>
                  {cat.name}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button className="hidden sm:flex p-2.5 hover:bg-black/5 rounded-full transition">
                <Search className="w-5 h-5" />
              </button>
              <button onClick={() => setShowWishlist(true)} className="relative p-2.5 hover:bg-black/5 rounded-full transition">
                <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'fill-black' : ''}`} />
                {wishlist.length > 0 && <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-black text-white text-[10px] font-medium rounded-full flex items-center justify-center">{wishlist.length}</span>}
              </button>
              <button onClick={() => setShowCart(true)} className="relative p-2.5 hover:bg-black/5 rounded-full transition">
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-black text-white text-[10px] font-medium rounded-full flex items-center justify-center">{cartCount}</span>}
              </button>
            </div>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-white">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-display text-lg">Menu</h2>
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-black/5 rounded-lg transition"><X className="w-5 h-5" /></button>
          </div>
          <div className="p-6">
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/30" />
              <input type="text" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3.5 bg-black/5 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-black" />
            </div>
            <nav className="space-y-1">
              <button onClick={() => { setSelectedCategory(null); setMobileMenuOpen(false); }} className={`block w-full text-left px-5 py-3.5 rounded-xl transition ${!selectedCategory ? 'bg-black text-white' : 'hover:bg-black/5'}`}>
                All Products
              </button>
              {categories.map(cat => (
                <button key={cat.id} onClick={() => { setSelectedCategory(cat.id); setMobileMenuOpen(false); }} className={`block w-full text-left px-5 py-3.5 rounded-xl transition ${selectedCategory === cat.id ? 'bg-black text-white' : 'hover:bg-black/5'}`}>
                  {cat.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      <section className="py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="font-display text-4xl lg:text-6xl font-light leading-[1.1] mb-6 tracking-tight">
                {store.hero_text || store.name}
              </h1>
              <a href="#products" className="inline-flex items-center gap-3 text-sm font-medium border-b-2 border-black pb-1 hover:opacity-60 transition group">
                View Collection
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
            {store.hero_image && (
              <div className="aspect-[4/5] rounded-2xl overflow-hidden">
                <img src={getOptimizedImageUrl(store.hero_image, { width: 800, height: 1000 })} alt="Featured" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="products" className="pb-20 lg:pb-28">
        <div className="max-w-6xl mx-auto px-4">
          <div className="hidden lg:flex items-center gap-3 mb-10">
            <button onClick={() => handleCategorySelect(null)} className={`px-5 py-2.5 text-sm rounded-full transition ${!selectedCategory ? 'bg-black text-white' : 'hover:bg-black/5'}`}>
              All
            </button>
            {categories.map(cat => (
              <button key={cat.id} onClick={() => handleCategorySelect(cat.id)} className={`px-5 py-2.5 text-sm rounded-full transition ${selectedCategory === cat.id ? 'bg-black text-white' : 'hover:bg-black/5'}`}>
                {cat.name}
              </button>
            ))}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-32">
              <p className="text-black/30 text-lg">No products found</p>
            </div>
          ) : (
            <div className={`grid ${gridMode === 'compact' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5' : gridMode === 'large' ? 'grid-cols-1 sm:grid-cols-2 gap-12' : 'grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10'}`}>
              {filteredProducts.map((product) => {
                const cartItem = cart.find(item => item.id === product.id);
                const discount = product.mrp ? Math.round((1 - product.price / product.mrp) * 100) : 0;
                const inWishlist = isInWishlist(product.id);

                return (
                  <div key={product.id} className="minimal-card group">
                    <div className={`relative bg-[#f0f0f0] rounded-xl overflow-hidden ${gridMode === 'large' ? 'aspect-[4/5]' : 'aspect-[3/4]'}`}>
                      <Link href={`/${storeSlug}/product/${product.id}`}>
                        {product.image_url ? (
                          <img src={getOptimizedImageUrl(product.image_url, { width: 600, height: 800 })} alt={product.name} className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-700" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><Package className="w-12 h-12 text-black/10" /></div>
                        )}
                      </Link>
                      <button onClick={() => toggleWishlist(product)} className={`absolute top-4 right-4 p-2.5 rounded-full transition ${inWishlist ? 'bg-black text-white' : 'bg-white/90 backdrop-blur-sm hover:bg-black hover:text-white'}`}>
                        <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                      </button>
                      {!product.in_stock && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                          <span className="text-sm font-medium tracking-wide">Sold Out</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-5">
                      <Link href={`/${storeSlug}/product/${product.id}`}>
                        <h3 className="font-medium text-sm mb-1.5 hover:opacity-60 transition">{product.name}</h3>
                      </Link>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="font-medium">₹{product.price.toLocaleString('en-IN')}</span>
                        {product.mrp && product.mrp > product.price && (
                          <>
                            <span className="text-sm text-black/30 line-through">₹{product.mrp.toLocaleString('en-IN')}</span>
                            <span className="text-xs bg-black text-white px-2 py-0.5 rounded">{discount}% off</span>
                          </>
                        )}
                      </div>
                      {product.in_stock && (
                        cartItem ? (
                          <div className="flex items-center justify-between border border-black rounded-full">
                            <button onClick={() => updateQuantity(product.id, -1)} className="p-2.5 hover:bg-black/5 rounded-l-full transition"><Minus className="w-4 h-4" /></button>
                            <span className="font-medium">{cartItem.quantity}</span>
                            <button onClick={() => updateQuantity(product.id, 1)} className="p-2.5 hover:bg-black/5 rounded-r-full transition"><Plus className="w-4 h-4" /></button>
                          </div>
                        ) : (
                          <button onClick={() => addToCart(product)} className="w-full py-3 bg-black text-white rounded-full text-sm font-medium hover:bg-black/80 transition">
                            Add to Cart
                          </button>
                        )
                      )}
                    </div>
                  </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <footer className="bg-white border-t border-black/5 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-10">
            <div className="md:col-span-2">
              {store.logo_url ? (
                <img src={getOptimizedImageUrl(store.logo_url, { width: 120, height: 40 })} alt={store.name} className="h-8 object-contain mb-4" />
              ) : (
                <h3 className="font-display text-xl font-medium mb-4">{store.name}</h3>
              )}
            </div>
            <div>
              <h4 className="font-medium text-sm mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-black/50">
                {store.phone && <a href={`tel:${store.phone}`} className="block hover:text-black transition">{store.phone}</a>}
                {store.showcase_email && <a href={`mailto:${store.showcase_email}`} className="block hover:text-black transition">{store.showcase_email}</a>}
              </div>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-4">Links</h4>
              <div className="space-y-2 text-sm text-black/50">
                <Link href="/terms" className="block hover:text-black transition">Terms</Link>
                <Link href="/privacy" className="block hover:text-black transition">Privacy</Link>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-6 border-t border-black/5 text-center text-black/30 text-sm">
            © {new Date().getFullYear()} {store.name}
          </div>
        </div>
      </footer>

      <CartDrawer show={showCart} onClose={() => setShowCart(false)} cart={cart} cartTotal={cartTotal} updateQuantity={updateQuantity} removeFromCart={removeFromCart} showCheckout={showCheckout} setShowCheckout={setShowCheckout} showUpiQr={showUpiQr} setShowUpiQr={setShowUpiQr} orderId={orderId} customerName={customerName} setCustomerName={setCustomerName} customerPhone={customerPhone} setCustomerPhone={setCustomerPhone} customerAddress={customerAddress} setCustomerAddress={setCustomerAddress} showPaymentComplete={showPaymentComplete} store={store} handleProceedToPayment={handleProceedToPayment} handlePaymentCompleted={handlePaymentCompleted} handleWhatsAppOrder={handleWhatsAppOrder} generateUpiUrl={generateUpiUrl} theme={{ primary: '#000000', text: '#0a0a0a' }} />
      <WishlistDrawer show={showWishlist} onClose={() => setShowWishlist(false)} wishlist={wishlist} addToCart={addToCart} toggleWishlist={toggleWishlist} theme={{ primary: '#000000', text: '#0a0a0a' }} />
      <OrdersDrawer show={showOrders} onClose={() => setShowOrders(false)} orders={orders} theme={{ primary: '#000000', text: '#0a0a0a' }} />
    </div>
  );
}

interface CartDrawerProps {
  show: boolean;
  onClose: () => void;
  cart: CartItem[];
  cartTotal: number;
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  showCheckout: boolean;
  setShowCheckout: (v: boolean) => void;
  showUpiQr: boolean;
  setShowUpiQr: (v: boolean) => void;
  orderId: string;
  customerName: string;
  setCustomerName: (v: string) => void;
  customerPhone: string;
  setCustomerPhone: (v: string) => void;
  customerAddress: string;
  setCustomerAddress: (v: string) => void;
  showPaymentComplete: boolean;
  store: StoreData;
  handleProceedToPayment: () => void;
  handlePaymentCompleted: () => void;
  handleWhatsAppOrder: () => void;
  generateUpiUrl: (orderId: string) => string;
  theme: { primary: string; text: string };
  dark?: boolean;
}

function CartDrawer({ show, onClose, cart, cartTotal, updateQuantity, removeFromCart, showCheckout, setShowCheckout, showUpiQr, setShowUpiQr, orderId, customerName, setCustomerName, customerPhone, setCustomerPhone, customerAddress, setCustomerAddress, showPaymentComplete, store, handleProceedToPayment, handlePaymentCompleted, handleWhatsAppOrder, generateUpiUrl, theme, dark }: CartDrawerProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className={`relative w-full max-w-md h-full flex flex-col shadow-2xl ${dark ? 'bg-[#1a1a2e] text-white' : 'bg-white text-gray-900'}`}>
        <div className={`flex items-center justify-between p-5 border-b ${dark ? 'border-white/10' : 'border-gray-100'}`}>
          <h2 className="text-lg font-semibold">Cart</h2>
          <button onClick={onClose} className={`p-2 rounded-full ${dark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCart className={`w-14 h-14 mx-auto mb-4 ${dark ? 'text-white/10' : 'text-gray-200'}`} />
              <p className={dark ? 'text-white/40' : 'text-gray-400'}>Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className={`flex gap-4 p-3 rounded-xl ${dark ? 'bg-white/5' : 'bg-gray-50'}`}>
                  {item.image_url ? (
                    <img src={getOptimizedImageUrl(item.image_url, { width: 100, height: 100 })} alt={item.name} className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />
                  ) : (
                    <div className={`w-20 h-20 rounded-lg flex items-center justify-center flex-shrink-0 ${dark ? 'bg-white/10' : 'bg-gray-100'}`}>
                      <Package className={`w-8 h-8 ${dark ? 'text-white/20' : 'text-gray-300'}`} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm mb-1 truncate">{item.name}</h3>
                    <p className="font-bold" style={{ color: theme.primary }}>₹{item.price.toLocaleString('en-IN')}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className={`flex items-center rounded-lg ${dark ? 'bg-white/10' : 'bg-gray-100'}`}>
                        <button onClick={() => updateQuantity(item.id, -1)} className="p-1.5" style={{ color: theme.primary }}><Minus className="w-4 h-4" /></button>
                        <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="p-1.5" style={{ color: theme.primary }}><Plus className="w-4 h-4" /></button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100"><X className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className={`border-t p-5 ${dark ? 'border-white/10' : 'border-gray-100'}`}>
            <div className="flex items-center justify-between mb-5">
              <span className="font-medium">Total</span>
              <span className="text-2xl font-bold" style={{ color: theme.primary }}>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>

            {showUpiQr && store.upi_enabled && store.upi_id ? (
              <div className="space-y-4">
                <div className={`text-center p-3 rounded-xl ${dark ? 'bg-white/5' : 'bg-gray-50'}`}>
                  <p className={`text-xs font-medium mb-1 ${dark ? 'text-white/40' : 'text-gray-400'}`}>Order ID</p>
                  <p className="font-bold text-lg" style={{ color: theme.primary }}>{orderId}</p>
                </div>
                <div className="flex justify-center p-5 bg-white rounded-xl"><QRCodeSVG value={generateUpiUrl(orderId)} size={160} level="H" includeMargin /></div>
                <p className={`text-center text-sm ${dark ? 'text-white/60' : 'text-gray-500'}`}>Scan QR or tap button to pay ₹{cartTotal.toLocaleString('en-IN')}</p>
                <a 
                  href={generateUpiUrl(orderId)} 
                  className="w-full py-3.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 text-white"
                  style={{ backgroundColor: theme.primary }}
                >
                  <QrCode className="w-5 h-5" />
                  Pay ₹{cartTotal.toLocaleString('en-IN')} with UPI
                </a>
                <div className={`text-center py-3 px-4 rounded-xl ${dark ? 'bg-white/5' : 'bg-gray-50'}`}>
                  <p className={`text-xs ${dark ? 'text-white/60' : 'text-gray-500'}`}>After completing payment, tap the button below to confirm your order</p>
                </div>
                <button onClick={handlePaymentCompleted} className="w-full py-3.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 bg-green-500 text-white">
                  <Check className="w-5 h-5" />I have completed payment
                </button>
                <p className={`text-center text-xs ${dark ? 'text-white/30' : 'text-gray-400'}`}>
                  Don&apos;t want to pay now? <button onClick={() => { setShowUpiQr(false); }} className="underline">Go back</button>
                </p>
              </div>
            ) : showCheckout ? (
              <div className="space-y-4">
                <input type="text" placeholder="Your Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className={`w-full px-4 py-3 rounded-xl border text-sm ${dark ? 'bg-white/5 border-white/10 text-white placeholder-white/30' : 'border-gray-200'}`} />
                <input type="tel" placeholder="Phone" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className={`w-full px-4 py-3 rounded-xl border text-sm ${dark ? 'bg-white/5 border-white/10 text-white placeholder-white/30' : 'border-gray-200'}`} />
                <textarea placeholder="Address" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} rows={2} className={`w-full px-4 py-3 rounded-xl border text-sm resize-none ${dark ? 'bg-white/5 border-white/10 text-white placeholder-white/30' : 'border-gray-200'}`} />
                {store.upi_enabled && store.upi_id ? (
                  <button onClick={handleProceedToPayment} disabled={!customerName || !customerPhone} className="w-full py-3.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50 text-white" style={{ backgroundColor: theme.primary }}>
                    <QrCode className="w-5 h-5" />Pay
                  </button>
                ) : store.phone ? (
                  <button onClick={handleWhatsAppOrder} disabled={!customerName || !customerPhone} className="w-full py-3.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50 bg-green-500 text-white">
                    <Phone className="w-5 h-5" />WhatsApp
                  </button>
                ) : null}
                <button onClick={() => setShowCheckout(false)} className={`w-full py-2 text-sm ${dark ? 'text-white/40' : 'text-gray-400'}`}>Back</button>
              </div>
            ) : (
              <button onClick={() => setShowCheckout(true)} className="w-full py-3.5 rounded-xl font-medium text-sm text-white" style={{ backgroundColor: theme.primary }}>
                Checkout
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface WishlistDrawerProps {
  show: boolean;
  onClose: () => void;
  wishlist: Product[];
  addToCart: (product: Product) => void;
  toggleWishlist: (product: Product) => void;
  theme: { primary: string; text: string };
  dark?: boolean;
}

function WishlistDrawer({ show, onClose, wishlist, addToCart, toggleWishlist, theme, dark }: WishlistDrawerProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className={`relative w-full max-w-md h-full flex flex-col shadow-2xl ${dark ? 'bg-[#1a1a2e] text-white' : 'bg-white text-gray-900'}`}>
        <div className={`flex items-center justify-between p-5 border-b ${dark ? 'border-white/10' : 'border-gray-100'}`}>
          <h2 className="text-lg font-semibold">Wishlist</h2>
          <button onClick={onClose} className={`p-2 rounded-full ${dark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {wishlist.length === 0 ? (
            <div className="text-center py-16">
              <Heart className={`w-14 h-14 mx-auto mb-4 ${dark ? 'text-white/10' : 'text-gray-200'}`} />
              <p className={dark ? 'text-white/40' : 'text-gray-400'}>Empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {wishlist.map(item => (
                <div key={item.id} className={`flex gap-4 p-3 rounded-xl ${dark ? 'bg-white/5' : 'bg-gray-50'}`}>
                  {item.image_url ? (
                    <img src={getOptimizedImageUrl(item.image_url, { width: 100, height: 100 })} alt={item.name} className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />
                  ) : (
                    <div className={`w-20 h-20 rounded-lg flex items-center justify-center flex-shrink-0 ${dark ? 'bg-white/10' : 'bg-gray-100'}`}>
                      <Package className={`w-8 h-8 ${dark ? 'text-white/20' : 'text-gray-300'}`} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm mb-1 truncate">{item.name}</h3>
                    <p className="font-bold" style={{ color: theme.primary }}>₹{item.price.toLocaleString('en-IN')}</p>
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => { addToCart(item); toggleWishlist(item); }} className="flex-1 py-2 text-xs font-medium rounded-lg text-white" style={{ backgroundColor: theme.primary }}>
                        Add
                      </button>
                      <button onClick={() => toggleWishlist(item)} className="p-2 rounded-lg bg-red-50 text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface OrdersDrawerProps {
  show: boolean;
  onClose: () => void;
  orders: Order[];
  theme: { primary: string; text: string };
  dark?: boolean;
}

function OrdersDrawer({ show, onClose, orders, theme, dark }: OrdersDrawerProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className={`relative w-full max-w-md h-full flex flex-col shadow-2xl ${dark ? 'bg-[#1a1a2e] text-white' : 'bg-white text-gray-900'}`}>
        <div className={`flex items-center justify-between p-5 border-b ${dark ? 'border-white/10' : 'border-gray-100'}`}>
          <h2 className="text-lg font-semibold">Orders</h2>
          <button onClick={onClose} className={`p-2 rounded-full ${dark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {orders.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className={`w-14 h-14 mx-auto mb-4 ${dark ? 'text-white/10' : 'text-gray-200'}`} />
              <p className={dark ? 'text-white/40' : 'text-gray-400'}>No orders</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className={`p-4 rounded-xl border ${dark ? 'border-white/10' : 'border-gray-100'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs ${dark ? 'text-white/40' : 'text-gray-400'}`}>
                      {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-600">{order.status}</span>
                  </div>
                  <div className="space-y-1 mb-3 text-sm">
                    {order.items.map(item => (
                      <div key={item.id} className="flex justify-between">
                        <span>{item.name} x{item.quantity}</span>
                        <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                  <div className={`flex justify-between pt-3 border-t ${dark ? 'border-white/10' : 'border-gray-100'}`}>
                    <span className="font-medium">Total</span>
                    <span className="font-bold" style={{ color: theme.primary }}>₹{order.total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
