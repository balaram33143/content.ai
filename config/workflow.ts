import type { Platform, Tone, Theme, Audience, WorkflowNode } from '@/types';

export const PLATFORMS: { value: Platform; label: string; icon: string }[] = [
  { value: 'LinkedIn', label: 'LinkedIn', icon: 'linkedin' },
  { value: 'X', label: 'X (Twitter)', icon: 'twitter' },
  { value: 'Facebook', label: 'Facebook', icon: 'facebook' },
  { value: 'Blog', label: 'Blog', icon: 'file-text' },
];

export const TONES: Tone[] = ['Educational', 'Inspirational', 'Opinionated', 'Storytelling'];

export const THEMES: Theme[] = ['Career Growth', 'Productivity', 'Leadership', 'AI', 'Entrepreneurship'];

export const AUDIENCES: Audience[] = ['Founders', 'Developers', 'Students', 'Marketers', 'Beginners'];

export const MAX_HUMAN_OPINION_LENGTH = 1000;

export const YOUTUBE_URL_REGEX =
  /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)[\w-]{11}([?&].*)?$/;

export function extractVideoId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  );
  return match ? match[1] : null;
}

export const WORKFLOW_NODES: WorkflowNode[] = [
  { id: 'form-trigger', label: 'User Form Submission', type: 'formTrigger', status: 'idle', description: 'Receives user inputs from the frontend form.' },
  { id: 'extract-video-id', label: 'Extract Video ID', type: 'code', status: 'idle', description: 'Parses the YouTube URL to isolate the video ID.' },
  { id: 'apify-transcript', label: 'Start Apify Transcript Extraction', type: 'httpRequest', status: 'idle', description: 'Triggers Apify actor to fetch the YouTube transcript.' },
  { id: 'wait', label: 'Wait for Apify', type: 'wait', status: 'idle', description: 'Pauses execution until transcript extraction finishes.' },
  { id: 'check-status', label: 'Check Apify Status', type: 'httpRequest', status: 'idle', description: 'Polls Apify for completion status.' },
  { id: 'transcript-ready', label: 'Transcript Ready', type: 'if', status: 'idle', description: 'Confirms transcript is ready for processing.' },
  { id: 'insight-extraction', label: 'Insight Extraction', type: 'googleGemini', status: 'idle', description: 'Gemini analyzes transcript and extracts key insights.' },
  { id: 'creative-transformation', label: 'Creative Transformation', type: 'googleGemini', status: 'idle', description: 'Gemini transforms insights into creative content ideas.' },
  { id: 'split-platforms', label: 'Split Platforms', type: 'code', status: 'idle', description: 'Splits content ideas into parallel platform branches.' },
  { id: 'platform-router', label: 'Platform Router', type: 'switch', status: 'idle', description: 'Routes each idea to the correct platform formatter.' },
  { id: 'linkedin-formatter', label: 'LinkedIn Formatter', type: 'googleGemini', status: 'idle', description: 'Gemini formats content for LinkedIn.' },
  { id: 'x-formatter', label: 'X Formatter', type: 'googleGemini', status: 'idle', description: 'Gemini formats content for X (Twitter).' },
  { id: 'facebook-formatter', label: 'Facebook Formatter', type: 'googleGemini', status: 'idle', description: 'Gemini formats content for Facebook.' },
  { id: 'blog-formatter', label: 'Blog Formatter', type: 'googleGemini', status: 'idle', description: 'Gemini formats content as a blog article.' },
  { id: 'merge-content', label: 'Merge Content', type: 'merge', status: 'idle', description: 'Merges all formatted platform outputs.' },
  { id: 'aggregate', label: 'Aggregate Platform Content', type: 'code', status: 'idle', description: 'Aggregates merged content into a single dataset.' },
  { id: 'create-drive-folder', label: 'Create Drive Folder', type: 'googleDrive', status: 'idle', description: 'Creates a Google Drive folder for outputs.' },
  { id: 'image-prompt', label: 'Generate Image Prompt', type: 'googleGemini', status: 'idle', description: 'Gemini creates a prompt for the AI image.' },
  { id: 'generate-image', label: 'Generate AI Image', type: 'httpRequest', status: 'idle', description: 'Calls image generation API with the prompt.' },
  { id: 'generate-report', label: 'Generate Report', type: 'code', status: 'idle', description: 'Builds the full report content from all outputs.' },
  { id: 'create-doc', label: 'Create Google Document', type: 'googleDocs', status: 'idle', description: 'Creates a new Google Doc for the report.' },
  { id: 'write-report', label: 'Write Report', type: 'googleDocs', status: 'idle', description: 'Writes report content into the Google Doc.' },
  { id: 'share-doc', label: 'Share Document', type: 'googleDocs', status: 'idle', description: 'Shares the Google Doc with the submitted email.' },
  { id: 'upload-image', label: 'Upload Image to Drive', type: 'googleDrive', status: 'idle', description: 'Uploads the generated image to the Drive folder.' },
  { id: 'synchronize', label: 'Synchronize', type: 'merge', status: 'idle', description: 'Waits for doc and image uploads to complete.' },
  { id: 'build-metadata', label: 'Build Metadata', type: 'code', status: 'idle', description: 'Constructs metadata object for all outputs.' },
  { id: 'convert-metadata', label: 'Convert Metadata to JSON', type: 'code', status: 'idle', description: 'Converts metadata object to a JSON file.' },
  { id: 'upload-metadata', label: 'Upload Metadata File', type: 'googleDrive', status: 'idle', description: 'Uploads the metadata JSON file to Drive.' },
  { id: 'build-output', label: 'Build Final Output', type: 'code', status: 'idle', description: 'Assembles the final response payload.' },
  { id: 'log-sheets', label: 'Log to Google Sheets', type: 'googleSheets', status: 'idle', description: 'Appends a row to Google Sheets for logging.' },
  { id: 'final-response', label: 'Return Final Response', type: 'respondToWebhook', status: 'idle', description: 'Returns the final payload to the frontend.' },
];

export const WORKFLOW_PROGRESS_STEPS = WORKFLOW_NODES.map((n) => ({
  id: n.id,
  label: n.label,
  description: n.description,
}));

export const NODE_TYPE_COLORS: Record<string, string> = {
  formTrigger: 'bg-blue-500',
  code: 'bg-emerald-500',
  httpRequest: 'bg-amber-500',
  wait: 'bg-orange-500',
  if: 'bg-cyan-500',
  switch: 'bg-cyan-500',
  googleGemini: 'bg-violet-500',
  googleDrive: 'bg-yellow-500',
  googleDocs: 'bg-indigo-500',
  googleSheets: 'bg-green-500',
  merge: 'bg-pink-500',
  respondToWebhook: 'bg-rose-500',
};
