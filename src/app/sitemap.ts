import { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();

  try {
    // Create Supabase client with anon key (should work with RLS)
    const { createClient } = await import('@supabase/supabase-js');
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase anon key not available, returning basic sitemap');
      return getBasicSitemap(baseUrl);
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const sitemapEntries: MetadataRoute.Sitemap = [];

    // Add landing page
    sitemapEntries.push({
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    });

    // Add privacy and terms pages
    sitemapEntries.push(
      {
        url: `${baseUrl}/privacy`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      {
        url: `${baseUrl}/terms`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      }
    );

    // Fetch all stores (public data)
    const { data: stores, error: storesError } = await supabase
      .from('stores')
      .select('id, slug, updated_at')
      .order('updated_at', { ascending: false })
      .limit(1000);

    if (storesError) {
      console.warn('Error fetching stores for sitemap:', storesError.message);
      return sitemapEntries; // Return with basic pages only
    }

    if (!stores || stores.length === 0) {
      console.log('No stores found for sitemap');
      return sitemapEntries;
    }

    // For each store, fetch products and add to sitemap
    for (const store of stores) {
      // Add store page
      sitemapEntries.push({
        url: `${baseUrl}/${store.slug}`,
        lastModified: store.updated_at ? new Date(store.updated_at) : new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      });

      // Fetch products for this store
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, updated_at')
        .eq('store_id', store.id)
        .order('updated_at', { ascending: false })
        .limit(500);

      if (productsError) {
        console.warn(`Error fetching products for store ${store.slug}:`, productsError.message);
        continue;
      }

      if (products && products.length > 0) {
        for (const product of products) {
          sitemapEntries.push({
            url: `${baseUrl}/${store.slug}/product/${product.id}`,
            lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
          });
        }
      }
    }

    console.log(`Generated sitemap with ${sitemapEntries.length} entries`);
    return sitemapEntries;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return getBasicSitemap(baseUrl);
  }
}

function getBasicSitemap(baseUrl: string): MetadataRoute.Sitemap {
  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];
}
