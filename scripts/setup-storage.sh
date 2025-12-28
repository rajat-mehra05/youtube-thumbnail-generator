#!/bin/bash

# Setup Storage Buckets for YouTube Thumbnail App
# This script applies the storage migration to create necessary buckets

echo "🚀 Setting up Supabase storage buckets..."
echo ""

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found!"
    echo "📦 Install it with: npm install -g supabase"
    echo "Or visit: https://supabase.com/docs/guides/cli"
    echo ""
    echo "📋 Alternatively, copy the migration file contents and run in Supabase Dashboard:"
    echo "   File: supabase/migrations/20251227100000_setup_storage_buckets.sql"
    exit 1
fi

# Check if Supabase is running
echo "🔍 Checking Supabase status..."
if ! supabase status &> /dev/null; then
    echo "⚠️  Supabase is not running locally"
    echo "Starting Supabase..."
    supabase start
fi

echo ""
echo "📤 Applying storage migration..."
supabase db push

echo ""
echo "✅ Storage setup complete!"
echo ""
echo "📦 Created buckets:"
echo "   • generated-images (PUBLIC) - for AI backgrounds"
echo "   • user-uploads (PRIVATE) - for user uploads"
echo "   • exports (PRIVATE) - for exported thumbnails"
echo "   • templates (PUBLIC) - for template previews"
echo ""
echo "🎨 You can now generate AI backgrounds without CORS errors!"
echo ""
echo "💡 Verify buckets with: supabase storage list"

