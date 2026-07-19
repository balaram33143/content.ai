'use client';

import { motion } from 'framer-motion';
import { HelpCircle, BookOpen, Code2, Zap, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const HELP_SECTIONS = [
  {
    icon: Zap,
    title: 'Getting Started',
    items: [
      { q: 'How do I generate content?', a: 'Navigate to Generate Content, paste a YouTube URL, select your platforms, tone, theme, and audience, then click Generate. The workflow handles the rest.' },
      { q: 'What is the webhook URL?', a: 'The webhook URL is your n8n workflow endpoint. It is pre-configured via the NEXT_PUBLIC_N8N_WEBHOOK_URL environment variable, but you can override it in Settings. If no URL is configured, the app will show a setup screen on first visit.' },
      { q: 'How do I find my webhook URL?', a: 'In n8n, open your workflow, click the Form Trigger node, and copy the Production URL. It looks like https://your-instance.app.n8n.cloud/webhook/abc-123-def. Paste it into the setup screen or Settings page.' },
      { q: 'How do I test the connection?', a: 'Go to Settings and click "Test Connection". The app sends an OPTIONS request to your webhook URL and shows ✓ Connected or the error message.' },
      { q: 'Can I deploy on Vercel, Netlify, or Docker?', a: 'Yes. Set NEXT_PUBLIC_N8N_WEBHOOK_URL as an environment variable in your hosting platform. The same code works in development and production — no code changes needed.' },
      { q: 'How long does generation take?', a: 'Typically 2–5 minutes. The workflow extracts a transcript, runs Gemini analysis, formats content for each platform, generates an image, and creates a Google Doc.' },
    ],
  },
  {
    icon: Code2,
    title: 'Technical',
    items: [
      { q: 'What technologies power this app?', a: 'Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, React Hook Form, Zod, Axios, React Query, and Supabase for history persistence.' },
      { q: 'How is the workflow integrated?', a: 'The frontend sends a POST request to the n8n webhook with the form payload. The workflow processes it and returns platform content, links, and metadata.' },
      { q: 'Can I deploy on Vercel, Netlify, or Cloudflare?', a: 'Yes. The app is fully static-friendly with Next.js. Set the NEXT_PUBLIC_N8N_WEBHOOK_URL and Supabase env vars on your platform of choice.' },
    ],
  },
];

export default function HelpPage() {
  return (
    <div className="space-y-6 pt-12 lg:pt-0 max-w-3xl">
      <div>
        <h1 className="font-display text-3xl font-bold">Help & Documentation</h1>
        <p className="text-muted-foreground mt-1">Everything you need to know about ContentForge AI.</p>
      </div>

      {HELP_SECTIONS.map((section) => (
        <div key={section.title} className="space-y-3">
          <h2 className="font-display text-xl font-semibold flex items-center gap-2">
            <section.icon className="h-5 w-5 text-primary" />
            {section.title}
          </h2>
          <Card className="glass-card rounded-2xl p-2">
            <Accordion type="single" collapsible>
              {section.items.map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="px-4 text-left">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
        </div>
      ))}

      <Card className="glass-card rounded-2xl p-6">
        <h2 className="font-display text-xl font-semibold flex items-center gap-2 mb-3">
          <BookOpen className="h-5 w-5 text-primary" />
          Resources
        </h2>
        <div className="space-y-2">
          {[
            { label: 'n8n Documentation', href: 'https://docs.n8n.io' },
            { label: 'Next.js Documentation', href: 'https://nextjs.org/docs' },
            { label: 'Supabase Documentation', href: 'https://supabase.com/docs' },
          ].map((r) => (
            <a
              key={r.label}
              href={r.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl p-3 hover:bg-muted/50 transition-colors group"
            >
              <span className="text-sm font-medium">{r.label}</span>
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
            </a>
          ))}
        </div>
      </Card>
    </div>
  );
}
