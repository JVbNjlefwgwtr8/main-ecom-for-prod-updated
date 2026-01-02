import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'https://jfgbpdppliilbukookyg.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmZ2JwZHBwbGlpbGJ1a29va3lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3MDQ2MjgsImV4cCI6MjA3NjI4MDYyOH0.-PXryoGB3JsHCZbiia_nmK1DDU9_ezcHuO_rvfiPDbQ';

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// SQL to add public read policies
const sql = `
-- Public READ policy for stores (select by slug)
CREATE POLICY IF NOT EXISTS "Anyone can read stores"
  ON stores
  FOR SELECT
  TO public
  USING (true);

-- Public READ policy for products (select by store_id)
CREATE POLICY IF NOT EXISTS "Anyone can read products"
  ON products
  FOR SELECT
  TO public
  USING (true);

-- Public READ policy for categories (select by store_id)
CREATE POLICY IF NOT EXISTS "Anyone can read categories"
  ON categories
  FOR SELECT
  TO public
  USING (true);

-- Public READ policy for discount_banners (select by store_id)
CREATE POLICY IF NOT EXISTS "Anyone can read discount banners"
  ON discount_banners
  FOR SELECT
  TO public
  USING (true);

-- Public READ policy for social_links (select by store_id)
CREATE POLICY IF NOT EXISTS "Anyone can read social links"
  ON social_links
  FOR SELECT
  TO public
  USING (true);
`;

async function main() {
  try {
    // Try a test query first to ensure connection works
    const { data: testData, error: testError } = await supabase
      .from('stores')
      .select('id')
      .limit(1);

    if (testError) {
      console.error('Connection error:', testError);
      process.exit(1);
    }

    console.log('✓ Connected to Supabase');
    console.log('Note: SQL migrations need to be executed via Supabase dashboard or CLI');
    console.log('The RLS policies for public access need to be manually applied.');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
