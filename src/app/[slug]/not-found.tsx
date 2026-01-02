import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-stone-50 to-white">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-stone-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-stone-700 mb-4">Store Not Found</h2>
        <p className="text-stone-500 mb-8">The store you are looking for does not exist or has been removed.</p>
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 text-white font-semibold rounded-lg hover:bg-stone-800 transition"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
