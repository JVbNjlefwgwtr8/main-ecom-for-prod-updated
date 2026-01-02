/*
  # Fix Schema Issues and Modernize Features

  1. Issues Fixed:
    - Remove image_url from categories (causing "Invalid relation name" error)
    - Replace individual feature columns with features JSON for flexibility
    - Add image_url column to categories if needed in future
    - Keep schema clean and scalable

  2. Changes:
    - Drop feature1_title, feature1_description, feature1_icon, etc columns
    - Add features JSONB column to stores table
    - Drop image_url column from categories table
*/

-- Step 1: Check if categories has image_url and drop it
ALTER TABLE categories DROP COLUMN IF EXISTS image_url;

-- Step 2: Add features JSONB column to stores if it doesn't exist
ALTER TABLE stores ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[
  {
    "id": "delivery",
    "title": "Fast Delivery",
    "description": "Quick and reliable shipping to your doorstep",
    "icon": "Truck"
  },
  {
    "id": "security",
    "title": "Secure Shopping",
    "description": "Your data and payments are always protected",
    "icon": "Shield"
  },
  {
    "id": "returns",
    "title": "Easy Returns",
    "description": "Hassle-free returns within 30 days",
    "icon": "RefreshCw"
  }
]'::jsonb;

-- Step 3: Drop individual feature columns if they exist
ALTER TABLE stores DROP COLUMN IF EXISTS feature1_title;
ALTER TABLE stores DROP COLUMN IF EXISTS feature1_description;
ALTER TABLE stores DROP COLUMN IF EXISTS feature1_icon;
ALTER TABLE stores DROP COLUMN IF EXISTS feature2_title;
ALTER TABLE stores DROP COLUMN IF EXISTS feature2_description;
ALTER TABLE stores DROP COLUMN IF EXISTS feature2_icon;
ALTER TABLE stores DROP COLUMN IF EXISTS feature3_title;
ALTER TABLE stores DROP COLUMN IF EXISTS feature3_description;
ALTER TABLE stores DROP COLUMN IF EXISTS feature3_icon;
