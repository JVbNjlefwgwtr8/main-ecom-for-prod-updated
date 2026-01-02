import { supabaseServer } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ProductPageClient from './ProductPageClient';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  mrp: number;
  category: string;
  image_url: string;
  in_stock: boolean;
  store_id: string;
}

interface Store {
  id: string;
  name: string;
  slug: string;
  logo_url: string;
  phone: string;
}

async function getProductData(slug: string, productId: string) {
  const { data: store, error: storeError } = await supabaseServer
    .from('stores')
    .select('id, slug, name, logo_url, phone')
    .eq('slug', slug)
    .single();

  if (storeError || !store) {
    return null;
  }

  const { data: products, error: productsError } = await supabaseServer
    .from('products')
    .select('*')
    .eq('store_id', store.id);

  if (productsError || !products) {
    return null;
  }

  const product = products.find((p: Product) => p.id === productId);
  if (!product) {
    return null;
  }

  const relatedProducts = products
    .filter((p: Product) => p.id !== productId && p.category === product.category)
    .slice(0, 4);

  return {
    store: store as Store,
    product: product as Product,
    relatedProducts: relatedProducts as Product[],
  };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; productId: string }> }): Promise<Metadata> {
  const { slug, productId } = await params;
  const data = await getProductData(slug, productId);
  
  if (!data) {
    return { title: 'Product Not Found' };
  }

  return {
    title: `${data.product.name} | ${data.store.name}`,
    description: data.product.description || `Buy ${data.product.name} at ${data.store.name}`,
    openGraph: {
      title: data.product.name,
      description: data.product.description || `Buy ${data.product.name}`,
      images: data.product.image_url ? [data.product.image_url] : [],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string; productId: string }> }) {
  const { slug, productId } = await params;
  const data = await getProductData(slug, productId);

  if (!data) {
    notFound();
  }

  return (
    <ProductPageClient
      store={data.store}
      product={data.product}
      relatedProducts={data.relatedProducts}
      slug={slug}
    />
  );
}
