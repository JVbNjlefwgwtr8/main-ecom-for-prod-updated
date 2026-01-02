'use client';

export default function InvoicesPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-2">Invoices</h1>
      <p className="text-slate-600 mb-8">Manage and create invoices for your store</p>

      <div className="bg-white rounded-xl shadow-md border border-slate-200 h-screen">
        <iframe
          src="https://invoiceforge.netlify.app/"
          title="Invoice Forge"
          className="w-full h-full border-none rounded-xl"
          style={{ minHeight: 'calc(100vh - 200px)' }}
        />
      </div>
    </div>
  );
}
