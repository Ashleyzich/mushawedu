import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Package, TriangleAlert, CheckCircle2, Tag } from 'lucide-react'
import api from '../api/axios'

const UNITS = [
  { value: 'bag',    label: 'Bag'           },
  { value: 'tonne',  label: 'Tonne'         },
  { value: 'kg',     label: 'Kilogram (kg)' },
  { value: 'litre',  label: 'Litre'         },
  { value: 'm2',     label: 'Square Metre'  },
  { value: 'm3',     label: 'Cubic Metre'   },
  { value: 'length', label: 'Length/Piece'  },
  { value: 'roll',   label: 'Roll'          },
  { value: 'unit',   label: 'Unit / Each'   },
]

export default function AddListingPage() {
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    name: '',
    description: '',
    category_id: '',
    unit: 'unit',
    price_usd: '',
    stock_quantity: '',
    location: '',
    is_available: true,
    is_resale: false,
  })

  useEffect(() => {
    api.get('/suppliers/categories/')
      .then(({ data }) => setCategories(Array.isArray(data) ? data : data.results || []))
      .catch(() => {})
  }, [])

  const handle = (e) => {
    const { name, value, type, checked } = e.target

    setForm((p) => ({
      ...p,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const submit = async (e) => {
    e.preventDefault()

    if (!form.name || !form.price_usd || !form.unit) {
      setError('Please fill in all required fields.')
      return
    }

    setError('')
    setLoading(true)

    try {
      const fd = new FormData()

      Object.entries(form).forEach(([k, v]) => {
        if (k === 'is_available' || k === 'is_resale') {
          fd.append(k, v)
        } else if (v !== '') {
          fd.append(k, v)
        }
      })

      if (image) {
        fd.append('image', image)
      }

      await api.post('/suppliers/', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

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
        setError('Failed to create listing. Please try again.')
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

          <h2 className="mb-2">Listing Created!</h2>

          <p className="text-gray-500 text-sm">
            Your material is now visible in the MushaWedu marketplace. Redirecting…
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
                Add Material Listing
              </p>

              <p className="text-white/50 text-xs">
                MushaWedu Supplier Marketplace
              </p>
            </div>
          </div>

          <h1 className="text-white text-2xl md:text-3xl font-extrabold">
            List a Construction Material
          </h1>

          <p className="text-white/70 text-sm mt-2">
            Your listing will appear in the MushaWedu materials marketplace.
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

              {/* Name */}
              <div>
                <label className="form-label">Material Name *</label>

                <input
                  name="name"
                  required
                  value={form.name}
                  onChange={handle}
                  className="form-input"
                  placeholder="e.g. Portland Cement 50kg"
                />
              </div>

              {/* Category */}
              <div>
                <label className="form-label">Category</label>

                <select
                  name="category_id"
                  value={form.category_id}
                  onChange={handle}
                  className="form-input"
                >
                  <option value="">Select a category…</option>

                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="form-label">Description</label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handle}
                  rows={3}
                  className="form-input resize-none"
                  placeholder="Brand, grade, specifications, delivery terms…"
                />
              </div>

              {/* Price and unit */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Price (USD) *</label>

                  <input
                    name="price_usd"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={form.price_usd}
                    onChange={handle}
                    className="form-input"
                    placeholder="13.50"
                  />
                </div>

                <div>
                  <label className="form-label">Unit *</label>

                  <select
                    name="unit"
                    value={form.unit}
                    onChange={handle}
                    className="form-input"
                  >
                    {UNITS.map((u) => (
                      <option key={u.value} value={u.value}>
                        {u.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Stock and location */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Stock Quantity</label>

                  <input
                    name="stock_quantity"
                    type="number"
                    min="0"
                    value={form.stock_quantity}
                    onChange={handle}
                    className="form-input"
                    placeholder="100"
                  />
                </div>

                <div>
                  <label className="form-label">Location</label>

                  <input
                    name="location"
                    value={form.location}
                    onChange={handle}
                    className="form-input"
                    placeholder="e.g. Harare CBD"
                  />
                </div>
              </div>

              {/* Image */}
              <div>
                <label className="form-label">Product Photo</label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange file:text-white hover:file:opacity-90"
                />
              </div>

              {/* Toggles */}
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer bg-bgray rounded-lg px-4 py-3 hover:bg-gray-100 transition-colors">
                  <input
                    name="is_available"
                    type="checkbox"
                    checked={form.is_available}
                    onChange={handle}
                    className="w-4 h-4 accent-green"
                  />

                  <div>
                    <p className="text-sm font-semibold text-navy">
                      Available for purchase
                    </p>

                    <p className="text-xs text-gray-400">
                      Uncheck to hide without deleting
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer bg-bgray rounded-lg px-4 py-3 hover:bg-gray-100 transition-colors">
                  <input
                    name="is_resale"
                    type="checkbox"
                    checked={form.is_resale}
                    onChange={handle}
                    className="w-4 h-4 accent-green"
                  />

                  <div>
                    <p className="text-sm font-semibold text-navy flex items-center gap-1.5">
                      <Tag size={13} className="text-green" />
                      List in Resale Hub
                    </p>

                    <p className="text-xs text-gray-400">
                      Excess or surplus materials — helps reduce waste
                    </p>
                  </div>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-3 text-base disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Creating listing…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Package size={16} />
                    Create Listing
                  </span>
                )}
              </button>
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