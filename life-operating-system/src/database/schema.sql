-- DATABASE SCHEMA: LIFE OPERATING SYSTEM
-- Target: Supabase / PostgreSQL
-- Features: Row Level Security (RLS), Cascading Deletes, Updated_at triggers, and relational lookups

-- 1. Profiles (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Portfolios (Top-level life domains)
CREATE TABLE IF NOT EXISTS public.portfolios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE DEFAULT auth.uid() NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    vision TEXT,
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Paused', 'Archived')) NOT NULL,
    health_score INTEGER DEFAULT 100 CHECK (health_score BETWEEN 0 AND 100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Programs (Strategic layer, long-term commitments)
CREATE TABLE IF NOT EXISTS public.programs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE DEFAULT auth.uid() NOT NULL,
    portfolio_id UUID REFERENCES public.portfolios ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    objective TEXT,
    owner TEXT,
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'At Risk', 'Blocked', 'Paused', 'Dead', 'Completed')) NOT NULL,
    health TEXT DEFAULT 'Healthy' CHECK (health IN ('Healthy', 'At Risk', 'Critical')) NOT NULL,
    risk_level TEXT DEFAULT 'Low' CHECK (risk_level IN ('Low', 'Medium', 'High')) NOT NULL,
    target_outcome TEXT,
    review_frequency TEXT DEFAULT 'Weekly' CHECK (review_frequency IN ('Weekly', 'Biweekly', 'Monthly')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Projects (Finite initiative layer)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE DEFAULT auth.uid() NOT NULL,
    program_id UUID REFERENCES public.programs ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    objective TEXT,
    definition_of_done TEXT,
    priority TEXT DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')) NOT NULL,
    status TEXT DEFAULT 'Planned' CHECK (status IN ('Planned', 'Active', 'Blocked', 'Paused', 'Completed', 'Killed')) NOT NULL,
    deadline DATEY,
    deadline DATE,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100) NOT NULL,
    energy_level_required TEXT DEFAULT 'Medium' CHECK (energy_level_required IN ('Low', 'Medium', 'High')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Tasks (Executable atomic actions)
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE DEFAULT auth.uid() NOT NULL,
    project_id UUID REFERENCES public.projects ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    notes TEXT,
    status TEXT DEFAULT 'Todo' CHECK (status IN ('Todo', 'In Progress', 'Waiting', 'Blocked', 'Done', 'Cancelled')) NOT NULL,
    due_date DATE,
    estimated_time INTEGER DEFAULT 0 NOT NULL, -- minutes
    actual_time INTEGER DEFAULT 0 NOT NULL, -- minutes
    energy_required TEXT DEFAULT 'Medium' CHECK (energy_required IN ('Low', 'Medium', 'High')) NOT NULL,
    context TEXT DEFAULT 'Work' NOT NULL,
    priority TEXT DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Weekly Reviews
CREATE TABLE IF NOT EXISTS public.weekly_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE DEFAULT auth.uid() NOT NULL,
    review_date DATE DEFAULT CURRENT_DATE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    uncompleted_tasks_reviewed_count INTEGER DEFAULT 0 NOT NULL,
    health_checks_completed_count INTEGER DEFAULT 0 NOT NULL,
    adjustments_made TEXT,
    reflection_notes TEXT
);

-- 7. Activity Logs
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users ON DELETE CASCADE DEFAULT auth.uid() NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    entity_title TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- INDEXES FOR PERFORMANCE OPTIMIZATION
CREATE INDEX IF NOT EXISTS idx_portfolios_user ON public.portfolios(user_id);
CREATE INDEX IF NOT EXISTS idx_programs_user_portfolio ON public.programs(user_id, portfolio_id);
CREATE INDEX IF NOT EXISTS idx_projects_user_program ON public.projects(user_id, program_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_project ON public.tasks(user_id, project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_date ON public.activity_logs(user_id, created_at DESC);

-- AUTOMATIC UPDATED_AT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- BIND TRIGGERS TO TABLES
CREATE TRIGGER trigger_portfolios_updated_at
    BEFORE UPDATE ON public.portfolios
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_programs_updated_at
    BEFORE UPDATE ON public.programs
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trigger_tasks_updated_at
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ENABLE ROW LEVEL SECURITY (RLS) FOR ALL TABLES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- CREATE RLS POLICY STATEMENTS
-- Profiles: Users can select and update their own profiles
CREATE POLICY "Users can manage own profile" ON public.profiles
    FOR ALL USING (auth.uid() = id);

-- Portfolios
CREATE POLICY "Users can manage own portfolios" ON public.portfolios
    FOR ALL USING (auth.uid() = user_id);

-- Programs
CREATE POLICY "Users can manage own programs" ON public.programs
    FOR ALL USING (auth.uid() = user_id);

-- Projects
CREATE POLICY "Users can manage own projects" ON public.projects
    FOR ALL USING (auth.uid() = user_id);

-- Tasks
CREATE POLICY "Users can manage own tasks" ON public.tasks
    FOR ALL USING (auth.uid() = user_id);

-- Weekly Reviews
CREATE POLICY "Users can manage own reviews" ON public.weekly_reviews
    FOR ALL USING (auth.uid() = user_id);

-- Activity Logs
CREATE POLICY "Users can view own activity logs" ON public.activity_logs
    FOR ALL USING (auth.uid() = user_id);

-- PROFILE CREATION TRIGGER FOR AUTHENTICATED USERS
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'full_name', 'Solo Operator'),
        coalesce(new.raw_user_meta_data->>'avatar_url', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
