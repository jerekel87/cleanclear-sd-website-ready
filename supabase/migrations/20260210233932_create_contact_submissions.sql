/*
  # Create contact submissions table

  1. New Tables
    - `contact_submissions`
      - `id` (uuid, primary key)
      - `name` (text, required) - Name of the person requesting a quote
      - `email` (text, required) - Contact email
      - `phone` (text) - Contact phone number
      - `service_type` (text) - Type of service requested
      - `message` (text) - Additional details about the request
      - `created_at` (timestamptz) - When the submission was created

  2. Security
    - Enable RLS on `contact_submissions` table
    - Add INSERT policy for anonymous users to submit contact forms
    - Add SELECT policy for authenticated users (admin) to view submissions
*/

CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text DEFAULT '',
  service_type text DEFAULT '',
  message text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a contact form"
  ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);
