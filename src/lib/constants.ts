export const API_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://ecommerce.codetolittech.qzz.io/';

export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: '/api/auth/signup',
    LOGIN: '/api/auth/login',
  },
  STORE: '/api/store',
  PRODUCTS: '/api/products',
  CATEGORIES: '/api/categories',
  BANNERS: '/api/banners',
  social_links: '/api/social-links',
} as const;
