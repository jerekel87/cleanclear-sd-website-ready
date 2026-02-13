/*
  # Create Customers Table

  1. New Tables
    - `customers`
      - `id` (uuid, primary key)
      - `first_name` (text, required)
      - `last_name` (text, required)
      - `email` (text)
      - `phone` (text)
      - `street_address` (text)
      - `city` (text)
      - `zip_code` (text)
      - `property_type` (text) - residential, commercial, etc.
      - `stories` (text)
      - `square_footage` (text)
      - `solar_panel_count` (text)
      - `tags` (text array) - residential, commercial, HOA, property manager
      - `notes` (text)
      - `source` (text) - website, referral, google, yelp, etc.
      - `lead_id` (uuid, FK to leads) - original lead if converted
      - `latitude` (double precision)
      - `longitude` (double precision)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `customers` table
    - Authenticated users can SELECT, INSERT, UPDATE, DELETE
*/

CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text DEFAULT '',
  phone text DEFAULT '',
  street_address text DEFAULT '',
  city text DEFAULT '',
  zip_code text DEFAULT '',
  property_type text DEFAULT '',
  stories text DEFAULT '',
  square_footage text DEFAULT '',
  solar_panel_count text DEFAULT '',
  tags text[] DEFAULT '{}',
  notes text DEFAULT '',
  source text DEFAULT 'website',
  lead_id uuid REFERENCES leads(id),
  latitude double precision,
  longitude double precision,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view customers"
  ON customers FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert customers"
  ON customers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update customers"
  ON customers FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete customers"
  ON customers FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);