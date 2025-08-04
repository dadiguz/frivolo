/*
  # Add email and job fields to users table

  1. Changes
    - Add `email` column (text, not null)
    - Add `job` column (text, not null, default 'Otro')
  
  2. Notes
    - Email field will store validated email addresses
    - Job field allows users to select from predefined options or enter custom job
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'email'
  ) THEN
    ALTER TABLE users ADD COLUMN email text NOT NULL DEFAULT '';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'job'
  ) THEN
    ALTER TABLE users ADD COLUMN job text NOT NULL DEFAULT 'Otro';
  END IF;
END $$;