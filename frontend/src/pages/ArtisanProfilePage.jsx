import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Briefcase, MapPin, TriangleAlert,
  CheckCircle2, Plus, Star, ShieldCheck
} from 'lucide-react'
import api from '../api/axios'
import { Spinner } from '../components/UI'

const TRADES = [
  { value: 'bricklaying', label: 'Bricklaying & Masonry' },
  { value: 'carpentry', label: 'Carpentry & Joinery' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'electrical', label: 'Electrical Installation' },
  { value: 'roofing', label: 'Roofing' },
  { value: 'painting', label: 'Painting & Finishing' },
  { value: 'tiling', label: 'Tiling & Flooring' },
  { value: 'welding', label: 'Welding & Fabrication' },
  { value: 'plastering', label: 'Plastering' },
  { value: 'landscaping', label: 'Landscaping & Paving' },
  { value: 'glazing', label: 'Glazing & Windows' },
  { value: 'general', label: 'General Construction' },
]

function PortfolioUploadForm({ onAdded }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    project_value: '',
    completed_date: '',
  })

  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handle = (e) => {
    setForm((p) => ({
      ...p,
      [e.target.name]: e.target.value,
    }))
  }

  const submit = async (e) => {
    e.preventDefault()

    if (!image) {
      setError('Please select an image.')
      return
    }

    setError('')
    setLoading(true)

    try {
      const fd = new FormData()

      Object.entries(form).forEach(([k, v]) => {
        if (v) {
          fd.append(k, v)
        }
      })

      fd.append('image', image)

      await api.post('/artisans/portfolio/add/', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      setForm({
        title: '',
        description: '',
        location: '',
        project_value: '',
        completed_date: '',
      })

      setImage(null)
      onAdded()
    } catch (err) {
      setError('Failed to upload. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="bg-bgray rounded-xl p-5 mt-4">
      <div className="flex items-center gap-2 mb-4">
        <img
          src="/images/mushawedu-logo.png"
          alt="MushaWedu Logo"
          className="w-8 h-8 object-contain"
        />

        <div>
          <p className="font-semibold text-navy text-sm">
            Add Portfolio Item
          </p>

          <p className="text-xs text-gray-400">
            Showcase your past MushaWedu work
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
          <TriangleAlert size={14} className="text-red-500" />
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      <div className="space-y-3">
        <div>
          <label className="form-label text-xs">Title *</label>

          <input
            name="title"
            required
            value={form.title}
            onChange={handle}
            className="form-input text-sm"
            placeholder="e.g. 4-Bedroom House — Borrowdale"
          />
        </div>

        <div>
          <label className="form-label text-xs">Photo *</label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange file:text-white hover:file:opacity-90"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="form-label text-xs">Location</label>

            <input
              name="location"
              value={form.location}
              onChange={handle}
              className="form-input text-sm"
              placeholder="Harare"
            />
          </div>

          <div>
            <label className="form-label text-xs">Project Value USD</label>

            <input
              name="project_value"
              type="number"
              value={form.project_value}
              onChange={handle}
              className="form-input text-sm"
              placeholder="2500"
            />
          </div>
        </div>

        <div>
          <label className="form-label text-xs">Description</label>

          <textarea
            name="description"
            value={form.description}
            onChange={handle}
            rows={2}
            className="form-input text-sm resize-none"
            placeholder="Brief description of the work done…"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary text-sm py-2 w-full justify-center disabled:opacity-60"
        >
          {loading ? (
            'Uploading…'
          ) : (
            <>
              <Plus size={14} />
              Add to Portfolio
            </>
          )}
        </button>
      </div>
    </form>
  )
}

export default function ArtisanProfilePage() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [showPortfolioForm, setShowPortfolioForm] = useState(false)

  const [form, setForm] = useState({
    primary_trade: '',
    years_experience: '',
    description: '',
    certifications: '',
    service_areas: '',
    is_museyamwa: false,
  })

  const fetchProfile = async () => {
    try {
      const { data } = await api.get('/artisans/me/')

      setProfile(data)

      setForm({
        primary_trade: data.primary_trade || '',
        years_experience: data.years_experience || '',
        description: data.description || '',
        certifications: data.certifications || '',
        service_areas: data.service_areas || '',
        is_museyamwa: data.is_museyamwa || false,
      })
    } catch {
      setError('Failed to load your artisan profile.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const handle = (e) => {
    const { name, value, type, checked } = e.target

    setForm((p) => ({
      ...p,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const save = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const { data } = await api.patch('/artisans/me/', form)

      setProfile(data)
      setSaved(true)

      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <Spinner label="Loading your MushaWedu profile…" />
  }

  return (
    <div className="min-h-screen bg-bgray">

      {/* Header */}
      <div className="bg-navy py-12">
        <div className="section-wrap">
          <div className="flex items-start gap-4">
            <img
              src="/images/mushawedu-logo.png"
              alt="MushaWedu Logo"
              className="w-14 h-14 object-contain"
            />

            <div>
              <p className="text-orange font-semibold text-sm uppercase tracking-widest mb-1">
                Artisan Profile
              </p>

              <h1 className="text-white text-2xl md:text-3xl font-extrabold">
                Build Your MushaWedu Portfolio
              </h1>

              <p className="text-white/60 text-sm mt-1 max-w-xl">
                Complete your profile to appear in customer searches and receive job enquiries
                from homeowners looking for verified artisans.
              </p>

              <div className="flex items-center gap-2 mt-3 text-white/60 text-xs">
                <ShieldCheck size={13} className="text-orange" />
                <span>MushaWedu Verified Artisan Network</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section-wrap py-10">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* Profile form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-orange">
            <h2 className="text-lg font-bold text-navy mb-6 flex items-center gap-2">
              <Briefcase size={18} className="text-maroon" />
              Professional Details
            </h2>

            {saved && (
              <div className="flex items-center gap-2 bg-green/10 border border-green/30 rounded-lg px-4 py-3 mb-5">
                <CheckCircle2 size={16} className="text-green" />

                <p className="text-sm text-green font-semibold">
                  Profile saved successfully!
                </p>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-5">
                <TriangleAlert size={16} className="text-red-500 shrink-0 mt-0.5" />

                <p className="text-sm text-red-600">
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={save} className="space-y-5">

              <div>
                <label className="form-label">Primary Trade *</label>

                <select
                  name="primary_trade"
                  value={form.primary_trade}
                  onChange={handle}
                  className="form-input"
                  required
                >
                  <option value="">Select your main trade…</option>

                  {TRADES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Years of Experience</label>

                <input
                  name="years_experience"
                  type="number"
                  min="0"
                  max="60"
                  value={form.years_experience}
                  onChange={handle}
                  className="form-input"
                  placeholder="e.g. 5"
                />
              </div>

              <div>
                <label className="form-label">About You</label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handle}
                  rows={4}
                  className="form-input resize-none"
                  placeholder="Describe your skills, experience, work quality, and what makes you stand out…"
                />
              </div>

              <div>
                <label className="form-label flex items-center gap-1">
                  <MapPin size={13} className="text-green" />
                  Areas You Serve
                </label>

                <input
                  name="service_areas"
                  value={form.service_areas}
                  onChange={handle}
                  className="form-input"
                  placeholder="e.g. Harare, Chitungwiza, Ruwa"
                />

                <p className="text-xs text-gray-400 mt-1">
                  Separate multiple areas with commas.
                </p>
              </div>

              <div>
                <label className="form-label">Certifications & Qualifications</label>

                <input
                  name="certifications"
                  value={form.certifications}
                  onChange={handle}
                  className="form-input"
                  placeholder="e.g. ZESA Licensed Electrician, City & Guilds Level 3"
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer bg-bgray rounded-lg px-4 py-3 hover:bg-gray-100 transition-colors">
                <input
                  name="is_museyamwa"
                  type="checkbox"
                  checked={form.is_museyamwa}
                  onChange={handle}
                  className="w-4 h-4 accent-green"
                />

                <div>
                  <p className="text-sm font-semibold text-navy">
                    I am a Museyamwa independent small artisan
                  </p>

                  <p className="text-xs text-gray-400">
                    This badge helps customers find and support independent local tradespeople on MushaWedu.
                  </p>
                </div>
              </label>

              <button
                type="submit"
                disabled={saving}
                className="btn-primary w-full justify-center py-3 text-base disabled:opacity-60"
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Saving…
                  </span>
                ) : (
                  'Save Profile'
                )}
              </button>
            </form>
          </div>

          {/* Portfolio section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-orange">
            <div className="flex items-center justify-between mb-5 gap-3">
              <h2 className="text-lg font-bold text-navy flex items-center gap-2">
                <Star size={18} className="text-orange" />
                Portfolio ({profile?.portfolio_items?.length || 0} items)
              </h2>

              <button
                onClick={() => setShowPortfolioForm((p) => !p)}
                className="btn-primary text-sm py-2 px-4"
              >
                <Plus size={14} />
                {showPortfolioForm ? 'Cancel' : 'Add Item'}
              </button>
            </div>

            {profile?.portfolio_items?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {profile.portfolio_items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg overflow-hidden border border-gray-100 bg-white shadow-sm"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-36 object-cover"
                      />
                    )}

                    <div className="p-3">
                      <p className="font-semibold text-navy text-sm">
                        {item.title}
                      </p>

                      {item.location && (
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <MapPin size={10} />
                          {item.location}
                        </p>
                      )}

                      {item.project_value && (
                        <p className="text-xs text-orange font-semibold mt-0.5">
                          ~${Number(item.project_value).toLocaleString()}
                        </p>
                      )}

                      {item.description && (
                        <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <img
                  src="/images/mushawedu-logo.png"
                  alt="MushaWedu Logo"
                  className="w-14 h-14 object-contain mx-auto mb-3 opacity-80"
                />

                <Star size={32} className="mx-auto mb-2 text-gray-200" />

                <p className="text-sm">
                  No portfolio items yet.
                </p>

                <p className="text-xs">
                  Add photos of your past work to attract MushaWedu customers.
                </p>
              </div>
            )}

            {showPortfolioForm && (
              <PortfolioUploadForm
                onAdded={() => {
                  fetchProfile()
                  setShowPortfolioForm(false)
                }}
              />
            )}
          </div>

          <p className="text-center">
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