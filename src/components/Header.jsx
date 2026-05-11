import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur border-b border-outline-variant/40">
      <div className="max-w-[1140px] mx-auto px-5 md:px-16 h-14 flex items-center justify-between">
        <Link
          to="/"
          className="font-headline text-xl text-on-surface"
        >
          Beaches OBGYN
        </Link>
        <nav className="flex items-center gap-1">
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
