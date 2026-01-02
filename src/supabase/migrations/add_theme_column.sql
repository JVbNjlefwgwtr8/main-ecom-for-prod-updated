-- Add theme and bg_color columns to stores table
ALTER TABLE stores ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'default';
ALTER TABLE stores ADD COLUMN IF NOT EXISTS bg_color TEXT DEFAULT '#ffffff';
