/**
 * Mock Database - Simulates Supabase for development/testing
 * Replace with real Supabase when ready
 */

import { GenerationRecord, GenerationStatus } from '@/types';

interface MockStore {
  generations: Map<string, GenerationRecord>;
}

const store: MockStore = {
  generations: new Map(),
};

// Seed initial mock data
function seedMockData() {
  const mockRecords: GenerationRecord[] = [
    {
      id: '1',
      youtube_url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
      email: 'demo@example.com',
      platforms: 'LinkedIn,Twitter,Facebook',
      tone: 'Educational',
      theme: 'AI',
      audience: 'Developers',
      human_opinion: 'Great AI concepts explained clearly',
      video_id: 'jNQXAC9IVRw',
      status: 'completed',
      linkedin_post: 'Here is a LinkedIn post about AI and productivity...',
      x_post: 'Check out these AI tips!',
      facebook_post: 'Learn about the future of AI in our new update.',
      blog_post: 'This is a long blog post detailing AI architecture...',
      image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
      report_url: 'https://docs.google.com/document/d/1demo-doc-id/edit',
      folder_url: 'https://drive.google.com/drive/folders/1demo-folder-id',
      metadata_file_url: 'https://drive.google.com/file/d/1demo-metadata-id/view',
      error_message: null,
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: '2',
      youtube_url: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
      email: 'user@example.com',
      platforms: 'LinkedIn,Blog',
      tone: 'Inspirational',
      theme: 'Leadership',
      audience: 'Founders',
      human_opinion: '',
      video_id: '9bZkp7q19f0',
      status: 'completed',
      linkedin_post: 'Inspirational thoughts on leadership...',
      x_post: null,
      facebook_post: null,
      blog_post: 'Detailed guide to modern leadership...',
      image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c',
      report_url: 'https://docs.google.com/document/d/1demo-doc-id-2/edit',
      folder_url: 'https://drive.google.com/drive/folders/1demo-folder-id-2',
      metadata_file_url: 'https://drive.google.com/file/d/1demo-metadata-id-2/view',
      error_message: null,
      created_at: new Date(Date.now() - 172800000).toISOString(),
      updated_at: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: '3',
      youtube_url: 'https://www.youtube.com/watch?v=kffacxfA7g4',
      email: 'demo@example.com',
      platforms: 'Twitter',
      tone: 'Opinionated',
      theme: 'Productivity',
      audience: 'Marketers',
      human_opinion: 'Focus on ROI metrics',
      video_id: 'kffacxfA7g4',
      status: 'running',
      linkedin_post: null,
      x_post: null,
      facebook_post: null,
      blog_post: null,
      image_url: null,
      report_url: null,
      folder_url: null,
      metadata_file_url: null,
      error_message: null,
      created_at: new Date(Date.now() - 3600000).toISOString(),
      updated_at: new Date(Date.now() - 3600000).toISOString(),
    },
  ];

  mockRecords.forEach((record) => {
    store.generations.set(record.id, record);
  });
}

// Initialize on first import
seedMockData();

export const mockDb = {
  async createGeneration(values: any, videoId: string | null): Promise<GenerationRecord | null> {
    const id = Math.random().toString(36).substr(2, 9);
    const now = new Date().toISOString();
    
    const record: GenerationRecord = {
      id,
      youtube_url: values.youtubeUrl,
      email: values.email,
      platforms: values.platforms.join(','),
      tone: values.tone,
      theme: values.theme,
      audience: values.audience,
      human_opinion: values.humanOpinion || null,
      video_id: videoId,
      status: 'completed' as GenerationStatus,
      linkedin_post: 'Generated LinkedIn post: ' + values.theme,
      x_post: 'Generated X post: ' + values.theme,
      facebook_post: 'Generated Facebook post: ' + values.theme,
      blog_post: 'Generated Blog post: ' + values.theme,
      image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
      report_url: 'https://docs.google.com/document/d/1demo-doc-id/edit',
      folder_url: 'https://drive.google.com/drive/folders/1demo-folder-id',
      metadata_file_url: 'https://drive.google.com/file/d/1demo-metadata-id/view',
      error_message: null,
      created_at: now,
      updated_at: now,
    };

    store.generations.set(id, record);
    return record;
  },

  async updateGeneration(id: string, updates: Partial<GenerationRecord>): Promise<void> {
    const record = store.generations.get(id);
    if (record) {
      store.generations.set(id, {
        ...record,
        ...updates,
        updated_at: new Date().toISOString(),
      });
    }
  },

  async getGeneration(id: string): Promise<GenerationRecord | null> {
    return store.generations.get(id) || null;
  },

  async fetchHistory(filters: any): Promise<{ records: GenerationRecord[]; total: number }> {
    let records = Array.from(store.generations.values());

    // Filter by status
    if (filters.status && filters.status !== 'all') {
      records = records.filter((r) => r.status === filters.status);
    }

    // Search
    if (filters.search) {
      const search = filters.search.toLowerCase();
      records = records.filter(
        (r) =>
          r.youtube_url.toLowerCase().includes(search) ||
          r.email.toLowerCase().includes(search) ||
          r.tone.toLowerCase().includes(search) ||
          r.theme.toLowerCase().includes(search),
      );
    }

    // Sort
    records.sort((a, b) => {
      const aTime = new Date(a.created_at).getTime();
      const bTime = new Date(b.created_at).getTime();
      return filters.sortBy === 'oldest' ? aTime - bTime : bTime - aTime;
    });

    // Paginate
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 8;
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    const paginated = records.slice(from, to);

    return { records: paginated, total: records.length };
  },

  async deleteGeneration(id: string): Promise<boolean> {
    return store.generations.delete(id);
  },

  // For testing: clear all data
  clear(): void {
    store.generations.clear();
    seedMockData();
  },

  // For testing: get all data
  getAll(): GenerationRecord[] {
    return Array.from(store.generations.values());
  },
};
