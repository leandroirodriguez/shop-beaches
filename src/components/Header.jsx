import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.svg'
import Starfish from './Starfish'

// Shop nav — flat, so the mobile menu is a simple list (no accordion
// like the practice chrome needs).
const NAV = [
  { label: 'Shop', to: '/shop' },
  { label: 'Blog', to: '/blog' },
  { label: 'Practice', to: '/mainclone' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  // Collapse the wordmark to the starfish mark once the page is scrolled,
  // matching the practice pages' header behavior.
  const [compact, setCompact] = useState(false)

  useEffect(() => {
    const update = () => setCompact(window.scrollY > 40)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <header className="sticky top-0 z-40 bg-white/55 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_1px_3px_rgb(47_86_100_/_0.07)]">
      <div className="max-w-[1140px] mx-auto px-5 md:px-16 h-20 md:h-24 flex items-center">
        {/* Mobile-only spacer to keep the logo symmetrically centered.
            Removed on desktop so the logo hugs the left edge. */}
        <div className="flex-1 md:hidden" />

        {/* Logo returns to the practice site, not the shop home — the shop is
            a section of the practice, so the wordmark belongs to the parent.
            "Shop" in the nav is the way back to the shop's own landing page. */}
        {/* Wordmark at rest; crossfades to the starfish mark on scroll. The
            anchor animates its width so the nav closes the gap smoothly. */}
        <Link
          to="/mainclone"
          aria-label="Beaches OBGYN practice site"
          className={`relative shrink-0 flex items-center h-[3.78rem] md:h-[4.32rem] transition-[width] duration-300 ${
            compact ? 'w-[3.4rem] md:w-[3.9rem]' : 'w-[12.25rem] md:w-[14rem]'
          }`}
        >
          <img
            src={logo}
            alt="Beaches OBGYN"
            className={`absolute left-0 h-full w-auto max-w-none transition-opacity duration-300 ${
              compact ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <Starfish
            className={`absolute left-0 w-[3.4rem] h-[3.4rem] md:w-[3.9rem] md:h-[3.9rem] text-primary transition-opacity duration-300 ${
              compact ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          />
        </Link>

        {/* Mobile: flex-1 balances the left spacer to center the logo.
            Desktop: ml-auto pushes the nav to the far right with text links. */}
        <nav className="flex-1 md:flex-none md:ml-auto flex items-center justify-end gap-7">
          {NAV.map(item => (
            <Link
              key={item.label}
              to={item.to}
              className="hidden md:inline-block font-label text-xs tracking-[0.2em] uppercase text-on-surface hover:text-primary transition"
            >
              {item.label}
            </Link>
          ))}

          {/* Mobile: hamburger sits at the right edge; the left spacer above
              balances it so the logo stays optically centered. */}
          <button
            type="button"
            className="md:hidden -mr-2 p-2 text-on-surface"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(o => !o)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {menuOpen
                ? <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                : <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />}
            </svg>
          </button>
        </nav>
      </div>

      {/* Mobile menu panel */}
      {menuOpen && (
        <nav className="md:hidden border-t border-outline-variant/40 bg-white/85 backdrop-blur-2xl backdrop-saturate-150 px-5 py-3">
          {NAV.map(item => (
            <Link
              key={item.label}
              to={item.to}
              onClick={() => setMenuOpen(false)}
              className="block py-3 font-label text-xs tracking-[0.2em] uppercase text-on-surface hover:text-primary transition"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
