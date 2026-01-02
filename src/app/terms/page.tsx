'use client';

import Link from 'next/link';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Link href="/" className="text-blue-600 hover:text-blue-700 mb-8 inline-block">
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        
        <div className="bg-white rounded-lg shadow p-8 prose prose-sm max-w-none">
          <p className="mb-4">Last updated: November 22, 2025</p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">1. Agreement to Terms</h2>
          <p className="mb-4">
            By accessing and using this website and service (the Service), you accept and agree to be bound by and comply with these terms and conditions.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">2. Use License</h2>
          <p className="mb-4">
            Permission is granted to temporarily download one copy of the materials (information or software) on Codetoli Commerce's Service for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose or for any public display</li>
            <li>Attempt to decompile or reverse engineer any software contained on the Service</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
            <li>Transfer the materials to another person or mirror the materials on any other server</li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">3. Disclaimer</h2>
          <p className="mb-4">
            The materials on Codetoli Commerce Service are provided on an as is basis. Codetoli Commerce makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">4. Limitations</h2>
          <p className="mb-4">
            In no event shall Codetoli Commerce or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the Service, even if Codetoli Commerce or an authorized representative has been notified orally or in writing of the possibility of such damage.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">5. Accuracy of Materials</h2>
          <p className="mb-4">
            The materials appearing on Codetoli Commerce Service could include technical, typographical, or photographic errors. Codetoli Commerce does not warrant that any of the materials on the Service are accurate, complete, or current. Codetoli Commerce may make changes to the materials contained on the Service at any time without notice.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Contact Us</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us at support@Codetoli Commerce.com
          </p>
        </div>
      </div>
    </div>
  );
}
