import { Link } from 'react-router-dom'
import logo from '../assets/logo.svg'

const quickLinks = [
  { to: '/shop', label: 'Shop' },
  { to: '/blog', label: 'Blog' },
]

const aboutLinks = [
  {
    href: 'https://www.toplinemd.com/beaches-obgyn/',
    label: 'The Practice',
    external: true,
  },
  {
    href: 'https://www.toplinemd.com/beaches-obgyn/contact-us/',
    label: 'Contact',
    external: true,
  },
]

export default function Footer() {
  return (
    // relative z-10: the footer renders outside App's wrapper, and a static
    // element would paint under the fixed z-0 backdrop.
    <footer className="glass-band relative z-10">
      <div className="max-w-[1140px] mx-auto px-5 md:px-16 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
          {/* Brand column */}
          <div className="text-center md:text-left">
            <img
              src={logo}
              alt="Beaches OBGYN"
              className="h-12 w-auto mx-auto md:mx-0"
            />
            <p className="mt-4 text-on-surface-variant text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
              Carefully curated wellness products, hand-picked by our board-certified OBGYN team for every stage of your health journey.
            </p>
          </div>

          {/* Browse column */}
          <div className="text-center md:text-left">
            <h3 className="font-label text-xs tracking-[0.2em] uppercase text-secondary mb-4">
              Browse
            </h3>
            <ul className="space-y-2">
              {quickLinks.map(l => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-on-surface-variant hover:text-primary text-sm transition"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About column */}
          <div className="text-center md:text-left">
            <h3 className="font-label text-xs tracking-[0.2em] uppercase text-secondary mb-4">
              About
            </h3>
            <ul className="space-y-2">
              {aboutLinks.map(l => (
                <li key={l.href || l.to}>
                  {l.external ? (
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-on-surface-variant hover:text-primary text-sm transition"
                    >
                      {l.label}
                    </a>
                  ) : (
                    <Link
                      to={l.to}
                      className="text-on-surface-variant hover:text-primary text-sm transition"
                    >
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Fine print: affiliate disclosure (FTC-required) + FDA disclaimer + copyright */}
        <div className="mt-12 md:mt-16 pt-8 border-t border-outline-variant/40 text-center md:text-left">
          <p className="text-[10px] leading-relaxed text-on-surface-variant/80 max-w-3xl mx-auto md:mx-0">
            As an Amazon Associate, Beaches OBGYN Ventures, LLC earns from qualifying purchases at no additional cost to you. These statements have not been evaluated by the Food and Drug Administration. Products featured are not intended to diagnose, treat, cure, or prevent any disease. Consult your healthcare provider before starting any new supplement.
          </p>
          <p className="mt-4 text-[10px] tracking-[0.15em] uppercase text-on-surface-variant/60">
            © {new Date().getFullYear()} Beaches OBGYN · All rights reserved
          </p>
        </div>
      </div>
    </footer>
  )
}
