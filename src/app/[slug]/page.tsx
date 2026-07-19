import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import StorefrontClient from './StorefrontClient';
import SeoJsonLd from '@/components/SeoJsonLd';
import { getAbsoluteUrl } from '@/lib/site';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getStoreData(slug: string) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: store, error: storeError } = await supabase
    .from('stores')
    .select('id, slug, name, logo_url, hero_text, hero_image, phone, showcase_email, features, upi_id, upi_enabled, show_category_images, image_display_mode, theme, bg_color')
    .eq('slug', slug)
    .single();

  if (storeError || !store) {
    return null;
  }

  const [productsRes, categoriesRes, socialRes, bannersRes] = await Promise.all([
    supabase.from('products').select('*').eq('store_id', store.id).order('created_at', { ascending: false }),
    supabase.from('categories').select('*').eq('store_id', store.id),
    supabase.from('social_links').select('*').eq('store_id', store.id),
    supabase.from('discount_banners').select('*').eq('store_id', store.id),
  ]);

  return {
    store,
    products: productsRes.data || [],
    categories: categoriesRes.data || [],
    socialLinks: socialRes.data || [],
    banners: bannersRes.data || [],
  };
}

export default async function StorefrontPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getStoreData(slug);

  if (!data) {
    notFound();
  }

  return (
    <>
      <SeoJsonLd
        id={`store-${slug}-schema`}
        data={{
          '@context': 'https://schema.org',
          '@type': 'Store',
          name: data.store.name,
          url: getAbsoluteUrl(`/${slug}`),
          description: `Shop online at ${data.store.name} with products, contact details, and ordering options.`,
          telephone: data.store.phone || undefined,
          image: data.store.logo_url || undefined,
        }}
      />
      <StorefrontClient
        store={data.store}
        products={data.products}
        categories={data.categories}
        socialLinks={data.socialLinks}
        banners={data.banners}
        slug={slug}
      />
    </>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const data = await getStoreData(slug);

  if (!data) {
    return { title: 'Store Not Found' };
  }

  const title = `${data.store.name} | Online Store`;
  const description = `Shop online at ${data.store.name}. Browse products, contact details, and ordering options for this store.`;

  return {
    title,
    description,
    alternates: {
      canonical: getAbsoluteUrl(`/${slug}`),
    },
    openGraph: {
      title,
      description,
      url: getAbsoluteUrl(`/${slug}`),
      type: 'website',
      images: data.store.logo_url ? [data.store.logo_url] : [],
    },
    icons: data.store.logo_url ? { icon: data.store.logo_url } : undefined,
  };
}
