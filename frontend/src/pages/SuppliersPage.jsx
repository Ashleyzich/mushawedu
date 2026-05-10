import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Package, Tag, ShieldCheck } from 'lucide-react'
import api from '../api/axios'
import { ListingCard, Spinner, EmptyState } from '../components/UI'

export default function SuppliersPage() {
  const [searchParams] = useSearchParams()
  const defaultTab = searchParams.get('resale') === 'true' ? 'resale' : 'all'

  const [listings, setListings] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState(defaultTab)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [ordering, setOrdering] = useState('-created_at')

  // Load categories once
  useEffect(() => {
    api.get('/suppliers/categories/')
      .then(({ data }) => setCategories(Array.isArray(data) ? data : data.results || []))
      .catch(() => {})
  }, [])

  // Load listings on filter change
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

    params.set('ordering', ordering)

    const endpoint = tab === 'resale' ? '/suppliers/resale/' : '/suppliers/'

    api.get(`${endpoint}?${params}`, { signal: controller.signal })
      .then(({ data }) => setListings(Array.isArray(data) ? data : data.results || []))
      .catch(() => {})
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [tab, search, category, ordering])

  const tabClass = (t) =>
    `px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors duration-150 ${
      tab === t
        ? 'bg-navy text-white'
        : 'bg-white text-navy hover:bg-bgray'
    }`

  return (
    <div className="min-h-screen bg-bgray">

      {/* Page header */}
      <div className="relative overflow-hidden">
        <img
          src="/images/suppliers-bg.jpg"
          alt="Construction materials background"
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
                  Materials Marketplace
                </p>

                <p className="text-white/50 text-xs">
                  MushaWedu Supplier Network
                </p>
              </div>
            </div>

            <h1 className="text-white text-3xl md:text-4xl font-extrabold mb-3 max-w-2xl">
              Suppliers & Construction Materials
            </h1>

            <p className="text-white/75 max-w-xl leading-relaxed">
              Compare prices from verified suppliers on MushaWedu. Find the best deal on cement,
              timber, steel, and more — or browse the Resale Hub for excess materials.
            </p>

            <div className="mt-6 flex flex-wrap gap-4 text-sm text-white/70">
              <span className="flex items-center gap-2">
                <ShieldCheck size={15} className="text-orange" />
                Verified suppliers
              </span>

              <span className="flex items-center gap-2">
                <Package size={15} className="text-green" />
                Construction materials
              </span>

              <span className="flex items-center gap-2">
                <Tag size={15} className="text-orange" />
                Resale Hub
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="section-wrap py-10">

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-7 bg-bgray p-1.5 rounded-xl w-fit">
          <button
            className={tabClass('all')}
            onClick={() => setTab('all')}
          >
            <span className="flex items-center gap-2">
              <Package size={14} />
              All Materials
            </span>
          </button>

          <button
            className={tabClass('resale')}
            onClick={() => setTab('resale')}
          >
            <span className="flex items-center gap-2">
              <Tag size={14} />
              Resale Hub
            </span>
          </button>
        </div>

        {/* Resale banner */}
        {tab === 'resale' && (
          <div className="card-bordered border-green bg-green/4 mb-7 flex items-start gap-3">
            <Tag size={20} className="text-green shrink-0 mt-0.5" />

            <div>
              <h3 className="font-semibold text-navy text-sm mb-0.5">
                Excess Materials Resale Hub
              </h3>

              <p className="text-sm text-gray-500 leading-relaxed">
                Buy and sell surplus construction materials at fair prices through MushaWedu.
                Reduce waste, recover value from unused stock, and promote sustainability
                across Zimbabwe&apos;s building sector. Listings are priced using real market data.
              </p>
            </div>
          </div>
        )}

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
              placeholder="Search materials, suppliers…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input pl-9"
            />
          </div>

          {/* Category */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-input w-auto min-w-[180px]"
          >
            <option value="">All Categories</option>

            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Ordering */}
          <select
            value={ordering}
            onChange={(e) => setOrdering(e.target.value)}
            className="form-input w-auto min-w-[160px]"
          >
            <option value="-created_at">Newest First</option>
            <option value="price_usd">Price: Low to High</option>
            <option value="-price_usd">Price: High to Low</option>
          </select>
        </div>

        {/* Count */}
        {!loading && (
          <p className="text-sm text-gray-500 mb-5 font-medium">
            {listings.length} listing{listings.length !== 1 ? 's' : ''} found
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <Spinner label="Loading materials…" />
        ) : listings.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No listings found"
            message={
              tab === 'resale'
                ? 'No resale materials listed yet. Check back soon!'
                : 'No materials match your search. Try adjusting filters.'
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {listings.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}