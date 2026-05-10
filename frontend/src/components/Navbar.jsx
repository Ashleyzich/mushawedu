import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Menu, X, ChevronDown, LogOut,
  LayoutDashboard, User, ShieldCheck,
  MessageSquare, Zap
} from 'lucide-react'
import api from '../api/axios'

const navLinks = [
  { to: '/artisans',  label: 'Artisans'  },
  { to: '/suppliers', label: 'Suppliers' },
  { to: '/projects',  label: 'Projects'  },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open,         setOpen]         = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [unread,       setUnread]       = useState(0)

  useEffect(() => {
    if (!user) return

    const fetchUnread = () => {
      api.get('/messaging/unread/')
        .then(({ data }) => setUnread(data.unread || 0))
        .catch(() => {})
    }

    fetchUnread()
    const timer = setInterval(fetchUnread, 30000)

    return () => clearInterval(timer)
  }, [user])

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
    navigate('/')
  }

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-150 hover:text-orange ${
      isActive ? 'text-orange font-semibold' : 'text-white/90'
    }`

  return (
    <header className="bg-navy sticky top-0 z-50 shadow-lg">
      <div className="section-wrap">
        <div className="flex items-center justify-between h-16">

          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/images/mushawedu-logo.png"
              alt="MushaWedu Logo"
              className="w-11 h-11 object-contain"
            />

            <div className="flex flex-col leading-none">
              <span className="text-white font-extrabold text-xl tracking-tight">
                MushaWedu
              </span>
              <span className="hidden sm:block text-white/50 text-xs font-normal mt-1">
                Zimbabwe
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkClass}>
                {l.label}
              </NavLink>
            ))}

            {user && (
              <NavLink to="/quotation" className={linkClass}>
                <span className="flex items-center gap-1">
                  <Zap size={13} className="text-orange" />
                  Quote
                </span>
              </NavLink>
            )}
          </nav>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  to="/messages"
                  className="relative text-white/70 hover:text-white transition-colors p-1"
                >
                  <MessageSquare size={20} />

                  {unread > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange rounded-full flex items-center justify-center text-white text-[9px] font-bold">
                      {unread > 9 ? '9+' : unread}
                    </span>
                  )}
                </Link>

                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen((p) => !p)}
                    className="flex items-center gap-2 text-white/90 hover:text-white text-sm font-medium transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-maroon/80 flex items-center justify-center text-white text-xs font-bold">
                      {(user.first_name?.[0] || user.username?.[0] || '?').toUpperCase()}
                    </div>

                    <span className="max-w-[110px] truncate">
                      {user.first_name || user.username}
                    </span>

                    <ChevronDown
                      size={14}
                      className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 animate-fade-in">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs text-gray-400">Signed in as</p>

                        <p className="text-sm font-semibold text-navy truncate">
                          {user.first_name} {user.last_name}
                        </p>

                        {user.is_verified && (
                          <span className="badge-verified mt-0.5">
                            <ShieldCheck size={10} />
                            Verified
                          </span>
                        )}
                      </div>

                      <Link
                        to="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-body hover:bg-bgray transition-colors"
                      >
                        <LayoutDashboard size={15} className="text-orange" />
                        Dashboard
                      </Link>

                      <Link
                        to="/messages"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-body hover:bg-bgray transition-colors"
                      >
                        <MessageSquare size={15} className="text-maroon" />
                        Messages

                        {unread > 0 && (
                          <span className="ml-auto w-5 h-5 bg-orange rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                            {unread}
                          </span>
                        )}
                      </Link>

                      <Link
                        to="/quotation"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-body hover:bg-bgray transition-colors"
                      >
                        <Zap size={15} className="text-orange" />
                        AI Quotation
                      </Link>

                      {user.role === 'customer' && (
                        <Link
                          to="/post-project"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-body hover:bg-bgray"
                        >
                          <User size={15} className="text-green" />
                          Post a Project
                        </Link>
                      )}

                      {user.role === 'artisan' && (
                        <Link
                          to="/artisan-profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-body hover:bg-bgray"
                        >
                          <User size={15} className="text-green" />
                          My Profile
                        </Link>
                      )}

                      {user.role === 'supplier' && (
                        <Link
                          to="/add-listing"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-body hover:bg-bgray"
                        >
                          <User size={15} className="text-green" />
                          Add Listing
                        </Link>
                      )}

                      <hr className="my-1 border-gray-100" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={15} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm text-white/80 hover:text-white font-medium transition-colors"
                >
                  Sign In
                </Link>

                <Link to="/register" className="btn-primary text-sm py-2 px-5">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen((p) => !p)}
            className="md:hidden text-white/80 hover:text-white p-1"
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-navy border-t border-white/10 animate-fade-in">
          <div className="section-wrap py-4 flex flex-col gap-1">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-white/10 text-orange'
                      : 'text-white/80 hover:bg-white/5'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}

            {user && (
              <>
                <NavLink
                  to="/quotation"
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-white/10 text-orange'
                        : 'text-white/80 hover:bg-white/5'
                    }`
                  }
                >
                  <Zap size={13} className="text-orange" />
                  AI Quotation
                </NavLink>

                <NavLink
                  to="/messages"
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-white/10 text-orange'
                        : 'text-white/80 hover:bg-white/5'
                    }`
                  }
                >
                  <MessageSquare size={13} />
                  Messages

                  {unread > 0 && (
                    <span className="ml-1 w-4 h-4 bg-orange rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                      {unread}
                    </span>
                  )}
                </NavLink>
              </>
            )}

            <hr className="border-white/10 my-2" />

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-white/80 hover:bg-white/5"
                >
                  Dashboard
                </Link>

                <button
                  onClick={() => {
                    handleLogout()
                    setOpen(false)
                  }}
                  className="text-left px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-white/5"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-white/80 hover:bg-white/5"
                >
                  Sign In
                </Link>

                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="mt-1 btn-primary text-sm justify-center"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}