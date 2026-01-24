-- Row Level Security Policies for TrustLance
-- Run this AFTER schema.sql

-- ============================================
-- USERS TABLE POLICIES
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- PROJECTS TABLE POLICIES
-- ============================================
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public projects are viewable"
  ON projects FOR SELECT
  USING (visibility = 'public' OR client_id = auth.uid());

CREATE POLICY "Clients can create projects"
  ON projects FOR INSERT
  WITH CHECK (client_id = auth.uid());

CREATE POLICY "Clients can update own projects"
  ON projects FOR UPDATE
  USING (client_id = auth.uid());

CREATE POLICY "Clients can delete own projects"
  ON projects FOR DELETE
  USING (client_id = auth.uid());

-- ============================================
-- PROPOSALS TABLE POLICIES
-- ============================================
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view relevant proposals"
  ON proposals FOR SELECT
  USING (
    freelancer_id = auth.uid() OR
    project_id IN (SELECT id FROM projects WHERE client_id = auth.uid())
  );

CREATE POLICY "Freelancers can create proposals"
  ON proposals FOR INSERT
  WITH CHECK (freelancer_id = auth.uid());

CREATE POLICY "Freelancers can update own proposals"
  ON proposals FOR UPDATE
  USING (freelancer_id = auth.uid() AND status = 'pending');

CREATE POLICY "Clients can update proposals on their projects"
  ON proposals FOR UPDATE
  USING (project_id IN (SELECT id FROM projects WHERE client_id = auth.uid()));

-- ============================================
-- MILESTONES TABLE POLICIES
-- ============================================
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view milestones for their projects"
  ON milestones FOR SELECT
  USING (
    project_id IN (
      SELECT id FROM projects 
      WHERE client_id = auth.uid() OR hired_freelancer_id = auth.uid()
    )
  );

CREATE POLICY "Clients can create milestones"
  ON milestones FOR INSERT
  WITH CHECK (
    project_id IN (SELECT id FROM projects WHERE client_id = auth.uid())
  );

CREATE POLICY "Clients can update milestones"
  ON milestones FOR UPDATE
  USING (
    project_id IN (SELECT id FROM projects WHERE client_id = auth.uid())
  );

-- ============================================
-- TRANSACTIONS TABLE POLICIES
-- ============================================
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (user_id = auth.uid());

-- ============================================
-- DISPUTES TABLE POLICIES
-- ============================================
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view relevant disputes"
  ON disputes FOR SELECT
  USING (
    raised_by = auth.uid() OR
    project_id IN (
      SELECT id FROM projects 
      WHERE client_id = auth.uid() OR hired_freelancer_id = auth.uid()
    )
  );

CREATE POLICY "Users can create disputes"
  ON disputes FOR INSERT
  WITH CHECK (raised_by = auth.uid());

-- ============================================
-- MESSAGES TABLE POLICIES
-- ============================================
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own messages"
  ON messages FOR SELECT
  USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  WITH CHECK (sender_id = auth.uid());

-- ============================================
-- NOTIFICATIONS TABLE POLICIES
-- ============================================
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());

-- ============================================
-- BOOKMARKS TABLE POLICIES
-- ============================================
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own bookmarks"
  ON bookmarks FOR ALL
  USING (user_id = auth.uid());

-- ============================================
-- SERVICES TABLE POLICIES
-- ============================================
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active services are viewable by all"
  ON services FOR SELECT
  USING (status = 'active' OR freelancer_id = auth.uid());

CREATE POLICY "Freelancers can manage own services"
  ON services FOR ALL
  USING (freelancer_id = auth.uid());

-- ============================================
-- BLOCKCHAIN ESCROWS TABLE POLICIES
-- ============================================
ALTER TABLE blockchain_escrows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view escrows for their projects"
  ON blockchain_escrows FOR SELECT
  USING (
    project_id IN (
      SELECT id FROM projects 
      WHERE client_id = auth.uid() OR hired_freelancer_id = auth.uid()
    )
  );

-- ============================================
-- AI RECOMMENDATIONS TABLE POLICIES
-- ============================================
ALTER TABLE ai_dispute_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view AI recommendations for their disputes"
  ON ai_dispute_recommendations FOR SELECT
  USING (
    dispute_id IN (
      SELECT id FROM disputes 
      WHERE raised_by = auth.uid() OR
      project_id IN (
        SELECT id FROM projects 
        WHERE client_id = auth.uid() OR hired_freelancer_id = auth.uid()
      )
    )
  );

-- Success message
SELECT 'RLS policies applied successfully!' AS status;
