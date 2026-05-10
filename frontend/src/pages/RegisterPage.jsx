import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, UserPlus, TriangleAlert, Users, Package, Home } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const ROLES = [
  {
    value: 'customer',
    label: 'Customer',
    desc: 'I want to hire artisans and source materials for my construction project.',
    icon: Home,
    color: 'border-green text-green bg-green/5',
  },
  {
    value: 'artisan',
    label: 'Artisan / Museyamwa',
    desc: 'I am a skilled tradesperson and want to showcase my work and find clients.',
    icon: Users,
    color: 'border-maroon text-maroon bg-maroon/5',
  },
  {
    value: 'supplier',
    label: 'Supplier',
    desc: 'I supply construction materials and want to list products on MushaWedu.',
    icon: Package,
    color: 'border-orange text-orange bg-orange/5',
  },
]

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [role, setRole] = useState('')

  const [form, setForm] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    location: '',
    password: '',
    password_confirm: '',
  })

  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = (e) => {
    setForm((p) => ({
      ...p,
      [e.target.name]: e.target.value,
    }))
  }

  const submit = async (e) => {
    e.preventDefault()

    if (form.password !== form.password_confirm) {
      setError('Passwords do not match.')
      return
    }

    setError('')
    setLoading(true)

    try {
      await register({ ...form, role })
      navigate('/login', { state: { registered: true } })
    } catch (err) {
      const data = err.response?.data

      if (data && typeof data === 'object') {
        const msgs = Object.entries(data)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
          .join(' · ')

        setError(msgs)
      } else {
        setError('Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bgray flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-lg">

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-orange">

          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-7">
            <img
              src="/images/mushawedu-logo.png"
              alt="MushaWedu Logo"
              className="w-14 h-14 object-contain"
            />

            <div className="flex flex-col leading-none">
              <span className="text-navy font-extrabold text-2xl">
                MushaWedu
              </span>
              <span className="text-green text-xs font-semibold mt-1">
                Zimbabwe
              </span>
            </div>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 justify-center mb-7">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    step >= s ? 'bg-navy text-white' : 'bg-bgray text-gray-400'
                  }`}
                >
                  {s}
                </div>

                {s < 2 && (
                  <div className={`w-12 h-0.5 ${step > 1 ? 'bg-navy' : 'bg-bgray'}`} />
                )}
              </div>
            ))}
          </div>

          {/* STEP 1: Choose role */}
          {step === 1 && (
            <div>
              <h2 className="text-center mb-1">Join MushaWedu</h2>

              <p className="text-center text-gray-400 text-sm mb-8">
                What best describes you?
              </p>

              <div className="flex flex-col gap-3">
                {ROLES.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => setRole(r.value)}
                    className={`w-full text-left border-2 rounded-xl p-4 transition-all duration-150 flex items-start gap-3 ${
                      role === r.value
                        ? `${r.color} border-2`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                        role === r.value ? 'bg-current/10' : 'bg-bgray'
                      }`}
                    >
                      <r.icon
                        size={18}
                        className={role === r.value ? 'inherit' : 'text-gray-400'}
                      />
                    </div>

                    <div>
                      <p className="font-semibold text-navy text-sm">{r.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                        {r.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => role && setStep(2)}
                disabled={!role}
                className="btn-primary w-full justify-center py-3 text-base mt-7 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue <span className="ml-1">→</span>
              </button>
            </div>
          )}

          {/* STEP 2: Fill details */}
          {step === 2 && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <button
                  onClick={() => setStep(1)}
                  className="text-sm text-gray-400 hover:text-navy transition-colors"
                >
                  ← Back
                </button>

                <h2 className="flex-1 text-center text-lg font-bold text-navy">
                  Create Your Account
                </h2>
              </div>

              {error && (
                <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-5">
                  <TriangleAlert size={16} className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">First Name</label>
                    <input
                      name="first_name"
                      required
                      value={form.first_name}
                      onChange={handle}
                      className="form-input"
                      placeholder="Pamela"
                    />
                  </div>

                  <div>
                    <label className="form-label">Last Name</label>
                    <input
                      name="last_name"
                      required
                      value={form.last_name}
                      onChange={handle}
                      className="form-input"
                      placeholder="Moyo"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Username</label>
                  <input
                    name="username"
                    required
                    value={form.username}
                    onChange={handle}
                    className="form-input"
                    placeholder="pmoyo"
                    autoComplete="username"
                  />
                </div>

                <div>
                  <label className="form-label">Email Address</label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handle}
                    className="form-input"
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Phone / EcoCash</label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handle}
                      className="form-input"
                      placeholder="+263 77 000 0000"
                    />
                  </div>

                  <div>
                    <label className="form-label">Location</label>
                    <input
                      name="location"
                      value={form.location}
                      onChange={handle}
                      className="form-input"
                      placeholder="Harare"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Password</label>

                  <div className="relative">
                    <input
                      name="password"
                      type={showPw ? 'text' : 'password'}
                      required
                      value={form.password}
                      onChange={handle}
                      className="form-input pr-10"
                      placeholder="Min. 8 characters"
                      autoComplete="new-password"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPw((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="form-label">Confirm Password</label>
                  <input
                    name="password_confirm"
                    type="password"
                    required
                    value={form.password_confirm}
                    onChange={handle}
                    className="form-input"
                    placeholder="Repeat password"
                    autoComplete="new-password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full justify-center py-3 text-base disabled:opacity-60 mt-2"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Creating account…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <UserPlus size={16} />
                      Create Account
                    </span>
                  )}
                </button>
              </form>
            </div>
          )}

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-maroon font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center mt-5">
          <Link to="/" className="text-sm text-gray-400 hover:text-navy transition-colors">
            ← Back to MushaWedu
          </Link>
        </p>
      </div>
    </div>
  )
}