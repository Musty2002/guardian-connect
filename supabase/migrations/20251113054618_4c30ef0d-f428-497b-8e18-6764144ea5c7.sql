-- Create device tracking table for enhanced location tracking
CREATE TABLE public.device_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  accuracy DOUBLE PRECISION,
  battery_level INTEGER,
  network_info JSONB,
  device_status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on device_tracking
ALTER TABLE public.device_tracking ENABLE ROW LEVEL SECURITY;

-- Users can insert their own tracking data
CREATE POLICY "Users can insert own tracking data"
ON public.device_tracking
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can view their own tracking data
CREATE POLICY "Users can view own tracking data"
ON public.device_tracking
FOR SELECT
USING (auth.uid() = user_id);

-- Family members can view each other's tracking data
CREATE POLICY "Family can view member tracking data"
ON public.device_tracking
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM family_connections
    WHERE (parent_id = auth.uid() AND child_id = device_tracking.user_id AND status = 'active')
       OR (child_id = auth.uid() AND parent_id = device_tracking.user_id AND status = 'active')
  )
);

-- Users can update their own device status
CREATE POLICY "Users can update own device status"
ON public.device_tracking
FOR UPDATE
USING (auth.uid() = user_id);

-- Create device security events table
CREATE TABLE public.device_security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL,
  event_data JSONB,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on device_security_events
ALTER TABLE public.device_security_events ENABLE ROW LEVEL SECURITY;

-- Users can insert their own security events
CREATE POLICY "Users can insert own security events"
ON public.device_security_events
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can view their own security events
CREATE POLICY "Users can view own security events"
ON public.device_security_events
FOR SELECT
USING (auth.uid() = user_id);

-- Create backup logs table
CREATE TABLE public.backup_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  backup_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  file_size INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on backup_logs
ALTER TABLE public.backup_logs ENABLE ROW LEVEL SECURITY;

-- Users can view their own backup logs
CREATE POLICY "Users can view own backup logs"
ON public.backup_logs
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own backup logs
CREATE POLICY "Users can insert own backup logs"
ON public.backup_logs
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_device_tracking_user_id ON public.device_tracking(user_id);
CREATE INDEX idx_device_tracking_created_at ON public.device_tracking(created_at DESC);
CREATE INDEX idx_device_security_events_user_id ON public.device_security_events(user_id);
CREATE INDEX idx_backup_logs_user_id ON public.backup_logs(user_id);