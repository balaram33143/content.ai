'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Youtube, Mail, Wand as Wand2, RotateCcw, Loader as Loader2, Sparkles, CircleAlert as AlertCircle, Link2, Zap, CircleCheck as CheckCircle2, Circle as XCircle, RefreshCw } from 'lucide-react';
import {
  PLATFORMS,
  TONES,
  THEMES,
  AUDIENCES,
  MAX_HUMAN_OPINION_LENGTH,
  YOUTUBE_URL_REGEX,
  extractVideoId,
} from '@/config/workflow';
import { useYoutubePreview } from '@/hooks/use-youtube-preview';
import { useWorkflowProgress } from '@/components/workflow-progress';
import { WorkflowProgress } from '@/components/workflow-progress';
import { submitWorkflow, parseN8nError, type N8nError } from '@/services/n8n';
import { createGeneration, updateGeneration } from '@/services/generations';
import { buildDemoResult } from '@/lib/demo-content';
import { useSettings } from '@/context/settings-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Platform, GenerationFormValues, GenerationResult } from '@/types';

const schema = z.object({
  youtubeUrl: z
    .string()
    .min(1, 'YouTube URL is required')
    .regex(YOUTUBE_URL_REGEX, 'Enter a valid YouTube URL (e.g. https://youtube.com/watch?v=...)'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  platforms: z.array(z.string()).min(1, 'Select at least one platform'),
  tone: z.string().min(1, 'Select a tone'),
  theme: z.string().min(1, 'Select a theme'),
  audience: z.string().min(1, 'Select an audience'),
  humanOpinion: z.string().max(MAX_HUMAN_OPINION_LENGTH, `Maximum ${MAX_HUMAN_OPINION_LENGTH} characters`).optional(),
});

type SubmitPhase = 'idle' | 'connecting' | 'submitting' | 'waiting' | 'completed' | 'error';

export default function GeneratePage() {
  const router = useRouter();
  const { webhookUrl, webhookConfigured, demoMode, connectionStatus, testing, testConnection } = useSettings();
  const [submitting, setSubmitting] = useState(false);
  const [phase, setPhase] = useState<SubmitPhase>('idle');
  const [error, setError] = useState<N8nError | null>(null);
  const workflow = useWorkflowProgress();

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<GenerationFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      youtubeUrl: '',
      email: '',
      platforms: [],
      tone: undefined,
      theme: undefined,
      audience: undefined,
      humanOpinion: '',
    },
  });

  const youtubeUrl = watch('youtubeUrl') || '';
  const { preview, loading: previewLoading } = useYoutubePreview(youtubeUrl);
  const humanOpinion = watch('humanOpinion') || '';

  const isConnected = connectionStatus?.connected === true;
  const canGenerate = !submitting;  // Allow generation in demo mode or with real webhook

  const onSubmit = async (values: GenerationFormValues) => {
    if (submitting) return;

    setSubmitting(true);
    setError(null);
    setPhase('connecting');
    workflow.start();

    const videoId = extractVideoId(values.youtubeUrl);
    const record = await createGeneration(values, videoId);

    try {
      setPhase('submitting');

      // Demo mode: generate rich mock content locally without calling n8n
      if (demoMode) {
        setPhase('waiting');
        workflow.completeAll();

        const result = buildDemoResult(values, videoId);

        if (record) {
          await updateGeneration(record.id, {
            status: 'completed',
            linkedin_post: result.linkedinPost,
            x_post: result.xPost,
            facebook_post: result.facebookPost,
            blog_post: result.blogPost,
            image_url: result.imageUrl,
            report_url: result.reportUrl,
            folder_url: result.folderUrl,
            metadata_file_url: result.metadataFileUrl,
          });
        }

        setPhase('completed');
        toast.success('Content generated successfully! (Demo mode)');

        const query = new URLSearchParams({
          linkedin: result.linkedinPost,
          x: result.xPost,
          facebook: result.facebookPost,
          blog: result.blogPost,
          image: result.imageUrl,
          report: result.reportUrl,
          folder: result.folderUrl,
          metadata: result.metadataFileUrl,
          videoId: videoId || '',
        }).toString();

        router.push(`/dashboard/results?${query}`);
        return;
      }

      const data = await submitWorkflow(values, webhookUrl);
      setPhase('waiting');

      workflow.completeAll();
      const result = parseResult(data);

      if (record) {
        await updateGeneration(record.id, {
          status: 'completed',
          linkedin_post: result.linkedinPost,
          x_post: result.xPost,
          facebook_post: result.facebookPost,
          blog_post: result.blogPost,
          image_url: result.imageUrl,
          report_url: result.reportUrl,
          folder_url: result.folderUrl,
          metadata_file_url: result.metadataFileUrl,
        });
      }

      setPhase('completed');
      toast.success('Content generated successfully!');

      const query = new URLSearchParams({
        linkedin: result.linkedinPost,
        x: result.xPost,
        facebook: result.facebookPost,
        blog: result.blogPost,
        image: result.imageUrl,
        report: result.reportUrl,
        folder: result.folderUrl,
        metadata: result.metadataFileUrl,
        videoId: videoId || '',
      }).toString();

      router.push(`/dashboard/results?${query}`);
    } catch (err) {
      const wfError = err as N8nError;
      const parsed = wfError.type ? wfError : parseN8nError(err);
      setError(parsed);
      setPhase('error');
      workflow.failAt(workflow.currentNodeIndex);

      if (record) {
        await updateGeneration(record.id, {
          status: 'failed',
          error_message: parsed.message,
        });
      }

      toast.error(parsed.message);
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    reset();
    workflow.reset();
    setPhase('idle');
    setError(null);
  };

  const handleRetry = () => {
    setError(null);
    setPhase('idle');
    setSubmitting(false);
    workflow.reset();
  };

  const phaseLabel: Record<SubmitPhase, string> = {
    idle: '',
    connecting: 'Connecting...',
    submitting: 'Submitting...',
    waiting: 'Waiting for Response...',
    completed: 'Completed',
    error: 'Failed',
  };

  return (
    <div className="space-y-6 pt-12 lg:pt-0">
      <div>
        <h1 className="font-display text-3xl font-bold">Generate Content</h1>
        <p className="text-muted-foreground mt-1">
          Fill in the details and let the workflow create your content suite.
        </p>
      </div>

      {/* Connection banner */}
      {!demoMode && webhookConfigured && !isConnected && (
        <Card className="glass-card rounded-xl p-4 border-amber-500/30 bg-amber-500/5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
              <div>
                <p className="text-sm font-medium">Workflow not tested yet</p>
                <p className="text-xs text-muted-foreground">
                  Test the connection to enable generation, or proceed and we'll test automatically.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => testConnection()}
              disabled={testing}
              className="rounded-lg shrink-0"
            >
              {testing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Test Connection
                </>
              )}
            </Button>
          </div>
        </Card>
      )}

      {/* Error display */}
      {error && (
        <Card className="glass-card rounded-xl p-4 border-destructive/30 bg-destructive/5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-destructive">
                  {error.statusCode ? `HTTP ${error.statusCode}` : 'Workflow Error'}
                </p>
                <p className="text-sm text-muted-foreground">{error.message}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleRetry} className="rounded-lg shrink-0">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-card rounded-2xl p-6 space-y-6">
            {/* YouTube URL */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Youtube className="h-4 w-4 text-red-500" />
                YouTube URL
              </Label>
              <Input
                {...register('youtubeUrl')}
                placeholder="https://www.youtube.com/watch?v=..."
                className={errors.youtubeUrl ? 'border-destructive' : ''}
              />
              {errors.youtubeUrl && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.youtubeUrl.message}
                </p>
              )}
            </div>

            {/* Live Preview */}
            <AnimatePresence>
              {previewLoading && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="glass rounded-xl p-4 flex items-center gap-3"
                >
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Fetching video metadata...</span>
                </motion.div>
              )}
              {preview && !previewLoading && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="glass rounded-xl p-4 flex gap-4"
                >
                  <img
                    src={preview.thumbnail}
                    alt={preview.title}
                    className="h-20 w-32 rounded-lg object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{preview.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{preview.channelName}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                      <Link2 className="h-3 w-3" />
                      Video ID: <span className="font-mono">{preview.videoId}</span>
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                Email
              </Label>
              <Input
                type="email"
                {...register('email')}
                placeholder="you@example.com"
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Platforms */}
            <div className="space-y-2">
              <Label>Target Platforms</Label>
              <Controller
                control={control}
                name="platforms"
                render={({ field }) => (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {PLATFORMS.map((p) => {
                      const checked = field.value?.includes(p.value as Platform);
                      return (
                        <label
                          key={p.value}
                          className={cn(
                            'flex items-center gap-2.5 rounded-xl border p-3 cursor-pointer transition-all hover:shadow-md',
                            checked ? 'border-primary bg-primary/5' : 'border-border',
                          )}
                        >
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(val) => {
                              if (val) {
                                field.onChange([...(field.value || []), p.value]);
                              } else {
                                field.onChange((field.value || []).filter((v: string) => v !== p.value));
                              }
                            }}
                          />
                          <span className="text-sm font-medium">{p.label}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              />
              {errors.platforms && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.platforms.message}
                </p>
              )}
            </div>

            {/* Tone, Theme, Audience */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Tone</Label>
                <Controller
                  control={control}
                  name="tone"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className={errors.tone ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        {TONES.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.tone && (
                  <p className="text-xs text-destructive">{errors.tone.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Theme</Label>
                <Controller
                  control={control}
                  name="theme"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className={errors.theme ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        {THEMES.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.theme && (
                  <p className="text-xs text-destructive">{errors.theme.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Audience</Label>
                <Controller
                  control={control}
                  name="audience"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className={errors.audience ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Select audience" />
                      </SelectTrigger>
                      <SelectContent>
                        {AUDIENCES.map((a) => (
                          <SelectItem key={a} value={a}>{a}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.audience && (
                  <p className="text-xs text-destructive">{errors.audience.message}</p>
                )}
              </div>
            </div>

            {/* Human Opinion */}
            <div className="space-y-2">
              <Label>Optional Human Opinion</Label>
              <Textarea
                {...register('humanOpinion')}
                placeholder="Add your own perspective or angle to incorporate..."
                rows={4}
                maxLength={MAX_HUMAN_OPINION_LENGTH}
                className={errors.humanOpinion ? 'border-destructive' : ''}
              />
              <div className="flex justify-between">
                {errors.humanOpinion ? (
                  <p className="text-xs text-destructive">{errors.humanOpinion.message}</p>
                ) : (
                  <span />
                )}
                <span className="text-xs text-muted-foreground tabular-nums">
                  {humanOpinion.length}/{MAX_HUMAN_OPINION_LENGTH}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={!canGenerate}
                className="flex-1 rounded-xl shadow-lg shadow-primary/20"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {phaseLabel[phase]}
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={submitting}
                className="rounded-xl"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>

            {/* Disabled hint */}
            {!canGenerate && !submitting && (
              <p className="text-xs text-muted-foreground text-center">
                {!webhookConfigured
                  ? 'Configure your webhook URL in Settings to enable generation.'
                  : ''}
              </p>
            )}
          </Card>
        </div>

        {/* Workflow Progress Sidebar */}
        <div className="lg:col-span-1">
          <AnimatePresence>
            {workflow.active && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="lg:sticky lg:top-8"
              >
                <WorkflowProgress
                  active={workflow.active}
                  currentNodeIndex={workflow.currentNodeIndex}
                  nodeStatuses={workflow.nodeStatuses}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {!workflow.active && (
            <Card className="glass-card rounded-2xl p-6 text-center">
              <Sparkles className="h-10 w-10 text-primary mx-auto mb-3 opacity-50" />
              <p className="text-sm text-muted-foreground">
                Click <span className="font-semibold text-foreground">Generate</span> to see the workflow pipeline animate in real time.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function parseResult(data: Record<string, unknown>): GenerationResult {
  const d = data as Record<string, unknown>;
  const findStr = (...keys: string[]): string => {
    for (const k of keys) {
      const v = d[k];
      if (typeof v === 'string' && v) return v;
    }
    return '';
  };

  return {
    linkedinPost: findStr('linkedin', 'linkedinPost', 'LinkedIn', 'linkedin_post', 'linkedinContent'),
    xPost: findStr('x', 'xPost', 'twitter', 'twitterPost', 'x_post', 'xContent'),
    facebookPost: findStr('facebook', 'facebookPost', 'facebook_post', 'facebookContent'),
    blogPost: findStr('blog', 'blogPost', 'blog_post', 'blogContent', 'article'),
    imageUrl: findStr('imageUrl', 'image', 'image_url', 'generatedImage', 'imageLink'),
    reportUrl: findStr('reportUrl', 'report', 'report_url', 'googleDocUrl', 'docUrl', 'documentUrl'),
    folderUrl: findStr('folderUrl', 'folder', 'folder_url', 'driveFolderUrl', 'driveUrl'),
    metadataFileUrl: findStr('metadataFileUrl', 'metadata', 'metadata_url', 'metadataUrl', 'metadataFile'),
  };
}
