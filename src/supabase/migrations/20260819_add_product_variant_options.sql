-- Store product colors, sizes, and named variants as one JSON document.
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS variant_options JSONB NOT NULL DEFAULT '{"colors": [], "sizes": [], "variants": []}'::jsonb;
