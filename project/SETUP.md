# Backend & Database Setup Guide

## Overview
This application connects:
- **Frontend**: Next.js (running on localhost:3000)
- **Backend**: n8n workflow automation (locally or cloud)
- **Database**: Supabase PostgreSQL

## Quick Setup

### 1. Supabase Database Setup

#### Step 1: Create a Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project" and sign in
3. Enter project details:
   - **Project Name**: Your app name
   - **Database Password**: Use a strong password
   - **Region**: Choose closest to you
4. Click "Create new project" (wait for initialization)

#### Step 2: Get Your Credentials
1. In Supabase dashboard, go to **Settings → API**
2. Copy:
   - `Project URL` → Paste into `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → Paste into `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### Step 3: Create the Database Table
1. In Supabase, go to **SQL Editor**
2. Click **New Query**
3. Paste this SQL:

```sql
-- Create generations table
CREATE TABLE IF NOT EXISTS generations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  youtube_url TEXT NOT NULL,
  email TEXT NOT NULL,
  platforms TEXT,
  tone TEXT,
  theme TEXT,
  audience TEXT,
  human_opinion TEXT,
  video_id TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create an index for faster queries
CREATE INDEX IF NOT EXISTS idx_generations_status ON generations(status);
CREATE INDEX IF NOT EXISTS idx_generations_email ON generations(email);
```

4. Click **Execute**
5. Verify the table was created in **Table Editor → generations**

---

### 2. n8n Workflow Setup

#### Option A: Local n8n Setup

1. **Install n8n**:
   ```bash
   npm install -g n8n
   n8n start
   ```
   - n8n will run on `http://localhost:5678`

2. **Create a Webhook Workflow**:
   - Open `http://localhost:5678`
   - Click **+ New** → **New Workflow**
   - Add **Webhook** trigger:
     - Method: `POST`
     - Path: `/your-workflow-id` (e.g., `/generate-content`)
   - Add your automation nodes (e.g., AI processing, database updates)
   - Click **Test webhook** to get the test URL
   - Deploy the workflow

3. **Get Your Webhook URL**:
   - When workflow is active: `http://localhost:5678/webhook/your-workflow-id`
   - When workflow is inactive (testing): `http://localhost:5678/webhook-test/your-workflow-id`

4. **Update Environment Variables**:
   ```env
   NEXT_PUBLIC_N8N_WEBHOOK_URL=http://localhost:5678/webhook/your-workflow-id
   ```

#### Option B: Cloud n8n Setup

1. Go to [n8n.cloud](https://n8n.cloud)
2. Create account and new workflow
3. Set up webhook trigger with your desired path
4. Copy the webhook URL
5. Update `.env.local`:
   ```env
   NEXT_PUBLIC_N8N_WEBHOOK_URL=https://n8n.cloud/webhook/your-workflow-id
   ```

---

### 3. Connect Everything

#### Update `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...

# n8n Webhook
NEXT_PUBLIC_N8N_WEBHOOK_URL=http://localhost:5678/webhook/your-workflow-id
```

#### Test the Connection:

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Visit the **Settings page** to verify n8n connection:
   - Paste the webhook URL in the Settings form
   - Check that the connection status shows green

3. Try creating a generation to test the full flow

---

## Troubleshooting

### HTTP 404 Error - Webhook Not Found

**Causes:**
1. Webhook URL is incorrect
2. n8n workflow is inactive (should use `/webhook-test/` instead)
3. n8n service is not running

**Fix:**
- Verify your n8n workflow is deployed
- If testing, use `/webhook-test/` path
- Check that n8n is running: `http://localhost:5678`

### Supabase Connection Failed

**Causes:**
1. Missing environment variables
2. Invalid API key
3. Database table doesn't exist

**Fix:**
- Double-check `NEXT_PUBLIC_SUPABASE_URL` and key
- Verify table exists in Supabase dashboard
- Check browser console for detailed errors

### Data Not Saving

**Causes:**
1. Supabase table name mismatch
2. Column names don't match
3. RLS policies blocking inserts

**Fix:**
- Verify table name is `generations`
- Check column names in migration
- In Supabase → Authentication → Policies, ensure inserts are allowed

---

## Architecture Flow

```
┌─────────────────┐
│   Frontend      │
│  (Next.js)      │
│ localhost:3000  │
└────────┬────────┘
         │ POST /api/n8n
         ▼
┌─────────────────┐     ┌─────────────────┐
│  API Proxy      │────▶│  n8n Webhook    │
│  /api/n8n       │     │ localhost:5678  │
└────────┬────────┘     └────────┬────────┘
         │                       │
         │ INSERT record        │ Process workflow
         ▼                       ▼
    ┌────────────────────────────┐
    │  Supabase Database         │
    │  (PostgreSQL)              │
    │  Table: generations        │
    └────────────────────────────┘
```

1. User submits form on frontend
2. Frontend calls `/api/n8n` proxy endpoint
3. Proxy forwards to n8n webhook
4. n8n processes the request and can update Supabase
5. Frontend displays results from Supabase

---

## Database Schema

The `generations` table stores all content generation records:

```sql
- id (UUID) - Primary key
- youtube_url (TEXT) - Source video URL
- email (TEXT) - User email
- platforms (TEXT) - Comma-separated: "LinkedIn,Twitter,Facebook"
- tone (TEXT) - Content tone: "Educational", "Inspirational", etc.
- theme (TEXT) - Content theme: "AI", "Leadership", etc.
- audience (TEXT) - Target audience: "Developers", "Founders", etc.
- human_opinion (TEXT) - User's additional input
- video_id (TEXT) - Extracted video ID from YouTube URL
- status (TEXT) - "pending", "running", "completed", "failed"
- created_at (TIMESTAMP) - Record creation time
- updated_at (TIMESTAMP) - Last update time
```

---

## Next Steps

1. ✅ Create Supabase project and get credentials
2. ✅ Set up n8n locally or in cloud
3. ✅ Create webhook trigger in n8n
4. ✅ Update `.env.local` with URLs and keys
5. ✅ Run `npm run dev`
6. ✅ Test via the Settings page
7. ✅ Create your first generation!

---

## Common n8n Workflow Template

Here's a basic webhook workflow to get started:

1. **Webhook Trigger**
   - Method: POST
   - Path: /generate-content

2. **Parse Request** (if needed)
   - Extract fields from request body

3. **Store in Database**
   - Use Supabase node to insert record

4. **Call AI Service** (Optional)
   - Call OpenAI or other AI API

5. **Update Database**
   - Update the record with results

6. **Return Response**
   - Send success response back to frontend

---

Need more help? Check out:
- [Supabase Docs](https://supabase.com/docs)
- [n8n Docs](https://docs.n8n.io/)
- [Next.js Docs](https://nextjs.org/docs)
