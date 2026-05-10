import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  LayoutDashboard, FolderOpen, Plus, Star, Package,
  ShieldCheck, CheckCircle2, Clock,
  TrendingUp, Briefcase, MapPin, TriangleAlert
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import { StarRating, Spinner } from '../components/UI'
import AnalyticsCharts from '../components/AnalyticsCharts'

/* ── Stat card ────────────────────────────────────────────────────────── */
function StatCard({ icon: Icon, iconColor, label, value, sub }) {
  return (
    <div className="bg-white rounded-xl shadow-card p-5 border-l-4 border-maroon">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">
            {label}
          </p>

          <p className="text-3xl font-extrabold text-navy leading-none">
            {value ?? '–'}
          </p>

          {sub && (
            <p className="text-xs text-gray-400 mt-1">
              {sub}
            </p>
          )}
        </div>

        <div className={`w-10 h-10 rounded-lg ${iconColor} flex items-center justify-center`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
    </div>
  )
}

/* ── Status badge ─────────────────────────────────────────────────────── */
function StatusBadge({ status }) {
  const map = {
    open: {
      label: 'Open',
      cls: 'bg-green/10 text-green',
    },
    in_progress: {
      label: 'In Progress',
      cls: 'bg-orange/10 text-orange',
    },
    completed: {
      label: 'Completed',
      cls: 'bg-green/10 text-green',
    },
    cancelled: {
      label: 'Cancelled',
      cls: 'bg-red-50 text-red-600',
    },
    pending: {
      label: 'Pending',
      cls: 'bg-gray-100 text-gray-500',
    },
    accepted: {
      label: 'Accepted',
      cls: 'bg-green/10 text-green',
    },
    declined: {
      label: 'Declined',
      cls: 'bg-red-50 text-red-600',
    },
  }

  const { label, cls } = map[status] || {
    label: status,
    cls: 'bg-gray-100 text-gray-500',
  }

  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${cls}`}>
      {label}
    </span>
  )
}

/* ── Customer view ────────────────────────────────────────────────────── */
function CustomerDashboard({ data }) {
  const stats = data.stats || {}
  const projects = data.recent_projects || []

  return (
    <div className="space-y-8">

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={FolderOpen}
          iconColor="bg-navy"
          label="Total Projects"
          value={stats.total_projects}
        />

        <StatCard
          icon={Clock}
          iconColor="bg-maroon"
          label="Open"
          value={stats.open_projects}
        />

        <StatCard
          icon={TrendingUp}
          iconColor="bg-orange"
          label="In Progress"
          value={stats.in_progress}
        />

        <StatCard
          icon={CheckCircle2}
          iconColor="bg-green"
          label="Completed"
          value={stats.completed}
        />
      </div>

      {/* Recent projects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-navy">
            Recent Projects
          </h3>

          <Link
            to="/post-project"
            className="flex items-center gap-1 text-sm text-orange font-semibold hover:underline"
          >
            <Plus size={14} />
            Post New Project
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="bg-white rounded-xl shadow-card p-10 text-center border-t-4 border-orange">
            <img
              src="/images/mushawedu-logo.png"
              alt="MushaWedu Logo"
              className="w-14 h-14 object-contain mx-auto mb-3"
            />

            <FolderOpen size={36} className="text-gray-300 mx-auto mb-3" />

            <p className="font-semibold text-gray-500 mb-1">
              No projects yet
            </p>

            <p className="text-sm text-gray-400 mb-5">
              Post your first construction project on MushaWedu to receive quotes from verified artisans.
            </p>

            <Link to="/post-project" className="btn-primary mx-auto">
              <Plus size={15} />
              Post a Project
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {projects.map((p) => (
              <div
                key={p.id}
                className="card-bordered flex items-center justify-between gap-4 flex-wrap"
              >
                <div>
                  <h4 className="font-semibold text-navy text-sm">
                    {p.title}
                  </h4>

                  <p className="text-xs text-gray-400 mt-0.5">
                    {p.category}
                  </p>
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  {(p.budget_min || p.budget_max) && (
                    <span className="text-sm font-semibold text-navy">
                      ${p.budget_min}–${p.budget_max}
                    </span>
                  )}

                  <StatusBadge status={p.status} />

                  <span className="text-xs text-gray-400">
                    {new Date(p.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            icon: Plus,
            label: 'Post a Project',
            to: '/post-project',
            color: 'bg-navy',
          },
          {
            icon: ShieldCheck,
            label: 'Find Artisans',
            to: '/artisans',
            color: 'bg-maroon',
          },
          {
            icon: Package,
            label: 'Browse Materials',
            to: '/suppliers',
            color: 'bg-orange',
          },
        ].map((a) => (
          <Link
            key={a.label}
            to={a.to}
            className="flex items-center gap-3 bg-white rounded-xl shadow-card p-4 hover:shadow-lg transition-shadow group"
          >
            <div className={`w-10 h-10 ${a.color} rounded-lg flex items-center justify-center`}>
              <a.icon size={18} className="text-white" />
            </div>

            <span className="font-semibold text-navy text-sm group-hover:text-orange transition-colors">
              {a.label}
            </span>
          </Link>
        ))}
      </div>

      {/* Market Analytics */}
      <div className="bg-bgray rounded-xl p-6">
        <AnalyticsCharts />
      </div>
    </div>
  )
}

/* ── Artisan view ─────────────────────────────────────────────────────── */
function ArtisanDashboard({ data }) {
  const stats = data.stats || {}
  const user = data.user || {}

  return (
    <div className="space-y-8">

      {/* Profile completeness */}
      {stats.profile_complete === false && (
        <div className="card-bordered border-orange bg-orange/4 flex items-start gap-3">
          <TriangleAlert size={20} className="text-orange shrink-0 mt-0.5" />

          <div>
            <p className="font-semibold text-navy text-sm">
              Complete Your Profile
            </p>

            <p className="text-sm text-gray-500 mt-0.5">
              Add your trade, portfolio photos, and certifications to start receiving enquiries through MushaWedu.
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Star}
          iconColor="bg-orange"
          label="Rating"
          value={stats.rating?.toFixed(1)}
          sub="out of 5.0"
        />

        <StatCard
          icon={ShieldCheck}
          iconColor="bg-green"
          label="Status"
          value={stats.is_verified ? 'Verified' : 'Unverified'}
        />

        <StatCard
          icon={Briefcase}
          iconColor="bg-maroon"
          label="Trade"
          value={stats.trade || '–'}
        />

        <StatCard
          icon={Star}
          iconColor="bg-navy"
          label="Reviews"
          value={stats.review_count}
        />
      </div>

      {/* Profile preview */}
      <div className="bg-white rounded-xl shadow-card p-6 border-t-4 border-orange">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-14 h-14 rounded-full bg-maroon/10 flex items-center justify-center">
            <span className="text-maroon font-bold text-2xl">
              {(user.first_name?.[0] || '?').toUpperCase()}
            </span>
          </div>

          <div>
            <h3 className="font-bold text-navy">
              {user.first_name} {user.last_name}
            </h3>

            <p className="text-sm text-gray-400">
              {user.role_display}
            </p>

            {user.is_verified && (
              <span className="badge-verified mt-1">
                <ShieldCheck size={10} />
                MushaWedu Verified
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
          {user.location && (
            <span className="flex items-center gap-1">
              <MapPin size={13} className="text-green" />
              {user.location}
            </span>
          )}

          {stats.rating > 0 && (
            <span className="flex items-center gap-1.5">
              <StarRating value={stats.rating} size={13} />

              <span className="font-semibold text-navy">
                {stats.rating?.toFixed(1)}
              </span>
            </span>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            icon: Plus,
            label: 'Edit My Profile',
            to: '/artisan-profile',
            color: 'bg-maroon',
          },
          {
            icon: Package,
            label: 'Browse Open Projects',
            to: '/projects',
            color: 'bg-orange',
          },
        ].map((a) => (
          <Link
            key={a.label}
            to={a.to}
            className="flex items-center gap-3 bg-white rounded-xl shadow-card p-4 hover:shadow-lg transition-shadow group"
          >
            <div className={`w-10 h-10 ${a.color} rounded-lg flex items-center justify-center`}>
              <a.icon size={18} className="text-white" />
            </div>

            <span className="font-semibold text-navy text-sm group-hover:text-orange transition-colors">
              {a.label}
            </span>
          </Link>
        ))}
      </div>

      {/* Market Analytics */}
      <div className="bg-bgray rounded-xl p-6">
        <AnalyticsCharts />
      </div>
    </div>
  )
}

/* ── Supplier view ────────────────────────────────────────────────────── */
function SupplierDashboard({ data }) {
  const stats = data.stats || {}

  return (
    <div className="space-y-8">

      <div className="grid grid-cols-2 gap-4">
        <StatCard
          icon={Package}
          iconColor="bg-orange"
          label="Total Listings"
          value={stats.total_listings}
        />

        <StatCard
          icon={CheckCircle2}
          iconColor="bg-green"
          label="Active Listings"
          value={stats.active_listings}
        />
      </div>

      <div className="bg-white rounded-xl shadow-card p-6 border-t-4 border-orange">
        <div className="flex items-center gap-3 mb-2">
          <img
            src="/images/mushawedu-logo.png"
            alt="MushaWedu Logo"
            className="w-10 h-10 object-contain"
          />

          <div>
            <h3 className="font-bold text-navy">
              Supplier Marketplace
            </h3>

            <p className="text-sm text-gray-400">
              Manage your MushaWedu material listings and resale stock.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            icon: Plus,
            label: 'Add Material Listing',
            to: '/add-listing',
            color: 'bg-orange',
          },
          {
            icon: Package,
            label: 'View All Listings',
            to: '/suppliers',
            color: 'bg-navy',
          },
        ].map((a) => (
          <Link
            key={a.label}
            to={a.to}
            className="flex items-center gap-3 bg-white rounded-xl shadow-card p-4 hover:shadow-lg transition-shadow group"
          >
            <div className={`w-10 h-10 ${a.color} rounded-lg flex items-center justify-center`}>
              <a.icon size={18} className="text-white" />
            </div>

            <span className="font-semibold text-navy text-sm group-hover:text-orange transition-colors">
              {a.label}
            </span>
          </Link>
        ))}
      </div>

      {/* Market Analytics */}
      <div className="bg-bgray rounded-xl p-6">
        <AnalyticsCharts />
      </div>
    </div>
  )
}

/* ── Page ─────────────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/users/dashboard/')
      .then(({ data }) => setData(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <Spinner label="Loading MushaWedu dashboard…" />
  }

  const roleMap = {
    customer: {
      label: 'Customer Dashboard',
      icon: LayoutDashboard,
    },
    artisan: {
      label: 'Artisan Dashboard',
      icon: Briefcase,
    },
    supplier: {
      label: 'Supplier Dashboard',
      icon: Package,
    },
    admin: {
      label: 'Admin Dashboard',
      icon: ShieldCheck,
    },
  }

  const { label } = roleMap[user?.role] || {
    label: 'Dashboard',
  }

  return (
    <div className="min-h-screen bg-bgray">

      {/* Header */}
      <div className="bg-navy py-12">
        <div className="section-wrap">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-start gap-4">
              <img
                src="/images/mushawedu-logo.png"
                alt="MushaWedu Logo"
                className="w-14 h-14 object-contain"
              />

              <div>
                <p className="text-orange font-semibold text-sm uppercase tracking-widest mb-1">
                  {label}
                </p>

                <h1 className="text-white text-2xl md:text-3xl font-extrabold">
                  Welcome back, {user?.first_name || user?.username} 👋
                </h1>

                <p className="text-white/60 text-sm mt-1">
                  {new Date().toLocaleDateString('en-ZW', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>

                <p className="text-white/50 text-xs mt-2">
                  MushaWedu Construction Marketplace
                </p>
              </div>
            </div>

            {user?.is_verified && (
              <span className="badge-verified bg-white/10 text-white border border-white/20 px-3 py-1.5">
                <ShieldCheck size={12} />
                Verified Account
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="section-wrap py-10">
        {data && user?.role === 'customer' && <CustomerDashboard data={data} />}

        {data && user?.role === 'artisan' && <ArtisanDashboard data={data} />}

        {data && user?.role === 'supplier' && <SupplierDashboard data={data} />}

        {data && user?.role === 'admin' && (
          <div className="card-bordered">
            <div className="flex items-center gap-3 mb-2">
              <img
                src="/images/mushawedu-logo.png"
                alt="MushaWedu Logo"
                className="w-10 h-10 object-contain"
              />

              <div>
                <p className="font-semibold text-navy">
                  MushaWedu Admin
                </p>

                <p className="text-sm text-gray-500">
                  Admin panel available at{' '}
                  <a
                    href="http://127.0.0.1:8000/admin/"
                    className="text-maroon font-semibold hover:underline"
                  >
                    Django Admin
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}