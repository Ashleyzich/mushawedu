import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  Search, FolderOpen, MapPin, DollarSign, Calendar,
  ChevronDown, ChevronUp, Send, TriangleAlert,
  CheckCircle2, ShieldCheck
} from 'lucide-react'
import api from '../api/axios'
import { Spinner, EmptyState } from '../components/UI'

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'residential_build', label: 'Residential Build' },
  { value: 'renovation', label: 'Renovation' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'roofing', label: 'Roofing' },
  { value: 'flooring', label: 'Flooring' },
  { value: 'painting', label: 'Painting & Finishing' },
  { value: 'landscaping', label: 'Landscaping' },
  { value: 'fencing', label: 'Fencing & Security' },
  { value: 'other', label: 'Other' },
]

// ── Quote submission form ─────────────────────────────────────────────────
function QuoteForm({ projectId, onSubmitted }) {
  const [form, setForm] = useState({
    amount: '',
    timeline_days: '',
    proposal: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handle = (e) => {
    setForm((p) => ({
      ...p,
      [e.target.name]: e.target.value,
    }))
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await api.post(`/projects/${projectId}/quotes/`, form)

      setSuccess(true)
      onSubmitted()
    } catch (err) {
      const data = err.response?.data

      if (data?.non_field_errors) {
        setError('You have already submitted a quote for this project.')
      } else if (data?.detail) {
        setError(data.detail)
      } else {
        setError('Failed to submit quote. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex items-center gap-2 bg-green/10 border border-green/30 rounded-lg px-4 py-3 mt-3">
        <CheckCircle2 size={16} className="text-green" />

        <p className="text-sm text-green font-semibold">
          Quote submitted successfully!
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="mt-4 bg-bgray rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <img
          src="/images/mushawedu-logo.png"
          alt="MushaWedu Logo"
          className="w-7 h-7 object-contain"
        />

        <p className="font-semibold text-navy text-sm">
          Submit Your MushaWedu Quote
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <TriangleAlert size={14} className="text-red-500 shrink-0" />

          <p className="text-xs text-red-600">
            {error}
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="form-label text-xs">Your Price (USD) *</label>

          <input
            name="amount"
            type="number"
            min="1"
            required
            value={form.amount}
            onChange={handle}
            className="form-input text-sm"
            placeholder="1500"
          />
        </div>

        <div>
          <label className="form-label text-xs">Timeline (days) *</label>

          <input
            name="timeline_days"
            type="number"
            min="1"
            required
            value={form.timeline_days}
            onChange={handle}
            className="form-input text-sm"
            placeholder="14"
          />
        </div>
      </div>

      <div>
        <label className="form-label text-xs">Your Proposal *</label>

        <textarea
          name="proposal"
          required
          value={form.proposal}
          onChange={handle}
          rows={4}
          className="form-input text-sm resize-none"
          placeholder="Describe your approach, experience with similar work, and what is included in your price…"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary text-sm py-2 w-full justify-center disabled:opacity-60"
      >
        {loading ? (
          'Submitting…'
        ) : (
          <>
            <Send size={13} />
            Submit Quote
          </>
        )}
      </button>
    </form>
  )
}

// ── Project card ──────────────────────────────────────────────────────────
function ProjectCard({ project, isArtisan }) {
  const [expanded, setExpanded] = useState(false)
  const [showQuote, setShowQuote] = useState(false)
  const [quoted, setQuoted] = useState(false)

  const statusColor = {
    open: 'bg-green/10 text-green',
    in_progress: 'bg-orange/10 text-orange',
    completed: 'bg-green/10 text-green',
    cancelled: 'bg-red-50 text-red-600',
  }[project.status] || 'bg-gray-100 text-gray-500'

  return (
    <div className="card-bordered hover:shadow-lg transition-shadow duration-200">

      {/* Top row */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-semibold text-navy text-sm leading-snug">
              {project.title}
            </h3>

            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor}`}>
              {project.status_display || project.status}
            </span>
          </div>

          <p className="text-xs text-gray-400">
            {project.category_display || project.category}
          </p>
        </div>

        {/* Budget */}
        {(project.budget_min || project.budget_max) && (
          <div className="text-right shrink-0">
            <p className="text-sm font-bold text-navy flex items-center gap-0.5">
              <DollarSign size={13} className="text-orange" />

              {project.budget_min && project.budget_max
                ? `${project.budget_min}–${project.budget_max}`
                : project.budget_max || project.budget_min}
            </p>

            <p className="text-xs text-gray-400">
              budget
            </p>
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="flex items-center gap-4 mt-2 flex-wrap text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <MapPin size={11} className="text-green" />
          {project.location}
        </span>

        {project.deadline && (
          <span className="flex items-center gap-1">
            <Calendar size={11} className="text-maroon" />
            {new Date(project.deadline).toLocaleDateString()}
          </span>
        )}

        <span>
          {project.quote_count || 0} quote{project.quote_count !== 1 ? 's' : ''}
        </span>

        <span>
          Posted {new Date(project.created_at).toLocaleDateString()}
        </span>
      </div>

      {/* Expand / collapse */}
      <button
        onClick={() => setExpanded((p) => !p)}
        className="flex items-center gap-1 text-xs text-orange font-semibold mt-3 hover:opacity-80 transition-opacity"
      >
        {expanded ? (
          <>
            <ChevronUp size={13} />
            Hide details
          </>
        ) : (
          <>
            <ChevronDown size={13} />
            View details
          </>
        )}
      </button>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {project.description}
          </p>

          {project.requires_materials && (
            <p className="mt-2 text-xs bg-orange/8 text-orange font-semibold px-2 py-1 rounded-md inline-block">
              Materials required
            </p>
          )}

          {/* Quote button for artisans */}
          {isArtisan && project.status === 'open' && !quoted && (
            <button
              onClick={() => setShowQuote((p) => !p)}
              className="btn-primary text-sm py-2 px-5 mt-4"
            >
              <Send size={13} />
              {showQuote ? 'Cancel' : 'Submit a Quote'}
            </button>
          )}

          {isArtisan && showQuote && !quoted && (
            <QuoteForm
              projectId={project.id}
              onSubmitted={() => {
                setQuoted(true)
                setShowQuote(false)
              }}
            />
          )}

          {quoted && (
            <div className="flex items-center gap-2 bg-green/10 border border-green/30 rounded-lg px-4 py-3 mt-3">
              <CheckCircle2 size={16} className="text-green" />

              <p className="text-sm text-green font-semibold">
                Quote submitted!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function ProjectsPage() {
  const { user } = useAuth()
  const isArtisan = user?.role === 'artisan'

  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('open')

  useEffect(() => {
    const controller = new AbortController()

    setLoading(true)

    const params = new URLSearchParams()

    if (search) {
      params.set('search', search)
    }

    if (category) {
      params.set('category', category)
    }

    if (status) {
      params.set('status', status)
    }

    api.get(`/projects/?${params}`, { signal: controller.signal })
      .then(({ data }) => setProjects(Array.isArray(data) ? data : data.results || []))
      .catch(() => {})
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [search, category, status])

  return (
    <div className="min-h-screen bg-bgray">

      {/* Header */}
      <div className="relative overflow-hidden">
        <img
          src="/images/projects-bg.jpg"
          alt="Construction projects background"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-navy/75" />

        <div className="relative py-14 md:py-20">
          <div className="section-wrap">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/images/mushawedu-logo.png"
                alt="MushaWedu Logo"
                className="w-11 h-11 object-contain"
              />

              <div>
                <p className="text-orange font-semibold text-sm uppercase tracking-widest">
                  {isArtisan ? 'Find Work' : 'Construction Projects'}
                </p>

                <p className="text-white/50 text-xs">
                  MushaWedu Project Marketplace
                </p>
              </div>
            </div>

            <h1 className="text-white text-3xl md:text-4xl font-extrabold mb-3 max-w-2xl">
              {isArtisan ? 'Open Projects — Submit Your Quote' : 'Browse Posted Projects'}
            </h1>

            <p className="text-white/75 max-w-xl leading-relaxed">
              {isArtisan
                ? 'Browse open construction projects on MushaWedu and submit competitive quotes to win jobs.'
                : 'See what projects are being posted by homeowners across Zimbabwe through MushaWedu.'}
            </p>

            <div className="mt-6 flex flex-wrap gap-4 text-sm text-white/70">
              <span className="flex items-center gap-2">
                <ShieldCheck size={15} className="text-orange" />
                Verified project network
              </span>

              <span className="flex items-center gap-2">
                <FolderOpen size={15} className="text-green" />
                Active construction jobs
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="section-wrap py-10">

        {/* Filter bar */}
        <div className="bg-white rounded-xl shadow-card p-4 mb-8 flex flex-wrap gap-3 border-t-4 border-orange">
          <div className="relative flex-1 min-w-[200px]">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search projects…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input pl-9"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-input w-auto min-w-[180px]"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="form-input w-auto min-w-[140px]"
          >
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Count */}
        {!loading && (
          <p className="text-sm text-gray-500 mb-5 font-medium">
            {projects.length} project{projects.length !== 1 ? 's' : ''} found
          </p>
        )}

        {/* List */}
        {loading ? (
          <Spinner label="Loading projects…" />
        ) : projects.length === 0 ? (
          <EmptyState
            icon={FolderOpen}
            title="No projects found"
            message="Try adjusting your filters or search terms."
          />
        ) : (
          <div className="flex flex-col gap-4">
            {projects.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                isArtisan={isArtisan}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}