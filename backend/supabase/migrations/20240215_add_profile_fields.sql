-- Add missing profile fields to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS hourly_rate DECIMAL(10, 2), -- Supports currency like 50.00
ADD COLUMN IF NOT EXISTS company TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT; -- User showed phone in screenshot, might be useful

-- Add comment
COMMENT ON COLUMN users.hourly_rate IS 'Hourly rate in platform currency (SHM)';
