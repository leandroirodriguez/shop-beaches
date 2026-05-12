import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

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
    <main className="max-w-[720px] mx-auto px-5 pb-32">
      {/* Hero image with badge */}
      <div className="relative mt-4 rounded-xl overflow-hidden bg-surface-container">
        {p.badge && (
          <span className="absolute top-4 left-4 z-10 inline-flex items-center px-3 py-1 rounded-md bg-secondary text-on-secondary font-label text-[11px] tracking-[0.12em] uppercase">
            {p.badge}
          </span>
        )}
        {images[0] && (
          <img src={images[0]} alt={p.display_title} className="w-full aspect-square object-cover" />
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3">
          {images.slice(1, 5).map((src, i) => (
            <div key={i} className="aspect-square rounded-md overflow-hidden bg-surface-container border border-outline-variant/40">
              <img src={src} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}

      {/* Title block */}
      <div className="mt-8">
        <StarRow rating={4.8} count={124} />
        <h1 className="font-headline text-3xl text-on-surface mt-3 leading-tight">{p.display_title}</h1>
        {p.amazon_price && <p className="font-headline text-2xl text-primary mt-3">{p.amazon_price}</p>}
        {p.short_description && <p className="text-on-surface-variant mt-4 leading-relaxed">{p.short_description}</p>}
      </div>

      {/* Why We Recommend This */}
      {p.provider_note && (
        <section className="mt-10 rounded-xl bg-primary text-on-primary p-6">
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
        <section className="mt-12">
          <h2 className="font-headline text-2xl text-on-surface">How to Use</h2>
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

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-outline-variant/40 text-center">
        <p className="font-headline text-2xl text-on-surface">Beaches OBGYN</p>
        <p className="mt-6 text-[10px] tracking-wider uppercase text-on-surface-variant leading-relaxed">
          These statements have not been evaluated by the Food and Drug Administration.
          This product is not intended to diagnose, treat, cure, or prevent any disease.
          Consult your provider before starting new supplements.
        </p>
      </footer>

      {/* Sticky bottom CTA */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-surface-container border-t border-outline-variant/40">
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
