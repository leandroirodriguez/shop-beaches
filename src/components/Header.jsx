import { Link } from 'react-router-dom'
import logo from '../assets/logo.svg'

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/55 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_1px_3px_rgb(47_86_100_/_0.07)]">
      <div className="max-w-[1140px] mx-auto px-5 md:px-16 h-20 md:h-24 flex items-center">
        {/* Mobile-only spacer to keep the logo symmetrically centered.
            Removed on desktop so the logo hugs the left edge. */}
        <div className="flex-1 md:hidden" />

        {/* Logo returns to the practice site, not the shop home — the shop is
            a section of the practice, so the wordmark belongs to the parent.
            "Shop" in the nav is the way back to the shop's own landing page. */}
        <Link to="/mainclone" aria-label="Beaches OBGYN practice site" className="shrink-0">
          <img
            src={logo}
            alt="Beaches OBGYN"
            className="block h-[3.78rem] md:h-[4.32rem] w-auto"
          />
        </Link>

        {/* Mobile: flex-1 balances the left spacer to center the logo.
            Desktop: ml-auto pushes the nav to the far right with text links. */}
        <nav className="flex-1 md:flex-none md:ml-auto flex items-center justify-end gap-7">
          <Link
            to="/shop"
            className="hidden md:inline-block font-label text-xs tracking-[0.2em] uppercase text-on-surface hover:text-primary transition"
          >
            Shop
          </Link>
          <Link
            to="/blog"
            className="hidden md:inline-block font-label text-xs tracking-[0.2em] uppercase text-on-surface hover:text-primary transition"
          >
            Blog
          </Link>
          <Link
            to="/mainclone"
            className="hidden md:inline-block font-label text-xs tracking-[0.2em] uppercase text-on-surface hover:text-primary transition"
          >
            Practice
          </Link>
        </nav>
      </div>
    </header>
  )
}
