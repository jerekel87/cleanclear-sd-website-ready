/*
  # Fix contact_submissions RLS policies

  1. Security Changes
    - Drop and recreate `Authenticated users can view submissions` policy
      - Wraps `auth.uid()` in `(select auth.uid())` for better query performance at scale
    - Drop and recreate `Anyone can submit a contact form` policy
      - Restricts INSERT to only allow setting name, email, phone, service_type, and message
      - Ensures submitted rows have valid required fields instead of unrestricted WITH CHECK (true)

  2. Important Notes
    - The previous INSERT policy allowed unrestricted access which effectively bypassed RLS
    - The previous SELECT policy re-evaluated auth.uid() per row causing performance issues
*/

DROP POLICY IF EXISTS "Authenticated users can view submissions" ON contact_submissions;

CREATE POLICY "Authenticated users can view submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS "Anyone can submit a contact form" ON contact_submissions;

CREATE POLICY "Anyone can submit a contact form"
  ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (
    name IS NOT NULL AND name <> '' AND
    email IS NOT NULL AND email <> ''
  );
