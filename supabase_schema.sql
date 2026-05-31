-- Enable the uuid-ossp extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: users
CREATE TABLE public.users (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    username text UNIQUE NOT NULL,
    email text UNIQUE NOT NULL,
    country text,
    city text,
    avatar_color text DEFAULT '#1de9b6',
    xp int DEFAULT 0,
    level int DEFAULT 1,
    planet_score int DEFAULT 100,
    streak int DEFAULT 0,
    last_logged_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now()
);

-- Table: activity_logs
CREATE TABLE public.activity_logs (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    category text NOT NULL,
    subcategory text,
    quantity float NOT NULL,
    unit text,
    co2_kg float NOT NULL,
    metadata jsonb,
    logged_at timestamp with time zone DEFAULT now()
);

-- Table: badges
CREATE TABLE public.badges (
    id text PRIMARY KEY,
    name text NOT NULL,
    description text NOT NULL,
    icon text,
    xp_reward int DEFAULT 0,
    criteria jsonb
);

-- Table: user_badges
CREATE TABLE public.user_badges (
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    badge_id text REFERENCES public.badges(id) ON DELETE CASCADE,
    unlocked_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (user_id, badge_id)
);

-- Table: challenges
CREATE TABLE public.challenges (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    title text NOT NULL,
    description text NOT NULL,
    start_date timestamp with time zone NOT NULL,
    end_date timestamp with time zone NOT NULL,
    target_metric text,
    community_progress float DEFAULT 0
);

-- Table: challenge_participants
CREATE TABLE public.challenge_participants (
    challenge_id uuid REFERENCES public.challenges(id) ON DELETE CASCADE,
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    progress float DEFAULT 0,
    joined_at timestamp with time zone DEFAULT now(),
    PRIMARY KEY (challenge_id, user_id)
);

-- Table: notifications
CREATE TABLE public.notifications (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    type text NOT NULL,
    message text NOT NULL,
    read boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);

-- Realtime Setup
-- To enable realtime for specific tables
alter publication supabase_realtime add table public.users;
alter publication supabase_realtime add table public.activity_logs;
alter publication supabase_realtime add table public.challenge_participants;
alter publication supabase_realtime add table public.notifications;

-- Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can read all users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update their own data" ON public.users FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for activity_logs
CREATE POLICY "Users can read their own logs" ON public.activity_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own logs" ON public.activity_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own logs" ON public.activity_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own logs" ON public.activity_logs FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for user_badges
CREATE POLICY "Users can read all badges" ON public.user_badges FOR SELECT USING (true);
CREATE POLICY "Users can insert their own badges" ON public.user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for challenge_participants
CREATE POLICY "Users can read all participants" ON public.challenge_participants FOR SELECT USING (true);
CREATE POLICY "Users can manage their participation" ON public.challenge_participants FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for notifications
CREATE POLICY "Users can read their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
