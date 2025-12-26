# YouTube Thumbnail Generator

A modern web application for creating professional YouTube thumbnails using AI-powered generation, templates, and a canvas editor.

## Features

- 🎨 **AI-Powered Generation** - Generate thumbnail concepts using AI with customizable styles and emotions
- 📁 **Template Library** - Browse and use pre-designed thumbnail templates
- 🖼️ **Image Upload** - Upload your own images (face, product, logo, screenshot)
- ✏️ **Canvas Editor** - Edit text, images, and layers with a Konva.js-powered editor
- 📤 **Export** - Export YouTube-ready thumbnails (1280x720)
- 🔐 **Authentication** - Secure Google OAuth via Supabase
- 👤 **Guest Mode** - Try the app without signing up

## Tech Stack

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
- **OpenAI** - Image generation
- **Sharp** - Server-side image processing

### Infrastructure
- **Upstash Redis** - Rate limiting & caching
- **Supabase Storage** - Image storage with signed URLs

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn or npm
- Supabase project
- API keys for AI services

### Environment Variables

Create a `.env.local` file with the following:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI APIs
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_key
OPENAI_API_KEY=your_openai_key

# Upstash Redis
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
```

### Installation

```bash
# Install dependencies
yarn install

# Run development server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Database Setup

Run the SQL scripts in the `supabase/` folder to set up your database:

1. `schema.sql` - Database tables and RLS policies
2. `seed-templates.sql` - Seed template data

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── create/            # Thumbnail creation flows
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

## Scripts

```bash
yarn dev      # Start development server
yarn build    # Build for production
yarn start    # Start production server
yarn lint     # Run ESLint
```

## License

MIT
