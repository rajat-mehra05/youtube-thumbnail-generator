# YouTube Thumbnail Generator

A modern web application for creating professional YouTube thumbnails using AI-powered generation, templates, and a canvas editor.

## ✨ Features

- 🎨 **AI-Powered Generation** - Generate thumbnail concepts using AI with customizable styles and emotions
- 📁 **Template Library** - Browse and use pre-designed thumbnail templates
- 🖼️ **Image Upload** - Upload your own images (face, product, logo, screenshot)
- ✏️ **Canvas Editor** - Edit text, images, and layers with a Konva.js-powered editor
- 📤 **Export** - Export YouTube-ready thumbnails (1280x720)
- 🔐 **Authentication** - Secure Google OAuth via Supabase
- 👤 **Guest Mode** - Try the app without signing up (1 free generation)
- 🎭 **Multiple Styles** - Choose from cinematic, 3D, anime, artistic, and more
- 📐 **Aspect Ratios** - Support for 16:9, 1:1, 4:3, 3:4, and 9:16 formats
- 💾 **Project Management** - Save and manage your thumbnail projects

## 🚀 Quick Start

### Current Status: ✅ **Ready to Use!**
The app works immediately without Supabase storage setup. Images are automatically converted to base64 data URLs, eliminating CORS issues.

### Prerequisites
- Node.js 18+
- Yarn or npm
- API keys for AI services (OpenAI and Google Generative AI)

### Environment Variables
Create a `.env.local` file in the root directory:

```env
# Required for AI generation
OPENAI_API_KEY=sk-your-openai-key
GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-key

# Optional: For Supabase features (auth, storage, projects)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional: For rate limiting & caching
UPSTASH_REDIS_REST_URL=your-redis-url
UPSTASH_REDIS_REST_TOKEN=your-redis-token
```

### Installation

```bash
# Install dependencies
yarn install

# Run development server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Database Setup (Optional)

If you want user accounts, projects, and Supabase storage:

1. **Link your Supabase project:**
   ```bash
   yarn db:link
   ```

2. **Run migrations:**
   ```bash
   yarn db:push
   ```

   Or manually run the SQL scripts in the `supabase/migrations/` folder:
   - `20251227063934_initial_schema.sql` - Database tables and RLS policies
   - `20251227064020_seed_templates.sql` - Seed template data
   - `20251227100000_setup_storage_buckets.sql` - Storage bucket setup
   - `20251229020651_update_generated_images_public.sql` - Storage policies

3. **Set up storage buckets:**
   - Go to Supabase Dashboard → Storage
   - Create a **public** bucket named `generated-images`
   - The migration scripts should handle the policies automatically

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** (App Router) - React framework with server components
- **React 19** - UI library
- **TypeScript** - Type safety
- **TailwindCSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible UI primitives (Dialog, Dropdown, Select, etc.)
- **Konva.js** - 2D canvas rendering for the editor
- **React Konva** - React bindings for Konva
- **TanStack Query** - Client-side data fetching and caching
- **Sonner** - Toast notifications
- **Lucide React** - Icon library

### Backend
- **Next.js Server Actions** - Server-side API endpoints
- **Supabase** - Authentication, PostgreSQL database, and storage
- **Google Generative AI (Gemini)** - Concept generation and text suggestions
- **OpenAI DALL-E** - Image generation
- **Sharp** - Server-side image processing and optimization

### Infrastructure
- **Upstash Redis** - Rate limiting & caching
- **Supabase Storage** - Image storage with signed URLs
- **Husky** - Git hooks for pre-commit checks

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # OAuth callback handlers
│   ├── create/            # Thumbnail creation flows
│   │   ├── ai/            # AI generation page
│   │   └── page.tsx       # Main creation page
│   ├── dashboard/         # User dashboard
│   ├── editor/            # Canvas editor
│   │   └── [projectId]/   # Dynamic editor route
│   ├── login/             # Authentication pages
│   ├── try/               # Guest trial page
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── create/            # Creation flow components
│   ├── dashboard/         # Dashboard components
│   ├── editor/            # Editor components
│   │   ├── layers/        # Layer-specific components
│   │   └── properties/    # Property panels
│   ├── guest/             # Guest mode components
│   ├── home/              # Homepage sections
│   ├── layout/            # Layout components (Navbar, Footer)
│   └── ui/                # Shadcn UI components
├── hooks/                 # Custom React hooks
│   ├── useCanvasState.ts  # Canvas state management
│   ├── useGuestTransfer.ts # Guest to user transfer
│   └── useUser.ts         # User authentication hook
├── lib/                   # Utilities and server actions
│   ├── actions/           # Server actions
│   │   ├── ai-generation.ts # AI image generation
│   │   ├── projects/      # Project CRUD operations
│   │   ├── usage.ts        # Usage tracking
│   │   └── guest-session.ts # Guest session management
│   ├── supabase/          # Supabase client utilities
│   ├── utils/             # Helper functions
│   └── constants.ts       # App-wide constants
└── types/                 # TypeScript type definitions

supabase/
├── migrations/            # Database migration files
├── schema.sql             # Complete database schema
└── seed-templates.sql     # Template seed data
```

## 🎯 Key Features Explained

### AI Generation
- Uses Google Gemini for concept generation and text suggestions
- Uses OpenAI DALL-E for high-quality image generation
- Supports multiple styles: cinematic, 3D, anime, artistic, digital art, etc.
- Emotion-based generation (excited, shocked, curious, happy, serious)
- Multiple aspect ratios for different platforms

### Canvas Editor
- Layer-based editing system
- Text layers with customizable fonts, colors, and effects
- Image layers with drag, resize, and transform controls
- Real-time preview
- Export to PNG at 1280x720 (YouTube standard)

### Guest Mode
- Try the app without signing up
- 1 free generation per session
- Session expires after 24 hours
- Seamless transfer to authenticated account

## 📜 Available Scripts

```bash
yarn dev              # Start development server
yarn build            # Build for production
yarn start            # Start production server
yarn lint             # Run ESLint
yarn type-check       # Run TypeScript type checking
yarn pre-commit       # Run type-check and lint (for CI)

# Database scripts (requires Supabase CLI)
yarn db:link          # Link to Supabase project
yarn db:push          # Push migrations to database
yarn db:reset         # Reset database (development only)
yarn db:migration:new # Create new migration
yarn db:migration:list # List all migrations
```

## 🐛 Troubleshooting

### Images Not Generating?
1. Check your `OPENAI_API_KEY` in `.env.local`
2. Verify the key has DALL-E access and sufficient credits
3. Check browser console for specific errors
4. Verify `GOOGLE_GENERATIVE_AI_API_KEY` is set for concept generation

### CORS Errors?
The app automatically uses base64 data URLs, so CORS shouldn't be an issue. If you still see errors:
- Clear your browser cache
- Try generating a new image
- Check that images are being converted to base64 properly

### Authentication Issues?
1. Verify Supabase environment variables are set correctly
2. Check that OAuth is configured in Supabase Dashboard
3. Ensure redirect URLs are whitelisted in Supabase

### Performance Issues?
- **Base64 images**: Work immediately but increase page size (~1-3MB per image)
- **Supabase storage**: Better performance, set up the `generated-images` bucket
- Use browser DevTools to identify slow components

### Database Connection Issues?
1. Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
2. Check that migrations have been run
3. Verify RLS (Row Level Security) policies are correct

## 🔒 Security Notes

- Never commit `.env.local` to version control
- Use environment variables for all sensitive keys
- Supabase RLS policies protect user data
- Rate limiting via Upstash Redis (if configured)

## 📄 License

MIT
