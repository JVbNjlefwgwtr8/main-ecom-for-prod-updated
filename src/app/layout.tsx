import '@/app/globals.css';
import { ReactNode } from 'react';
import { AuthProvider } from '@/app/contexts/AuthContext';
import { StoreProvider } from '@/app/contexts/StoreContext';
import { Maven_Pro, Playfair_Display } from 'next/font/google';

import ErrorReporter from '@/components/ErrorReporter';
import Script from 'next/script';
import { Metadata } from 'next';
import { siteMetadata } from '@/app/metadata';

const mavenPro = Maven_Pro({ subsets: ['latin'], weight: ['400', '500', '700'] });
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '500', '700', '900'] });

export const metadata: Metadata = siteMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-V5XJJ277CJ"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-V5XJJ277CJ');
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <ErrorReporter />
        <AuthProvider>
          <StoreProvider>
            {children}
          </StoreProvider>
        </AuthProvider>
        </body>
    </html>
  );
}