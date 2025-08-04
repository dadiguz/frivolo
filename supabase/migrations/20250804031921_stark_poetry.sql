/*
  # Add email column to users table

  1. Changes
    - Add `email` column to `users` table
    - Column is required (NOT NULL) with no default value
    - Column type is text for storing email addresses

  2. Notes
    - This migration adds the missing email column that the application expects
    - The column is set as NOT NULL since email is required in the application
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'email'
  ) THEN
    ALTER TABLE users ADD COLUMN email text NOT NULL DEFAULT '';
    
    -- Remove the default after adding the column to ensure future inserts require email
    ALTER TABLE users ALTER COLUMN email DROP DEFAULT;
  END IF;
END $$;