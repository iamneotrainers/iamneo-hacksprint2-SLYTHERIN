-- Enhance Users Table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS profession_title TEXT,
ADD COLUMN IF NOT EXISTS profession_category TEXT,
ADD COLUMN IF NOT EXISTS about TEXT,
ADD COLUMN IF NOT EXISTS skills TEXT[],
ADD COLUMN IF NOT EXISTS languages JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS total_credits INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS projects_completed INTEGER DEFAULT 0;

-- User Education Table
CREATE TABLE IF NOT EXISTS user_education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  institution TEXT NOT NULL,
  degree TEXT,
  field_of_study TEXT,
  start_date DATE,
  end_date DATE, -- Null means "Present"
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Certifications Table
CREATE TABLE IF NOT EXISTS user_certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  organization TEXT NOT NULL,
  issue_date DATE,
  expiry_date DATE,
  credential_id TEXT,
  credential_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Portfolio Items Table (Auto & Manual)
CREATE TABLE IF NOT EXISTS portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL, -- Nullable for manual entries
  title TEXT NOT NULL,
  summary TEXT,
  skills TEXT[],
  category TEXT,
  token_amount INTEGER,
  client_rating INTEGER,
  client_review TEXT,
  thumbnail_url TEXT,
  origin TEXT CHECK (origin IN ('auto', 'manual')) DEFAULT 'manual',
  is_visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Credit Transactions Table
CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_education_user_id ON user_education(user_id);
CREATE INDEX IF NOT EXISTS idx_user_certifications_user_id ON user_certifications(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_user_id ON portfolio_items(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user_id ON credit_transactions(user_id);

-- RLS Policies

-- Enable RLS
ALTER TABLE user_education ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- Reading: Public for everyone (Profile is public)
CREATE POLICY "Public profiles are viewable by everyone" ON user_education FOR SELECT USING (true);
CREATE POLICY "Public certifications are viewable by everyone" ON user_certifications FOR SELECT USING (true);
CREATE POLICY "Public portfolios are viewable by everyone" ON portfolio_items FOR SELECT USING (true);
CREATE POLICY "Users can view own credits" ON credit_transactions FOR SELECT USING (auth.uid() = user_id);

-- Writing: Users can edit their own data
CREATE POLICY "Users can manage own education" ON user_education
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own certifications" ON user_certifications
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own portfolio" ON portfolio_items
  FOR ALL USING (auth.uid() = user_id);

-- Credits are system-managed mostly, but for now we allow insert if needed by server (service role)
-- preventing users from manually inserting credits via API directly (RLS defaults to deny if not explicitly allowed)
