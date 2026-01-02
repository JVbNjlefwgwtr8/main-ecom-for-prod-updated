/*
  # Enable Public Read Access for Storefronts

  1. Problem:
    - RLS policies only allow authenticated users to read stores
    - Public storefronts cannot be accessed by anonymous visitors
    - Customers cannot view products, categories, or social links

  2. Solution:
    - Add public SELECT policies for stores (all visitors)
    - Add public SELECT policies for products (all visitors)
    - Add public SELECT policies for categories (all visitors)
    - Add public SELECT policies for social_links (all visitors)
    - Keep authenticated policies for write operations
*/

-- Public READ policy for stores (select by slug)
CREATE POLICY "Anyone can read stores"
  ON stores
  FOR SELECT
  TO public
  USING (true);

-- Public READ policy for products (select by store_id)
CREATE POLICY "Anyone can read products"
  ON products
  FOR SELECT
  TO public
  USING (true);

-- Public READ policy for categories (select by store_id)
CREATE POLICY "Anyone can read categories"
  ON categories
  FOR SELECT
  TO public
  USING (true);

-- Public READ policy for discount_banners (select by store_id)
CREATE POLICY "Anyone can read discount banners"
  ON discount_banners
  FOR SELECT
  TO public
  USING (true);

-- Public READ policy for social_links (select by store_id)
CREATE POLICY "Anyone can read social links"
  ON social_links
  FOR SELECT
  TO public
  USING (true);
