import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key-that-is-at-least-50-characters-long-to-be-valid-for-supabase';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

