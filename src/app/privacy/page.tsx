'use client';

import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <Link href="/" className="text-blue-600 hover:text-blue-700 mb-8 inline-block">
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="bg-white rounded-lg shadow p-8 prose prose-sm max-w-none">
          <p className="mb-4">Last updated: November 22, 2025. Codetoli Commerce &copy; 2025. All rights reserved.</p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">1. Introduction</h2>
          <p className="mb-4">
            Codetoli Commerce (we or us or our) operates the website and service (the Service). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">2. Information Collection and Use</h2>
          <p className="mb-4">
            We collect several different types of information for various purposes to provide and improve our Service to you.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Types of Data Collected:</h3>
          <ul className="list-disc list-inside mb-4">
            <li><strong>Personal Data:</strong> Email address, first name and last name, phone number</li>
            <li><strong>Usage Data:</strong> Browser type, IP address, pages visited, time and date of visit</li>
            <li><strong>Store Data:</strong> Store name, product information, categories, pricing</li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">3. Use of Data</h2>
          <p className="mb-4">
            Codetoli Commerce uses the collected data for various purposes:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>To provide and maintain our Service</li>
            <li>To notify you about changes to our Service</li>
            <li>To provide customer support</li>
            <li>To gather analysis or valuable information so we can improve our Service</li>
            <li>To monitor the usage of our Service</li>
            <li>To detect, prevent and address technical issues</li>
          </ul>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">4. Security of Data</h2>
          <p className="mb-4">
            The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">5. Changes to This Privacy Policy</h2>
          <p className="mb-4">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "effective date" at the top of this Privacy Policy.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at privacy@Codetoli Commerce.com
          </p>
        </div>
      </div>
    </div>
  );
}
