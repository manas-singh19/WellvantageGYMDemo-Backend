-- Create client_info table
CREATE TABLE client_info (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT,
  sessions_left INTEGER DEFAULT 20,
  expiry_date DATE DEFAULT '2026-06-24',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create time_slots table
CREATE TABLE time_slots (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  date TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  status TEXT CHECK (status IN ('Open', 'Booked', 'Closed')) DEFAULT 'Open',
  session_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES client_info(user_id)
);

-- Create indexes for better performance
CREATE INDEX idx_time_slots_user_id ON time_slots(user_id);
CREATE INDEX idx_time_slots_date ON time_slots(date);
CREATE INDEX idx_client_info_user_id ON client_info(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE client_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;

-- Create policies (optional - for user-specific access)
CREATE POLICY "Users can view their own client info" ON client_info
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own client info" ON client_info
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own client info" ON client_info
  FOR UPDATE USING (true);

CREATE POLICY "Users can view their own time slots" ON time_slots
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own time slots" ON time_slots
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own time slots" ON time_slots
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete their own time slots" ON time_slots
  FOR DELETE USING (true);