/*
  # Create feedback table for Relatify

  1. New Tables
    - `profile_feedback`
      - `id` (uuid, primary key) - Unique identifier
      - `profile_text` (text) - The dating profile that was analyzed
      - `accuracy_rating` (text) - User's accuracy rating: 'accurate', 'somewhat', 'inaccurate'
      - `comment` (text, optional) - User's optional feedback comment
      - `created_at` (timestamptz) - When feedback was submitted
  
  2. Security
    - Enable RLS on `profile_feedback` table
    - Add policy for anonymous users to insert feedback (write-only)
    - No read policies needed (admin-only access)
  
  3. Notes
    - Anonymous feedback submission to encourage honest responses
    - No user authentication required for this early-stage tool
*/

CREATE TABLE IF NOT EXISTS profile_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_text text NOT NULL,
  accuracy_rating text NOT NULL CHECK (accuracy_rating IN ('accurate', 'somewhat', 'inaccurate')),
  comment text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profile_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit feedback"
  ON profile_feedback
  FOR INSERT
  TO anon
  WITH CHECK (true);