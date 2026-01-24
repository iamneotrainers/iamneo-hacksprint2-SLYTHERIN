-- TrustLance Complete Database Schema with Demo Data
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('client', 'freelancer', 'both')),
  bio TEXT,
  location TEXT,
  avatar_url TEXT,
  wallet_address TEXT UNIQUE,
  paypal_email TEXT,
  balance DECIMAL(12, 2) DEFAULT 0,
  currency TEXT DEFAULT 'INR',
  rating DECIMAL(3, 2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  jobs_completed INTEGER DEFAULT 0,
  total_earnings DECIMAL(12, 2) DEFAULT 0,
  success_rate DECIMAL(5, 2) DEFAULT 0,
  membership_tier TEXT DEFAULT 'free' CHECK (membership_tier IN ('free', 'plus', 'premium')),
  bids_remaining INTEGER DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. PROJECTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  budget_type TEXT NOT NULL CHECK (budget_type IN ('fixed', 'hourly')),
  budget_range TEXT NOT NULL,
  budget_min DECIMAL(12, 2),
  budget_max DECIMAL(12, 2),
  duration TEXT NOT NULL,
  experience_level TEXT NOT NULL CHECK (experience_level IN ('beginner', 'intermediate', 'expert')),
  skills TEXT[] DEFAULT '{}',
  location_preference TEXT DEFAULT 'anywhere',
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
  status TEXT DEFAULT 'open' CHECK (status IN ('draft', 'open', 'in_progress', 'completed', 'cancelled')),
  hired_freelancer_id UUID REFERENCES users(id),
  time_remaining TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. PROJECT ATTACHMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS project_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. PROPOSALS (BIDS)
-- ============================================
CREATE TABLE IF NOT EXISTS proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  freelancer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cover_letter TEXT NOT NULL,
  proposed_budget DECIMAL(12, 2) NOT NULL,
  estimated_duration TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, freelancer_id)
);

-- ============================================
-- 5. MILESTONES
-- ============================================
CREATE TABLE IF NOT EXISTS milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(12, 2) NOT NULL,
  due_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'approved', 'rejected', 'paid')),
  submitted_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. SERVICES
-- ============================================
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  freelancer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  price DECIMAL(12, 2) NOT NULL,
  delivery_time TEXT NOT NULL,
  revisions INTEGER DEFAULT 3,
  status TEXT DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'deleted')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 7. TRANSACTIONS
-- ============================================
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id),
  amount DECIMAL(12, 2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('credit', 'debit')),
  category TEXT NOT NULL CHECK (category IN ('project_payment', 'withdrawal', 'deposit', 'platform_fee', 'refund')),
  description TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  payment_method TEXT CHECK (payment_method IN ('blockchain_escrow', 'paypal', 'bank_transfer', 'wallet')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 8. DISPUTES
-- ============================================
CREATE TABLE IF NOT EXISTS disputes (
  id TEXT PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  raised_by UUID NOT NULL REFERENCES users(id),
  project_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('CLIENT', 'FREELANCER')),
  amount DECIMAL(12, 2) NOT NULL,
  status TEXT DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'AWAITING_EVIDENCE', 'UNDER_REVIEW', 'RESOLVED', 'ESCALATED')),
  reason TEXT NOT NULL,
  outcome TEXT CHECK (outcome IN ('FREELANCER', 'CLIENT', 'PARTIAL')),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('BLOCKCHAIN_ESCROW', 'PAYPAL_PLATFORM_MANAGED')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 9. DISPUTE EVIDENCE
-- ============================================
CREATE TABLE IF NOT EXISTS dispute_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dispute_id TEXT NOT NULL REFERENCES disputes(id) ON DELETE CASCADE,
  submitted_by UUID NOT NULL REFERENCES users(id),
  evidence_text TEXT NOT NULL,
  attachments TEXT[],
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 10. MESSAGES
-- ============================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES users(id),
  recipient_id UUID NOT NULL REFERENCES users(id),
  project_id UUID REFERENCES projects(id),
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 11. NOTIFICATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('project', 'proposal', 'payment', 'dispute', 'message', 'system')),
  read BOOLEAN DEFAULT false,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 12. BOOKMARKS
-- ============================================
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, project_id)
);

-- ============================================
-- 13. BLOCKCHAIN ESCROWS
-- ============================================
CREATE TABLE IF NOT EXISTS blockchain_escrows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  contract_address TEXT NOT NULL,
  project_id_bytes32 TEXT NOT NULL,
  client_wallet TEXT NOT NULL,
  freelancer_wallet TEXT NOT NULL,
  total_amount DECIMAL(18, 8) NOT NULL,
  currency TEXT DEFAULT 'MATIC',
  network TEXT DEFAULT 'mumbai',
  status TEXT DEFAULT 'created' CHECK (status IN ('created', 'funded', 'completed', 'refunded', 'disputed')),
  tx_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 14. AI DISPUTE RECOMMENDATIONS
-- ============================================
CREATE TABLE IF NOT EXISTS ai_dispute_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dispute_id TEXT NOT NULL REFERENCES disputes(id) ON DELETE CASCADE,
  recommended_outcome TEXT NOT NULL CHECK (recommended_outcome IN ('FREELANCER', 'CLIENT', 'PARTIAL')),
  freelancer_percentage INTEGER DEFAULT 0,
  confidence_score INTEGER NOT NULL,
  reasoning TEXT NOT NULL,
  key_factors TEXT[] DEFAULT '{}',
  evidence_summary TEXT,
  admin_override BOOLEAN DEFAULT false,
  final_decision TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_proposals_project_id ON proposals(project_id);
CREATE INDEX IF NOT EXISTS idx_proposals_freelancer_id ON proposals(freelancer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_disputes_project_id ON disputes(project_id);
CREATE INDEX IF NOT EXISTS idx_blockchain_escrows_project_id ON blockchain_escrows(project_id);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_dispute ON ai_dispute_recommendations(dispute_id);

-- ============================================
-- TRIGGERS
-- ============================================

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to tables with updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_proposals_updated_at
  BEFORE UPDATE ON proposals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_disputes_updated_at
  BEFORE UPDATE ON disputes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_blockchain_escrows_updated_at
  BEFORE UPDATE ON blockchain_escrows
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Update user balance on transaction
CREATE OR REPLACE FUNCTION update_user_balance()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' THEN
    IF NEW.type = 'credit' THEN
      UPDATE users SET balance = balance + NEW.amount WHERE id = NEW.user_id;
    ELSIF NEW.type = 'debit' THEN
      UPDATE users SET balance = balance - NEW.amount WHERE id = NEW.user_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_balance_on_transaction
  AFTER INSERT OR UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_user_balance();

-- ============================================
-- DEMO DATA
-- ============================================

-- Demo Users
INSERT INTO users (email, name, username, role, bio, location, rating, total_reviews, jobs_completed, success_rate, balance) VALUES
('john.client@demo.com', 'John Smith', 'johnsmith', 'client', 'Tech startup founder looking for talented developers', 'San Francisco, USA', 4.8, 25, 12, 95.5, 5000),
('sarah.freelancer@demo.com', 'Sarah Chen', 'sarahchen', 'freelancer', 'Full-stack developer with 5 years experience', 'Mumbai, India', 4.9, 48, 45, 97.2, 2450),
('mike.freelancer@demo.com', 'Mike Rodriguez', 'mikero', 'freelancer', 'UI/UX designer specializing in modern web apps', 'Barcelona, Spain', 4.7, 32, 28, 94.0, 1800),
('priya.both@demo.com', 'Priya Sharma', 'priyasharma', 'both', 'Entrepreneur and developer', 'Bangalore, India', 4.6, 15, 10, 92.0, 3200);

-- Demo Projects
INSERT INTO projects (client_id, title, description, category, subcategory, budget_type, budget_range, budget_min, budget_max, duration, experience_level, skills, status, tags) VALUES
((SELECT id FROM users WHERE email = 'john.client@demo.com'), 
 'Build a responsive e-commerce website', 
 'I need a modern e-commerce website built with responsive design. The site should include product catalog, shopping cart, payment integration, and admin panel.',
 'development',
 'Web Development',
 'fixed',
 '1000-5000',
 1000,
 5000,
 '1-3 months',
 'intermediate',
 ARRAY['React', 'Node.js', 'MongoDB', 'Stripe'],
 'open',
 ARRAY['FEATURED', 'URGENT']),

((SELECT id FROM users WHERE email = 'john.client@demo.com'),
 'Mobile app UI/UX design',
 'Looking for an experienced designer to create modern, intuitive mobile app interfaces for iOS and Android.',
 'design',
 'UI/UX Design',
 'fixed',
 '500-1000',
 500,
 1000,
 '1-4 weeks',
 'expert',
 ARRAY['Figma', 'Adobe XD', 'Mobile Design'],
 'open',
 ARRAY['SEALED', 'NDA']),

((SELECT id FROM users WHERE email = 'priya.both@demo.com'),
 'Content writing for tech blog',
 'Need high-quality blog content for technology website. 10 articles, 1500+ words each.',
 'content',
 'Writing & Translation',
 'fixed',
 'under-500',
 100,
 500,
 'less-1-week',
 'intermediate',
 ARRAY['Content Writing', 'SEO', 'Tech Writing'],
 'in_progress',
 ARRAY['URGENT']);

-- Demo Proposals
INSERT INTO proposals (project_id, freelancer_id, cover_letter, proposed_budget, estimated_duration, status) VALUES
((SELECT id FROM projects WHERE title = 'Build a responsive e-commerce website'),
 (SELECT id FROM users WHERE email = 'sarah.freelancer@demo.com'),
 'Hello! I have 5+ years of experience building e-commerce platforms. I can deliver a fully responsive website with all requested features. My portfolio includes similar projects.',
 3500,
 '2 months',
 'pending'),

((SELECT id FROM projects WHERE title = 'Mobile app UI/UX design'),
 (SELECT id FROM users WHERE email = 'mike.freelancer@demo.com'),
 'I specialize in mobile app design with modern UI/UX principles. I can create pixel-perfect designs for both iOS and Android.',
 800,
 '3 weeks',
 'accepted');

-- Demo Services
INSERT INTO services (freelancer_id, title, category, description, price, delivery_time, revisions, status) VALUES
((SELECT id FROM users WHERE email = 'sarah.freelancer@demo.com'),
 'Full-Stack Web Development',
 'Web Development',
 'I will build a responsive web application using React and Node.js',
 2500,
 '14 days',
 3,
 'active'),

((SELECT id FROM users WHERE email = 'mike.freelancer@demo.com'),
 'Modern UI/UX Design',
 'Graphic Design',
 'Professional UI/UX design for web and mobile applications',
 1200,
 '7 days',
 5,
 'active');

-- Demo Transactions
INSERT INTO transactions (user_id, amount, type, category, description, status, payment_method) VALUES
((SELECT id FROM users WHERE email = 'sarah.freelancer@demo.com'),
 15000,
 'credit',
 'project_payment',
 'Project Payment - Website Development',
 'completed',
 'blockchain_escrow'),

((SELECT id FROM users WHERE email = 'sarah.freelancer@demo.com'),
 -5000,
 'debit',
 'withdrawal',
 'Withdrawal to Bank Account',
 'completed',
 'bank_transfer'),

((SELECT id FROM users WHERE email = 'mike.freelancer@demo.com'),
 8500,
 'credit',
 'project_payment',
 'Project Payment - Mobile App Design',
 'pending',
 'blockchain_escrow');

-- Demo Dispute
INSERT INTO disputes (id, project_id, raised_by, project_name, role, amount, status, reason, payment_method) VALUES
('DSP-001',
 (SELECT id FROM projects WHERE title = 'Content writing for tech blog'),
 (SELECT id FROM users WHERE email = 'priya.both@demo.com'),
 'Content writing for tech blog',
 'CLIENT',
 300,
 'UNDER_REVIEW',
 'Work quality does not match requirements. Articles need significant revisions.',
 'BLOCKCHAIN_ESCROW');

-- Demo Messages
INSERT INTO messages (sender_id, recipient_id, project_id, content, read) VALUES
((SELECT id FROM users WHERE email = 'john.client@demo.com'),
 (SELECT id FROM users WHERE email = 'sarah.freelancer@demo.com'),
 (SELECT id FROM projects WHERE title = 'Build a responsive e-commerce website'),
 'Hi Sarah, I reviewed your proposal and it looks great! Can we schedule a call to discuss the project timeline?',
 true),

((SELECT id FROM users WHERE email = 'sarah.freelancer@demo.com'),
 (SELECT id FROM users WHERE email = 'john.client@demo.com'),
 (SELECT id FROM projects WHERE title = 'Build a responsive e-commerce website'),
 'Sure! I''m available tomorrow at 3 PM EST. Does that work for you?',
 false);

-- Demo Notifications
INSERT INTO notifications (user_id, title, message, type, read) VALUES
((SELECT id FROM users WHERE email = 'john.client@demo.com'),
 'New Proposal Received',
 'Sarah Chen submitted a proposal for your project "Build a responsive e-commerce website"',
 'proposal',
 false),

((SELECT id FROM users WHERE email = 'sarah.freelancer@demo.com'),
 'Project Payment Released',
 'Payment of ₹15,000 has been released for completed project',
 'payment',
 true);

-- Success message
SELECT 'Database schema created successfully with demo data!' AS status;
SELECT 'Total users: ' || COUNT(*)::TEXT FROM users;
SELECT 'Total projects: ' || COUNT(*)::TEXT FROM projects;
SELECT 'Total proposals: ' || COUNT(*)::TEXT FROM proposals;
