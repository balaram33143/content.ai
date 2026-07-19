# 🚀 Quick Start Checklist

Follow these steps to get your ContentForge application fully connected to n8n and Supabase.

---

## Step 1: Set Up Supabase Database

### 1.1 Create a Supabase Project
- [ ] Go to https://supabase.com and sign up (free tier is fine)
- [ ] Click "New Project"
- [ ] Enter project details:
  - Name: `ContentForge` (or your preferred name)
  - Database Password: Generate a strong password
  - Region: Choose closest to your location
- [ ] Click "Create new project" and wait for initialization (~2 minutes)

### 1.2 Get Your Credentials
- [ ] In Supabase dashboard, go to **Settings → API**
- [ ] Copy `Project URL` → Save it
- [ ] Copy `anon public` key → Save it

### 1.3 Create the Database Table
- [ ] In Supabase, go to **SQL Editor**
- [ ] Click **New Query**
- [ ] Paste this SQL:

```sql
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

CREATE INDEX IF NOT EXISTS idx_generations_status ON generations(status);
CREATE INDEX IF NOT EXISTS idx_generations_email ON generations(email);
```

- [ ] Click **Execute**
- [ ] Verify the table appears in **Table Editor → generations**

---

## Step 2: Set Up n8n Workflow

### Option A: Local n8n (Development)

- [ ] Install n8n:
  ```bash
  npm install -g n8n
  n8n start
  ```
- [ ] Open http://localhost:5678
- [ ] Create a new workflow
- [ ] Add a **Webhook** trigger:
  - Method: `POST`
  - Path: `/generate-content` (or any unique path)
- [ ] Add your processing nodes (AI, database updates, etc.)
- [ ] **Save** and **Deploy** the workflow
- [ ] Your webhook URL will be: `http://localhost:5678/webhook/generate-content`
- [ ] For testing inactive workflows: `http://localhost:5678/webhook-test/generate-content`

### Option B: Cloud n8n

- [ ] Go to https://n8n.cloud and create an account
- [ ] Create a new workflow
- [ ] Add **Webhook** trigger and set your path
- [ ] Deploy the workflow
- [ ] Copy the webhook URL from the workflow details

---

## Step 3: Update Environment Variables

### 3.1 Edit `.env.local`

Replace the placeholder values with your actual credentials:

```env
# From Supabase Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# From n8n webhook trigger
NEXT_PUBLIC_N8N_WEBHOOK_URL=http://localhost:5678/webhook/generate-content
```

### 3.2 Save and Restart

- [ ] Save `.env.local`
- [ ] Restart the development server:
  ```bash
  # Stop: Ctrl+C in the terminal
  # Restart: npm run dev
  ```

---

## Step 4: Verify Connection

### 4.1 Check Diagnostics
- [ ] Open http://localhost:3000/dashboard/diagnostics
- [ ] Look for the status of each check:
  - ✓ n8n Webhook URL configured
  - ✓ Supabase URL configured
  - ✓ Supabase Key configured
  - ✓ Supabase Connection (OK)
  - ✓ n8n Webhook (Reachable)

### 4.2 Alternative: Settings Page
- [ ] Go to http://localhost:3000/dashboard/settings
- [ ] Paste your webhook URL in the "n8n Webhook URL" field
- [ ] Click "Test Connection"
- [ ] Should show "Connected to n8n workflow" ✓

---

## Step 5: Test End-to-End

### 5.1 Create a Generation
- [ ] Go to http://localhost:3000/dashboard/generate
- [ ] Fill in the form:
  - YouTube URL: Any valid YouTube video
  - Email: Your email
  - Platforms: Select at least one
  - Other fields as desired
- [ ] Click "Generate Content"

### 5.2 Check Results
- [ ] If successful → should see the workflow running
- [ ] Go to History page to see the status
- [ ] Check Supabase → Table Editor → generations to see the record

---

## Troubleshooting

### ❌ "HTTP 404 - Webhook not found"

**Possible causes:**
1. Webhook URL is incorrect
2. n8n workflow is not deployed/active
3. n8n service is not running

**Solutions:**
- Double-check the webhook URL from n8n
- Make sure the workflow is **deployed** (not just saved)
- For testing: use `/webhook-test/` path while testing
- Verify n8n is running: http://localhost:5678

### ❌ Supabase connection failed

**Possible causes:**
1. Invalid URL or API key
2. Typo in environment variables
3. Network/firewall issue

**Solutions:**
- Re-copy the credentials from Supabase Settings → API
- Check for extra spaces in `.env.local`
- Verify the URL includes `https://` and ends with `supabase.co`

### ❌ "No generations yet" after submitting

**Possible causes:**
1. Webhook not returning valid response
2. Database table doesn't exist
3. Incorrect table permissions

**Solutions:**
- Check n8n workflow execution logs
- Verify the `generations` table exists in Supabase
- Check Supabase → Authentication → Policies

---

## Important Notes

### Webhook URL Format

- **Active workflow (production)**: `https://instance.com/webhook/path`
- **Inactive workflow (testing)**: `https://instance.com/webhook-test/path`

The system automatically tries both if needed.

### Environment Variables

- `NEXT_PUBLIC_*` variables are exposed to the browser (safe for URLs/keys)
- Always use strong passwords for Supabase
- Never commit `.env.local` to version control

### File Locations

- Environment file: `project/.env.local`
- API route: `project/app/api/n8n/route.ts`
- Diagnostics API: `project/app/api/diagnostic/route.ts`
- Diagnostics page: `project/app/dashboard/diagnostics/page.tsx`

---

## Next Steps

Once everything is connected:

1. Customize the n8n workflow for your use case
2. Configure YouTube transcript extraction (if needed)
3. Set up AI providers (OpenAI, Gemini, etc.) in n8n
4. Test with various content types
5. Deploy to production (Vercel + n8n Cloud)

---

## Support Resources

- 📖 [Supabase Docs](https://supabase.com/docs)
- 📖 [n8n Docs](https://docs.n8n.io/)
- 📖 [Next.js Docs](https://nextjs.org/docs)
- 💬 [Supabase Discord](https://discord.supabase.com)
- 💬 [n8n Community](https://community.n8n.io)

---

## Architecture Reminder

```
Browser                  Next.js Backend          n8n Workflow         Database
┌──────────┐            ┌────────────┐          ┌──────────┐         ┌────────────┐
│ Frontend │  POST      │ /api/n8n   │ POST     │ Webhook  │  SQL    │ Supabase   │
│          ├───────────▶│ (proxy)    ├─────────▶│ Trigger  ├────────▶│ PostgreSQL │
│          │            │            │          │          │         │            │
│ Records  │ GET        │            │  GET     │          │ SELECT  │ generations│
│ from DB  │◀───────────│ /api/rpc   │◀─────────│ Response │◀────────│ table      │
└──────────┘            └────────────┘          └──────────┘         └────────────┘
```

1. User fills form on frontend
2. Frontend sends POST to Next.js proxy (`/api/n8n`)
3. Proxy forwards to n8n webhook
4. n8n processes and can update database
5. Frontend fetches results from Supabase

---

**You're all set!** 🎉 Your ContentForge app is now ready to use.
