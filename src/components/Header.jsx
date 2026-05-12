import { Link } from 'react-router-dom'
import logo from '../assets/logo.svg'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur border-b border-outline-variant/40">
      <div className="max-w-[1140px] mx-auto px-5 md:px-16 h-16 md:h-20 flex items-center">
        {/* Spacer for symmetric centering of the logo */}
        <div className="flex-1" />

        <Link to="/" aria-label="Beaches OBGYN home" className="shrink-0">
          <img
            src={logo}
            alt="Beaches OBGYN"
            className="block h-12 md:h-14 w-auto"
          />
        </Link>

        <nav className="flex-1 flex items-center justify-end">
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
