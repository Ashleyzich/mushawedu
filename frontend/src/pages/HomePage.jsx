import { Link } from 'react-router-dom'
import {
  Search, Users, Package, ArrowRight,
  TriangleAlert, ShieldCheck, Star, Recycle,
  ChevronRight, CheckCircle2, Zap, TrendingUp
} from 'lucide-react'

/* ── Data ──────────────────────────────────────────────────────────────── */
const PAIN_POINTS = [
  {
    icon: Users,
    color: 'text-maroon',
    bg: 'bg-maroon/8',
    title: 'Unreliable Workforce',
    desc: 'Difficulty finding and verifying skilled artisans and builders with proven track records. 65% of homeowners struggle to find reliable artisans.',
  },
  {
    icon: Package,
    color: 'text-orange',
    bg: 'bg-orange/8',
    title: 'Limited Supplier Access',
    desc: 'Restricted visibility of diverse and affordable material suppliers across regions, forcing customers to manually visit multiple stores.',
  },
  {
    icon: TrendingUp,
    color: 'text-maroon',
    bg: 'bg-maroon/8',
    title: 'Budget Unpredictability',
    desc: 'Hidden costs, inaccurate manual quotations and unexpected expenses leading to budget overruns — affecting 78% of homeowners.',
  },
  {
    icon: Recycle,
    color: 'text-green',
    bg: 'bg-green/8',
    title: 'Significant Material Waste',
    desc: 'An estimated 40% of construction materials are wasted in typical projects due to poor planning and no structured resale mechanism.',
  },
  {
    icon: ShieldCheck,
    color: 'text-orange',
    bg: 'bg-orange/8',
    title: 'Trust Deficit',
    desc: 'Lack of transparency and accountability among construction stakeholders. 83% of participants lack adequate digital resources for planning.',
  },
]

const STATS = [
  { value: '78%', label: 'of homeowners report budget overruns', color: 'text-maroon' },
  { value: '65%', label: 'struggle to find reliable artisans', color: 'text-navy' },
  { value: '40%', label: 'material wastage in typical projects', color: 'text-orange' },
  { value: '83%', label: 'lack digital resources for planning', color: 'text-maroon' },
]

const SERVICES = [
  {
    icon: Users,
    color: 'bg-maroon',
    title: 'Artisan Portfolios',
    desc: 'Browse verified artisans and Museyamwa companies. View past work, certifications, ratings, and connect directly with the right professional for your build.',
    link: '/artisans',
    cta: 'Find Artisans',
  },
  {
    icon: Package,
    color: 'bg-orange',
    title: 'Supplier Marketplace',
    desc: 'Compare construction material prices from multiple suppliers side by side. Find the best deal on cement, timber, steel, and more — all in one place.',
    link: '/suppliers',
    cta: 'Browse Materials',
  },
  {
    icon: Recycle,
    color: 'bg-green',
    title: 'Resale Hub',
    desc: 'Buy and sell excess construction materials at fair prices. Reduce waste, recover value, and promote sustainability across Zimbabwe\'s building sector.',
    link: '/suppliers?resale=true',
    cta: 'View Resale',
  },
  {
    icon: Zap,
    color: 'bg-navy',
    title: 'AI Quotation Tool',
    desc: 'Upload your building plans and receive an AI-generated cost estimate with plain-language breakdowns of technical terms — no engineering degree needed.',
    link: '/register',
    cta: 'Get a Quote',
  },
]

const HOW_STEPS = [
  {
    step: '01',
    icon: Search,
    title: 'Search & Compare',
    desc: 'Browse verified artisans by trade and location, or compare construction material prices from multiple suppliers in one place.',
  },
  {
    step: '02',
    icon: ShieldCheck,
    title: 'Connect & Verify',
    desc: 'Review portfolio work, read verified client reviews, and engage with trusted professionals. Every artisan profile is backed by real credentials.',
  },
  {
    step: '03',
    icon: CheckCircle2,
    title: 'Build with Confidence',
    desc: 'Manage your project, process payments securely via EcoCash, and leave a review — creating accountability that the whole community benefits from.',
  },
]

/* ── Section: Hero ─────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative bg-navy overflow-hidden">
      {/* geometric accent shapes */}
      <div className="absolute inset-0 pointer-events-none select-none z-10">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-maroon/10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-orange/8 -translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/3 right-1/4 w-2 h-2 rounded-full bg-orange opacity-60" />
        <div className="absolute top-20 left-1/3 w-1.5 h-1.5 rounded-full bg-white/20" />
        <div className="absolute top-0 right-1/3 w-px h-full bg-white/5 -skew-x-12" />
      </div>

      {/* Background image */}
      <img
        src="/images/hero-photo.jpg"
        alt="Construction background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      <div className="absolute inset-0 bg-navy/75 z-10" />

      <div className="section-wrap relative py-20 md:py-28 lg:py-36 z-20">
        <div className="max-w-3xl">

          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-6 animate-fade-in-up">
            <img
              src="/images/mushawedu-logo.png"
              alt="MushaWedu Logo"
              className="w-10 h-10 object-contain"
            />

            <span className="text-white font-semibold text-sm uppercase tracking-widest">
              Zimbabwe&apos;s Construction Marketplace
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-white text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.1] animate-fade-in-up delay-100">
            Connecting Homes,
            <span className="text-orange"> Skills,</span>
            <br />
            and Trust
          </h1>

          <p className="mt-6 text-white/95 text-lg md:text-xl leading-relaxed max-w-xl animate-fade-in-up delay-200">
            MushaWedu is a digital solution to Zimbabwe&apos;s construction challenges.
            Find verified artisans, compare supplier prices, get AI-powered quotations,
            and resell excess materials — all in one place.
          </p>

          {/* CTAs */}
          <div className="mt-9 flex flex-wrap gap-3 animate-fade-in-up delay-300">
            <Link to="/register" className="btn-primary text-base px-7 py-3">
              Get Started Free
              <ArrowRight size={16} />
            </Link>

            <Link
              to="/artisans"
              className="btn-outline border-white/40 text-white hover:bg-white hover:text-navy text-base px-7 py-3"
            >
              Browse Artisans
            </Link>
          </div>

          {/* Trust bar */}
          <div className="mt-12 flex flex-wrap gap-6 animate-fade-in-up delay-400">
            {[
              { icon: ShieldCheck, label: 'Verified Artisans', color: 'text-green' },
              { icon: Star, label: 'Rated & Reviewed', color: 'text-orange' },
              { icon: Package, label: 'EcoCash Payments', color: 'text-white' },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-2 text-white/70 text-sm">
                <Icon size={15} className={color} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Section: Problem Statement ─────────────────────────────────────────── */
function ProblemSection() {
  return (
    <section id="problem" className="py-20 bg-white">
      <div className="section-wrap">

        <div className="max-w-2xl mb-12 animate-fade-in-up">
          <p className="text-maroon font-semibold text-sm uppercase tracking-widest mb-2">
            The Challenge
          </p>

          <h2>Zimbabwe&apos;s Construction Sector Challenges</h2>

          <p className="mt-3 text-gray-500 leading-relaxed">
            The construction industry faces persistent inefficiencies that cost homeowners,
            artisans, and suppliers time, money, and trust every day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {PAIN_POINTS.map((p, i) => (
            <div
              key={i}
              className="card-bordered animate-fade-in-up"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className={`w-10 h-10 rounded-lg ${p.bg} flex items-center justify-center mb-3`}>
                <p.icon size={20} className={p.color} />
              </div>

              <h3 className="font-semibold text-navy mb-1.5 text-base">
                {p.title}
              </h3>

              <p className="text-sm text-gray-500 leading-relaxed">
                {p.desc}
              </p>
            </div>
          ))}

          {/* Warning callout card */}
          <div
            className="card-bordered border-orange bg-orange/3 flex flex-col justify-center animate-fade-in-up"
            style={{ animationDelay: '0.4s' }}
          >
            <div className="flex items-start gap-3">
              <TriangleAlert size={20} className="text-orange shrink-0 mt-0.5" />

              <div>
                <p className="font-semibold text-navy text-sm mb-1">
                  Industry Warning
                </p>

                <p className="text-sm text-gray-600 leading-relaxed">
                  These challenges create a fragmented and inefficient construction ecosystem
                  that increases costs and reduces quality outcomes for Zimbabweans.
                  <strong className="text-maroon"> MushaWedu was built to change this.</strong>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="bg-bgray rounded-2xl p-8">
          <p className="text-center text-sm font-semibold text-maroon uppercase tracking-widest mb-7">
            Industry Pain Points
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <div key={i} className="stat-box">
                <p className={`text-4xl font-extrabold ${s.color} leading-none`}>
                  {s.value}
                </p>

                <p className="text-xs text-gray-500 mt-2 leading-snug">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Section: Services ───────────────────────────────────────────────────── */
function ServicesSection() {
  return (
    <section id="services" className="py-20 bg-bgray">
      <div className="section-wrap">

        <div className="text-center mb-12">
          <p className="text-maroon font-semibold text-sm uppercase tracking-widest mb-2">
            What MushaWedu Offers
          </p>

          <h2>Everything You Need to Build Better</h2>

          <p className="mt-3 text-gray-500 max-w-xl mx-auto leading-relaxed">
            An all-in-one digital construction marketplace connecting Zimbabwe&apos;s
            suppliers, artisans, and customers through one trusted platform.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-card p-6 flex flex-col hover:shadow-lg transition-all duration-200 group animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className={`w-11 h-11 ${s.color} rounded-xl flex items-center justify-center mb-4`}>
                <s.icon size={22} className="text-white" />
              </div>

              <h3 className="font-bold text-navy mb-2">
                {s.title}
              </h3>

              <p className="text-sm text-gray-500 leading-relaxed flex-1">
                {s.desc}
              </p>

              <Link
                to={s.link}
                className="mt-5 flex items-center gap-1 text-sm font-semibold text-orange group-hover:gap-2 transition-all duration-150"
              >
                {s.cta}
                <ChevronRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Section: How It Works ──────────────────────────────────────────────── */
function HowItWorksSection() {
  return (
    <section id="how" className="py-20 bg-white">
      <div className="section-wrap">

        <div className="text-center mb-14">
          <p className="text-maroon font-semibold text-sm uppercase tracking-widest mb-2">
            Simple Process
          </p>

          <h2>How MushaWedu Works</h2>

          <p className="mt-3 text-gray-500 max-w-md mx-auto">
            Three steps to connecting with the right people and getting your project done right.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-9 left-1/4 right-1/4 h-0.5 bg-bgray z-0" />

          {HOW_STEPS.map((step, i) => (
            <div
              key={i}
              className="relative z-10 flex flex-col items-center text-center animate-fade-in-up"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="relative mb-5">
                <div className="w-16 h-16 rounded-full bg-navy flex items-center justify-center shadow-lg">
                  <step.icon size={26} className="text-white" />
                </div>

                <span className="absolute -top-2 -right-2 w-6 h-6 bg-orange rounded-full flex items-center justify-center text-white text-[10px] font-extrabold">
                  {step.step}
                </span>
              </div>

              <h3 className="font-bold text-navy mb-2">
                {step.title}
              </h3>

              <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Section: CTA Banner ────────────────────────────────────────────────── */
function CTASection() {
  return (
    <section className="py-20 bg-navy relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full bg-maroon/15" />
        <div className="absolute top-0 left-1/4 w-px h-full bg-white/5" />
      </div>

      <div className="section-wrap relative text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <img
            src="/images/mushawedu-logo.png"
            alt="MushaWedu Logo"
            className="w-12 h-12 object-contain"
          />
        </div>

        <h2 className="text-white text-3xl md:text-4xl font-extrabold mb-4">
          Ready to Build with Confidence?
        </h2>

        <p className="text-white/70 max-w-lg mx-auto mb-9 leading-relaxed">
          Join thousands of Zimbabweans already using MushaWedu to find trusted artisans,
          compare suppliers, and manage their construction projects smarter.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/register" className="btn-primary text-base px-8 py-3">
            Create Free Account
            <ArrowRight size={16} />
          </Link>

          <Link
            to="/artisans"
            className="btn-outline border-white/30 text-white hover:bg-white hover:text-navy text-base px-8 py-3"
          >
            Browse Artisans
          </Link>
        </div>

        <div className="mt-14 flex items-center justify-center gap-2">
          <span className="text-white/30 text-xs uppercase tracking-widest">
            Integrates with
          </span>

          <span className="ml-4 text-white/50 font-semibold text-sm">EcoCash</span>
          <span className="mx-2 text-white/20">·</span>
          <span className="text-white/50 font-semibold text-sm">OneMoney</span>
          <span className="mx-2 text-white/20">·</span>
          <span className="text-white/50 font-semibold text-sm">ZIPIT</span>
        </div>
      </div>
    </section>
  )
}

/* ── Page export ─────────────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <>
      <Hero />
      <ProblemSection />
      <ServicesSection />
      <HowItWorksSection />
      <CTASection />
    </>
  )
}