'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Linkedin,
  Twitter,
  Facebook,
  FileText,
  Image as ImageIcon,
  FileSpreadsheet,
  FolderOpen,
  Copy,
  Download,
  Share2,
  ExternalLink,
  CheckCircle2,
  Youtube,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function ResultsContent() {
  const params = useSearchParams();
  const [copied, setCopied] = useState<string | null>(null);

  const linkedin = params.get('linkedin') || '';
  const x = params.get('x') || '';
  const facebook = params.get('facebook') || '';
  const blog = params.get('blog') || '';
  const image = params.get('image') || '';
  const report = params.get('report') || '';
  const folder = params.get('folder') || '';
  const metadata = params.get('metadata') || '';
  const videoId = params.get('videoId') || '';

  const copyToClipboard = async (text: string, label: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      toast.success(`${label} copied to clipboard`);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const downloadText = (text: string, filename: string) => {
    if (!text) return;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`${filename} downloaded`);
  };

  const share = async (text: string) => {
    if (!text) return;
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch {
        // user cancelled
      }
    } else {
      copyToClipboard(text, 'Content');
    }
  };

  const platformTabs = [
    { value: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'text-blue-600', content: linkedin },
    { value: 'x', label: 'X', icon: Twitter, color: 'text-sky-400', content: x },
    { value: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-blue-500', content: facebook },
    { value: 'blog', label: 'Blog', icon: FileText, color: 'text-emerald-500', content: blog },
  ].filter((t) => t.content);

  const links = [
    { label: 'Google Doc Report', url: report, icon: FileSpreadsheet, color: 'text-indigo-500' },
    { label: 'Drive Folder', url: folder, icon: FolderOpen, color: 'text-yellow-500' },
    { label: 'Metadata File', url: metadata, icon: FileText, color: 'text-violet-500' },
  ].filter((l) => l.url);

  return (
    <div className="space-y-6 pt-12 lg:pt-0">
      <div className="flex items-center gap-3">
        <CheckCircle2 className="h-8 w-8 text-emerald-500" />
        <div>
          <h1 className="font-display text-3xl font-bold">Content Generated</h1>
          <p className="text-muted-foreground mt-0.5">Your multi-platform content is ready.</p>
        </div>
      </div>

      {/* Video source */}
      {videoId && (
        <Card className="glass-card rounded-2xl p-4 flex items-center gap-4">
          <Youtube className="h-8 w-8 text-red-500 shrink-0" />
          <div>
            <p className="text-sm font-medium">Source Video</p>
            <p className="text-xs text-muted-foreground font-mono">ID: {videoId}</p>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Platform Content */}
        <div className="lg:col-span-2">
          {platformTabs.length > 0 ? (
            <Tabs defaultValue={platformTabs[0].value}>
              <TabsList className="w-full justify-start">
                {platformTabs.map((t) => (
                  <TabsTrigger key={t.value} value={t.value} className="gap-2">
                    <t.icon className={`h-4 w-4 ${t.color}`} />
                    {t.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {platformTabs.map((t) => (
                <TabsContent key={t.value} value={t.value}>
                  <Card className="glass-card rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <t.icon className={`h-5 w-5 ${t.color}`} />
                        {t.label} Post
                      </h3>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(t.content, t.label)}
                          className="rounded-lg"
                        >
                          {copied === t.label ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadText(t.content, `${t.value}-post.txt`)}
                          className="rounded-lg"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => share(t.content)}
                          className="rounded-lg"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed bg-muted/30 rounded-xl p-4">
                        {t.content}
                      </pre>
                    </div>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <Card className="glass-card rounded-2xl p-12 text-center text-muted-foreground">
              <FileText className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p>No platform content was returned.</p>
            </Card>
          )}
        </div>

        {/* Sidebar: Image + Links */}
        <div className="space-y-4">
          {/* AI Image */}
          {image && (
            <Card className="glass-card rounded-2xl p-4">
              <h3 className="font-semibold flex items-center gap-2 mb-3">
                <ImageIcon className="h-5 w-5 text-violet-500" />
                AI Generated Image
              </h3>
              <img
                src={image}
                alt="AI generated"
                className="w-full rounded-xl"
              />
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" className="rounded-lg flex-1" asChild>
                  <a href={image} download="ai-image.png">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </a>
                </Button>
                <Button size="sm" variant="outline" className="rounded-lg" asChild>
                  <a href={image} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </Card>
          )}

          {/* Links */}
          {links.length > 0 && (
            <Card className="glass-card rounded-2xl p-4 space-y-2">
              <h3 className="font-semibold mb-2">Files & Links</h3>
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl p-3 hover:bg-muted/50 transition-colors group"
                >
                  <l.icon className={`h-5 w-5 ${l.color} shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{l.label}</p>
                    <p className="text-xs text-muted-foreground truncate">{l.url}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                </a>
              ))}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="pt-12 lg:pt-0">Loading...</div>}>
      <ResultsContent />
    </Suspense>
  );
}
