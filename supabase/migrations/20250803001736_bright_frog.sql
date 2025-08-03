/*
  # Create users and saved searches tables

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `user_id` (text, unique) - Local storage ID
      - `name` (text)
      - `age` (integer)
      - `country` (text)
      - `monthly_salary` (numeric)
      - `hours_per_day` (numeric)
      - `days_per_week` (numeric)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `saved_searches`
      - `id` (uuid, primary key)
      - `user_id` (text) - References users.user_id
      - `product_name` (text)
      - `product_cost` (numeric)
      - `hours_needed` (numeric)
      - `hourly_wage` (numeric)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public access (no authentication required)
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text UNIQUE NOT NULL,
  name text NOT NULL,
  age integer NOT NULL,
  country text NOT NULL DEFAULT 'México',
  monthly_salary numeric NOT NULL,
  hours_per_day numeric NOT NULL,
  days_per_week numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS saved_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  product_name text NOT NULL,
  product_cost numeric NOT NULL,
  hours_needed numeric NOT NULL,
  hourly_wage numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no auth required)
CREATE POLICY "Allow all operations on users"
  ON users
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on saved_searches"
  ON saved_searches
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Add foreign key constraint
ALTER TABLE saved_searches 
ADD CONSTRAINT fk_saved_searches_user_id 
FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_user_id ON users(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_searches_user_id ON saved_searches(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_searches_created_at ON saved_searches(created_at DESC);