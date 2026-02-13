/*
  # Create Jobs Table

  1. New Tables
    - `jobs`
      - `id` (uuid, primary key)
      - `customer_id` (uuid, FK to customers, required)
      - `title` (text, required)
      - `services` (text array)
      - `status` (text) - scheduled, in_progress, completed, cancelled
      - `scheduled_date` (date, required)
      - `scheduled_time` (text)
      - `estimated_duration` (integer, minutes)
      - `notes` (text)
      - `crew_notes` (text)
      - `price` (numeric)
      - `completed_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `jobs` table
    - Authenticated users can SELECT, INSERT, UPDATE, DELETE

  3. Important Notes
    - Jobs are linked to customers, not leads
    - A lead must be converted to a customer before scheduling jobs
    - Status workflow: scheduled -> in_progress -> completed (or cancelled)
*/

CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id) NOT NULL,
  title text NOT NULL,
  services text[] DEFAULT '{}',
  status text DEFAULT 'scheduled',
  scheduled_date date NOT NULL,
  scheduled_time text DEFAULT '',
  estimated_duration integer DEFAULT 60,
  notes text DEFAULT '',
  crew_notes text DEFAULT '',
  price numeric(10,2),
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view jobs"
  ON jobs FOR SELECT
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert jobs"
  ON jobs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update jobs"
  ON jobs FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete jobs"
  ON jobs FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);