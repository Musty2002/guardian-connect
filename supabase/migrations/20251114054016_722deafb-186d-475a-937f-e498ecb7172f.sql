-- Create threat_assessments table for AI threat detection
CREATE TABLE IF NOT EXISTS public.threat_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  threat_level TEXT NOT NULL CHECK (threat_level IN ('low', 'medium', 'high', 'critical')),
  threats TEXT[] NOT NULL,
  recommendations TEXT[] NOT NULL,
  location_data JSONB NOT NULL,
  alert_contacts BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.threat_assessments ENABLE ROW LEVEL SECURITY;

-- Users can view their own assessments
CREATE POLICY "Users can view their own threat assessments"
ON public.threat_assessments
FOR SELECT
USING (auth.uid() = user_id);

-- System can insert assessments
CREATE POLICY "System can insert threat assessments"
ON public.threat_assessments
FOR INSERT
WITH CHECK (true);

-- Index for better query performance
CREATE INDEX idx_threat_assessments_user_id ON public.threat_assessments(user_id);
CREATE INDEX idx_threat_assessments_created_at ON public.threat_assessments(created_at DESC);