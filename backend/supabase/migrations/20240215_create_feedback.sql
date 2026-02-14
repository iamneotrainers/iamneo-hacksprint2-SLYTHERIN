-- Create Feedback Table
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reviewee_id UUID REFERENCES users(id) ON DELETE CASCADE, -- Optional for now but good for direct user reviews
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_feedback_project_id ON feedback(project_id);
CREATE INDEX IF NOT EXISTS idx_feedback_reviewer_id ON feedback(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_feedback_reviewee_id ON feedback(reviewee_id);

-- Trigger for updated_at
CREATE TRIGGER update_feedback_updated_at
  BEFORE UPDATE ON feedback
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS Policies
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Everyone can read feedback
CREATE POLICY "Feedback is public" ON feedback
  FOR SELECT USING (true);

-- Authenticated users can create feedback
CREATE POLICY "Users can create feedback" ON feedback
  FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Users can update their own feedback
CREATE POLICY "Users can update own feedback" ON feedback
  FOR UPDATE USING (auth.uid() = reviewer_id);
