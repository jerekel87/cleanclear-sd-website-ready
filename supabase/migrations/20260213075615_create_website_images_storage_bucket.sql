/*
  # Create storage bucket for website images

  1. Storage
    - Creates 'website-images' public bucket for storing gallery before/after images
    - 5MB file size limit
    - Allows JPEG, PNG, WebP, and GIF formats

  2. Security Policies
    - Anyone can view images (public bucket for website display)
    - Authenticated users can upload, update, and delete images
*/

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'website-images',
  'website-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view website images"
  ON storage.objects FOR SELECT
  TO anon
  USING (bucket_id = 'website-images');

CREATE POLICY "Authenticated users can view website images"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'website-images');

CREATE POLICY "Authenticated users can upload website images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'website-images');

CREATE POLICY "Authenticated users can update website images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'website-images')
  WITH CHECK (bucket_id = 'website-images');

CREATE POLICY "Authenticated users can delete website images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'website-images');
