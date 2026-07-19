export type Platform = 'LinkedIn' | 'X' | 'Facebook' | 'Blog';

export type Tone =
  | 'Educational'
  | 'Inspirational'
  | 'Opinionated'
  | 'Storytelling';

export type Theme =
  | 'Career Growth'
  | 'Productivity'
  | 'Leadership'
  | 'AI'
  | 'Entrepreneurship';

export type Audience =
  | 'Founders'
  | 'Developers'
  | 'Students'
  | 'Marketers'
  | 'Beginners';

export interface GenerationFormValues {
  youtubeUrl: string;
  email: string;
  platforms: Platform[];
  tone: Tone;
  theme: Theme;
  audience: Audience;
  humanOpinion?: string;
}

export interface YouTubePreview {
  videoId: string;
  title: string;
  channelName: string;
  thumbnail: string;
  duration: string;
}

export type GenerationStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface GenerationRecord {
  id: string;
  youtube_url: string;
  email: string;
  platforms: string;
  tone: string;
  theme: string;
  audience: string;
  human_opinion: string | null;
  video_id: string | null;
  status: GenerationStatus;
  linkedin_post: string | null;
  x_post: string | null;
  facebook_post: string | null;
  blog_post: string | null;
  image_url: string | null;
  report_url: string | null;
  folder_url: string | null;
  metadata_file_url: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface GenerationResult {
  linkedinPost: string;
  xPost: string;
  facebookPost: string;
  blogPost: string;
  imageUrl: string;
  reportUrl: string;
  folderUrl: string;
  metadataFileUrl: string;
}

export type NodeStatus = 'idle' | 'running' | 'waiting' | 'completed' | 'failed';

export interface WorkflowNode {
  id: string;
  label: string;
  type: string;
  status: NodeStatus;
  description: string;
}

export interface AppSettings {
  webhookUrl: string;
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
}
