import { useEffect, useState } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { ArrowLeft, Copy, Check, ExternalLink, Image as ImageIcon, Wand2 } from 'lucide-react'
import { getGeneration } from '../lib/generations'
import { buildEmailHtml, buildEmailSubject } from '../lib/email-template'
import type { GenerationRecord, GenerationResult, GenerationFormValues } from '../types'

interface LocalResultState {
  result: GenerationResult
  values: GenerationFormValues
}

export default function ResultsPage() {
  const { id } = useParams()
  const location = useLocation()
  const [record, setRecord] = useState<GenerationRecord | null>(null)
  const [localResult, setLocalResult] = useState<GenerationResult | null>(null)
  const [localValues, setLocalValues] = useState<GenerationFormValues | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    if (id === 'local') {
      const state = location.state as LocalResultState | null
      if (state) {
        setLocalResult(state.result)
        setLocalValues(state.values)
      }
      setLoading(false)
    } else if (id) {
      getGeneration(id).then(r => {
        setRecord(r)
        setLoading(false)
      })
    }
  }, [id, location.state])

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20 text-neutral-400">Loading...</div>
  }

  const result: GenerationResult | null = record ? {
    linkedinPost: record.linkedin_post || '',
    xPost: record.x_post || '',
    facebookPost: record.facebook_post || '',
    blogPost: record.blog_post || '',
    imageUrl: record.image_url || '',
    imagePrompt: record.image_prompt || '',
    reportUrl: record.report_url || '',
    folderUrl: record.folder_url || '',
    metadataFileUrl: record.metadata_file_url || '',
  } : localResult

  if (!result) {
    return (
      <div className="text-center py-20">
        <p className="text-neutral-500">Result not found.</p>
        <Link to="/generate" className="mt-4 inline-block text-primary-600 hover:underline">Generate new content</Link>
      </div>
    )
  }

  const emailHtml = localValues ? buildEmailHtml(result, localValues) : null

  const posts = [
    { key: 'linkedin', label: 'LinkedIn Post', icon: '💼', content: result.linkedinPost },
    { key: 'x', label: 'X Post', icon: '🐦', content: result.xPost },
    { key: 'facebook', label: 'Facebook Post', icon: '📘', content: result.facebookPost },
    { key: 'blog', label: 'Blog Post', icon: '📝', content: result.blogPost },
  ].filter(p => p.content)

  return (
    <div>
      <Link to="/history" className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700 mb-4">
        <ArrowLeft className="w-4 h-4" /> Back to History
      </Link>

      <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2">Your Generated Content</h1>
      <p className="text-neutral-500 mb-6">Review, copy, and download your content below.</p>

      {/* Generated Image */}
      {result.imageUrl && (
        <div className="mb-6 bg-white rounded-xl shadow-sm border border-neutral-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <ImageIcon className="w-5 h-5 text-primary-600" />
            <h2 className="font-semibold text-neutral-800">Generated Image</h2>
          </div>
          <img src={result.imageUrl} alt="Generated content" className="w-full rounded-lg" />
        </div>
      )}

      {/* Image Generation Prompt */}
      {result.imagePrompt && (
        <div className="mb-6 bg-white rounded-xl shadow-sm border border-neutral-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="flex items-center gap-2 font-semibold text-neutral-800">
              <Wand2 className="w-5 h-5 text-purple-600" />
              AI Image Generation Prompt
            </h2>
            <button
              onClick={() => copy(result.imagePrompt, 'imagePrompt')}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-600 hover:bg-neutral-100 transition"
            >
              {copied === 'imagePrompt' ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied === 'imagePrompt' ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="text-sm text-neutral-700 whitespace-pre-wrap leading-relaxed bg-purple-50 border border-purple-100 p-4 rounded-lg">
            {result.imagePrompt}
          </div>
        </div>
      )}

      {/* Links */}
      <div className="mb-6 flex flex-wrap gap-3">
        {result.reportUrl && (
          <a href={result.reportUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-50 text-primary-700 border border-primary-200 text-sm font-medium hover:bg-primary-100 transition">
            <ExternalLink className="w-4 h-4" /> Full Report
          </a>
        )}
        {result.folderUrl && (
          <a href={result.folderUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-100 text-neutral-700 border border-neutral-200 text-sm font-medium hover:bg-neutral-200 transition">
            <ExternalLink className="w-4 h-4" /> Drive Folder
          </a>
        )}
      </div>

      {/* Platform Posts */}
      <div className="space-y-4">
        {posts.map(post => (
          <div key={post.key} className="bg-white rounded-xl shadow-sm border border-neutral-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="flex items-center gap-2 font-semibold text-neutral-800">
                <span>{post.icon}</span> {post.label}
              </h2>
              <button
                onClick={() => copy(post.content, post.key)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-600 hover:bg-neutral-100 transition"
              >
                {copied === post.key ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied === post.key ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="text-sm text-neutral-700 whitespace-pre-wrap leading-relaxed bg-neutral-50 p-4 rounded-lg">
              {post.content}
            </div>
          </div>
        ))}
      </div>

      {/* Email Preview */}
      {emailHtml && (
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-neutral-200 p-5">
          <h2 className="flex items-center gap-2 font-semibold text-neutral-800 mb-1">
            <span>📧</span> Email Preview
          </h2>
          <p className="text-xs text-neutral-500 mb-3">Subject: {buildEmailSubject()}</p>
          <div className="border border-neutral-200 rounded-lg overflow-hidden">
            <iframe
              srcDoc={emailHtml}
              title="Email Preview"
              className="w-full h-[500px]"
              sandbox="allow-same-origin"
            />
          </div>
        </div>
      )}
    </div>
  )
}
