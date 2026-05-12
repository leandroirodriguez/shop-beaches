import { Link } from 'react-router-dom'
import logo from '../assets/logo.svg'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur border-b border-outline-variant/40">
      <div className="max-w-[1140px] mx-auto px-5 md:px-16 h-20 md:h-24 flex items-center">
        {/* Mobile-only spacer to keep the logo symmetrically centered.
            Removed on desktop so the logo hugs the left edge. */}
        <div className="flex-1 md:hidden" />

        <Link to="/" aria-label="Beaches OBGYN home" className="shrink-0">
          <img
            src={logo}
            alt="Beaches OBGYN"
            className="block h-14 md:h-16 w-auto"
          />
        </Link>

        {/* Mobile: flex-1 balances the left spacer to center the logo.
            Desktop: ml-auto pushes the nav to the far right. */}
        <nav className="flex-1 md:flex-none md:ml-auto flex items-center justify-end">
          <button
            type="button"
            aria-label="Search"
            className="w-10 h-10 grid place-items-center rounded-full hover:bg-surface-container-high"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
          </button>
        </nav>
      </div>
    </header>
  )
}
