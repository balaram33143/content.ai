export type Platform = 'LinkedIn' | 'X' | 'Facebook' | 'Blog'

export type Tone =
  | 'Educational'
  | 'Inspirational'
  | 'Opinionated'
  | 'Storytelling'
  | 'Motivational'
  | 'Humorous / Witty'
  | 'Professional / Formal'
  | 'Conversational / Casual'
  | 'Bold / Provocative'
  | 'Analytical / Data-Driven'

export type Theme =
  | 'Career Growth'
  | 'Productivity'
  | 'Leadership'
  | 'AI'
  | 'Entrepreneurship'
  | 'Marketing'
  | 'Personal Finance'
  | 'Health & Wellness'
  | 'Technology & Innovation'
  | 'Sales'
  | 'Personal Branding'
  | 'Remote Work'
  | 'Startups & Innovation'

export type Audience =
  | 'Founders'
  | 'Developers'
  | 'Students'
  | 'Marketers'
  | 'Beginners'
  | 'Executives / C-Suite'
  | 'Small Business Owners'
  | 'Freelancers'
  | 'Content Creators'
  | 'HR Professionals'
  | 'Sales Professionals'
  | 'General Public'

export interface GenerationFormValues {
  youtubeUrl: string
  email: string
  platforms: Platform[]
  tone: Tone
  theme: Theme
  audience: Audience
  humanOpinion?: string
}

export type GenerationStatus = 'pending' | 'running' | 'completed' | 'failed'

export interface GenerationResult {
  linkedinPost: string
  xPost: string
  facebookPost: string
  blogPost: string
  imageUrl: string
  reportUrl: string
  folderUrl: string
  metadataFileUrl: string
}

export interface GenerationRecord {
  id: string
  youtube_url: string
  email: string
  platforms: string
  tone: string
  theme: string
  audience: string
  human_opinion: string | null
  video_id: string | null
  status: GenerationStatus
  linkedin_post: string | null
  x_post: string | null
  facebook_post: string | null
  blog_post: string | null
  image_url: string | null
  report_url: string | null
  folder_url: string | null
  metadata_file_url: string | null
  error_message: string | null
  created_at: string
  updated_at: string
}
