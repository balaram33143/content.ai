import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { History, Search, Trash2, ExternalLink, Loader as Loader2 } from 'lucide-react'
import { fetchHistory, deleteGeneration } from '../lib/generations'
import type { GenerationRecord } from '../types'

const STATUS_COLORS: Record<string, string> = {
  completed: 'bg-green-100 text-green-700',
  running: 'bg-blue-100 text-blue-700',
  pending: 'bg-yellow-100 text-yellow-700',
  failed: 'bg-red-100 text-red-700',
}

export default function HistoryPage() {
  const [records, setRecords] = useState<GenerationRecord[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [page, setPage] = useState(1)
  const pageSize = 8

  const load = async () => {
    setLoading(true)
    const { records, total } = await fetchHistory({
      search: search || undefined,
      status: statusFilter === 'all' ? 'all' : statusFilter as any,
      page,
      pageSize,
    })
    setRecords(records)
    setTotal(total)
    setLoading(false)
  }

  useEffect(() => { load() }, [page, statusFilter])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this generation?')) return
    await deleteGeneration(id)
    load()
  }

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 flex items-center gap-2">
          <History className="w-6 h-6" /> History
        </h1>
        <p className="mt-2 text-neutral-500">View and manage your past content generations.</p>
      </div>

      {/* Search & Filter */}
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by URL, email, tone, or theme..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-neutral-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-neutral-300 bg-white outline-none focus:border-primary-500"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="running">Running</option>
          <option value="failed">Failed</option>
        </select>
      </form>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-neutral-400" /></div>
      ) : records.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-neutral-400 mb-4">No generations yet.</p>
          <Link to="/generate" className="inline-block px-4 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition">
            Generate Content
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {records.map(r => (
              <div key={r.id} className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4 hover:shadow-md transition">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[r.status] || 'bg-neutral-100 text-neutral-600'}`}>
                        {r.status}
                      </span>
                      <span className="text-xs text-neutral-400">{new Date(r.created_at).toLocaleString()}</span>
                    </div>
                    <p className="text-sm font-medium text-neutral-800 truncate">{r.youtube_url}</p>
                    <div className="mt-1 flex flex-wrap gap-2 text-xs text-neutral-500">
                      <span>{r.tone}</span>·<span>{r.theme}</span>·<span>{r.audience}</span>·<span>{r.platforms}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    {r.status === 'completed' && (
                      <Link to={`/results/${r.id}`} className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-600" title="View results">
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    )}
                    <button onClick={() => handleDelete(r.id)} className="p-2 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-500" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 rounded-lg text-sm border border-neutral-300 disabled:opacity-40 hover:bg-neutral-50"
              >
                Previous
              </button>
              <span className="text-sm text-neutral-500">Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 rounded-lg text-sm border border-neutral-300 disabled:opacity-40 hover:bg-neutral-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
