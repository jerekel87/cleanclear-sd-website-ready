/*
  # Add Latitude and Longitude to Leads Table

  1. Changes
    - Add `latitude` column (double precision) for storing lead location latitude
    - Add `longitude` column (double precision) for storing lead location longitude
    - These columns will be used to display lead locations on a map in the admin dashboard

  2. Notes
    - Columns are nullable as existing leads won't have coordinates initially
    - Coordinates can be populated via geocoding service when leads are created or updated
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'latitude'
  ) THEN
    ALTER TABLE leads ADD COLUMN latitude double precision;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'longitude'
  ) THEN
    ALTER TABLE leads ADD COLUMN longitude double precision;
  END IF;
END $$;
