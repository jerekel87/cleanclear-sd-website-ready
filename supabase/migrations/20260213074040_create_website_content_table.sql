/*
  # Create website_content table for editable website sections

  1. New Tables
    - `website_content`
      - `id` (uuid, primary key)
      - `section_key` (text, unique) - Identifier for the website section (hero, about, services, etc.)
      - `content` (jsonb) - Flexible JSON storage for section-specific content fields
      - `updated_at` (timestamptz) - When the content was last modified
      - `updated_by` (uuid) - Reference to the authenticated user who made the change

  2. Security
    - Enable RLS on `website_content` table
    - Add SELECT policy for anonymous users to read content (public website needs to display it)
    - Add SELECT policy for authenticated users to read content (admin editing)
    - Add INSERT policy for authenticated users to create content entries
    - Add UPDATE policy for authenticated users to modify content

  3. Important Notes
    - The section_key is unique to ensure one content record per section
    - Content is stored as JSONB for maximum flexibility per section type
    - Anonymous users can only read, never modify content
    - Only authenticated admin users can insert and update content
*/

CREATE TABLE IF NOT EXISTS website_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text UNIQUE NOT NULL,
  content jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

ALTER TABLE website_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read website content"
  ON website_content
  FOR SELECT
  TO anon
  USING (section_key IS NOT NULL AND section_key <> '');

CREATE POLICY "Authenticated users can read website content"
  ON website_content
  FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert website content"
  ON website_content
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update website content"
  ON website_content
  FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);
