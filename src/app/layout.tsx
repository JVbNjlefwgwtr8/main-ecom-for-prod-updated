import '@/app/globals.css';
import { ReactNode } from 'react';
import { AuthProvider } from '@/app/contexts/AuthContext';
import { StoreProvider } from '@/app/contexts/StoreContext';
import { Maven_Pro, Playfair_Display } from 'next/font/google';

import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";

const mavenPro = Maven_Pro({ subsets: ['latin'], weight: ['400', '500', '700'] });
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '500', '700', '900'] });

export const metadata = {
  title: 'Codetoli Commerce - Build Your E-Commerce Store',
  description: 'Create and manage your online store with ease',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://commerce.codetolittech.qzz.io',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Script
          id="orchids-browser-logs"
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts/orchids-browser-logs.js"
          strategy="afterInteractive"
          data-orchids-project-id="180cb890-327d-4304-9866-a2150aafa63e"
        />
        <ErrorReporter />
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
        />
        <AuthProvider>
          <StoreProvider>
            {children}
          </StoreProvider>
        </AuthProvider>
        </body>
    </html>
  );
}