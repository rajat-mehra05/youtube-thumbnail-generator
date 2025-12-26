You are building a **YouTube Thumbnail Generator Web App** using **Next.js (App Router)**, **Supabase**, and **LLM + Image Generation APIs**.

Your task is to implement the system till **v1 level**, focusing on **architecture correctness, extensibility, caching, and user-uploaded images**.

---

## Product Scope (v1)

The app allows a logged-in user to:

* Create a thumbnail project
* Input video title, topic, and emotion
* Upload their own images (face, product, logo, screenshot)
* Generate AI-based thumbnail concepts and images
* Edit text and image positioning on a canvas
* Export a final YouTube-ready thumbnail (1280x720)

---

## Tech Stack

Frontend:

* Next.js (App Router)
* TypeScript
* Canvas rendering using Konva.js or Fabric.js
* TanStack Query for client-side caching

Backend:

* Next.js Server Actions or API routes
* Supabase (Auth, Postgres, Storage)
* LLM API for text and layout generation
* Image generation API (Replicate or OpenAI Image)

Infra and utilities:

* Supabase signed URLs for uploads
* Redis or Supabase table for caching
* Sharp for server-side image processing
* CDN caching for images

---

## Core Architecture Requirements

### Authentication

* Use Supabase Auth
* Support Google OAuth
* Protect all project routes

---

### Database Design (Supabase)

Create tables:

* users
* projects
* thumbnails
* images
* cache_entries
* usage_logs

Key points:

* A project can have multiple thumbnails
* Images can be user-uploaded or AI-generated
* Store image metadata (width, height, mime, storage path)

---

### Storage Buckets

Create Supabase Storage buckets:

* user-uploads
* generated-images
* exports

Use folder structure:

```
user-uploads/{userId}/{projectId}/original/
generated-images/{userId}/{projectId}/
exports/{userId}/{projectId}/
```

All uploads must use **signed upload URLs**.

---

### User Image Upload Flow

* Client requests a signed upload URL
* Client uploads image directly to Supabase Storage
* Metadata is stored in `images` table
* Uploaded images can be placed on the canvas
* Uploaded images can be used as AI reference images

Validate:

* File type
* File size
* Image dimensions

---

### AI Generation Flow

Split AI into two steps:

1. **Concept Generation (LLM)**

   * Generate headline text
   * Generate layout hints
   * Generate background prompt
   * Output structured JSON

2. **Image Generation**

   * Generate image using prompt + optional user reference image
   * Cache generated images aggressively

All AI calls must:

* Be idempotent
* Use deterministic hashing for caching
* Log usage cost

---

### Caching Strategy

Implement caching at three levels.

Client-side:

* Cache concepts and previews using TanStack Query
* Cache key based on hash of inputs

Server-side:

* Cache LLM responses and image generation results
* Use Redis or Supabase `cache_entries` table
* Cache key = hash(title + style + emotion + referenceImageId)

CDN:

* Generated images served with long cache headers
* Signed URLs for private access

Never regenerate AI output if a cache hit exists.

---

### Canvas Editor

* Use Konva.js or Fabric.js
* Support:

  * Text layers
  * Image layers
  * Z-index ordering
  * Resize, move, rotate
* Canvas state should be serializable and stored in DB
* Avoid unnecessary React re-renders

---

### Export Pipeline

* Export final thumbnail server-side
* Rebuild canvas using stored state
* Generate 1280x720 image using Sharp
* Store in `exports` bucket
* Return downloadable URL

Preview quality can be lower than export quality.

---

### Performance and Safety

* Async background jobs for image generation
* Rate limit AI endpoints
* Validate and moderate uploaded images
* Track per-user usage and limits

---

### Non-Goals for v1

Do NOT implement:

* Team collaboration
* A/B testing
* CTR prediction
* Advanced face retouching

---

### Output Expectations

* Clean, readable code
* Clear separation of concerns
* Extensible architecture
* Well-named functions and folders
* Comments explaining design decisions

Build the app incrementally but ensure the **data models, caching, and upload pipelines are production-ready**.

---
