'use client';

import Link from 'next/link';
import { Store, Mail, Linkedin, ShoppingBag, Palette, BarChart3, CreditCard, Smartphone, Zap, Shield, Globe, ArrowRight, Check, Star, Users, Package, TrendingUp, Layers, Settings, Heart, Truck, RefreshCw, Crown, Leaf, Stethoscope } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Sora:wght@400;500;600;700&display=swap');
        body { font-family: 'DM Sans', sans-serif; }
        .font-display { font-family: 'Sora', sans-serif; }
        
        .card-hover {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card-hover:hover {
          transform: translateY(-8px);
        }
        
        .theme-card {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .theme-card:hover {
          transform: scale(1.02);
        }
      `}</style>

      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                <Store className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-xl font-bold">Codetoli Commerce</span>
            </div>
            <div className="flex items-center space-x-6">
              <a href="#features" className="text-sm text-white/60 hover:text-white transition">Features</a>
              <a href="#themes" className="text-sm text-white/60 hover:text-white transition">Themes</a>
              <a href="#dashboard" className="text-sm text-white/60 hover:text-white transition">Dashboard</a>
              <Link href="/auth/login" className="px-5 py-2 bg-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative min-h-screen flex items-center justify-center pt-16">
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8">
            <Zap className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-white/70">Launch your store in minutes</span>
          </div>
          
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Build Your Online Store<br />
            <span className="text-indigo-400">Without The Hassle</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10">
            Everything you need to sell online. Beautiful themes, powerful dashboard, 
            UPI payments, WhatsApp orders - all in one platform.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a href="#contact" className="px-8 py-4 bg-indigo-600 rounded-xl font-semibold hover:bg-indigo-700 transition flex items-center gap-2 group">
              Get Your Store
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </a>
            <a href="#themes" className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-semibold hover:bg-white/10 transition">
              View Themes
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { icon: Users, label: '500+', sub: 'Active Stores' },
              { icon: Package, label: '50K+', sub: 'Products Listed' },
              { icon: TrendingUp, label: '₹10Cr+', sub: 'GMV Processed' },
              { icon: Star, label: '4.9/5', sub: 'Store Rating' },
            ].map((stat, i) => (
              <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <stat.icon className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
                <p className="font-display text-2xl font-bold">{stat.label}</p>
                <p className="text-sm text-white/50">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-indigo-400 text-sm font-medium uppercase tracking-wider">Features</span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold mt-4 mb-4">Everything You Need</h2>
            <p className="text-white/60 max-w-2xl mx-auto">Powerful features to help you manage and grow your online business</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Palette, title: 'Beautiful Themes', desc: '5 stunning themes - Medical, Fashion, General, Minimal, Petals. Each designed for specific industries.' },
              { icon: ShoppingBag, title: 'Product Management', desc: 'Add unlimited products with images, pricing, categories, stock management, and more.' },
              { icon: CreditCard, title: 'UPI Payments', desc: 'Accept payments via UPI QR codes. Direct bank transfers, no commission fees.' },
              { icon: Smartphone, title: 'WhatsApp Orders', desc: 'Let customers order directly via WhatsApp. Instant notifications and easy communication.' },
              { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Track orders, revenue, top products, and customer insights in real-time.' },
              { icon: Shield, title: 'Secure & Fast', desc: 'Enterprise-grade security with blazing fast performance on all devices.' },
              { icon: Globe, title: 'Custom Domain', desc: 'Your store, your brand. Get a custom storefront URL that customers remember.' },
              { icon: Layers, title: 'Categories & Banners', desc: 'Organize products with categories and promote with eye-catching banners.' },
              { icon: Settings, title: 'Full Customization', desc: 'Logo, colors, features section, social links - make it truly yours.' },
            ].map((feature, i) => (
              <div key={i} className="p-6 bg-[#12121a] rounded-2xl border border-white/5 card-hover">
                <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="themes" className="py-24 bg-[#08080c]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-indigo-400 text-sm font-medium uppercase tracking-wider">Themes</span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold mt-4 mb-4">Choose Your Style</h2>
            <p className="text-white/60 max-w-2xl mx-auto">5 professionally designed themes for different industries</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="theme-card rounded-3xl overflow-hidden border border-teal-500/30 bg-[#12121a]">
              <div className="aspect-[4/3] bg-teal-50 p-6 relative overflow-hidden">
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow-lg">
                  <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                    <Stethoscope className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-gray-800 text-sm">MediCare</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 grid grid-cols-2 gap-2">
                  <div className="bg-white rounded-xl p-3 shadow-sm">
                    <div className="w-full h-16 bg-teal-100 rounded-lg mb-2"></div>
                    <div className="h-2 bg-gray-200 rounded w-3/4 mb-1"></div>
                    <div className="h-2 bg-teal-500 rounded w-1/2"></div>
                  </div>
                  <div className="bg-white rounded-xl p-3 shadow-sm">
                    <div className="w-full h-16 bg-cyan-100 rounded-lg mb-2"></div>
                    <div className="h-2 bg-gray-200 rounded w-3/4 mb-1"></div>
                    <div className="h-2 bg-teal-500 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Stethoscope className="w-5 h-5 text-teal-400" />
                  <h3 className="font-display text-xl font-bold">Medical</h3>
                </div>
                <p className="text-white/50 text-sm mb-4">Perfect for pharmacies, health stores, medical equipment suppliers</p>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-teal-500/20 text-teal-300 rounded text-xs">Healthcare</span>
                  <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded text-xs">Clean</span>
                </div>
              </div>
            </div>

            <div className="theme-card rounded-3xl overflow-hidden border border-purple-500/30 bg-[#12121a]">
              <div className="aspect-[4/3] bg-[#0a0a0f] p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-purple-900/20"></div>
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Crown className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-white text-sm">Luxe Fashion</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 grid grid-cols-2 gap-2">
                  <div className="bg-white/10 backdrop-blur rounded-xl p-3 border border-white/10">
                    <div className="w-full h-16 bg-purple-500/20 rounded-lg mb-2"></div>
                    <div className="h-2 bg-white/20 rounded w-3/4 mb-1"></div>
                    <div className="h-2 bg-purple-500 rounded w-1/2"></div>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-xl p-3 border border-white/10">
                    <div className="w-full h-16 bg-pink-500/20 rounded-lg mb-2"></div>
                    <div className="h-2 bg-white/20 rounded w-3/4 mb-1"></div>
                    <div className="h-2 bg-pink-500 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-5 h-5 text-purple-400" />
                  <h3 className="font-display text-xl font-bold">Fashion</h3>
                </div>
                <p className="text-white/50 text-sm mb-4">Dark luxury aesthetic for fashion brands and boutiques</p>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">Luxury</span>
                  <span className="px-2 py-1 bg-pink-500/20 text-pink-300 rounded text-xs">Dark</span>
                </div>
              </div>
            </div>

            <div className="theme-card rounded-3xl overflow-hidden border border-blue-500/30 bg-[#12121a]">
              <div className="aspect-[4/3] bg-blue-50 p-6 relative overflow-hidden">
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow-lg">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Store className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-gray-800 text-sm">General Store</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2">
                  <div className="bg-white rounded-xl p-2 shadow-sm">
                    <div className="w-full h-12 bg-blue-100 rounded-lg mb-2"></div>
                    <div className="h-2 bg-blue-500 rounded w-2/3"></div>
                  </div>
                  <div className="bg-white rounded-xl p-2 shadow-sm">
                    <div className="w-full h-12 bg-indigo-100 rounded-lg mb-2"></div>
                    <div className="h-2 bg-indigo-500 rounded w-2/3"></div>
                  </div>
                  <div className="bg-white rounded-xl p-2 shadow-sm">
                    <div className="w-full h-12 bg-amber-100 rounded-lg mb-2"></div>
                    <div className="h-2 bg-amber-500 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Store className="w-5 h-5 text-blue-400" />
                  <h3 className="font-display text-xl font-bold">General</h3>
                </div>
                <p className="text-white/50 text-sm mb-4">Versatile theme for any type of retail business</p>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">Versatile</span>
                  <span className="px-2 py-1 bg-amber-500/20 text-amber-300 rounded text-xs">Bright</span>
                </div>
              </div>
            </div>

            <div className="theme-card rounded-3xl overflow-hidden border border-gray-500/30 bg-[#12121a]">
              <div className="aspect-[4/3] bg-[#fafafa] p-6 relative overflow-hidden">
                <div className="absolute top-4 left-4">
                  <span className="font-semibold text-black text-lg tracking-tight">minimal.</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-3 border border-black/5">
                    <div className="w-full h-20 bg-gray-100 rounded mb-2"></div>
                    <div className="h-1.5 bg-black rounded w-2/3"></div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-black/5">
                    <div className="w-full h-20 bg-gray-100 rounded mb-2"></div>
                    <div className="h-1.5 bg-black rounded w-2/3"></div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="w-5 h-5 text-gray-400" />
                  <h3 className="font-display text-xl font-bold">Minimal</h3>
                </div>
                <p className="text-white/50 text-sm mb-4">Clean, minimal design that lets your products shine</p>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-gray-500/20 text-gray-300 rounded text-xs">Clean</span>
                  <span className="px-2 py-1 bg-neutral-500/20 text-neutral-300 rounded text-xs">Modern</span>
                </div>
              </div>
            </div>

            <div className="theme-card rounded-3xl overflow-hidden border border-pink-500/30 bg-[#12121a]">
              <div className="aspect-[4/3] bg-pink-50 p-6 relative overflow-hidden">
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-white rounded-full px-3 py-2 shadow-lg">
                  <div className="w-6 h-6 bg-pink-400 rounded-full flex items-center justify-center">
                    <Leaf className="w-3 h-3 text-white" />
                  </div>
                  <span className="font-semibold text-pink-800 text-sm">Petals</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                  <div className="flex-1 bg-white rounded-2xl p-3 shadow-sm">
                    <div className="w-full h-14 bg-pink-100 rounded-xl mb-2"></div>
                    <div className="h-2 bg-pink-400 rounded-full w-1/2"></div>
                  </div>
                  <div className="flex-1 bg-white rounded-2xl p-3 shadow-sm">
                    <div className="w-full h-14 bg-rose-100 rounded-xl mb-2"></div>
                    <div className="h-2 bg-rose-400 rounded-full w-1/2"></div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Leaf className="w-5 h-5 text-pink-400" />
                  <h3 className="font-display text-xl font-bold">Petals</h3>
                </div>
                <p className="text-white/50 text-sm mb-4">Soft, elegant theme for beauty, flowers, and lifestyle brands</p>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-pink-500/20 text-pink-300 rounded text-xs">Elegant</span>
                  <span className="px-2 py-1 bg-rose-500/20 text-rose-300 rounded text-xs">Feminine</span>
                </div>
              </div>
            </div>

            <div className="theme-card rounded-3xl overflow-hidden border border-indigo-500/30 bg-[#12121a] flex items-center justify-center">
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-indigo-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Palette className="w-8 h-8 text-indigo-400" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">More Coming</h3>
                <p className="text-white/50 text-sm">New themes being designed regularly</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="dashboard" className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-indigo-400 text-sm font-medium uppercase tracking-wider">Dashboard</span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold mt-4 mb-4">Powerful Admin Panel</h2>
            <p className="text-white/60 max-w-2xl mx-auto">Manage everything from one place - products, orders, design, and more</p>
          </div>

          <div className="rounded-3xl overflow-hidden border border-white/10 bg-[#12121a] p-2">
            <div className="bg-[#1a1a2e] rounded-2xl overflow-hidden">
              <div className="h-8 bg-[#0f0f17] flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-4 text-xs text-white/40">Dashboard - Codetoli Commerce</span>
              </div>
              
              <div className="flex">
                <div className="w-56 bg-[#0f0f17] p-4 hidden md:block">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg"></div>
                    <span className="font-semibold text-sm">My Store</span>
                  </div>
                  <div className="space-y-1">
                    {['Dashboard', 'Products', 'Categories', 'Orders', 'Design Store', 'Settings'].map((item, i) => (
                      <div key={i} className={`px-3 py-2 rounded-lg text-sm ${i === 4 ? 'bg-indigo-600/20 text-indigo-400' : 'text-white/50 hover:text-white/70'}`}>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex-1 p-6 min-h-[400px]">
                  <h3 className="font-semibold text-lg mb-4">Design Your Store</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                      <p className="text-sm text-white/50 mb-2">Store Logo</p>
                      <div className="w-16 h-16 bg-indigo-600 rounded-xl"></div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                      <p className="text-sm text-white/50 mb-2">Hero Text</p>
                      <div className="h-3 bg-white/20 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-white/10 rounded w-1/2"></div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5 md:col-span-2">
                      <p className="text-sm text-white/50 mb-3">Store Features</p>
                      <div className="flex gap-3">
                        {[Truck, Shield, RefreshCw, Heart].map((Icon, i) => (
                          <div key={i} className="flex-1 bg-white/5 rounded-lg p-3 flex items-center gap-2">
                            <Icon className="w-4 h-4 text-indigo-400" />
                            <span className="text-xs text-white/70">Feature {i+1}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                      <p className="text-sm text-white/50 mb-2">Theme</p>
                      <div className="flex gap-2">
                        {['bg-teal-500', 'bg-purple-600', 'bg-blue-600', 'bg-pink-400'].map((g, i) => (
                          <div key={i} className={`w-8 h-8 rounded-lg ${g} ${i===0 ? 'ring-2 ring-white' : ''}`}></div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                      <p className="text-sm text-white/50 mb-2">Social Links</p>
                      <div className="flex gap-2">
                        <div className="px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded text-xs">Instagram</div>
                        <div className="px-3 py-1.5 bg-red-500/20 text-red-300 rounded text-xs">YouTube</div>
                        <div className="px-3 py-1.5 bg-white/10 text-white/50 rounded text-xs">+ Add</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {[
              { title: 'Product Management', desc: 'Add products with images, prices, stock levels, and categories', icon: Package },
              { title: 'Order Tracking', desc: 'View all orders with customer details and order status', icon: ShoppingBag },
              { title: 'Analytics', desc: 'Track revenue, top products, and customer insights', icon: BarChart3 },
            ].map((item, i) => (
              <div key={i} className="p-6 bg-[#12121a] rounded-2xl border border-white/5">
                <item.icon className="w-8 h-8 text-indigo-400 mb-4" />
                <h4 className="font-display font-semibold mb-2">{item.title}</h4>
                <p className="text-white/50 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#08080c]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-indigo-400 text-sm font-medium uppercase tracking-wider">What You Get</span>
            <h2 className="font-display text-4xl sm:text-5xl font-bold mt-4">Complete Solution</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              'Professional storefront with your brand',
              'UPI payment integration',
              'WhatsApp order notifications',
              'Product & category management',
              'Banner & promotional tools',
              'Social media integration',
              'Mobile-responsive design',
              'Real-time order tracking',
              'Customer data management',
              'Multiple theme options',
              'Custom features section',
              'Ongoing support & updates',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-4 bg-[#12121a] rounded-xl border border-white/5">
                <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-white/80">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="p-8 sm:p-12 bg-[#12121a] rounded-3xl border border-white/10">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">Ready to Start Selling?</h2>
            <p className="text-white/60 mb-8">
              Get your Codetoli Commerce store today. Reach out to us and we&apos;ll help you get started.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="mailto:support@codetolittech.qzz.io"
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-xl hover:bg-indigo-700 transition font-semibold"
              >
                <Mail className="w-5 h-5" />
                <span>support@codetolittech.qzz.io</span>
              </a>
              
              <a 
                href="https://linkedin.com/company/codetoli-technology"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white/10 border border-white/10 text-white px-8 py-4 rounded-xl hover:bg-white/20 transition font-semibold"
              >
                <Linkedin className="w-5 h-5" />
                <span>Codetoli Technology</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-white/5 bg-[#08080c]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                <Store className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-lg font-bold">Codetoli Commerce</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-white/50">
              <Link href="/terms" className="hover:text-white transition">Terms</Link>
              <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
            </div>

            <div className="text-center text-sm text-white/40 pt-6 border-t border-white/5 w-full">
              <p className="mb-2">Powered by <span className="text-indigo-400 font-medium">Codetoli Commerce</span></p>
              <p>© 2024-2025 Codetoli Technology. All Software Rights Reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
