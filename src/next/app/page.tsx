import Link from 'next/link';
import { Store, Mail, Linkedin } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
                <Store className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">Codetoli Commerce</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login" className="text-gray-600 hover:text-gray-900">
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-6xl font-bold text-gray-900 mb-8">
            Codetoli Commerce
          </h1>
          
          {/* Contact Section */}
          <div className="mt-16 space-y-8">
            <p className="text-xl text-gray-600 mb-8">
              To get your Codetoli Commerce store, reach out to us:
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              {/* Email */}
              <a 
                href="mailto:support@codetolittech.qzz.io"
                className="flex items-center gap-3 bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                <Mail className="w-5 h-5" />
                <span>support@codetolittech.qzz.io</span>
              </a>
              
              {/* LinkedIn */}
              <a 
                href="https://linkedin.com/company/codetoli-technology"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-blue-700 text-white px-8 py-3 rounded-lg hover:bg-blue-800 transition"
              >
                <Linkedin className="w-5 h-5" />
                <span>LinkedIn: Codetoli Technology</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
