'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Store, LogOut, Menu, X, LayoutDashboard, Package, Tag, Settings, Zap, Share2, Palette, CreditCard, FileText } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const router = useRouter();
  const storeSlug = params.slug as string;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndOwnership = async () => {
      try {
        // Check if user is authenticated
        const userId = localStorage.getItem('user_id');
        const authToken = localStorage.getItem('auth_token');

        if (!userId || !authToken) {
          // Redirect to login if not authenticated
          router.push('/auth/login');
          return;
        }

        setIsAuthenticated(true);

        // Verify that the user owns this store
        const response = await fetch(`/api/store/verify-owner`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            storeSlug,
            userId,
          }),
        });

        if (!response.ok) {
          // User is not the owner of this store
          router.push('/');
          return;
        }

        setIsOwner(true);
      } catch (error) {
        console.error('Error checking authentication:', error);
        router.push('/auth/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndOwnership();
  }, [storeSlug, router]);

  const menuItems = [
    { label: 'My Store', href: `/admin-profile/my-store`, icon: Store },
    { label: 'Products', href: `/admin-profile/products`, icon: Package },
    { label: 'Categories', href: `/admin-profile/categories`, icon: Tag },
    { label: 'Discounts', href: `/admin-profile/discounts`, icon: Zap },
    { label: 'Social Links', href: `/admin-profile/social-links`, icon: Share2 },
    { label: 'Collect Payments', href: `/admin-profile/collect-payments`, icon: CreditCard },
    { label: 'Invoices', href: `/admin-profile/invoices`, icon: FileText },
    { label: 'Design', href: `/admin-profile/design-store`, icon: Palette },
    { label: 'Settings', href: `/admin-profile/settings`, icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isOwner) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-gray-600 mb-4">You don't have access to this store.</p>
          <Link href="/auth/login" className="text-blue-600 hover:text-blue-700">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white transition-all duration-300 fixed h-full left-0 top-0 overflow-y-auto`}>
        <div className="p-4">
          <Link href="/" className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Store className="w-6 h-6" />
            </div>
            {sidebarOpen && <span className="font-bold text-lg">Codetoli Commerce</span>}
          </Link>

          <nav className="space-y-2">
            {menuItems.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={`/${storeSlug}${item.href}`}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition"
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition text-red-400"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className={`${sidebarOpen ? 'ml-64' : 'ml-20'} flex-1 transition-all duration-300`}>
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-8 py-4 flex justify-between items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="text-sm text-gray-600">
              Welcome back!
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
