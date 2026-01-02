-- Migration: Add UPI and display settings to stores table
-- Run this migration on your Supabase database

-- Add new columns to stores table
ALTER TABLE stores ADD COLUMN IF NOT EXISTS upi_id TEXT DEFAULT '';
ALTER TABLE stores ADD COLUMN IF NOT EXISTS upi_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE stores ADD COLUMN IF NOT EXISTS show_category_images BOOLEAN DEFAULT TRUE;

-- Add image_url column to categories table if it doesn't exist
ALTER TABLE categories ADD COLUMN IF NOT EXISTS image_url TEXT DEFAULT '';

-- Update the updated_at column for any existing rows
UPDATE stores SET updated_at = now() WHERE upi_id IS NULL;
UPDATE categories SET updated_at = now() WHERE image_url IS NULL;
