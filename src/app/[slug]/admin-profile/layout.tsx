'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { Store, LogOut, Menu, X, Package, Tag, Settings, Zap, Share2, Palette, CreditCard, FileText, ChevronRight, ExternalLink } from 'lucide-react';
import { getCookie } from '@/lib/utils';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const storeSlug = params.slug as string;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isOwner, setIsOwner] = useState<boolean | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const checkAuthAndOwnership = async () => {
      try {
        const userId = getCookie('user_id');
        const authToken = getCookie('auth_token');

        if (!userId || !authToken) {
          setIsAuthenticated(false);
          return;
        }

        setIsAuthenticated(true);

        try {
          const response = await fetch(`/api/store?user_id=${userId}`);
          const storeData = await response.json();

          if (!storeData.data || storeData.data.slug !== storeSlug) {
            setIsOwner(false);
            return;
          }

          setIsOwner(true);
        } catch (verifyError) {
          console.error('Error verifying ownership:', verifyError);
          setIsOwner(false);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuthAndOwnership();
  }, [storeSlug]);

  useEffect(() => {
    if (isAuthenticated === false) {
      router.push('/auth/login');
    } else if (isOwner === false) {
      router.push('/');
    }
  }, [isAuthenticated, isOwner, router]);

  const menuItems = [
    { label: 'My Store', href: `/admin-profile/my-store`, icon: Store },
    { label: 'Products', href: `/admin-profile/products`, icon: Package },
    { label: 'Categories', href: `/admin-profile/categories`, icon: Tag },
    { label: 'Discounts', href: `/admin-profile/discounts`, icon: Zap },
    { label: 'Social Links', href: `/admin-profile/social-links`, icon: Share2 },
    { label: 'Payments', href: `/admin-profile/collect-payments`, icon: CreditCard },
    { label: 'Invoices', href: `/admin-profile/invoices`, icon: FileText },
    { label: 'Design', href: `/admin-profile/design-store`, icon: Palette },
    { label: 'Settings', href: `/admin-profile/settings`, icon: Settings },
  ];

  const handleLogout = () => {
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    document.cookie = 'user_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    document.cookie = 'user_email=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    localStorage.clear();
    router.push('/');
  };

  if (isAuthenticated === null || isOwner === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-indigo-600 border-t-transparent mx-auto mb-3"></div>
          <p className="text-slate-500 text-sm font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated === false || isOwner === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-slate-600 mb-4">You don't have access to this store.</p>
          <Link href="/auth/login" className="text-indigo-600 hover:text-indigo-700 font-medium">Go to Login</Link>
        </div>
      </div>
    );
  }

  const isActive = (href: string) => pathname.includes(href);

  return (
    <div className="min-h-screen bg-slate-50">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
      `}</style>

      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`fixed top-0 left-0 h-full w-64 bg-slate-900 z-50 transform transition-transform duration-300 ease-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-slate-800">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
                  <Store className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-white text-sm">Codetoli Commerce</span>
              </Link>
          </div>

          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            {menuItems.map(item => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.label}
                  href={`/${storeSlug}${item.href}`}
                  onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      active 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                >
                  <Icon className="w-4.5 h-4.5 flex-shrink-0" />
                  <span>{item.label}</span>
                  {active && <ChevronRight className="w-4 h-4 ml-auto" />}
                </Link>
              );
            })}
          </nav>

          <div className="p-3 border-t border-slate-800 space-y-2">
            <Link
              href={`/${storeSlug}`}
              target="_blank"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              <ExternalLink className="w-4.5 h-4.5" />
              <span>View Store</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
            >
              <LogOut className="w-4.5 h-4.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64 min-h-screen flex flex-col">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200">
          <div className="flex items-center justify-between px-4 lg:px-6 h-14">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 -ml-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="hidden lg:block">
              <h1 className="text-sm font-semibold text-slate-900">Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={`/${storeSlug}`}
                target="_blank"
                className="hidden sm:flex items-center gap-2 text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Preview Store
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
