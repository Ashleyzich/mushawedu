import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Facebook, Twitter, Linkedin } from 'lucide-react'

const links = {
  Platform: [
    { label: 'Find Artisans',   to: '/artisans'  },
    { label: 'Browse Suppliers', to: '/suppliers' },
    { label: 'Post a Project',  to: '/register'  },
    { label: 'Resale Hub',      to: '/suppliers?resale=true' },
  ],
  Company: [
    { label: 'About MushaWedu',   to: '/#about'    },
    { label: 'How It Works',     to: '/#how'      },
    { label: 'Careers',          to: '/#careers'  },
    { label: 'Contact Us',       to: '/#contact'  },
  ],
  Support: [
    { label: 'Help Centre',     to: '/#help'     },
    { label: 'Privacy Policy',  to: '/#privacy' },
    { label: 'Terms of Use',    to: '/#terms'    },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-navy text-white/80">
      <div className="section-wrap pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img
                src="/images/mushawedu-logo.png"
                alt="MushaWedu Logo"
                className="w-11 h-11 object-contain"
              />

              <div className="flex flex-col leading-none">
                <span className="text-white font-extrabold text-xl">
                  MushaWedu
                </span>
                <span className="text-white/50 text-xs mt-1">
                  Zimbabwe
                </span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed mb-5 max-w-xs">
              Zimbabwe&apos;s trusted digital marketplace connecting homeowners with verified
              artisans, quality suppliers, and construction professionals.
            </p>

            <div className="flex flex-col gap-2 text-sm">
              <span className="flex items-center gap-2">
                <MapPin size={14} className="text-orange shrink-0" />
                Harare, Zimbabwe
              </span>

              <span className="flex items-center gap-2">
                <Phone size={14} className="text-orange shrink-0" />
                +263 77 000 0000
              </span>

              <span className="flex items-center gap-2">
                <Mail size={14} className="text-orange shrink-0" />
                hello@mushawedu.co.zw
              </span>
            </div>

            <div className="flex items-center gap-3 mt-5">
              {[Facebook, Twitter, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-orange flex items-center justify-center transition-colors duration-150"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">
                {title}
              </h4>

              <ul className="flex flex-col gap-2">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="text-sm hover:text-orange transition-colors duration-150"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <p>
            © {new Date().getFullYear()} MushaWedu Technologies. All rights reserved.
          </p>

          <p className="flex items-center gap-1">
            Built by the MushaWedu Team — Harare Institute of Technology
          </p>
        </div>
      </div>
    </footer>
  )
}