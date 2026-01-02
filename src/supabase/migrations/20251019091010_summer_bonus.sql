/*
  # Initial Schema Setup for Codetoli Commerce

  1. New Tables
    - `stores`
      - `id` (uuid, primary key)
      - `slug` (text, unique)
      - `name` (text)
      - `logo_url` (text)
      - `hero_text` (text)
      - `hero_image` (text)
      - `login_email` (text)
      - `showcase_email` (text)
      - `phone` (text)
      - `user_id` (uuid, references auth.users)
      - `feature1_title` (text)
      - `feature1_description` (text)
      - `feature1_icon` (text)
      - `feature2_title` (text)
      - `feature2_description` (text)
      - `feature2_icon` (text)
      - `feature3_title` (text)
      - `feature3_description` (text)
      - `feature3_icon` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (integer)
      - `mrp` (integer)
      - `category` (text)
      - `image_url` (text)
      - `in_stock` (boolean)
      - `store_id` (uuid, references stores)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `categories`
      - `id` (uuid, primary key)
      - `name` (text)
      - `store_id` (uuid, references stores)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `discount_banners`
      - `id` (uuid, primary key)
      - `text` (text)
      - `is_active` (boolean)
      - `background_color` (text)
      - `text_color` (text)
      - `store_id` (uuid, references stores)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `social_links`
      - `id` (uuid, primary key)
      - `display_text` (text)
      - `url` (text)
      - `store_id` (uuid, references stores)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create stores table
CREATE TABLE IF NOT EXISTS stores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  logo_url text DEFAULT '',
  hero_text text DEFAULT '',
  hero_image text DEFAULT '',
  login_email text NOT NULL,
  showcase_email text NOT NULL,
  phone text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  feature1_title text DEFAULT 'Fast Delivery',
  feature1_description text DEFAULT 'Quick and reliable shipping to your doorstep',
  feature1_icon text DEFAULT 'Truck',
  feature2_title text DEFAULT 'Secure Shopping',
  feature2_description text DEFAULT 'Your data and payments are always protected',
  feature2_icon text DEFAULT 'Shield',
  feature3_title text DEFAULT 'Easy Returns',
  feature3_description text DEFAULT 'Hassle-free returns within 30 days',
  feature3_icon text DEFAULT 'RefreshCw',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  price integer NOT NULL,
  mrp integer NOT NULL,
  category text DEFAULT '',
  image_url text DEFAULT '',
  in_stock boolean DEFAULT true,
  store_id uuid REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  store_id uuid REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create discount_banners table
CREATE TABLE IF NOT EXISTS discount_banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text text NOT NULL,
  is_active boolean DEFAULT true,
  background_color text DEFAULT '#EF4444',
  text_color text DEFAULT '#FFFFFF',
  store_id uuid REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create social_links table
CREATE TABLE IF NOT EXISTS social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  display_text text NOT NULL,
  url text NOT NULL,
  store_id uuid REFERENCES stores(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

-- Create policies for stores
CREATE POLICY "Users can read their own stores"
  ON stores
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stores"
  ON stores
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stores"
  ON stores
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own stores"
  ON stores
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for products
CREATE POLICY "Users can read products from their stores"
  ON products
  FOR SELECT
  TO authenticated
  USING (
    store_id IN (
      SELECT id FROM stores WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert products to their stores"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (
    store_id IN (
      SELECT id FROM stores WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update products in their stores"
  ON products
  FOR UPDATE
  TO authenticated
  USING (
    store_id IN (
      SELECT id FROM stores WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    store_id IN (
      SELECT id FROM stores WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete products from their stores"
  ON products
  FOR DELETE
  TO authenticated
  USING (
    store_id IN (
      SELECT id FROM stores WHERE user_id = auth.uid()
    )
  );

-- Create policies for categories
CREATE POLICY "Users can read categories from their stores"
  ON categories
  FOR SELECT
  TO authenticated
  USING (
    store_id IN (
      SELECT id FROM stores WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert categories to their stores"
  ON categories
  FOR INSERT
  TO authenticated
  WITH CHECK (
    store_id IN (
      SELECT id FROM stores WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update categories in their stores"
  ON categories
  FOR UPDATE
  TO authenticated
  USING (
    store_id IN (
      SELECT id FROM stores WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    store_id IN (
      SELECT id FROM stores WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete categories from their stores"
  ON categories
  FOR DELETE
  TO authenticated
  USING (
    store_id IN (
      SELECT id FROM stores WHERE user_id = auth.uid()
    )
  );

-- Create policies for discount_banners
CREATE POLICY "Users can read banners from their stores"
  ON discount_banners
  FOR SELECT
  TO authenticated
  USING (
    store_id IN (
      SELECT id FROM stores WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert banners to their stores"
  ON discount_banners
  FOR INSERT
  TO authenticated
  WITH CHECK (
    store_id IN (
      SELECT id FROM stores WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update banners in their stores"
  ON discount_banners
  FOR UPDATE
  TO authenticated
  USING (
    store_id IN (
      SELECT id FROM stores WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    store_id IN (
      SELECT id FROM stores WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete banners from their stores"
  ON discount_banners
  FOR DELETE
  TO authenticated
  USING (
    store_id IN (
      SELECT id FROM stores WHERE user_id = auth.uid()
    )
  );

-- Create policies for social_links
CREATE POLICY "Users can read social links from their stores"
  ON social_links
  FOR SELECT
  TO authenticated
  USING (
    store_id IN (
      SELECT id FROM stores WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert social links to their stores"
  ON social_links
  FOR INSERT
  TO authenticated
  WITH CHECK (
    store_id IN (
      SELECT id FROM stores WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update social links in their stores"
  ON social_links
  FOR UPDATE
  TO authenticated
  USING (
    store_id IN (
      SELECT id FROM stores WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    store_id IN (
      SELECT id FROM stores WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete social links from their stores"
  ON social_links
  FOR DELETE
  TO authenticated
  USING (
    store_id IN (
      SELECT id FROM stores WHERE user_id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS stores_user_id_idx ON stores(user_id);
CREATE INDEX IF NOT EXISTS stores_slug_idx ON stores(slug);
CREATE INDEX IF NOT EXISTS products_store_id_idx ON products(store_id);
CREATE INDEX IF NOT EXISTS categories_store_id_idx ON categories(store_id);
CREATE INDEX IF NOT EXISTS discount_banners_store_id_idx ON discount_banners(store_id);
CREATE INDEX IF NOT EXISTS social_links_store_id_idx ON social_links(store_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_discount_banners_updated_at BEFORE UPDATE ON discount_banners FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_social_links_updated_at BEFORE UPDATE ON social_links FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();