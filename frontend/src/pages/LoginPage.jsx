import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, LogIn, TriangleAlert } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    username: '',
    password: '',
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)

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
      await login(form.username, form.password)
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.detail || 'Invalid username or password.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bgray flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-orange">

          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
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

          <h2 className="text-center mb-1">Welcome Back</h2>

          <p className="text-center text-gray-400 text-sm mb-8">
            Sign in to your MushaWedu account
          </p>

          {error && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6">
              <TriangleAlert size={16} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="form-label">Username</label>

              <input
                name="username"
                type="text"
                required
                value={form.username}
                onChange={handle}
                className="form-input"
                placeholder="Enter your username"
                autoComplete="username"
              />
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
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  onClick={() => setShowPw((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 text-base disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn size={16} />
                  Sign In
                </span>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-7">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-maroon font-semibold hover:underline">
              Create one free
            </Link>
          </p>
        </div>

        {/* Back link */}
        <p className="text-center mt-5">
          <Link to="/" className="text-sm text-gray-400 hover:text-navy transition-colors">
            ← Back to MushaWedu
          </Link>
        </p>
      </div>
    </div>
  )
}