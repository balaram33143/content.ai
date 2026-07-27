import { supabase, isSupabaseConfigured } from './supabase'
import type { GenerationRecord, GenerationStatus, GenerationFormValues, GenerationResult } from '../types'

function platformsToString(platforms: string[]): string {
  return platforms.join(',')
}

export async function createGeneration(
  values: GenerationFormValues,
  videoId: string | null,
): Promise<GenerationRecord | null> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn('[generations] Supabase not configured — skipping DB insert')
    return null
  }

  const insertPayload = {
    youtube_url: values.youtubeUrl,
    email: values.email,
    platforms: platformsToString(values.platforms),
    tone: values.tone,
    theme: values.theme,
    audience: values.audience,
    human_opinion: values.humanOpinion || null,
    video_id: videoId,
    status: 'running' as GenerationStatus,
  }

  console.log('[generations] Inserting record:', insertPayload)

  const { data, error } = await supabase
    .from('generations')
    .insert(insertPayload)
    .select()
    .single()

  if (error) {
    console.error('[generations] Insert failed:', error.message, error.details)
    return null
  }

  console.log('[generations] Inserted record id:', data?.id)
  return data as unknown as GenerationRecord
}

export async function updateGeneration(
  id: string,
  updates: Partial<GenerationRecord>,
): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return

  const { error } = await supabase
    .from('generations')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) console.error('[generations] Update failed:', error.message)
  else console.log('[generations] Updated record:', id)
}

export async function completeGeneration(
  id: string,
  result: GenerationResult,
): Promise<void> {
  await updateGeneration(id, {
    status: 'completed',
    linkedin_post: result.linkedinPost,
    x_post: result.xPost,
    facebook_post: result.facebookPost,
    blog_post: result.blogPost,
    image_url: result.imageUrl,
    image_prompt: result.imagePrompt,
    report_url: result.reportUrl,
    folder_url: result.folderUrl,
    metadata_file_url: result.metadataFileUrl,
  })
}

export async function failGeneration(id: string, errorMessage: string): Promise<void> {
  await updateGeneration(id, {
    status: 'failed',
    error_message: errorMessage,
  })
}

export async function getGeneration(id: string): Promise<GenerationRecord | null> {
  if (!isSupabaseConfigured || !supabase) return null

  const { data, error } = await supabase
    .from('generations')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    console.error('[generations] Fetch failed:', error.message)
    return null
  }
  return data as unknown as GenerationRecord | null
}

export interface HistoryFilters {
  search?: string
  status?: GenerationStatus | 'all'
  sortBy?: 'newest' | 'oldest'
  page?: number
  pageSize?: number
}

export async function fetchHistory(filters: HistoryFilters): Promise<{
  records: GenerationRecord[]
  total: number
}> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn('[generations] Supabase not configured — returning empty history')
    return { records: [], total: 0 }
  }

  const { search, status, sortBy = 'newest', page = 1, pageSize = 8 } = filters
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase.from('generations').select('*', { count: 'exact' })

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }
  if (search) {
    query = query.or(
      `youtube_url.ilike.%${search}%,email.ilike.%${search}%,tone.ilike.%${search}%,theme.ilike.%${search}%`,
    )
  }
  query = query.order('created_at', { ascending: sortBy === 'oldest' })
  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    console.error('[generations] History fetch failed:', error.message)
    return { records: [], total: 0 }
  }

  console.log('[generations] History fetched:', data?.length, 'records, total:', count)
  return { records: (data as unknown as GenerationRecord[]) || [], total: count || 0 }
}

export async function deleteGeneration(id: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) return false

  const { error } = await supabase.from('generations').delete().eq('id', id)
  if (error) {
    console.error('[generations] Delete failed:', error.message)
    return false
  }
  console.log('[generations] Deleted record:', id)
  return true
}
