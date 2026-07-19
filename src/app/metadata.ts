import { Metadata } from 'next';
import { getSiteUrl } from '@/lib/site';

export const siteMetadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: 'Codetoli Commerce | Build Your Online Store',
    template: '%s | Codetoli Commerce',
  },
  description:
    'Launch a modern online store with themes, product management, UPI payments, WhatsApp ordering, and analytics in one easy platform.',
  keywords: [
    'online store builder',
    'ecommerce platform',
    'small business website',
    'UPI payments',
    'WhatsApp ordering',
    'store builder India',
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: getSiteUrl(),
  },
  openGraph: {
    title: 'Codetoli Commerce | Build Your Online Store',
    description:
      'Launch a modern online store with themes, product management, payments, WhatsApp ordering, and analytics in one easy platform.',
    type: 'website',
    url: getSiteUrl(),
    siteName: 'Codetoli Commerce',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Codetoli Commerce | Build Your Online Store',
    description:
      'Launch a modern online store with themes, product management, payments, WhatsApp ordering, and analytics in one easy platform.',
  },
};
