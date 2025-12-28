-- Update generated-images bucket to be public
-- This migration corrects the generated-images bucket visibility to public
-- for easier access and to avoid CORS issues

UPDATE storage.buckets
SET public = true,
    file_size_limit = 10485760, -- 10MB
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp']
WHERE id = 'generated-images';
