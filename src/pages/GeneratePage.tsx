import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Loader as Loader2, Youtube, Mail, Palette, Target, Users, Lightbulb, Check } from 'lucide-react'
import { PLATFORMS, TONES, THEMES, AUDIENCES } from '../config'
import { buildDemoResult } from '../lib/demo-content'
import { createGeneration, completeGeneration } from '../lib/generations'
import type { GenerationFormValues, Platform, Tone, Theme, Audience } from '../types'

function extractVideoId(url: string): string | null {
  const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/)
  return match ? match[1] : null
}

export default function GeneratePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [email, setEmail] = useState('')
  const [platforms, setPlatforms] = useState<Platform[]>(['LinkedIn'])
  const [tone, setTone] = useState<Tone>('Educational')
  const [theme, setTheme] = useState<Theme>('AI')
  const [audience, setAudience] = useState<Audience>('Developers')
  const [humanOpinion, setHumanOpinion] = useState('')

  const togglePlatform = (p: Platform) => {
    setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!youtubeUrl.trim()) { setError('Please enter a YouTube video URL.'); return }
    if (!email.trim()) { setError('Please enter your email.'); return }
    if (platforms.length === 0) { setError('Please select at least one platform.'); return }

    setLoading(true)
    try {
      const values: GenerationFormValues = {
        youtubeUrl: youtubeUrl.trim(),
        email: email.trim(),
        platforms,
        tone,
        theme,
        audience,
        humanOpinion: humanOpinion.trim() || undefined,
      }
      const videoId = extractVideoId(values.youtubeUrl)

      const record = await createGeneration(values, videoId)

      await new Promise(r => setTimeout(r, 1500))
      const result = buildDemoResult(values, videoId)

      if (record) {
        await completeGeneration(record.id, result)
        navigate(`/results/${record.id}`)
      } else {
        navigate(`/results/local`, { state: { result, values } })
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      setError(msg)
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">Generate Content</h1>
        <p className="mt-2 text-neutral-500">
          Submit a YouTube video URL and content preferences. Content is generated locally — no webhook configuration needed.
        </p>
      </div>

      <div className="mb-4 p-3 rounded-lg bg-primary-50 border border-primary-200 text-sm text-primary-800 flex items-start gap-2">
        <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span>Demo mode: generating sample content locally. Configure your n8n webhook to run the real workflow.</span>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-accent-50 border border-accent-200 text-sm text-accent-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 mb-2">
            <Youtube className="w-4 h-4 text-accent-600" />
            YouTube Video URL
          </label>
          <input
            type="url"
            value={youtubeUrl}
            onChange={e => setYoutubeUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition"
            required
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 mb-2">
            <Mail className="w-4 h-4 text-primary-600" />
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition"
            required
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 mb-2">
            <Check className="w-4 h-4 text-green-600" />
            Target Platforms
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {PLATFORMS.map(p => (
              <button
                key={p}
                type="button"
                onClick={() => togglePlatform(p)}
                className={`px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition ${
                  platforms.includes(p)
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-neutral-300 text-neutral-600 hover:border-neutral-400'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 mb-2">
            <Palette className="w-4 h-4 text-purple-600" />
            Tone
          </label>
          <select
            value={tone}
            onChange={e => setTone(e.target.value as Tone)}
            className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition bg-white"
          >
            {TONES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 mb-2">
            <Target className="w-4 h-4 text-orange-600" />
            Theme
          </label>
          <select
            value={theme}
            onChange={e => setTheme(e.target.value as Theme)}
            className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition bg-white"
          >
            {THEMES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 mb-2">
            <Users className="w-4 h-4 text-blue-600" />
            Target Audience
          </label>
          <select
            value={audience}
            onChange={e => setAudience(e.target.value as Audience)}
            className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition bg-white"
          >
            {AUDIENCES.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-semibold text-neutral-700 mb-2">
            <Lightbulb className="w-4 h-4 text-yellow-600" />
            Optional Human Insight / Opinion
          </label>
          <textarea
            value={humanOpinion}
            onChange={e => setHumanOpinion(e.target.value)}
            placeholder="Share any personal take or opinion you'd like woven into the content (optional)"
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 disabled:bg-neutral-400 text-white font-semibold transition shadow-sm"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating content...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Content
            </>
          )}
        </button>
      </form>
    </div>
  )
}
