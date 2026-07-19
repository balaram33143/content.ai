'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Sparkles,
  Youtube,
  Linkedin,
  Twitter,
  Facebook,
  FileText,
  Image as ImageIcon,
  FileSpreadsheet,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SiteNav } from '@/components/site-nav';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const PLATFORM_ICONS = [
  { Icon: Youtube, color: 'text-red-500', bg: 'from-red-500/20 to-red-500/5' },
  { Icon: Linkedin, color: 'text-blue-600', bg: 'from-blue-600/20 to-blue-600/5' },
  { Icon: Twitter, color: 'text-sky-400', bg: 'from-sky-400/20 to-sky-400/5' },
  { Icon: Facebook, color: 'text-blue-500', bg: 'from-blue-500/20 to-blue-500/5' },
  { Icon: FileText, color: 'text-emerald-500', bg: 'from-emerald-500/20 to-emerald-500/5' },
  { Icon: ImageIcon, color: 'text-violet-500', bg: 'from-violet-500/20 to-violet-500/5' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-mesh">
      <SiteNav />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              custom={0}
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm font-medium mb-6"
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Powered by automated n8n workflows</span>
            </motion.div>

            <motion.h1
              custom={1}
              variants={fadeUp}
              className="font-display text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]"
            >
              Turn any YouTube video into
              <br />
              <span className="text-gradient">polished multi-platform content</span>
            </motion.h1>

            <motion.p
              custom={2}
              variants={fadeUp}
              className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Paste a link, pick your platforms, and let an AI pipeline extract insights,
              format posts, generate images, and deliver a shareable Google Doc — automatically.
            </motion.p>

            <motion.div
              custom={3}
              variants={fadeUp}
              className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <Link href="/dashboard/generate">
                <Button size="lg" className="rounded-full px-8 text-base shadow-xl shadow-primary/25 group">
                  <Zap className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Generate Content
                </Button>
              </Link>
              <Link href="/#how-it-works">
                <Button variant="outline" size="lg" className="rounded-full px-8 text-base">
                  See How It Works
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Floating platform icons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-4 max-w-2xl mx-auto"
          >
            {PLATFORM_ICONS.map(({ Icon, color, bg }, i) => (
              <motion.div
                key={i}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
                className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${bg} glass-card shadow-lg`}
              >
                <Icon className={`h-7 w-7 ${color}`} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              Everything you need to <span className="text-gradient">scale content</span>
            </h2>
            <p className="mt-3 text-muted-foreground text-lg">
              One video in, a full content suite out.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              How it <span className="text-gradient">works</span>
            </h2>
            <p className="mt-3 text-muted-foreground text-lg">Three steps. That's it.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-cyan-400 shadow-lg shadow-primary/30 mb-4">
                  <span className="text-2xl font-bold text-white">{i + 1}</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Preview */}
      <section id="workflow" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              The <span className="text-gradient">pipeline</span>
            </h2>
            <p className="mt-3 text-muted-foreground text-lg">
              Every node in the workflow, visualized.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col gap-2">
              {PIPELINE_PREVIEW.map((step, i) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary shrink-0">
                    {i + 1}
                  </div>
                  <div className="glass-card rounded-lg px-4 py-2.5 text-sm font-medium flex-1">
                    {step}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              Frequently asked <span className="text-gradient">questions</span>
            </h2>
          </motion.div>

          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass-card rounded-2xl p-6"
              >
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center glass-card rounded-3xl p-12 shadow-xl"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Ready to forge your content?
            </h2>
            <p className="text-muted-foreground text-lg mb-6">
              Start generating in seconds. No setup, no friction.
            </p>
            <Link href="/dashboard/generate">
              <Button size="lg" className="rounded-full px-8 shadow-xl shadow-primary/25">
                <Sparkles className="mr-2 h-5 w-5" />
                Get Started Free
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-cyan-400">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-display font-bold">ContentForge AI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Built for automated content creation. Powered by n8n.
          </p>
        </div>
      </footer>
    </div>
  );
}

const FEATURES = [
  { icon: Youtube, title: 'YouTube Transcript Extraction', desc: 'Apify automatically pulls transcripts from any YouTube video — no manual copying.' },
  { icon: Sparkles, title: 'AI Insight Extraction', desc: 'Google Gemini analyzes the transcript and distills key insights worth sharing.' },
  { icon: FileText, title: 'Multi-Platform Formatting', desc: 'Separate Gemini calls format content specifically for LinkedIn, X, Facebook, and Blog.' },
  { icon: ImageIcon, title: 'AI Image Generation', desc: 'A dedicated image prompt is generated and sent to an AI image API automatically.' },
  { icon: FileSpreadsheet, title: 'Google Doc Reports', desc: 'A full report is created, written, and shared to your email as a Google Doc.' },
  { icon: Zap, title: 'Automated Metadata', desc: 'Metadata JSON is built, converted, and uploaded to Drive alongside all outputs.' },
];

const STEPS = [
  { title: 'Paste a YouTube URL', desc: 'Drop in any video link. We preview the thumbnail, title, and channel instantly.' },
  { title: 'Pick platforms & tone', desc: 'Choose LinkedIn, X, Facebook, Blog — then select tone, theme, and audience.' },
  { title: 'Get your content suite', desc: 'The workflow runs end-to-end and delivers formatted posts, an AI image, and a Google Doc.' },
];

const PIPELINE_PREVIEW = [
  'Extract Video ID',
  'Start Apify Transcript Extraction',
  'Wait & Check Status',
  'Insight Extraction (Gemini)',
  'Creative Transformation (Gemini)',
  'Split & Route to Platforms',
  'Format LinkedIn, X, Facebook, Blog',
  'Merge & Aggregate Content',
  'Create Drive Folder',
  'Generate AI Image',
  'Create & Write Google Doc',
  'Share Document',
  'Upload Image & Metadata',
  'Build Final Output',
  'Log to Google Sheets',
  'Return Final Response',
];

const FAQS = [
  { q: 'Do I need to modify the n8n workflow?', a: 'No. The frontend is built to adapt to the existing workflow exactly as it is — no node renames, no field changes, no payload modifications.' },
  { q: 'What platforms are supported?', a: 'LinkedIn, X (Twitter), Facebook, and Blog. Each gets its own Gemini-formatted output tailored to the platform.' },
  { q: 'How long does generation take?', a: 'Typically 2–5 minutes depending on transcript length and AI processing. The pipeline view shows live progress.' },
  { q: 'Where are my results stored?', a: 'Generated content is saved to your history, and the workflow also creates a Google Doc and Drive folder with all outputs.' },
  { q: 'Can I customize the webhook URL?', a: 'Yes. Configure your n8n webhook URL in Settings or via the NEXT_PUBLIC_N8N_WEBHOOK_URL environment variable.' },
];
