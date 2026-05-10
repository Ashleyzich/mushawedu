import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Phone, DollarSign, CheckCircle2, TriangleAlert, Clock, Zap, ShieldCheck } from 'lucide-react'
import api from '../api/axios'

export default function PaymentPage() {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const prefill = location.state || {}

  const [form, setForm] = useState({
    payee_id: prefill.payee_id || '',
    amount_usd: prefill.amount_usd || '',
    payment_type: prefill.payment_type || 'project_quote',
    description: prefill.description || '',
    ecocash_number: user?.ecocash_number || '',
    project_id: prefill.project_id || '',
  })

  const [step, setStep] = useState('form')
  const [paymentId, setPaymentId] = useState(null)
  const [pollMsg, setPollMsg] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [simulated, setSimulated] = useState(false)

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
      const { data } = await api.post('/payments/initiate/', form)

      setPaymentId(data.payment_id)
      setSimulated(data.simulated)
      setStep('pending')

      if (data.simulated) {
        setTimeout(() => checkStatus(data.payment_id), 3000)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to initiate payment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const checkStatus = async (id) => {
    setPollMsg('Checking payment status…')

    try {
      const { data } = await api.post(`/payments/${id || paymentId}/check/`)

      if (data.status === 'paid') {
        setStep('success')
      } else {
        setPollMsg('Payment not yet confirmed. Please approve on your EcoCash handset, then check again.')
      }
    } catch {
      setPollMsg('Could not reach payment server. Please try again.')
    }
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-bgray flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-md w-full border-t-4 border-orange">
          <img
            src="/images/mushawedu-logo.png"
            alt="MushaWedu Logo"
            className="w-16 h-16 object-contain mx-auto mb-4"
          />

          <div className="w-16 h-16 bg-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-green" />
          </div>

          <h2 className="mb-2">Payment Confirmed!</h2>

          <p className="text-gray-500 text-sm mb-2">
            ${Number(form.amount_usd).toFixed(2)} USD has been sent successfully via EcoCash.
          </p>

          {simulated && (
            <p className="text-xs text-orange bg-orange/8 rounded-lg px-3 py-2 mb-4">
              Simulation mode — no real money moved. Add Paynow credentials to go live.
            </p>
          )}

          <p className="text-gray-400 text-xs mb-6">
            A MushaWedu payment confirmation has been sent to your email address.
          </p>

          <div className="flex gap-3 justify-center">
            <Link to="/dashboard" className="btn-primary px-6 py-2.5">
              Go to Dashboard
            </Link>

            <Link to="/projects" className="btn-outline px-6 py-2.5">
              View Projects
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'pending') {
    return (
      <div className="min-h-screen bg-bgray flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full border-t-4 border-orange">
          <img
            src="/images/mushawedu-logo.png"
            alt="MushaWedu Logo"
            className="w-14 h-14 object-contain mx-auto mb-4 animate-pulse"
          />

          <div className="w-14 h-14 bg-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock size={28} className="text-orange" />
          </div>

          <h2 className="mb-2">
            {simulated ? 'Processing Simulation…' : 'Awaiting EcoCash Approval'}
          </h2>

          <p className="text-gray-500 text-sm mb-2">
            {simulated
              ? 'MushaWedu is simulating a payment confirmation…'
              : `A payment request of $${Number(form.amount_usd).toFixed(2)} USD has been sent to ${form.ecocash_number}. Please approve it on your handset.`}
          </p>

          {pollMsg && (
            <p className="text-xs text-gray-400 bg-bgray rounded-lg px-3 py-2 mb-4">
              {pollMsg}
            </p>
          )}

          <button
            onClick={() => checkStatus(paymentId)}
            className="btn-primary w-full justify-center py-3 mb-3"
          >
            <CheckCircle2 size={15} />
            I&apos;ve Approved — Confirm Payment
          </button>

          <button
            onClick={() => {
              setStep('form')
              setPollMsg('')
            }}
            className="text-sm text-gray-400 hover:text-navy transition-colors"
          >
            Cancel and go back
          </button>
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
              className="w-12 h-12 object-contain"
            />

            <div>
              <p className="text-orange font-semibold text-sm uppercase tracking-widest">
                EcoCash Payment
              </p>

              <p className="text-white/50 text-xs">
                MushaWedu Secure Payment Gateway
              </p>
            </div>
          </div>

          <h1 className="text-white text-2xl md:text-3xl font-extrabold">
            Pay via EcoCash
          </h1>

          <p className="text-white/60 text-sm mt-1">
            Secure payments powered by Paynow for MushaWedu transactions.
          </p>

          <div className="mt-5 flex flex-wrap gap-4 text-sm text-white/70">
            <span className="flex items-center gap-2">
              <Phone size={15} className="text-orange" />
              EcoCash supported
            </span>

            <span className="flex items-center gap-2">
              <ShieldCheck size={15} className="text-green" />
              Secure transaction flow
            </span>
          </div>
        </div>
      </div>

      <div className="section-wrap py-10">
        <div className="max-w-md mx-auto">

          {/* Simulation notice */}
          <div className="card-bordered border-orange bg-orange/4 mb-6 flex items-start gap-3">
            <Zap size={18} className="text-orange shrink-0 mt-0.5" />

            <div>
              <p className="font-semibold text-navy text-sm">
                Simulation Mode Active
              </p>

              <p className="text-xs text-gray-500 mt-0.5">
                No real money will move until you add your Paynow merchant credentials.
                All payments are simulated for MushaWedu demonstration.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-7 border-t-4 border-orange">
            <div className="flex items-center gap-3 mb-6">
              <img
                src="/images/mushawedu-logo.png"
                alt="MushaWedu Logo"
                className="w-10 h-10 object-contain"
              />

              <div>
                <h2 className="text-lg font-bold text-navy">
                  Payment Details
                </h2>

                <p className="text-xs text-gray-400">
                  Complete your MushaWedu payment below.
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

              {/* Amount */}
              <div>
                <label className="form-label flex items-center gap-1">
                  <DollarSign size={13} className="text-orange" />
                  Amount (USD) *
                </label>

                <input
                  name="amount_usd"
                  type="number"
                  min="1"
                  step="0.01"
                  required
                  value={form.amount_usd}
                  onChange={handle}
                  className="form-input text-lg font-semibold"
                  placeholder="0.00"
                />
              </div>

              {/* Description */}
              <div>
                <label className="form-label">
                  Description *
                </label>

                <input
                  name="description"
                  required
                  value={form.description}
                  onChange={handle}
                  className="form-input"
                  placeholder="e.g. Quote payment for kitchen renovation"
                />
              </div>

              {/* EcoCash number */}
              <div>
                <label className="form-label flex items-center gap-1">
                  <Phone size={13} className="text-green" />
                  Your EcoCash Number *
                </label>

                <input
                  name="ecocash_number"
                  required
                  value={form.ecocash_number}
                  onChange={handle}
                  className="form-input"
                  placeholder="+263 77 000 0000"
                />

                <p className="text-xs text-gray-400 mt-1">
                  You will receive an approval prompt on this number.
                </p>
              </div>

              {/* Payee ID */}
              {!prefill.payee_id && (
                <div>
                  <label className="form-label">
                    Recipient User ID *
                  </label>

                  <input
                    name="payee_id"
                    type="number"
                    required
                    value={form.payee_id}
                    onChange={handle}
                    className="form-input"
                    placeholder="Enter the recipient's user ID"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-3 text-base disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Initiating…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Phone size={16} />
                    Pay via EcoCash
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