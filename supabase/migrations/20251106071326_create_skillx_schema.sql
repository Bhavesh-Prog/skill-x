/*
  # SkillX Database Schema

  ## Overview
  This migration creates the complete database schema for the SkillX peer-to-peer learning platform.
  
  ## New Tables
  
  ### 1. users
  - `id` (uuid, primary key) - Unique user identifier
  - `name` (text) - User's full name
  - `email` (text, unique) - User's email address
  - `password` (text) - Hashed password
  - `role` (text) - User role: 'student' or 'faculty'
  - `student_type` (text, nullable) - For students: 'learner', 'mentor', or 'both'
  - `created_at` (timestamptz) - Account creation timestamp
  
  ### 2. skills
  - `id` (uuid, primary key) - Unique skill identifier
  - `mentor_id` (uuid, foreign key) - Reference to user who teaches this skill
  - `mentor_name` (text) - Cached mentor name for display
  - `title` (text) - Skill title
  - `description` (text) - Detailed skill description
  - `category` (text) - Skill category
  - `price` (numeric) - Price per session in rupees
  - `status` (text) - Verification status: 'pending', 'approved', or 'rejected'
  - `rejection_reason` (text, nullable) - Reason if rejected
  - `created_at` (timestamptz) - Submission timestamp
  
  ### 3. videos
  - `id` (uuid, primary key) - Unique video identifier
  - `skill_id` (uuid, foreign key) - Associated skill
  - `mentor_id` (uuid, foreign key) - Video uploader
  - `title` (text) - Video title
  - `file_name` (text) - Original file name
  - `uploaded_at` (timestamptz) - Upload timestamp
  
  ### 4. enrollments
  - `id` (uuid, primary key) - Unique enrollment identifier
  - `learner_id` (uuid, foreign key) - Student enrolling
  - `learner_name` (text) - Cached learner name
  - `mentor_id` (uuid, foreign key) - Skill mentor
  - `mentor_name` (text) - Cached mentor name
  - `skill_id` (uuid, foreign key) - Enrolled skill
  - `skill_title` (text) - Cached skill title
  - `price` (numeric) - Paid price
  - `enrolled_at` (timestamptz) - Enrollment timestamp
  - `completed` (boolean) - Completion status
  - `feedback` (text, nullable) - Learner feedback
  
  ### 5. payments
  - `id` (uuid, primary key) - Unique payment identifier
  - `learner_id` (uuid, foreign key) - Student making payment
  - `mentor_id` (uuid, foreign key) - Recipient mentor
  - `skill_id` (uuid, foreign key) - Associated skill
  - `amount` (numeric) - Payment amount
  - `status` (text) - Payment status: 'pending', 'completed', or 'failed'
  - `transaction_date` (timestamptz) - Payment timestamp
  
  ### 6. verifications
  - `id` (uuid, primary key) - Unique verification session identifier
  - `skill_id` (uuid, foreign key) - Skill being verified
  - `faculty_id` (uuid, foreign key) - Faculty conducting verification
  - `faculty_name` (text) - Cached faculty name
  - `scheduled_date` (timestamptz) - Session date/time
  - `completed` (boolean) - Session completion status
  - `remarks` (text, nullable) - Faculty remarks
  
  ### 7. notifications
  - `id` (uuid, primary key) - Unique notification identifier
  - `user_id` (uuid, foreign key) - Recipient user
  - `message` (text) - Notification message
  - `type` (text) - Notification type: 'info', 'success', or 'warning'
  - `read` (boolean) - Read status
  - `created_at` (timestamptz) - Creation timestamp
  
  ## Security
  - Row Level Security (RLS) is enabled on all tables
  - Policies enforce that users can only access their own data
  - Faculty have additional permissions to view and manage skills
  - Public read access for approved skills only
  
  ## Important Notes
  1. All tables use UUID primary keys with automatic generation
  2. Timestamps default to current time
  3. Boolean fields default to false
  4. Foreign key constraints maintain referential integrity
  5. Indexes are created on frequently queried columns
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  role text NOT NULL CHECK (role IN ('student', 'faculty')),
  student_type text CHECK (student_type IN ('learner', 'mentor', 'both')),
  created_at timestamptz DEFAULT now()
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mentor_name text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  rejection_reason text,
  created_at timestamptz DEFAULT now()
);

-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id uuid NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  mentor_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  file_name text NOT NULL,
  uploaded_at timestamptz DEFAULT now()
);

-- Create enrollments table
CREATE TABLE IF NOT EXISTS enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  learner_name text NOT NULL,
  mentor_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mentor_name text NOT NULL,
  skill_id uuid NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  skill_title text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  enrolled_at timestamptz DEFAULT now(),
  completed boolean DEFAULT false,
  feedback text
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mentor_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  skill_id uuid NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  amount numeric NOT NULL CHECK (amount >= 0),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  transaction_date timestamptz DEFAULT now()
);

-- Create verifications table
CREATE TABLE IF NOT EXISTS verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id uuid NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  faculty_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  faculty_name text NOT NULL,
  scheduled_date timestamptz NOT NULL,
  completed boolean DEFAULT false,
  remarks text
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message text NOT NULL,
  type text NOT NULL CHECK (type IN ('info', 'success', 'warning')),
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_skills_mentor_id ON skills(mentor_id);
CREATE INDEX IF NOT EXISTS idx_skills_status ON skills(status);
CREATE INDEX IF NOT EXISTS idx_videos_skill_id ON videos(skill_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_learner_id ON enrollments(learner_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_mentor_id ON enrollments(mentor_id);
CREATE INDEX IF NOT EXISTS idx_payments_learner_id ON payments(learner_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);

-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Anyone can register"
  ON users FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- RLS Policies for skills table
CREATE POLICY "Anyone can view approved skills"
  ON skills FOR SELECT
  TO authenticated, anon
  USING (status = 'approved' OR mentor_id = auth.uid());

CREATE POLICY "Mentors can create skills"
  ON skills FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = mentor_id);

CREATE POLICY "Mentors can view own skills"
  ON skills FOR SELECT
  TO authenticated
  USING (mentor_id = auth.uid());

CREATE POLICY "Faculty can view all skills"
  ON skills FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'faculty'
    )
  );

CREATE POLICY "Faculty can update skill status"
  ON skills FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'faculty'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'faculty'
    )
  );

-- RLS Policies for videos table
CREATE POLICY "Mentors can view own videos"
  ON videos FOR SELECT
  TO authenticated
  USING (mentor_id = auth.uid());

CREATE POLICY "Enrolled learners can view videos"
  ON videos FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.skill_id = videos.skill_id
      AND enrollments.learner_id = auth.uid()
    )
  );

CREATE POLICY "Faculty can view all videos"
  ON videos FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'faculty'
    )
  );

CREATE POLICY "Mentors can upload videos"
  ON videos FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = mentor_id);

CREATE POLICY "Mentors can delete own videos"
  ON videos FOR DELETE
  TO authenticated
  USING (mentor_id = auth.uid());

-- RLS Policies for enrollments table
CREATE POLICY "Learners can view own enrollments"
  ON enrollments FOR SELECT
  TO authenticated
  USING (learner_id = auth.uid());

CREATE POLICY "Mentors can view their students"
  ON enrollments FOR SELECT
  TO authenticated
  USING (mentor_id = auth.uid());

CREATE POLICY "Learners can create enrollments"
  ON enrollments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = learner_id);

CREATE POLICY "Learners can update own enrollments"
  ON enrollments FOR UPDATE
  TO authenticated
  USING (learner_id = auth.uid())
  WITH CHECK (learner_id = auth.uid());

-- RLS Policies for payments table
CREATE POLICY "Learners can view own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (learner_id = auth.uid());

CREATE POLICY "Mentors can view their earnings"
  ON payments FOR SELECT
  TO authenticated
  USING (mentor_id = auth.uid());

CREATE POLICY "Learners can create payments"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = learner_id);

CREATE POLICY "Faculty can view all payments"
  ON payments FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'faculty'
    )
  );

-- RLS Policies for verifications table
CREATE POLICY "Faculty can manage verifications"
  ON verifications FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'faculty'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'faculty'
    )
  );

CREATE POLICY "Mentors can view verifications for their skills"
  ON verifications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM skills
      WHERE skills.id = verifications.skill_id
      AND skills.mentor_id = auth.uid()
    )
  );

-- RLS Policies for notifications table
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);