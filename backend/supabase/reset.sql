-- Clean Reset Script - Run this FIRST to clear everything
-- This will drop all tables and start fresh

-- Drop tables in reverse order (to handle foreign keys)
DROP TABLE IF EXISTS ai_dispute_recommendations CASCADE;
DROP TABLE IF EXISTS blockchain_escrows CASCADE;
DROP TABLE IF EXISTS bookmarks CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS dispute_evidence CASCADE;
DROP TABLE IF EXISTS disputes CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS milestones CASCADE;
DROP TABLE IF EXISTS proposals CASCADE;
DROP TABLE IF EXISTS project_attachments CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS update_updated_at() CASCADE;
DROP FUNCTION IF EXISTS update_user_balance() CASCADE;

-- Success message
SELECT 'All tables and functions dropped successfully! Now run schema.sql' AS status;
