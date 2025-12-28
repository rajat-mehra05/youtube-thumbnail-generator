# YouTube Thumbnail Generator

A modern web application for creating professional YouTube thumbnails using AI-powered generation, templates, and a canvas editor.

## ✨ Features

- 🎨 **AI-Powered Generation** - Generate thumbnail concepts using AI with customizable styles and emotions
- 📁 **Template Library** - Browse and use pre-designed thumbnail templates
- 🖼️ **Image Upload** - Upload your own images (face, product, logo, screenshot)
- ✏️ **Canvas Editor** - Edit text, images, and layers with a Konva.js-powered editor
- 📤 **Export** - Export YouTube-ready thumbnails (1280x720)
- 🔐 **Authentication** - Secure Google OAuth via Supabase
- 👤 **Guest Mode** - Try the app without signing up

## 🚀 Quick Start

### Current Status: ✅ **Ready to Use!**
The app works immediately without Supabase storage setup. Images are automatically converted to base64 data URLs, eliminating CORS issues.

### Prerequisites
- Node.js 18+
- Yarn or npm
- API keys for AI services

### Environment Variables
Create a `.env.local` file:

```env
# Required for AI generation
OPENAI_API_KEY=sk-your-openai-key
GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-key

# Optional: For Supabase features (auth, storage)
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

1. Run the SQL scripts in the `supabase/` folder:
   - `schema.sql` - Database tables and RLS policies
   - `seed-templates.sql` - Seed template data

2. Set up storage buckets:
   - Go to Supabase Dashboard → Storage
   - Create a **public** bucket named `generated-images`
   - Run the SQL policies from `supabase/migrations/20251227100000_setup_storage_buckets.sql`

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **TailwindCSS 4**
- **Radix UI** - Accessible UI primitives
- **Konva.js** - Canvas rendering
- **TanStack Query** - Client-side caching

### Backend
- **Next.js Server Actions**
- **Supabase** - Auth, Postgres, Storage
- **Google Generative AI** - Concept generation
- **OpenAI DALL-E** - Image generation
- **Sharp** - Server-side image processing

### Infrastructure
- **Upstash Redis** - Rate limiting & caching
- **Supabase Storage** - Image storage with signed URLs

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── create/            # Thumbnail creation flows
│   │   ├── ai/            # AI generation page
│   │   ├── templates/     # Template selection
│   │   └── upload/        # Image upload page
│   ├── dashboard/         # User dashboard
│   ├── editor/            # Canvas editor
│   ├── login/             # Authentication
│   └── try/               # Guest trial
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── create/            # Creation flow components
│   ├── dashboard/         # Dashboard components
│   ├── editor/            # Editor components
│   ├── guest/             # Guest mode components
│   ├── home/              # Homepage sections
│   ├── layout/            # Layout components
│   ├── templates/         # Template components
│   └── ui/                # Shadcn UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and server actions
│   ├── actions/           # Server actions
│   └── supabase/          # Supabase client utilities
└── types/                 # TypeScript types
```

## 🐛 Troubleshooting

### Images Not Generating?
1. Check your `OPENAI_API_KEY` in `.env.local`
2. Verify the key has DALL-E access
3. Check browser console for specific errors

### CORS Errors?
The app automatically uses base64 data URLs, so CORS shouldn't be an issue. If you still see errors:
- Clear your browser cache
- Try generating a new image

### Performance Issues?
- **Base64 images**: Work immediately but ~1-3MB page size
- **Supabase storage**: Better performance, set up the `generated-images` bucket

## 📜 Scripts

```bash
yarn dev      # Start development server
yarn build    # Build for production
yarn start    # Start production server
yarn lint     # Run ESLint
```

## 📄 License

MIT
