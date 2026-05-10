import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FolderPlus, MapPin, DollarSign, Calendar, TriangleAlert, CheckCircle2 } from 'lucide-react'
import api from '../api/axios'

const CATEGORIES = [
  { value: 'residential_build', label: 'Residential Build' },
  { value: 'renovation', label: 'Renovation / Remodelling' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'roofing', label: 'Roofing' },
  { value: 'flooring', label: 'Flooring' },
  { value: 'painting', label: 'Painting & Finishing' },
  { value: 'landscaping', label: 'Landscaping & Paving' },
  { value: 'fencing', label: 'Fencing & Security' },
  { value: 'other', label: 'Other' },
]

export default function PostProjectPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    location: user?.location || '',
    budget_min: '',
    budget_max: '',
    deadline: '',
    requires_materials: false,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handle = (e) => {
    const { name, value, type, checked } = e.target

    setForm((p) => ({
      ...p,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.title || !form.description || !form.category || !form.location) {
      setError('Please fill in all required fields.')
      return
    }

    setLoading(true)

    try {
      const payload = {
        ...form,
        budget_min: form.budget_min || null,
        budget_max: form.budget_max || null,
        deadline: form.deadline || null,
      }

      await api.post('/projects/', payload)

      setSuccess(true)
      setTimeout(() => navigate('/dashboard'), 2000)
    } catch (err) {
      const data = err.response?.data

      if (data && typeof data === 'object') {
        const msgs = Object.entries(data)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
          .join(' · ')

        setError(msgs)
      } else {
        setError('Failed to post project. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-bgray flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-md border-t-4 border-orange">
          <img
            src="/images/mushawedu-logo.png"
            alt="MushaWedu Logo"
            className="w-16 h-16 object-contain mx-auto mb-4"
          />

          <div className="w-16 h-16 bg-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-green" />
          </div>

          <h2 className="mb-2">Project Posted!</h2>

          <p className="text-gray-500 text-sm">
            Your project is now live on MushaWedu. Verified artisans can submit quotes.
            Redirecting to dashboard…
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bgray">

      {/* Header */}
      <div className="bg-navy py-12">
        <div className="section-wrap">
          <div className="flex items-center gap-3 mb-4">
            <img
              src="/images/mushawedu-logo.png"
              alt="MushaWedu Logo"
              className="w-11 h-11 object-contain"
            />

            <div>
              <p className="text-orange font-semibold text-sm uppercase tracking-widest">
                Post a Project
              </p>

              <p className="text-white/50 text-xs">
                MushaWedu Project Marketplace
              </p>
            </div>
          </div>

          <h1 className="text-white text-2xl md:text-3xl font-extrabold">
            Describe Your Construction Project
          </h1>

          <p className="text-white/70 text-sm mt-2">
            Verified artisans will see your project and submit quotes.
          </p>
        </div>
      </div>

      <div className="section-wrap py-10">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-orange">

            {error && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6">
                <TriangleAlert size={16} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={submit} className="space-y-5">

              {/* Title */}
              <div>
                <label className="form-label">Project Title *</label>

                <input
                  name="title"
                  required
                  value={form.title}
                  onChange={handle}
                  className="form-input"
                  placeholder="e.g. 3-Bedroom House Construction in Borrowdale"
                />
              </div>

              {/* Category */}
              <div>
                <label className="form-label">Category *</label>

                <select
                  name="category"
                  required
                  value={form.category}
                  onChange={handle}
                  className="form-input"
                >
                  <option value="">Select a category…</option>

                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="form-label">Project Description *</label>

                <textarea
                  name="description"
                  required
                  value={form.description}
                  onChange={handle}
                  rows={5}
                  className="form-input resize-none"
                  placeholder="Describe your project in detail — scope of work, materials needed, access to site, special requirements…"
                />

                <p className="text-xs text-gray-400 mt-1">
                  The more detail you provide, the better the quotes you&apos;ll receive.
                </p>
              </div>

              {/* Location */}
              <div>
                <label className="form-label flex items-center gap-1">
                  <MapPin size={13} className="text-green" />
                  Location *
                </label>

                <input
                  name="location"
                  required
                  value={form.location}
                  onChange={handle}
                  className="form-input"
                  placeholder="e.g. Borrowdale, Harare"
                />
              </div>

              {/* Budget */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label flex items-center gap-1">
                    <DollarSign size={13} className="text-orange" />
                    Min Budget (USD)
                  </label>

                  <input
                    name="budget_min"
                    type="number"
                    min="0"
                    value={form.budget_min}
                    onChange={handle}
                    className="form-input"
                    placeholder="500"
                  />
                </div>

                <div>
                  <label className="form-label flex items-center gap-1">
                    <DollarSign size={13} className="text-orange" />
                    Max Budget (USD)
                  </label>

                  <input
                    name="budget_max"
                    type="number"
                    min="0"
                    value={form.budget_max}
                    onChange={handle}
                    className="form-input"
                    placeholder="5000"
                  />
                </div>
              </div>

              {/* Deadline */}
              <div>
                <label className="form-label flex items-center gap-1">
                  <Calendar size={13} className="text-maroon" />
                  Desired Start / Completion Date
                </label>

                <input
                  name="deadline"
                  type="date"
                  value={form.deadline}
                  onChange={handle}
                  className="form-input"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Requires materials */}
              <label className="flex items-center gap-3 cursor-pointer bg-bgray rounded-lg px-4 py-3 hover:bg-gray-100 transition-colors">
                <input
                  name="requires_materials"
                  type="checkbox"
                  checked={form.requires_materials}
                  onChange={handle}
                  className="w-4 h-4 accent-green"
                />

                <div>
                  <p className="text-sm font-semibold text-navy">
                    I also need construction materials
                  </p>

                  <p className="text-xs text-gray-400">
                    Artisans can include material costs in their quotes
                  </p>
                </div>
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-3 text-base disabled:opacity-60 mt-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Posting project…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <FolderPlus size={16} />
                    Post Project
                  </span>
                )}
              </button>

              <p className="text-center text-xs text-gray-400">
                By posting, your project will be visible to all verified artisans on MushaWedu.
              </p>
            </form>
          </div>

          <p className="text-center mt-5">
            <Link
              to="/dashboard"
              className="text-sm text-gray-400 hover:text-navy transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}