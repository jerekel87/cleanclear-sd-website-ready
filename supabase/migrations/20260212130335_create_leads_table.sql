/*
  # Create leads table for quote form submissions

  1. New Tables
    - `leads`
      - `id` (uuid, primary key)
      - `services` (text[], required) - Array of selected services
      - `property_type` (text) - Residential or Commercial
      - `stories` (text) - Number of stories (1, 2, 3+)
      - `square_footage` (text) - Approximate property/area size range
      - `solar_panel_count` (text) - Number of solar panels if applicable
      - `property_notes` (text) - Additional property details
      - `first_name` (text, required) - Contact first name
      - `last_name` (text, required) - Contact last name
      - `phone` (text, required) - Contact phone number
      - `email` (text, required) - Contact email address
      - `street_address` (text) - Service location street address
      - `city` (text) - Service location city
      - `zip_code` (text) - Service location zip code
      - `preferred_timeframe` (text) - When they want service (ASAP, This Week, etc.)
      - `preferred_time` (text) - Preferred time of day
      - `notes` (text) - Any additional notes from the customer
      - `status` (text) - Lead status for admin tracking (new, contacted, quoted, etc.)
      - `created_at` (timestamptz) - When the lead was submitted

  2. Security
    - Enable RLS on `leads` table
    - Add INSERT policy for anonymous users to submit leads from the public website
    - Add SELECT policy for authenticated users (admin) to view leads
    - Add UPDATE policy for authenticated users (admin) to update lead status

  3. Important Notes
    - The INSERT policy validates that required fields are present
    - Anonymous users can only insert, never read or modify leads
    - Authenticated admin users can read and update leads
*/

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  services text[] NOT NULL DEFAULT '{}',
  property_type text DEFAULT '',
  stories text DEFAULT '',
  square_footage text DEFAULT '',
  solar_panel_count text DEFAULT '',
  property_notes text DEFAULT '',
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  street_address text DEFAULT '',
  city text DEFAULT '',
  zip_code text DEFAULT '',
  preferred_timeframe text DEFAULT '',
  preferred_time text DEFAULT '',
  notes text DEFAULT '',
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public visitors can submit lead forms"
  ON leads
  FOR INSERT
  TO anon
  WITH CHECK (
    first_name IS NOT NULL AND first_name <> '' AND
    last_name IS NOT NULL AND last_name <> '' AND
    phone IS NOT NULL AND phone <> '' AND
    email IS NOT NULL AND email <> '' AND
    array_length(services, 1) > 0
  );

CREATE POLICY "Authenticated admins can view leads"
  ON leads
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Authenticated admins can update leads"
  ON leads
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL)
  WITH CHECK ((select auth.uid()) IS NOT NULL);
