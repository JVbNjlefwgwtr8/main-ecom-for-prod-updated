'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Trash2, Plus, X, Download, Copy, Check } from 'lucide-react';
import { useParams } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface UPIPayment {
  id: string;
  upiId: string;
  amount: number;
  message: string;
  productId?: string;
  productName?: string;
  createdAt: number;
}

interface Store {
  id: string;
  name: string;
}

export default function CollectPaymentsPage() {
  const params = useParams();
  const slug = params.slug as string;
  const qrRefMap = useRef<Record<string, HTMLDivElement | null>>({});

  const [storeId, setStoreId] = useState<string>('');
  const [storeName, setStoreName] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [payments, setPayments] = useState<UPIPayment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    upiId: '',
    amount: '',
    message: '',
    productId: '',
  });

  // Load data
  useEffect(() => {
    if (!slug) return;

    const loadData = async () => {
      try {
        // Load store
        const storeRes = await fetch(`/api/store?slug=${slug}`);
        const storeData = await storeRes.json();

        if (storeData.data) {
          setStoreId(storeData.data.id);
          setStoreName(storeData.data.name);

          // Load products
          const productsRes = await fetch(`/api/products?store_slug=${slug}`);
          const productsData = await productsRes.json();
          setProducts(productsData.data || []);

          // Load payments from localStorage
          const savedPayments = localStorage.getItem(`upi_payments_${storeData.data.id}`);
          if (savedPayments) {
            setPayments(JSON.parse(savedPayments));
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, [slug]);

  // Auto-fill UPI ID from localStorage after component mounts
  useEffect(() => {
    if (slug) {
      const savedUPIId = localStorage.getItem(`upi_id_${slug}`);
      if (savedUPIId) {
        setForm(prev => ({
          ...prev,
          upiId: savedUPIId,
        }));
      }
    }
  }, [slug]);

  // Save payments to localStorage
  useEffect(() => {
    if (storeId && payments.length > 0) {
      localStorage.setItem(`upi_payments_${storeId}`, JSON.stringify(payments));
    }
  }, [payments, storeId]);

  // Save UPI ID to localStorage whenever it changes
  useEffect(() => {
    if (slug && form.upiId) {
      localStorage.setItem(`upi_id_${slug}`, form.upiId);
    }
  }, [form.upiId, slug]);

  // Auto-fill amount when product is selected
  const handleProductChange = (productId: string) => {
    setForm(prev => ({
      ...prev,
      productId,
    }));

    if (productId) {
      const product = products.find(p => p.id === productId);
      if (product) {
        setForm(prev => ({
          ...prev,
          amount: product.price.toString(),
        }));
      }
    }
  };

  // Add payment
  const handleAddPayment = () => {
    if (!form.upiId || !form.amount) {
      alert('Please fill in UPI ID and Amount');
      return;
    }

    const amount = parseInt(form.amount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const selectedProduct = form.productId
      ? products.find(p => p.id === form.productId)
      : null;

    const newPayment: UPIPayment = {
      id: Date.now().toString(),
      upiId: form.upiId,
      amount,
      message: form.message,
      productId: form.productId,
      productName: selectedProduct?.name,
      createdAt: Date.now(),
    };

    setPayments(prev => [...prev, newPayment]);
    setForm({
      upiId: '',
      amount: '',
      message: '',
      productId: '',
    });
  };

  // Delete payment
  const handleDelete = (id: string) => {
    setPayments(prev => prev.filter(p => p.id !== id));
  };

  // Copy UPI ID
  const handleCopy = (upiId: string, id: string) => {
    navigator.clipboard.writeText(upiId);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // Generate QR Code and Download as Image
  const handleDownloadQR = async (payment: UPIPayment) => {
    try {
      setIsLoading(true);

      const upiUrl = `upi://pay?pa=${payment.upiId}&am=${payment.amount}&tn=${encodeURIComponent(payment.message)}`;
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiUrl)}`;

      // Create a canvas element for the QR code image with BHIM-style branding
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 600;
      canvas.height = 900;

      // White background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Load and draw QR code with crossOrigin
      const qrImage = new Image();
      qrImage.crossOrigin = 'anonymous';
      
      qrImage.onload = () => {
        try {
          // Draw gradient header background
          const headerGradient = ctx.createLinearGradient(0, 0, canvas.width, 80);
          headerGradient.addColorStop(0, '#FFC520');
          headerGradient.addColorStop(1, '#FFB500');
          ctx.fillStyle = headerGradient;
          ctx.fillRect(0, 0, canvas.width, 80);

          // Draw decorative header pattern
          ctx.fillStyle = '#FF9C00';
          for (let i = 0; i < 60; i += 20) {
            ctx.fillRect(i, 0, 8, 80);
          }

          // Draw "SCAN & PAY" text in header with shadow
          ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
          ctx.font = 'bold 28px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('SCAN & PAY', 302, 57);
          
          ctx.fillStyle = '#FFFFFF';
          ctx.fillText('SCAN & PAY', 300, 55);

          // Draw decorative line
          ctx.strokeStyle = '#FF9C00';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(60, 95);
          ctx.lineTo(540, 95);
          ctx.stroke();

          // Draw store name with background box
          ctx.fillStyle = '#E8F0FE';
          ctx.fillRect(30, 110, 540, 50);
          
          ctx.fillStyle = '#1E293B';
          ctx.font = 'bold 24px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(storeName, 300, 145);

          // Draw decorative circles around QR
          ctx.strokeStyle = '#FFC520';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(120, 190, 6, 0, Math.PI * 2);
          ctx.stroke();
          
          ctx.beginPath();
          ctx.arc(480, 190, 6, 0, Math.PI * 2);
          ctx.stroke();

          // Draw QR code in center with border - SQUARE DIMENSIONS FOR NO DISTORTION
          ctx.strokeStyle = '#FFC520';
          ctx.lineWidth = 8;
          ctx.fillStyle = '#FFFFFF';
          const qrSize = 280; // Square size
          const qrX = (canvas.width - qrSize) / 2; // Center horizontally
          const qrY = 170; // Top position
          
          ctx.fillRect(qrX - 8, qrY - 8, qrSize + 16, qrSize + 16);
          ctx.strokeRect(qrX - 8, qrY - 8, qrSize + 16, qrSize + 16);
          
          // Draw QR code with same dimensions (square, no distortion)
          ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);

          // Draw corner decorations
          ctx.fillStyle = '#FFC520';
          ctx.fillRect(qrX - 15, qrY - 15, 15, 3);
          ctx.fillRect(qrX - 15, qrY - 15, 3, 15);
          ctx.fillRect(qrX + qrSize + 8, qrY - 15, 15, 3);
          ctx.fillRect(qrX + qrSize + 20, qrY - 15, 3, 15);
          ctx.fillRect(qrX - 15, qrY + qrSize + 8, 15, 3);
          ctx.fillRect(qrX - 15, qrY + qrSize + 20, 3, 15);
          ctx.fillRect(qrX + qrSize + 8, qrY + qrSize + 8, 15, 3);
          ctx.fillRect(qrX + qrSize + 20, qrY + qrSize + 20, 3, 15);

          // Draw "UPI ID" label with background
          ctx.fillStyle = '#F0F4F8';
          ctx.fillRect(60, 465, 480, 35);
          
          ctx.fillStyle = '#475569';
          ctx.font = 'bold 14px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('Scan using any UPI app', 300, 485);

          // Draw UPI ID with highlight box
          ctx.fillStyle = '#E8F0FE';
          ctx.fillRect(80, 510, 440, 50);
          ctx.strokeStyle = '#2563EB';
          ctx.lineWidth = 2;
          ctx.strokeRect(80, 510, 440, 50);
          
          ctx.fillStyle = '#2563EB';
          ctx.font = 'bold 18px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('UPI: ' + payment.upiId, 300, 542);

          // Draw amount section with gradient background
          const amountGradient = ctx.createLinearGradient(0, 570, 0, 640);
          amountGradient.addColorStop(0, '#E0F2FE');
          amountGradient.addColorStop(1, '#E8F0FE');
          ctx.fillStyle = amountGradient;
          ctx.fillRect(40, 570, 520, 70);
          
          // Amount label
          ctx.fillStyle = '#1E293B';
          ctx.font = 'bold 14px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('AMOUNT TO PAY', 300, 590);

          // Amount value with gradient text effect
          ctx.fillStyle = '#2563EB';
          ctx.font = 'bold 52px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(`₹${payment.amount}`, 300, 632);

          // Draw decorative side accents
          ctx.fillStyle = '#FFC520';
          ctx.fillRect(30, 570, 4, 70);
          ctx.fillRect(566, 570, 4, 70);

          // Draw message if exists
          if (payment.message) {
            ctx.fillStyle = '#F5F5F5';
            ctx.fillRect(40, 650, 520, 40);
            
            ctx.font = '13px Arial';
            ctx.fillStyle = '#64748B';
            ctx.textAlign = 'center';
            ctx.fillText(payment.message, 300, 675);
          }

          // Draw supported payment methods with icons indication
          ctx.fillStyle = '#F8FAFC';
          ctx.fillRect(0, 700, canvas.width, 80);
          
          ctx.fillStyle = '#64748B';
          ctx.font = 'bold 12px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('Accepted Payment Methods', 300, 720);

          ctx.font = '11px Arial';
          ctx.fillStyle = '#94A3B8';
          ctx.fillText('Paytm • PhonePe • Google Pay • BHIM • WhatsApp Pay', 300, 735);
          ctx.fillText('Amazon Pay • Mobikwik • and more...', 300, 750);

          // Draw footer with branding
          ctx.fillStyle = '#1E293B';
          ctx.font = '10px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('Powered by Codetoli Commerce', 300, 805);

          // Draw bottom decorative bar with gradient
          const footerGradient = ctx.createLinearGradient(0, 820, canvas.width, 850);
          footerGradient.addColorStop(0, '#FFB500');
          footerGradient.addColorStop(0.5, '#FFC520');
          footerGradient.addColorStop(1, '#FFB500');
          ctx.fillStyle = footerGradient;
          ctx.fillRect(0, 820, canvas.width, 30);

          // Download
          const link = document.createElement('a');
          link.href = canvas.toDataURL('image/png');
          link.download = `QR_${payment.upiId.replace('@', '_')}_${payment.amount}.png`;
          link.click();
        } catch (canvasError) {
          console.error('Canvas error:', canvasError);
          alert('Canvas error - trying alternative download method');
          // Fallback: download QR directly
          const link = document.createElement('a');
          link.href = qrCodeUrl;
          link.download = `QR_${payment.upiId.replace('@', '_')}_${payment.amount}.png`;
          link.click();
        }
      };

      qrImage.onerror = () => {
        console.error('Failed to load QR image');
        alert('Failed to load QR code - trying alternative download method');
        // Fallback: download QR directly
        const link = document.createElement('a');
        link.href = qrCodeUrl;
        link.download = `QR_${payment.upiId.replace('@', '_')}_${payment.amount}.png`;
        link.click();
      };

      qrImage.src = qrCodeUrl;
    } catch (error) {
      console.error('Error downloading QR:', error);
      alert('Failed to download QR code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-2 text-slate-900">Collect Payments</h1>
      <p className="text-slate-600 mb-8">Create and manage UPI payment requests with QR codes</p>

      {/* Add Payment Form */}
      <div className="bg-white rounded-xl shadow-md p-8 mb-8 border border-slate-200">
        <h2 className="text-2xl font-bold mb-6 text-slate-900">Create Payment Request</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* UPI ID */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              UPI ID *
            </label>
            <input
              type="text"
              placeholder="example@upi"
              value={form.upiId}
              onChange={(e) => setForm({...form, upiId: e.target.value})}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Amount (₹) *
            </label>
            <input
              type="number"
              placeholder="500"
              value={form.amount}
              onChange={(e) => setForm({...form, amount: e.target.value})}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium"
            />
          </div>

          {/* Product Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Product (Optional)
            </label>
            <select
              value={form.productId}
              onChange={(e) => handleProductChange(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium"
            >
              <option value="">Select a product</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name} (₹{product.price})
                </option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Payment Message
            </label>
            <input
              type="text"
              placeholder="Payment for order"
              value={form.message}
              onChange={(e) => setForm({...form, message: e.target.value})}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium"
            />
          </div>
        </div>

        <button
          onClick={handleAddPayment}
          disabled={isLoading}
          className="mt-6 w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create Payment Request
        </button>
      </div>

      {/* Payment Requests */}
      <div>
        <h2 className="text-2xl font-bold mb-6 text-slate-900">Payment Requests</h2>

        {payments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center border border-slate-200">
            <p className="text-slate-600">No payment requests yet. Create your first one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {payments.map(payment => {
              const upiUrl = `upi://pay?pa=${payment.upiId}&am=${payment.amount}&tn=${encodeURIComponent(payment.message)}`;
              const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upiUrl)}`;

              return (
                <div key={payment.id} className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
                  {/* QR Code */}
                  <div className="bg-slate-50 p-4 flex justify-center">
                    <img src={qrCodeUrl} alt="QR Code" className="w-40 h-40" />
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    {/* UPI ID */}
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase">UPI ID</label>
                      <div className="flex items-center justify-between gap-2 mt-1">
                        <p className="font-mono text-slate-900 font-bold">{payment.upiId}</p>
                        <button
                          onClick={() => handleCopy(payment.upiId, payment.id)}
                          className="p-1 hover:bg-slate-100 rounded text-slate-600"
                        >
                          {copied === payment.id ? (
                            <Check className="w-5 h-5 text-green-600" />
                          ) : (
                            <Copy className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Amount */}
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase">Amount</label>
                      <p className="text-2xl font-bold text-slate-900 mt-1">₹{payment.amount}</p>
                    </div>

                    {/* Product */}
                    {payment.productName && (
                      <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase">Product</label>
                        <p className="text-slate-900 mt-1">{payment.productName}</p>
                      </div>
                    )}

                    {/* Message */}
                    {payment.message && (
                      <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase">Message</label>
                        <p className="text-slate-600 text-sm mt-1">{payment.message}</p>
                      </div>
                    )}

                    {/* Date */}
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase">Created</label>
                      <p className="text-slate-600 text-sm mt-1">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t border-slate-200">
                      <button
                        onClick={() => handleDownloadQR(payment)}
                        disabled={isLoading}
                        className="flex-1 bg-slate-900 text-white py-2 rounded-lg font-semibold hover:bg-slate-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                      <button
                        onClick={() => handleDelete(payment.id)}
                        className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
