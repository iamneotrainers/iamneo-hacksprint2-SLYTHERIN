-- Add start_date and end_date columns to projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS start_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS end_date TIMESTAMPTZ;

-- Make duration nullable since we're moving to start_date/end_date
ALTER TABLE projects 
ALTER COLUMN duration DROP NOT NULL;

-- Create index for date-based queries
CREATE INDEX IF NOT EXISTS idx_projects_start_date ON projects(start_date);
CREATE INDEX IF NOT EXISTS idx_projects_end_date ON projects(end_date);
