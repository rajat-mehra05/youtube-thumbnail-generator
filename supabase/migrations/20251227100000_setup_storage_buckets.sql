-- Storage Buckets Setup
-- Create storage buckets for the application

-- Create user-uploads bucket (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'user-uploads',
  'user-uploads',
  false,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Create generated-images bucket (public for easier access)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'generated-images',
  'generated-images',
  true, -- Make public to avoid CORS issues
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Create exports bucket (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'exports',
  'exports',
  false,
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png']
)
ON CONFLICT (id) DO NOTHING;

-- Create templates bucket (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'templates',
  'templates',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STORAGE POLICIES
-- ============================================

-- Policies for user-uploads bucket
CREATE POLICY "Users can upload to their folder"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'user-uploads' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their uploads"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'user-uploads' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their uploads"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'user-uploads' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their uploads"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'user-uploads' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policies for generated-images bucket (public bucket but with upload restrictions)
CREATE POLICY "Anyone can view generated images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'generated-images');

CREATE POLICY "Authenticated users can upload generated images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'generated-images' 
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR (storage.foldername(name))[1] LIKE 'guest%'
    )
  );

CREATE POLICY "Users can update their generated images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'generated-images' 
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR (storage.foldername(name))[1] LIKE 'guest%'
    )
  );

CREATE POLICY "Users can delete their generated images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'generated-images' 
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR (storage.foldername(name))[1] LIKE 'guest%'
    )
  );

-- Policies for exports bucket
CREATE POLICY "Users can upload to their exports folder"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'exports' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their exports"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'exports' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their exports"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'exports' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policies for templates bucket (public bucket, admin-managed)
CREATE POLICY "Anyone can view templates"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'templates');

-- Note: Only service role can upload templates (done via backend)

