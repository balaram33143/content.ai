/*
# Create generations table (single-tenant, no auth)

1. New Tables
- `generations`
  - `id` (uuid, primary key)
  - `youtube_url` (text, not null) - the submitted YouTube video URL
  - `email` (text, not null) - submitter email (used by workflow to share Google Doc)
  - `platforms` (text, not null) - comma-joined selected platforms (LinkedIn, X, Facebook, Blog)
  - `tone` (text, not null) - selected tone
  - `theme` (text, not null) - selected theme
  - `audience` (text, not null) - selected target audience
  - `human_opinion` (text, nullable) - optional human insight/opinion
  - `video_id` (text, nullable) - extracted YouTube video id
  - `status` (text, not null default 'pending') - pending | running | completed | failed
  - `linkedin_post` (text, nullable) - generated LinkedIn content
  - `x_post` (text, nullable) - generated X/Twitter content
  - `facebook_post` (text, nullable) - generated Facebook content
  - `blog_post` (text, nullable) - generated blog article
  - `image_url` (text, nullable) - generated AI image link
  - `report_url` (text, nullable) - Google Doc report link
  - `folder_url` (text, nullable) - Google Drive folder link
  - `metadata_file_url` (text, nullable) - metadata JSON file link
  - `error_message` (text, nullable) - error details if failed
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

2. Security
- Enable RLS on `generations`.
- Allow anon + authenticated full CRUD because the data is intentionally shared/public (no sign-in app).

3. Notes
- No user_id column or auth.users FK — single-tenant app with no sign-in.
- Index on created_at for history sorting/pagination.
*/

CREATE TABLE IF NOT EXISTS generations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  youtube_url text NOT NULL,
  email text NOT NULL,
  platforms text NOT NULL,
  tone text NOT NULL,
  theme text NOT NULL,
  audience text NOT NULL,
  human_opinion text,
  video_id text,
  status text NOT NULL DEFAULT 'pending',
  linkedin_post text,
  x_post text,
  facebook_post text,
  blog_post text,
  image_url text,
  report_url text,
  folder_url text,
  metadata_file_url text,
  error_message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_generations" ON generations;
CREATE POLICY "anon_select_generations" ON generations FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_generations" ON generations;
CREATE POLICY "anon_insert_generations" ON generations FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_generations" ON generations;
CREATE POLICY "anon_update_generations" ON generations FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_generations" ON generations;
CREATE POLICY "anon_delete_generations" ON generations FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS generations_created_at_idx ON generations (created_at DESC);
