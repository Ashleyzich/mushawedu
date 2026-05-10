import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import {
  Zap, MapPin, TriangleAlert, ChevronDown,
  ChevronUp, DollarSign, Lightbulb, ShieldCheck
} from 'lucide-react'
import api from '../api/axios'

export default function QuotationPage() {
  const { user } = useAuth()

  const [form, setForm] = useState({
    description: '',
    location: user?.location || 'Harare',
  })

  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showTerms, setShowTerms] = useState(false)

  const handle = (e) => {
    setForm((p) => ({
      ...p,
      [e.target.name]: e.target.value,
    }))
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setResult(null)
    setLoading(true)

    try {
      const { data } = await api.post('/quotation/', form)
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate estimate. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bgray">

      {/* Header */}
      <div className="bg-navy py-14">
        <div className="section-wrap">
          <div className="flex items-center gap-3 mb-4">
            <img
              src="/images/mushawedu-logo.png"
              alt="MushaWedu Logo"
              className="w-12 h-12 object-contain"
            />

            <div>
              <p className="text-orange font-semibold text-sm uppercase tracking-widest">
                AI Quotation Tool
              </p>

              <p className="text-white/50 text-xs">
                MushaWedu Smart Cost Estimator
              </p>
            </div>
          </div>

          <h1 className="text-white text-3xl md:text-4xl font-extrabold mb-3">
            Get an Instant Cost Estimate
          </h1>

          <p className="text-white/65 max-w-xl leading-relaxed">
            Describe your construction project in plain language and MushaWedu will generate
            a detailed cost breakdown with explanations of technical terms.
          </p>

          <div className="mt-5 flex flex-wrap gap-4 text-sm text-white/70">
            <span className="flex items-center gap-2">
              <Zap size={15} className="text-orange" />
              AI-assisted quotation
            </span>

            <span className="flex items-center gap-2">
              <ShieldCheck size={15} className="text-green" />
              Built for Zimbabwean projects
            </span>
          </div>
        </div>
      </div>

      <div className="section-wrap py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-xl p-7 border-t-4 border-orange">
            <div className="flex items-center gap-3 mb-5">
              <img
                src="/images/mushawedu-logo.png"
                alt="MushaWedu Logo"
                className="w-10 h-10 object-contain"
              />

              <div>
                <h2 className="text-lg font-bold text-navy">
                  Describe Your Project
                </h2>

                <p className="text-xs text-gray-400">
                  MushaWedu will estimate your expected construction cost.
                </p>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-5">
                <TriangleAlert size={15} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={submit} className="space-y-5">
              <div>
                <label className="form-label">Project Description *</label>

                <textarea
                  name="description"
                  required
                  value={form.description}
                  onChange={handle}
                  rows={7}
                  className="form-input resize-none"
                  placeholder={`Describe your project as if you're explaining it to a friend. For example:

"I want to build a 3-bedroom house on my 300sqm plot in Borrowdale. The house should have 2 bathrooms, a kitchen, lounge, and covered veranda. I have the land cleared already and need a full build from foundation to roof including plastering and painting. I prefer brick and mortar construction."`}
                />

                <p className="text-xs text-gray-400 mt-1">
                  The more detail you provide, the more accurate your estimate.
                </p>
              </div>

              <div>
                <label className="form-label flex items-center gap-1">
                  <MapPin size={13} className="text-green" />
                  Location
                </label>

                <input
                  name="location"
                  value={form.location}
                  onChange={handle}
                  className="form-input"
                  placeholder="e.g. Borrowdale, Harare"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-3 text-base disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Generating estimate…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Zap size={16} />
                    Generate Cost Estimate
                  </span>
                )}
              </button>

              <p className="text-xs text-gray-400 mt-1">
                You can generate a demo estimate immediately, but longer descriptions improve accuracy.
              </p>
            </form>

            {/* Tips */}
            <div className="mt-5 p-4 bg-bgray rounded-xl">
              <p className="text-xs font-semibold text-navy mb-2 flex items-center gap-1">
                <Lightbulb size={12} className="text-orange" />
                Tips for a better estimate
              </p>

              <ul className="text-xs text-gray-500 space-y-1">
                <li>• Include the number of rooms and rough floor area</li>
                <li>• Mention the construction type, for example brick or precast</li>
                <li>• Describe what finishes you want, such as tiles, plaster, or paint</li>
                <li>• Say whether materials, labour, or both are needed</li>
              </ul>
            </div>
          </div>

          {/* Loading result */}
          {loading && (
            <div className="bg-white rounded-2xl shadow-xl p-10 text-center border-t-4 border-orange">
              <img
                src="/images/mushawedu-logo.png"
                alt="MushaWedu Logo"
                className="w-16 h-16 object-contain mx-auto mb-4 animate-pulse"
              />

              <div className="w-12 h-12 border-4 border-bgray border-t-orange rounded-full animate-spin mx-auto mb-4" />

              <p className="font-semibold text-navy">
                Analysing your project…
              </p>

              <p className="text-sm text-gray-400 mt-1">
                MushaWedu is reviewing your description and generating a cost breakdown.
              </p>
            </div>
          )}

          {/* Result */}
          {result && !loading && (
            <div className="space-y-5">

              {result.simulated && (
                <div className="flex items-start gap-2 bg-orange/8 border border-orange/30 rounded-lg px-4 py-3">
                  <TriangleAlert size={15} className="text-orange shrink-0 mt-0.5" />

                  <p className="text-xs text-orange">
                    Demo estimate — add your ANTHROPIC_API_KEY to .env for real AI-powered quotes.
                  </p>
                </div>
              )}

              {/* Total cost card */}
              <div className="bg-navy rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src="/images/mushawedu-logo.png"
                    alt="MushaWedu Logo"
                    className="w-10 h-10 object-contain"
                  />

                  <div>
                    <p className="text-white/60 text-sm">
                      Estimated total cost
                    </p>

                    <p className="text-white/40 text-xs">
                      MushaWedu AI Quotation
                    </p>
                  </div>
                </div>

                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-3xl font-extrabold text-orange">
                    ${Number(result.data.total_min_usd).toLocaleString()}
                  </span>

                  <span className="text-white/60">—</span>

                  <span className="text-3xl font-extrabold">
                    ${Number(result.data.total_max_usd).toLocaleString()}
                  </span>

                  <span className="text-white/50 text-sm">
                    USD
                  </span>
                </div>

                <p className="text-white/60 text-xs mt-2">
                  {result.data.currency_note}
                </p>

                <p className="text-white/80 text-sm mt-3 leading-relaxed">
                  {result.data.summary}
                </p>
              </div>

              {/* Line items */}
              <div className="bg-white rounded-2xl shadow-xl p-5 border-t-4 border-orange">
                <h3 className="font-bold text-navy mb-4 text-sm">
                  Cost Breakdown
                </h3>

                <div className="space-y-2">
                  {result.data.line_items?.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-3 py-2 border-b border-gray-50 last:border-0"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-body truncate">
                          {item.item}
                        </p>

                        <span className="text-[10px] bg-bgray text-gray-500 px-1.5 py-0.5 rounded font-medium">
                          {item.category}
                        </span>
                      </div>

                      <p className="text-sm font-semibold text-navy shrink-0 flex items-center gap-0.5">
                        <DollarSign size={11} className="text-orange" />

                        {item.min_usd === item.max_usd
                          ? item.min_usd.toLocaleString()
                          : `${item.min_usd.toLocaleString()}–${item.max_usd.toLocaleString()}`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical terms */}
              {result.data.key_terms?.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl p-5 border-t-4 border-orange">
                  <button
                    onClick={() => setShowTerms((p) => !p)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <h3 className="font-bold text-navy text-sm">
                      Technical Terms Explained ({result.data.key_terms.length})
                    </h3>

                    {showTerms ? (
                      <ChevronUp size={16} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={16} className="text-gray-400" />
                    )}
                  </button>

                  {showTerms && (
                    <div className="mt-4 space-y-3">
                      {result.data.key_terms.map((t, i) => (
                        <div key={i} className="border-l-2 border-orange pl-3">
                          <p className="font-semibold text-navy text-sm">
                            {t.term}
                          </p>

                          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                            {t.explanation}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tips */}
              {result.data.tips?.length > 0 && (
                <div className="bg-white rounded-2xl shadow-xl p-5 border-t-4 border-orange">
                  <h3 className="font-bold text-navy text-sm mb-3">
                    Recommended Next Steps
                  </h3>

                  <ul className="space-y-2">
                    {result.data.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="w-5 h-5 rounded-full bg-orange/15 text-orange text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>

                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Disclaimer */}
              <p className="text-xs text-gray-400 leading-relaxed px-1">
                {result.data.disclaimer}
              </p>

              {/* CTA */}
              <Link
                to="/artisans"
                className="btn-primary w-full justify-center py-3 text-base"
              >
                Find Verified Artisans on MushaWedu
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}