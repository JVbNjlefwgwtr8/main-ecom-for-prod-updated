import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import StorefrontClient from './StorefrontClient';

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
    <StorefrontClient
      store={data.store}
      products={data.products}
      categories={data.categories}
      socialLinks={data.socialLinks}
      banners={data.banners}
      slug={slug}
    />
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const data = await getStoreData(slug);

  if (!data) {
    return { title: 'Store Not Found' };
  }

  return {
    title: data.store.name,
    description: `Shop at ${data.store.name}`,
    icons: data.store.logo_url ? { icon: data.store.logo_url } : undefined,
  };
}
