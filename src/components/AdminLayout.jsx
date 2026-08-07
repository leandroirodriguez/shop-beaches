import { Link, useLocation } from 'react-router-dom'

// Preview-mode layout. Once Supabase auth is wired, this will be
// wrapped in useAdminGuard() and a real sign-out button will replace
// the "preview" badge.

export default function AdminLayout({ children, backTo, backLabel }) {
  const location = useLocation()
  const isLogin = location.pathname === '/admin'

  return (
    <div className="min-h-svh">
      {!isLogin && (
        <header className="sticky top-0 z-40 bg-white/55 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_1px_3px_rgb(47_86_100_/_0.07)]">
          <div className="max-w-[960px] mx-auto px-5 md:px-10 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/admin/dashboard" className="font-headline text-lg text-on-surface">
                Admin
              </Link>
              <span className="font-label text-[10px] tracking-[0.15em] uppercase px-2 py-0.5 rounded-sm bg-secondary-container/60 text-on-secondary-container">
                Preview
              </span>
            </div>
            <Link
              to="/"
              className="font-label text-xs tracking-wider uppercase text-on-surface-variant hover:text-primary"
            >
              View Site
            </Link>
          </div>
        </header>
      )}

      {backTo && (
        <div className="max-w-[960px] mx-auto px-5 md:px-10 pt-6">
          <Link
            to={backTo}
            className="inline-flex items-center gap-1 text-sm text-on-surface-variant hover:text-primary"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
            {backLabel || 'Back'}
          </Link>
        </div>
      )}

      {children}
    </div>
  )
}
