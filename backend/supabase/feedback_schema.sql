-- ============================================
-- TWO-WAY FEEDBACK SYSTEM SCHEMA
-- ============================================
-- This schema supports bidirectional feedback between clients and freelancers
-- plus platform feedback from both parties

-- ============================================
-- 1. FREELANCER FEEDBACK (From Clients)
-- ============================================
CREATE TABLE IF NOT EXISTS freelancer_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
  from_user_id UUID NOT NULL REFERENCES users(id), -- Client who gave feedback
  to_user_id UUID NOT NULL REFERENCES users(id),   -- Freelancer receiving feedback
  rating DECIMAL(2, 1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
  review TEXT NOT NULL,
  would_work_again BOOLEAN DEFAULT NULL,
  
  -- Multi-criteria ratings
  communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
  quality_rating INTEGER CHECK (quality_rating >= 1 AND quality_rating <= 5),
  timeliness_rating INTEGER CHECK (timeliness_rating >= 1 AND timeliness_rating <= 5),
  professionalism_rating INTEGER CHECK (professionalism_rating >= 1 AND professionalism_rating <= 5),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure one feedback per contract from each client
  UNIQUE(contract_id, from_user_id)
);

-- ============================================
-- 2. CLIENT FEEDBACK (From Freelancers)
-- ============================================
CREATE TABLE IF NOT EXISTS client_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
  from_user_id UUID NOT NULL REFERENCES users(id), -- Freelancer who gave feedback
  to_user_id UUID NOT NULL REFERENCES users(id),   -- Client receiving feedback
  rating DECIMAL(2, 1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
  review TEXT NOT NULL,
  would_work_again BOOLEAN DEFAULT NULL,
  
  -- Multi-criteria ratings for clients
  communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
  clarity_rating INTEGER CHECK (clarity_rating >= 1 AND clarity_rating <= 5),
  payment_timeliness_rating INTEGER CHECK (payment_timeliness_rating >= 1 AND payment_timeliness_rating <= 5),
  overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure one feedback per contract from each freelancer
  UNIQUE(contract_id, from_user_id)
);

-- ============================================
-- 3. PLATFORM FEEDBACK
-- ============================================
CREATE TABLE IF NOT EXISTS platform_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
  user_role TEXT NOT NULL CHECK (user_role IN ('CLIENT', 'FREELANCER')),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_freelancer_feedback_to_user ON freelancer_feedback(to_user_id);
CREATE INDEX IF NOT EXISTS idx_freelancer_feedback_from_user ON freelancer_feedback(from_user_id);
CREATE INDEX IF NOT EXISTS idx_freelancer_feedback_contract ON freelancer_feedback(contract_id);
CREATE INDEX IF NOT EXISTS idx_freelancer_feedback_project ON freelancer_feedback(project_id);

CREATE INDEX IF NOT EXISTS idx_client_feedback_to_user ON client_feedback(to_user_id);
CREATE INDEX IF NOT EXISTS idx_client_feedback_from_user ON client_feedback(from_user_id);
CREATE INDEX IF NOT EXISTS idx_client_feedback_contract ON client_feedback(contract_id);
CREATE INDEX IF NOT EXISTS idx_client_feedback_project ON client_feedback(project_id);

CREATE INDEX IF NOT EXISTS idx_platform_feedback_user ON platform_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_platform_feedback_contract ON platform_feedback(contract_id);

-- ============================================
-- 5. TRIGGERS TO UPDATE USER RATINGS
-- ============================================

-- Trigger function to update freelancer rating
CREATE OR REPLACE FUNCTION update_freelancer_rating()
RETURNS TRIGGER AS $$
DECLARE
  new_rating DECIMAL(3, 2);
  new_count INTEGER;
BEGIN
  -- Calculate new average rating from freelancer_feedback
  SELECT 
    COALESCE(AVG(rating), 0), 
    COUNT(*) 
  INTO 
    new_rating, 
    new_count
  FROM freelancer_feedback 
  WHERE to_user_id = NEW.to_user_id;

  -- Update user table
  UPDATE users 
  SET 
    rating = new_rating,
    total_reviews = new_count
  WHERE id = NEW.to_user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for freelancer feedback
CREATE TRIGGER on_freelancer_feedback_submitted
  AFTER INSERT OR UPDATE ON freelancer_feedback
  FOR EACH ROW EXECUTE FUNCTION update_freelancer_rating();

-- Note: For client ratings, we could create a separate rating column in users table
-- For now, the primary rating field will be for freelancers only

-- ============================================
-- 6. MODIFY CONTRACTS TABLE
-- ============================================
-- Add feedback_pending column to track who still needs to submit feedback
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS feedback_pending JSONB DEFAULT '{"client": true, "freelancer": true}';

-- Add index for feedback_pending queries
CREATE INDEX IF NOT EXISTS idx_contracts_feedback_pending ON contracts((feedback_pending->>'client'), (feedback_pending->>'freelancer'));

-- ============================================
-- 7. TRIGGERS FOR UPDATED_AT
-- ============================================
CREATE TRIGGER update_freelancer_feedback_updated_at
  BEFORE UPDATE ON freelancer_feedback
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_client_feedback_updated_at
  BEFORE UPDATE ON client_feedback
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 8. ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE freelancer_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_feedback ENABLE ROW LEVEL SECURITY;

-- Users can view feedback they gave or received
CREATE POLICY "Users can view their freelancer feedback" ON freelancer_feedback
  FOR SELECT USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Users can view their client feedback" ON client_feedback
  FOR SELECT USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

CREATE POLICY "Users can view their platform feedback" ON platform_feedback
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert feedback IF they are part of the contract
CREATE POLICY "Users can insert freelancer feedback" ON freelancer_feedback
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM contracts 
      WHERE id = contract_id 
      AND client_id = auth.uid()
      AND from_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert client feedback" ON client_feedback
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM contracts 
      WHERE id = contract_id 
      AND freelancer_id = auth.uid()
      AND from_user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert platform feedback" ON platform_feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- 9. HELPER FUNCTIONS
-- ============================================

-- Function to check if user has submitted feedback for a contract
CREATE OR REPLACE FUNCTION has_submitted_feedback(
  p_contract_id UUID,
  p_user_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  is_client BOOLEAN;
  feedback_exists BOOLEAN;
BEGIN
  -- Check if user is client or freelancer for this contract
  SELECT client_id = p_user_id INTO is_client
  FROM contracts
  WHERE id = p_contract_id;

  IF is_client THEN
    -- Check freelancer_feedback
    SELECT EXISTS(
      SELECT 1 FROM freelancer_feedback 
      WHERE contract_id = p_contract_id AND from_user_id = p_user_id
    ) INTO feedback_exists;
  ELSE
    -- Check client_feedback
    SELECT EXISTS(
      SELECT 1 FROM client_feedback 
      WHERE contract_id = p_contract_id AND from_user_id = p_user_id
    ) INTO feedback_exists;
  END IF;

  RETURN feedback_exists;
END;
$$ LANGUAGE plpgsql;

-- Function to get average rating for a user (as freelancer)
CREATE OR REPLACE FUNCTION get_freelancer_rating(p_user_id UUID)
RETURNS TABLE(
  avg_rating DECIMAL(3, 2),
  total_reviews INTEGER,
  avg_communication DECIMAL(3, 2),
  avg_quality DECIMAL(3, 2),
  avg_timeliness DECIMAL(3, 2),
  avg_professionalism DECIMAL(3, 2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(AVG(rating), 0)::DECIMAL(3, 2),
    COUNT(*)::INTEGER,
    COALESCE(AVG(communication_rating), 0)::DECIMAL(3, 2),
    COALESCE(AVG(quality_rating), 0)::DECIMAL(3, 2),
    COALESCE(AVG(timeliness_rating), 0)::DECIMAL(3, 2),
    COALESCE(AVG(professionalism_rating), 0)::DECIMAL(3, 2)
  FROM freelancer_feedback
  WHERE to_user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get average rating for a user (as client)
CREATE OR REPLACE FUNCTION get_client_rating(p_user_id UUID)
RETURNS TABLE(
  avg_rating DECIMAL(3, 2),
  total_reviews INTEGER,
  avg_communication DECIMAL(3, 2),
  avg_clarity DECIMAL(3, 2),
  avg_payment_timeliness DECIMAL(3, 2),
  avg_overall DECIMAL(3, 2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(AVG(rating), 0)::DECIMAL(3, 2),
    COUNT(*)::INTEGER,
    COALESCE(AVG(communication_rating), 0)::DECIMAL(3, 2),
    COALESCE(AVG(clarity_rating), 0)::DECIMAL(3, 2),
    COALESCE(AVG(payment_timeliness_rating), 0)::DECIMAL(3, 2),
    COALESCE(AVG(overall_rating), 0)::DECIMAL(3, 2)
  FROM client_feedback
  WHERE to_user_id = p_user_id;
END;
$$ LANGUAGE plpgsql;
