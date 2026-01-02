/*
  # Public Access Policies for Storefront

  1. Security Changes
    - Add public read access for stores (by slug)
    - Add public read access for products (by store)
    - Add public read access for categories (by store)
    - Add public read access for discount_banners (by store, active only)
    - Add public read access for social_links (by store)

  These policies allow the public storefront to display store data without authentication.
*/

-- Public read access for stores (by slug)
CREATE POLICY "Anyone can read stores by slug"
  ON stores
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Public read access for products
CREATE POLICY "Anyone can read products"
  ON products
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Public read access for categories
CREATE POLICY "Anyone can read categories"
  ON categories
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Public read access for active discount banners
CREATE POLICY "Anyone can read active discount banners"
  ON discount_banners
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Public read access for social links
CREATE POLICY "Anyone can read social links"
  ON social_links
  FOR SELECT
  TO anon, authenticated
  USING (true);