/*
  # Add email column to users table

  1. Changes
    - Add `email` column to `users` table
    - Set as NOT NULL with empty string default for existing records
    - Remove default after adding column to ensure future records require email

  2. Security
    - No changes to RLS policies needed
*/

-- Add email column with temporary default
ALTER TABLE users ADD COLUMN IF NOT EXISTS email text DEFAULT '';

-- Update any existing records that might have empty email
UPDATE users SET email = '' WHERE email IS NULL;

-- Make the column NOT NULL
ALTER TABLE users ALTER COLUMN email SET NOT NULL;

-- Remove the default so future inserts require email
ALTER TABLE users ALTER COLUMN email DROP DEFAULT;