# ContentForge AI — Multi-Platform Content Generator

A production-ready Next.js frontend for an existing n8n workflow that transforms YouTube videos into polished multi-platform content (LinkedIn, X, Facebook, Blog), AI-generated images, and shareable Google Docs.

> **The n8n workflow JSON is not modified in any way.** This frontend adapts to the workflow exactly as it exists — no node renames, no field changes, no payload modifications.

---

## Features

- **Beautiful AI SaaS landing page** — hero, feature cards, how-it-works, workflow pipeline preview, FAQ, sticky navigation
- **Dashboard** — sidebar navigation, stats overview, quick actions, recent activity
- **Generate Content page** — form matching the workflow's exact fields with live YouTube preview (thumbnail, title, channel, video ID)
- **Animated workflow pipeline** — 30 nodes visualized with real-time status (idle, running, waiting, completed, failed) and progress bar
- **Results page** — tabbed platform content, AI image, Google Doc / Drive / metadata links with copy, download, and share buttons
- **History** — search, filter by status, sort, delete, pagination (persisted via Supabase)
- **Reports** — Google Doc links from completed generations
- **Downloads** — AI images, Drive folders, metadata JSON files
- **Settings** — configurable webhook URL, theme (light/dark/system), notification toggle
- **Workflow Visualization** — full animated node diagram with type legend
- **Dark / Light mode** — glassmorphism design with system preference detection
- **Responsive** — mobile to desktop with adaptive layouts
- **SEO ready** — metadata, OpenGraph, semantic HTML
- **Accessibility** — ARIA labels, keyboard navigation, contrast ratios

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 15 (App Router) | Framework |
| React 19 | UI library |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| shadcn/ui | Component library |
| Framer Motion | Animations |
| React Hook Form + Zod | Forms & validation |
| Axios | HTTP client |
| React Query | Server state |
| Supabase | History persistence |
| Lucide Icons | Icons |

---

## Getting Started

### Prerequisites

- Node.js 18+
- An n8n instance with the YouTube Multi-Platform Content Generator workflow deployed
- The webhook URL from your n8n workflow's Webhook node

### Installation

```bash
npm install
```

### Environment Variables

A `.env.local` file has been created with placeholders. Update it with your credentials:

```env
# Supabase (from https://supabase.com)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# n8n Webhook URL
NEXT_PUBLIC_N8N_WEBHOOK_URL=http://localhost:5678/webhook/your-workflow-id
```

**For complete setup instructions, see [SETUP.md](./SETUP.md)**

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_N8N_WEBHOOK_URL` | Your n8n webhook endpoint URL (active or test) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |

> **Webhook URL resolution priority:**
> 1. Environment variable (`NEXT_PUBLIC_N8N_WEBHOOK_URL`)
> 2. localStorage (saved via Settings page)
> 3. Settings form prompt (if not configured)

### Development

```bash
npm run dev
```

The app runs at `http://localhost:3000`.

### Build

```bash
npm run build
npm start
```

---

## How It Integrates With the n8n Workflow

The frontend sends a `POST` request to the n8n webhook with this payload:

```json
{
  "youtubeUrl": "https://youtube.com/watch?v=...",
  "email": "user@example.com",
  "platforms": ["LinkedIn", "X", "Facebook", "Blog"],
  "tone": "Educational",
  "theme": "AI",
  "audience": "Founders",
  "humanOpinion": "optional text"
}
```

The workflow processes the request through its full pipeline (30 nodes: transcript extraction → Gemini analysis → platform formatting → image generation → Google Doc creation → metadata → logging) and returns a response containing the generated content and links.

The frontend parses the response flexibly — it checks multiple possible field names for each output (e.g., `linkedin`, `linkedinPost`, `LinkedIn`, `linkedin_post`) so it adapts to the workflow's actual response shape without requiring changes to the workflow.

### Workflow Pipeline (30 Nodes)

1. User Form Submission
2. Extract Video ID
3. Start Apify Transcript Extraction
4. Wait for Apify
5. Check Apify Status
6. Transcript Ready
7. Insight Extraction (Gemini)
8. Creative Transformation (Gemini)
9. Split Platforms
10. Platform Router
11. LinkedIn Formatter
12. X Formatter
13. Facebook Formatter
14. Blog Formatter
15. Merge Content
16. Aggregate Platform Content
17. Create Drive Folder
18. Generate Image Prompt
19. Generate AI Image
20. Generate Report
21. Create Google Document
22. Write Report
23. Share Document
24. Upload Image to Drive
25. Synchronize
26. Build Metadata
27. Convert Metadata to JSON
28. Upload Metadata File
29. Build Final Output
30. Log to Google Sheets
31. Return Final Response

Each node is visualized in the animated pipeline with live status updates.

---

## Project Structure

```
app/
  layout.tsx              # Root layout (providers, fonts, SEO metadata)
  page.tsx                # Landing page
  providers.tsx           # React Query, Theme, Settings, Toaster providers
  globals.css            # Design system, glassmorphism, animations
  dashboard/
    layout.tsx            # Dashboard layout with sidebar
    page.tsx              # Dashboard overview
    generate/page.tsx     # Generate content form + workflow progress
    results/page.tsx      # Results display
    history/page.tsx       # History with search/filter/pagination
    reports/page.tsx       # Google Doc reports
    downloads/page.tsx     # Downloadable files
    workflow/page.tsx      # Animated workflow diagram
    settings/page.tsx      # Settings
    help/page.tsx          # Help & documentation
components/
  site-nav.tsx             # Landing page navigation
  dashboard-sidebar.tsx    # Dashboard sidebar
  workflow-progress.tsx    # Animated pipeline progress
  workflow-diagram.tsx     # Full workflow visualization
  ui/                      # shadcn/ui components
config/
  workflow.ts             # Workflow metadata, form options, node definitions
context/
  theme-provider.tsx       # Theme context (light/dark/system)
  settings-context.tsx     # App settings context
hooks/
  use-youtube-preview.ts   # YouTube oEmbed live preview
  use-toast.ts             # Toast notifications
lib/
  supabase.ts              # Supabase client
  utils.ts                 # Utility functions
services/
  api.ts                   # n8n webhook API service
  generations.ts           # Supabase CRUD for history
types/
  index.ts                 # TypeScript type definitions
```

---

## Deployment

### Vercel

1. Push your repository to GitHub
2. Import the project at [vercel.com](https://vercel.com)
3. Add environment variables in the Vercel dashboard:
   - `NEXT_PUBLIC_N8N_WEBHOOK_URL` — your n8n webhook URL (or leave empty to prompt at runtime)
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy — Vercel auto-detects Next.js

### Netlify

1. Push your repository to GitHub
2. Import the project at [netlify.com](https://netlify.com)
3. Build command: `npm run build`
4. Publish directory: `.next`
5. Add the same environment variables in Netlify site settings
6. The `netlify.toml` file is already configured with the Next.js plugin

### Docker

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t contentforge .
docker run -p 3000:3000 -e NEXT_PUBLIC_N8N_WEBHOOK_URL=https://your-n8n.com/webhook/xxx contentforge
```

### Bolt

The project is already configured for Bolt. The `.env` file includes the webhook URL. No additional setup needed.

---

## Form Fields (Matching the Workflow)

| Field | Type | Options |
|---|---|---|
| YouTube URL | Text input | Validated with YouTube URL regex |
| Email | Email input | Validated with email regex |
| Target Platforms | Checkboxes | LinkedIn, X, Facebook, Blog |
| Tone | Dropdown | Educational, Inspirational, Opinionated, Storytelling |
| Theme | Dropdown | Career Growth, Productivity, Leadership, AI, Entrepreneurship |
| Audience | Dropdown | Founders, Developers, Students, Marketers, Beginners |
| Human Opinion | Textarea (optional) | Max 1000 characters |

---

## Error Handling

- **Network errors** — friendly message when the webhook is unreachable
- **Timeout** — 5-minute timeout with clear message (workflow may still be running)
- **Workflow errors** — HTTP error status and message surfaced from the response
- **Validation errors** — instant inline validation with Zod
- **Retry** — reset and re-submit capability on failure

---

## License

MIT
