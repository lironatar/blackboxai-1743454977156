-- Create task_lists table
CREATE TABLE IF NOT EXISTS task_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL CHECK (name <> ''),
  user_id UUID REFERENCES auth.users NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add list_id column to tasks table
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS list_id UUID REFERENCES task_lists(id);

-- Enable RLS for task_lists
ALTER TABLE task_lists ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for task_lists
CREATE POLICY "Users can view their own task lists" 
ON task_lists FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own task lists" 
ON task_lists FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own task lists" 
ON task_lists FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own task lists" 
ON task_lists FOR DELETE 
USING (auth.uid() = user_id);

-- Update RLS policies for tasks to include list_id
CREATE OR REPLACE POLICY "Users can view their own tasks" 
ON tasks FOR SELECT 
USING (auth.uid() = user_id);

CREATE OR REPLACE POLICY "Users can insert their own tasks" 
ON tasks FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE POLICY "Users can update their own tasks" 
ON tasks FOR UPDATE 
USING (auth.uid() = user_id);

CREATE OR REPLACE POLICY "Users can delete their own tasks" 
ON tasks FOR DELETE 
USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_task_lists_user_id ON task_lists(user_id);
CREATE INDEX idx_tasks_list_id ON tasks(list_id);