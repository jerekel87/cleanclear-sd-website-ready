/*
  # Create site_images table for storing website images

  1. New Tables
    - `site_images`
      - `key` (text, primary key) - unique identifier like 'hero-bg'
      - `image_data` (text) - base64-encoded image data
      - `content_type` (text) - MIME type e.g. 'image/jpeg'
      - `is_public` (boolean) - whether the image is publicly viewable
      - `updated_at` (timestamptz) - last update timestamp

  2. Security
    - Enable RLS on `site_images` table
    - Add policy for public (anon + authenticated) to read images marked as public
    - Write access is restricted to service role (edge functions)
*/

CREATE TABLE IF NOT EXISTS site_images (
  key TEXT PRIMARY KEY,
  image_data TEXT NOT NULL,
  content_type TEXT NOT NULL DEFAULT 'image/jpeg',
  is_public BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE site_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public images are viewable by everyone"
  ON site_images FOR SELECT
  TO anon, authenticated
  USING (is_public = true);
