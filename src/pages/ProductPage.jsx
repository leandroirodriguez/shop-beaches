import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { formatPrice } from '../lib/format'
import Starfish from '../components/Starfish'

function StarRow({ rating, count }) {
  if (rating == null) return null
  const filled = Math.round(rating)
  const formatted = Number.isInteger(rating) ? rating : rating.toFixed(1)
  const formattedCount = count != null ? count.toLocaleString() : null
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
      <span>
        {formatted}/5{formattedCount ? ` · ${formattedCount} reviews` : ''}
      </span>
    </div>
  )
}

export default function ProductPage() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [primaryCategory, setPrimaryCategory] = useState(null)
  const [status, setStatus] = useState('loading')
  const [activeImage, setActiveImage] = useState(0)
  const [relatedProducts, setRelatedProducts] = useState(null)
  const [recentPosts, setRecentPosts] = useState(null)

  useEffect(() => {
    // Reset state when navigating between products
    setProduct(null)
    setPrimaryCategory(null)
    setStatus('loading')
    setActiveImage(0)
    setRelatedProducts(null)
    setRecentPosts(null)

    supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle()
      .then(async ({ data, error }) => {
        if (error) { setStatus('error'); return }
        if (!data) { setStatus('not-found'); return }
        setProduct(data)
        setStatus('ok')

        // Look up the primary category (first id in category_ids) so we
        // can display its name in the "More from X" related-products header.
        const catIds = data.category_ids || []
        if (catIds.length > 0) {
          supabase
            .from('categories')
            .select('id, name, slug')
            .eq('id', catIds[0])
            .maybeSingle()
            .then(({ data: cat }) => setPrimaryCategory(cat))

          // Related: any other product that shares at least one category
          supabase
            .from('products')
            .select('id, slug, display_title, amazon_image_urls, amazon_price, badge')
            .eq('published', true)
            .overlaps('category_ids', catIds)
            .neq('id', data.id)
            .order('is_top_recommendation', { ascending: false })
            .order('created_at', { ascending: false })
            .limit(3)
            .then(({ data: related }) => setRelatedProducts(related || []))
        } else {
          setRelatedProducts([])
        }
      })

    // Recent posts in parallel — doesn't depend on the product
    supabase
      .from('blog_posts')
      .select('id, slug, title, excerpt, cover_url, published_at')
      .eq('published', true)
      .order('published_at', { ascending: false })
      .limit(2)
      .then(({ data }) => setRecentPosts(data || []))
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
          <div
            className={`relative mt-4 md:mt-0 rounded-md overflow-hidden ${
              activeImage === 0 ? 'bg-surface-container-lowest' : ''
            }`}
          >
            {p.badge && (
              <span className="absolute top-4 left-4 z-10 inline-flex items-center px-3 py-1 rounded-md bg-secondary text-on-secondary font-label text-[11px] tracking-[0.12em] uppercase">
                {p.badge}
              </span>
            )}
            {images[activeImage] && (
              <img
                src={images[activeImage]}
                alt={p.display_title}
                className={`w-full aspect-square ${
                  activeImage === 0
                    ? 'object-contain p-4 md:p-10'
                    : 'object-cover'
                }`}
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
                  className={`aspect-square rounded-md overflow-hidden border-2 transition ${
                    activeImage === i
                      ? 'border-primary'
                      : 'border-outline-variant/40 hover:border-outline'
                  }`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Summary column */}
        <div className="mt-8 md:mt-0">
          <StarRow rating={p.rating} count={p.review_count} />
          <h1 className="font-headline text-3xl md:text-4xl text-on-surface mt-3 leading-tight">{p.display_title}</h1>
          {p.amazon_price && (
            <p className="font-headline text-2xl md:text-3xl text-primary mt-3">{formatPrice(p.amazon_price)}</p>
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

      {/* Why We Recommend This — refined; internal 2-col on lg+ so the
          card spans the full container width without giving the quote
          uncomfortable line lengths */}
      {p.provider_note && (
        <section className="relative mt-10 md:mt-20 rounded-2xl bg-primary text-on-primary p-7 md:p-12 overflow-hidden">
          {/* Decorative starfish watermark, bottom-right */}
          <Starfish className="absolute -bottom-24 -right-24 w-80 h-80 md:w-96 md:h-96 text-primary-fixed-dim opacity-15 -rotate-12 pointer-events-none" />

          {/* OBGYN Approved stamp — visible only at md (single-col card).
              At lg+ the 2-col layout already provides visual rhythm and
              the stamp would crash into the right column. */}
          <div
            className="hidden md:flex lg:hidden absolute top-7 right-7 w-24 h-24 rounded-full border-2 border-primary-fixed-dim/40 items-center justify-center"
            style={{ transform: 'rotate(8deg)' }}
            aria-hidden="true"
          >
            <div className="text-center font-label text-[9px] tracking-[0.2em] uppercase text-primary-fixed-dim/80 leading-[1.4]">
              OBGYN<br />
              <span className="inline-block text-base leading-none my-0.5">✦</span><br />
              Approved
            </div>
          </div>

          <div className="relative lg:grid lg:grid-cols-2 lg:gap-14 lg:items-start">
            {/* Quote column */}
            <div>
              <p className="font-label text-[10px] tracking-[0.25em] uppercase text-primary-fixed-dim md:max-w-[70%] lg:max-w-none">
                Why We Recommend This
              </p>

              <blockquote className="mt-4 md:mt-5 font-headline text-xl md:text-3xl leading-[1.3] italic text-on-primary md:max-w-[70%] lg:max-w-none">
                <span className="font-headline text-3xl md:text-5xl leading-none align-text-top text-primary-fixed-dim mr-1.5">"</span>
                {p.provider_note}
              </blockquote>

              <p className="mt-6 font-label text-[11px] tracking-[0.2em] uppercase text-primary-fixed-dim">
                — The Beaches OBGYN Team
              </p>
            </div>

            {/* Benefits column (right on desktop, below on mobile) */}
            {Array.isArray(p.key_benefits) && p.key_benefits.length > 0 && (
              <div className="mt-8 lg:mt-0">
                {/* Divider only on stacked layouts; not needed in 2-col */}
                <div className="mb-6 h-px bg-primary-container/60 lg:hidden" />
                <p className="hidden lg:block font-label text-[10px] tracking-[0.25em] uppercase text-primary-fixed-dim mb-5">
                  Key Benefits
                </p>
                <ul className="space-y-4">
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
              </div>
            )}
          </div>
        </section>
      )}

      {/* How to Use — vertical list on mobile/tablet, horizontal 3-up grid on lg+ */}
      {Array.isArray(p.how_to_use) && p.how_to_use.length > 0 && (
        <section className="mt-12 md:mt-16">
          <h2 className="font-headline text-2xl md:text-3xl text-on-surface">How to Use</h2>
          <ol className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
            {p.how_to_use.map(s => (
              <li
                key={s.step}
                className="flex items-start gap-4 lg:block lg:card-soft lg:rounded-lg lg:p-6"
              >
                <span className="w-8 h-8 rounded-full border-2 border-primary text-primary font-label font-semibold grid place-items-center shrink-0 lg:mb-3">
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

      {/* Full-width: You May Also Like + Recommended Reading.
          Hidden on mobile (too much vertical scroll for small screens). */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="hidden md:block mt-16 md:mt-24">
          <h2 className="font-headline text-2xl md:text-3xl text-on-surface">You May Also Like</h2>
          <p className="text-on-surface-variant mt-2">
            More from {primaryCategory?.name || 'this category'}
          </p>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
            {relatedProducts.map(rp => (
              <Link
                key={rp.id}
                to={`/product/${rp.slug}`}
                className="group block card-soft rounded-lg overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md"
              >
                {rp.amazon_image_urls?.[0] && (
                  <img
                    src={rp.amazon_image_urls[0]}
                    alt={rp.display_title}
                    className="w-full aspect-square object-contain p-4 bg-surface-container-lowest transition duration-500 group-hover:scale-[1.03]"
                  />
                )}
                <div className="p-4 md:p-5">
                  {rp.badge && (
                    <span className="inline-block font-label text-[10px] tracking-[0.15em] uppercase text-secondary mb-2">
                      {rp.badge}
                    </span>
                  )}
                  <h3 className="font-headline text-base md:text-lg text-on-surface leading-snug">
                    {rp.display_title}
                  </h3>
                  {rp.amazon_price && (
                    <p className="font-headline text-sm md:text-base text-primary mt-1">{formatPrice(rp.amazon_price)}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {recentPosts && recentPosts.length > 0 && (
        <section className="mt-16 md:mt-24">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="font-headline text-2xl md:text-3xl text-on-surface">Recommended Reading</h2>
            <Link to="/blog" className="font-label text-xs tracking-wider uppercase text-primary hover:underline">
              View All →
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {recentPosts.map(post => (
              <article key={post.id} className="group">
                {post.cover_url && (
                  <Link to={`/blog/${post.slug}`} className="block overflow-hidden rounded-lg">
                    <img
                      src={post.cover_url}
                      alt=""
                      className="w-full aspect-[16/9] object-cover transition duration-500 group-hover:scale-105"
                    />
                  </Link>
                )}
                <Link to={`/blog/${post.slug}`} className="hover:underline">
                  <h3 className="font-headline text-lg md:text-xl text-on-surface leading-snug mt-3">
                    {post.title}
                  </h3>
                </Link>
                {post.excerpt && (
                  <p className="text-on-surface-variant text-sm mt-2 line-clamp-2">{post.excerpt}</p>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Sticky bottom CTA — mobile only */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/55 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_-1px_3px_rgb(47_86_100_/_0.07)]">
        <div className="max-w-[720px] mx-auto px-5 py-3 flex items-center gap-4">
          <div className="flex-1">
            {p.amazon_price && (
              <>
                <p className="font-label text-[10px] tracking-[0.15em] uppercase text-on-surface-variant">
                  Retail Price
                </p>
                <p className="font-headline text-xl text-on-surface leading-none mt-1">{formatPrice(p.amazon_price)}</p>
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
