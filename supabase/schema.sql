-- YouTube Thumbnail Generator - Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUM TYPES
-- ============================================

CREATE TYPE template_category AS ENUM (
  'gaming',
  'vlog',
  'tutorial',
  'podcast',
  'reaction',
  'business'
);

CREATE TYPE template_type AS ENUM (
  'full_design',
  'layout_only'
);

CREATE TYPE emotion_type AS ENUM (
  'excited',
  'shocked',
  'curious',
  'happy',
  'serious'
);

CREATE TYPE style_preference AS ENUM (
  'bold_text',
  'minimal',
  'colorful',
  'dark',
  'professional'
);

CREATE TYPE cache_type AS ENUM (
  'llm_response',
  'image_generation'
);

CREATE TYPE action_type AS ENUM (
  'ai_generation',
  'image_generation',
  'export'
);

-- ============================================
-- TABLES
-- ============================================

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  credits_remaining INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Untitled Project',
  video_title TEXT,
  topic template_category,
  emotion emotion_type,
  style style_preference,
  canvas_state JSONB,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Thumbnails table (generated thumbnails for a project)
CREATE TABLE public.thumbnails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_ai_generated BOOLEAN DEFAULT false,
  prompt_used TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Images table (uploaded images)
CREATE TABLE public.images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Templates table
CREATE TABLE public.templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category template_category NOT NULL,
  type template_type NOT NULL,
  thumbnail_url TEXT NOT NULL,
  canvas_state JSONB NOT NULL,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Guest sessions table
CREATE TABLE public.guest_sessions (
  id UUID PRIMARY KEY,
  generations_used INTEGER DEFAULT 0,
  concept_data JSONB,
  converted_to_user UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours')
);

-- Cache entries table
CREATE TABLE public.cache_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cache_key TEXT NOT NULL UNIQUE,
  cache_type cache_type NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

-- Usage logs table
CREATE TABLE public.usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  action_type action_type NOT NULL,
  credits_used INTEGER DEFAULT 1,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_projects_created_at ON public.projects(created_at DESC);
CREATE INDEX idx_thumbnails_project_id ON public.thumbnails(project_id);
CREATE INDEX idx_images_user_id ON public.images(user_id);
CREATE INDEX idx_images_project_id ON public.images(project_id);
CREATE INDEX idx_templates_category ON public.templates(category);
CREATE INDEX idx_templates_type ON public.templates(type);
CREATE INDEX idx_guest_sessions_expires_at ON public.guest_sessions(expires_at);
CREATE INDEX idx_cache_entries_cache_key ON public.cache_entries(cache_key);
CREATE INDEX idx_cache_entries_expires_at ON public.cache_entries(expires_at);
CREATE INDEX idx_usage_logs_user_id ON public.usage_logs(user_id);
CREATE INDEX idx_usage_logs_created_at ON public.usage_logs(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thumbnails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guest_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cache_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Projects policies
CREATE POLICY "Users can view their own projects"
  ON public.projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON public.projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects"
  ON public.projects FOR DELETE
  USING (auth.uid() = user_id);

-- Thumbnails policies
CREATE POLICY "Users can view thumbnails of their projects"
  ON public.thumbnails FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = thumbnails.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can create thumbnails for their projects"
  ON public.thumbnails FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = thumbnails.project_id
    AND projects.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete thumbnails from their projects"
  ON public.thumbnails FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = thumbnails.project_id
    AND projects.user_id = auth.uid()
  ));

-- Images policies
CREATE POLICY "Users can view their own images"
  ON public.images FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can upload their own images"
  ON public.images FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own images"
  ON public.images FOR DELETE
  USING (auth.uid() = user_id);

-- Templates policies (public read)
CREATE POLICY "Anyone can view templates"
  ON public.templates FOR SELECT
  TO authenticated, anon
  USING (true);

-- Guest sessions policies (service role only for security)
CREATE POLICY "Service role can manage guest sessions"
  ON public.guest_sessions FOR ALL
  USING (true)
  WITH CHECK (true);

-- Cache entries policies (service role only)
CREATE POLICY "Service role can manage cache"
  ON public.cache_entries FOR ALL
  USING (true)
  WITH CHECK (true);

-- Usage logs policies
CREATE POLICY "Users can view their own usage"
  ON public.usage_logs FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================
-- TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to users table
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to projects table
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to clean up expired guest sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_guest_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM public.guest_sessions
  WHERE expires_at < NOW()
  AND converted_to_user IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up expired cache entries
CREATE OR REPLACE FUNCTION public.cleanup_expired_cache()
RETURNS void AS $$
BEGIN
  DELETE FROM public.cache_entries
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- STORAGE BUCKETS
-- ============================================

-- Note: Run these in the Supabase Dashboard -> Storage

-- INSERT INTO storage.buckets (id, name, public) VALUES ('user-uploads', 'user-uploads', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('generated-images', 'generated-images', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('exports', 'exports', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('templates', 'templates', true);

-- Storage policies for user-uploads bucket
-- CREATE POLICY "Users can upload to their folder"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Users can view their uploads"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

-- CREATE POLICY "Users can delete their uploads"
--   ON storage.objects FOR DELETE
--   USING (bucket_id = 'user-uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

