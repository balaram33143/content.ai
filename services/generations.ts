import { supabase } from '@/lib/supabase';
import { mockDb } from '@/lib/mock-db';
import type { GenerationRecord, GenerationStatus, GenerationFormValues } from '@/types';

function platformsArrayToString(platforms: string[]): string {
  return platforms.join(',');
}

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // Check if credentials are real (not placeholder values)
  const hasRealUrl = url && url.includes('supabase.co') && !url.includes('your-') && !url.includes('placeholder');
  const hasRealKey = key && key.length > 50 && !key.includes('your-') && !key.includes('placeholder');
  
  return !!(hasRealUrl && hasRealKey);
}

export async function createGeneration(
  values: GenerationFormValues,
  videoId: string | null,
): Promise<GenerationRecord | null> {
  // Use mock database if Supabase not configured
  if (!isSupabaseConfigured()) {
    console.log('Using mock database (Supabase not configured)');
    return mockDb.createGeneration(values, videoId);
  }

  const { data, error } = await supabase
    .from('generations')
    .insert({
      youtube_url: values.youtubeUrl,
      email: values.email,
      platforms: platformsArrayToString(values.platforms),
      tone: values.tone,
      theme: values.theme,
      audience: values.audience,
      human_opinion: values.humanOpinion || null,
      video_id: videoId,
      status: 'running' as GenerationStatus,
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to create generation record:', error);
    return null;
  }
  return data as unknown as GenerationRecord;
}

export async function updateGeneration(
  id: string,
  updates: Partial<GenerationRecord>,
): Promise<void> {
  if (!isSupabaseConfigured()) {
    await mockDb.updateGeneration(id, updates);
    return;
  }

  const { error } = await supabase
    .from('generations')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) console.error('Failed to update generation:', error);
}

export async function getGeneration(id: string): Promise<GenerationRecord | null> {
  if (!isSupabaseConfigured()) {
    return mockDb.getGeneration(id);
  }

  const { data, error } = await supabase
    .from('generations')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) {
    console.error('Failed to fetch generation:', error);
    return null;
  }
  return data as unknown as GenerationRecord | null;
}

export interface HistoryFilters {
  search?: string;
  status?: GenerationStatus | 'all';
  sortBy?: 'newest' | 'oldest';
  page?: number;
  pageSize?: number;
}

export async function fetchHistory(filters: HistoryFilters): Promise<{
  records: GenerationRecord[];
  total: number;
}> {
  if (!isSupabaseConfigured()) {
    return mockDb.fetchHistory(filters);
  }

  const { search, status, sortBy = 'newest', page = 1, pageSize = 8 } = filters;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase.from('generations').select('*', { count: 'exact' });

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }
  if (search) {
    query = query.or(
      `youtube_url.ilike.%${search}%,email.ilike.%${search}%,tone.ilike.%${search}%,theme.ilike.%${search}%`,
    );
  }
  query = query.order('created_at', { ascending: sortBy === 'oldest' });
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error('Failed to fetch history:', error);
    return { records: [], total: 0 };
  }
  return { records: (data as unknown as GenerationRecord[]) || [], total: count || 0 };
}

export async function deleteGeneration(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return mockDb.deleteGeneration(id);
  }

  const { error } = await supabase.from('generations').delete().eq('id', id);
  if (error) {
    console.error('Failed to delete generation:', error);
    return false;
  }
  return true;
}
