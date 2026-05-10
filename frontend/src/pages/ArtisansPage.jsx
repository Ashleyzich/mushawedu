import { useState, useEffect } from 'react'
import { Search, SlidersHorizontal, Users, ShieldCheck } from 'lucide-react'
import api from '../api/axios'
import { ArtisanCard, Spinner, EmptyState } from '../components/UI'

const TRADES = [
  { value: '', label: 'All Trades' },
  { value: 'bricklaying', label: 'Bricklaying' },
  { value: 'carpentry', label: 'Carpentry' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'roofing', label: 'Roofing' },
  { value: 'painting', label: 'Painting & Finishing' },
  { value: 'tiling', label: 'Tiling & Flooring' },
  { value: 'welding', label: 'Welding' },
  { value: 'plastering', label: 'Plastering' },
  { value: 'landscaping', label: 'Landscaping' },
  { value: 'general', label: 'General Construction' },
]

export default function ArtisansPage() {
  const [artisans, setArtisans] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [trade, setTrade] = useState('')
  const [museyamwa, setMuseyamwa] = useState(false)
  const [ordering, setOrdering] = useState('-average_rating')

  useEffect(() => {
    const controller = new AbortController()

    setLoading(true)

    const params = new URLSearchParams()

    if (search) {
      params.set('search', search)
    }

    if (trade) {
      params.set('primary_trade', trade)
    }

    if (museyamwa) {
      params.set('is_museyamwa', 'true')
    }

    params.set('ordering', ordering)

    api.get(`/artisans/?${params}`, { signal: controller.signal })
      .then(({ data }) => {
        setArtisans(Array.isArray(data) ? data : data.results || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [search, trade, museyamwa, ordering])

  return (
    <div className="min-h-screen bg-bgray">

      {/* Page header */}
      <div className="relative overflow-hidden">
        <img
          src="/images/artisans-bg.jpg"
          alt="Construction artisans background"
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
                  Find Professionals
                </p>

                <p className="text-white/50 text-xs">
                  MushaWedu Verified Network
                </p>
              </div>
            </div>

            <h1 className="text-white text-3xl md:text-4xl font-extrabold mb-3 max-w-2xl">
              Verified Artisans & Museyamwa
            </h1>

            <p className="text-white/75 max-w-xl leading-relaxed">
              Browse Zimbabwe&apos;s skilled construction professionals on MushaWedu.
              Every profile is backed by real portfolio work and verified client reviews.
            </p>

            <div className="mt-6 flex flex-wrap gap-4 text-sm text-white/70">
              <span className="flex items-center gap-2">
                <ShieldCheck size={15} className="text-orange" />
                Verified profiles
              </span>

              <span className="flex items-center gap-2">
                <Users size={15} className="text-green" />
                Skilled local artisans
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="section-wrap py-10">

        {/* Filter bar */}
        <div className="bg-white rounded-xl shadow-card p-4 mb-8 flex flex-wrap gap-3 items-end border-t-4 border-orange">

          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search by name, skill, or area…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input pl-9"
            />
          </div>

          {/* Trade filter */}
          <select
            value={trade}
            onChange={(e) => setTrade(e.target.value)}
            className="form-input w-auto min-w-[180px]"
          >
            {TRADES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={ordering}
            onChange={(e) => setOrdering(e.target.value)}
            className="form-input w-auto min-w-[160px]"
          >
            <option value="-average_rating">Highest Rated</option>
            <option value="-completed_jobs">Most Jobs</option>
            <option value="-years_experience">Most Experienced</option>
          </select>

          {/* Museyamwa toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none bg-bgray px-4 py-2.5 rounded-md">
            <input
              type="checkbox"
              checked={museyamwa}
              onChange={(e) => setMuseyamwa(e.target.checked)}
              className="w-4 h-4 accent-green"
            />

            <span className="text-sm font-medium text-navy whitespace-nowrap">
              Museyamwa only
            </span>
          </label>

          {/* Filters icon decoration */}
          <div className="flex items-center gap-1.5 text-gray-400 text-sm ml-auto">
            <SlidersHorizontal size={14} />
            <span className="hidden sm:inline">Filters</span>
          </div>
        </div>

        {/* Count */}
        {!loading && (
          <p className="text-sm text-gray-500 mb-5 font-medium">
            {artisans.length} artisan{artisans.length !== 1 ? 's' : ''} found
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <Spinner label="Loading artisans…" />
        ) : artisans.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No artisans found"
            message="Try adjusting your filters or search terms."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {artisans.map((a) => (
              <ArtisanCard key={a.id} artisan={a} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}