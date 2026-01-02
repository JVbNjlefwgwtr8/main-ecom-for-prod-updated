/*
  # Remove Hardcoded Feature Defaults

  1. Changes:
    - Remove hardcoded default features from stores.features column
    - Change default from pre-filled array to empty array
    - This allows design store to start with no features by default
    - Users must explicitly add features via the design store UI
    
  2. Impact:
    - Existing stores will keep their current features (no data loss)
    - New stores will start with empty features array
    - Aligns with updated design store UX that shows "No features added yet"
*/

-- Update the default for features column to empty array
ALTER TABLE stores ALTER COLUMN features SET DEFAULT '[]'::jsonb;

-- Optional: For existing stores with default features, reset them to empty
-- Uncomment the line below if you want to clear all existing features
-- UPDATE stores SET features = '[]'::jsonb WHERE features = '[
--   {
--     "id": "delivery",
--     "title": "Fast Delivery",
--     "description": "Quick and reliable shipping to your doorstep",
--     "icon": "Truck"
--   },
--   {
--     "id": "security",
--     "title": "Secure Shopping",
--     "description": "Your data and payments are always protected",
--     "icon": "Shield"
--   },
--   {
--     "id": "returns",
--     "title": "Easy Returns",
--     "description": "Hassle-free returns within 30 days",
--     "icon": "RefreshCw"
--   }
-- ]'::jsonb;
