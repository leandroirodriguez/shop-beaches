import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import logo from '../assets/logo.svg'

function StarRow({ rating = 4.8, count }) {
  const filled = Math.round(rating)
  return (
    <div className="flex items-center gap-2 text-sm text-on-surface-variant">
      <div className="flex">
        {[1, 2, 3, 4, 5].map(i => (
          <svg
            key={i}
            width="16" height="16" viewBox="0 0 24 24"
            fill={i <= filled ? 'currentColor' : 'none'}
            stroke="currentColor" strokeWidth="2"
            className="text-primary"
          >
            <polygon points="12 2 15 9 22 9.5 17 14.5 18.5 22 12 18 5.5 22 7 14.5 2 9.5 9 9 12 2" />
          </svg>
        ))}
      </div>
      {count != null && <span>({rating}/5 · {count} Patients)</span>}
    </div>
  )
}

export default function ProductPage() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [status, setStatus] = useState('loading')
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    supabase
      .from('products')
      .select('*, category:categories(name, slug)')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) { setStatus('error'); return }
        if (!data) { setStatus('not-found'); return }
        setProduct(data)
        setActiveImage(0)
        setStatus('ok')
      })
  }, [slug])

  if (status === 'loading') {
    return <main className="max-w-[720px] mx-auto px-5 py-12 text-on-surface-variant">Loading…</main>
  }
  if (status === 'not-found') {
    return (
      <main className="max-w-[720px] mx-auto px-5 py-12 text-center">
        <h1 className="font-headline text-2xl text-on-surface">Product not found</h1>
        <p className="text-on-surface-variant mt-2">
          The product you're looking for isn't available right now.
        </p>
        <Link to="/" className="inline-block mt-4 font-label text-sm tracking-wider uppercase text-primary hover:underline">
          Back to Home
        </Link>
      </main>
    )
  }
  if (status === 'error' || !product) {
    return <main className="max-w-[720px] mx-auto px-5 py-12 text-on-surface-variant">Something went wrong loading this product.</main>
  }

  const p = product
  const images = p.amazon_image_urls || []

  return (
    <main className="max-w-[720px] md:max-w-[1140px] mx-auto px-5 md:px-10 pb-32 md:pb-16">
      {/* Top: image + summary side-by-side on desktop, stacked on mobile */}
      <div className="md:grid md:grid-cols-2 md:gap-12 md:items-start md:mt-8">
        {/* Image gallery (sticks on desktop scroll) */}
        <div className="md:sticky md:top-20">
          <div className="relative mt-4 md:mt-0 rounded-xl overflow-hidden bg-surface-container-lowest">
            {p.badge && (
              <span className="absolute top-4 left-4 z-10 inline-flex items-center px-3 py-1 rounded-md bg-secondary text-on-secondary font-label text-[11px] tracking-[0.12em] uppercase">
                {p.badge}
              </span>
            )}
            {images[activeImage] && (
              <img
                src={images[activeImage]}
                alt={p.display_title}
                className="w-full aspect-square object-contain p-4 md:p-10"
              />
            )}
          </div>

          {images.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-3">
              {images.slice(0, 4).map((src, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  aria-label={`Show image ${i + 1}`}
                  aria-pressed={activeImage === i}
                  className={`aspect-square rounded-md overflow-hidden bg-surface-container-lowest border-2 transition ${
                    activeImage === i
                      ? 'border-primary'
                      : 'border-outline-variant/40 hover:border-outline'
                  }`}
                >
                  <img src={src} alt="" className="w-full h-full object-contain p-1" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Summary column */}
        <div className="mt-8 md:mt-0">
          <StarRow rating={4.8} count={124} />
          <h1 className="font-headline text-3xl md:text-4xl text-on-surface mt-3 leading-tight">{p.display_title}</h1>
          {p.amazon_price && (
            <p className="font-headline text-2xl md:text-3xl text-primary mt-3">{p.amazon_price}</p>
          )}
          {p.short_description && (
            <p className="text-on-surface-variant mt-4 md:mt-5 leading-relaxed md:text-lg">{p.short_description}</p>
          )}

          {/* Desktop inline CTA — replaces the sticky bottom bar on wide screens */}
          <a
            href={p.amazon_url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="hidden md:inline-flex mt-7 items-center justify-center gap-2 px-7 py-3.5 rounded-md bg-primary text-on-primary font-label text-sm tracking-wider shadow-lift hover:bg-primary-container transition"
          >
            View on Amazon
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17 17 7M7 7h10v10" />
            </svg>
          </a>
        </div>
      </div>

      {/* Below the top grid: full-width sections with a constrained readable width */}
      <div className="md:max-w-[760px] md:mx-auto">
        {/* Why We Recommend This */}
        {p.provider_note && (
          <section className="mt-10 md:mt-20 rounded-xl bg-primary text-on-primary p-6 md:p-8">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-9 h-9 rounded-md bg-primary-container grid place-items-center shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </div>
              <h2 className="font-headline text-2xl leading-tight">Why We Recommend This</h2>
            </div>
            <blockquote className="italic text-primary-fixed-dim leading-relaxed">"{p.provider_note}"</blockquote>
            <div className="mt-4 pt-4 border-t border-primary-container">
              <p className="font-label text-[11px] tracking-[0.15em] uppercase text-primary-fixed-dim">
                — The Beaches OBGYN Team
              </p>
            </div>
            {Array.isArray(p.key_benefits) && p.key_benefits.length > 0 && (
              <ul className="mt-5 space-y-3">
                {p.key_benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-secondary-container text-on-secondary-container grid place-items-center shrink-0">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    <span>
                      <span className="font-semibold">{b.title}</span>
                      <span className="text-primary-fixed-dim"> — {b.body}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* How to Use */}
        {Array.isArray(p.how_to_use) && p.how_to_use.length > 0 && (
          <section className="mt-12 md:mt-16">
            <h2 className="font-headline text-2xl md:text-3xl text-on-surface">How to Use</h2>
            <ol className="mt-6 space-y-5">
              {p.how_to_use.map(s => (
                <li key={s.step} className="flex items-start gap-4">
                  <span className="w-8 h-8 rounded-full border-2 border-primary text-primary font-label font-semibold grid place-items-center shrink-0">
                    {s.step}
                  </span>
                  <div>
                    <h3 className="font-label font-semibold text-on-surface">{s.title}</h3>
                    <p className="text-on-surface-variant text-sm mt-1 leading-relaxed">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-outline-variant/40 flex flex-col items-center text-center md:max-w-[760px] md:mx-auto">
        <img
          src={logo}
          alt="Beaches OBGYN"
          className="h-16 md:h-20 w-auto"
        />
        <p className="mt-6 text-[10px] tracking-wider uppercase text-on-surface-variant leading-relaxed">
          These statements have not been evaluated by the Food and Drug Administration.
          This product is not intended to diagnose, treat, cure, or prevent any disease.
          Consult your provider before starting new supplements.
        </p>
      </footer>

      {/* Sticky bottom CTA — mobile only */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-surface-container border-t border-outline-variant/40">
        <div className="max-w-[720px] mx-auto px-5 py-3 flex items-center gap-4">
          <div className="flex-1">
            {p.amazon_price && (
              <>
                <p className="font-label text-[10px] tracking-[0.15em] uppercase text-on-surface-variant">
                  Retail Price
                </p>
                <p className="font-headline text-xl text-on-surface leading-none mt-1">{p.amazon_price}</p>
              </>
            )}
          </div>
          <a
            href={p.amazon_url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-primary text-on-primary font-label text-sm tracking-wider shadow-lift hover:bg-primary-container transition"
          >
            View on Amazon
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17 17 7M7 7h10v10" />
            </svg>
          </a>
        </div>
      </div>
    </main>
  )
}
