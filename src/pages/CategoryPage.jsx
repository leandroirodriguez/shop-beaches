import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { formatPrice } from '../lib/format'
import Reveal from '../components/Reveal'
import Starfish from '../components/Starfish'

// Reusable curved divider — matches the one on the homepage so the
// transitions feel consistent across landing pages.
function CurvedDivider({ tone = 'surface-container-low', flipY = false }) {
  const colorClass = {
    'surface-container-low': 'text-surface-container-low',
    surface: 'text-surface',
  }[tone] || 'text-surface-container-low'

  return (
    <svg
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      className={`block w-full h-10 md:h-14 ${colorClass}`}
      style={{ transform: flipY ? 'scaleY(-1)' : undefined }}
      aria-hidden="true"
    >
      <path fill="currentColor" d="M0,0 C360,72 1080,72 1440,0 L1440,80 L0,80 Z" />
    </svg>
  )
}

export default function CategoryPage() {
  const { slug } = useParams()
  const [category, setCategory] = useState(null)
  const [products, setProducts] = useState([])
  const [recentPosts, setRecentPosts] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    setStatus('loading')
    setCategory(null)
    setProducts([])
    setRecentPosts([])

    async function load() {
      const { data: cat } = await supabase
        .from('categories')
        .select('id, slug, name, description, intro_paragraph, cta_label, cta_url, hero_image_url')
        .eq('slug', slug)
        .maybeSingle()

      if (!cat) { setStatus('not-found'); return }
      setCategory(cat)

      const { data: items } = await supabase
        .from('products')
        .select('id, slug, display_title, short_description, amazon_price, amazon_image_urls, badge, is_top_recommendation, provider_note, tags')
        .contains('category_ids', [cat.id])
        .eq('published', true)
        .order('is_top_recommendation', { ascending: false })
        .order('created_at', { ascending: false })

      setProducts(items || [])

      // Try to fetch posts tagged with this category first; if none, fall back to latest 2 overall
      const { data: tagged } = await supabase
        .from('blog_posts')
        .select('id, slug, title, excerpt, cover_url, published_at')
        .eq('published', true)
        .eq('category_id', cat.id)
        .order('published_at', { ascending: false })
        .limit(2)

      if (tagged && tagged.length > 0) {
        setRecentPosts(tagged)
      } else {
        const { data: anyPosts } = await supabase
          .from('blog_posts')
          .select('id, slug, title, excerpt, cover_url, published_at')
          .eq('published', true)
          .order('published_at', { ascending: false })
          .limit(2)
        setRecentPosts(anyPosts || [])
      }

      setStatus('ok')
    }
    load()
  }, [slug])

  if (status === 'loading') {
    return <main className="max-w-[720px] mx-auto px-5 py-12 text-on-surface-variant">Loading…</main>
  }
  if (status === 'not-found') {
    return (
      <main className="max-w-[720px] mx-auto px-5 py-12 text-center">
        <h1 className="font-headline text-2xl text-on-surface">Category not found</h1>
        <Link to="/" className="inline-block mt-4 font-label text-sm tracking-wider uppercase text-primary hover:underline">
          Back to Home
        </Link>
      </main>
    )
  }

  // Only use the full-width spotlight when there's a real "top pick"
  // AND there are other products to distinguish it from. If the category
  // has only one product, the spotlight is redundant — show it as a
  // normal card in the grid instead.
  const topProduct = products.find(p => p.is_top_recommendation)
  const useSpotlight = topProduct && products.length > 1
  const gridProducts = useSpotlight
    ? products.filter(p => p.id !== topProduct.id)
    : products

  return (
    <>
      {/* Hero — image left, copy right (like homepage). Mobile stacks. */}
      <section className="hero-radial relative overflow-hidden">
        <Starfish
          className="hidden md:block absolute -top-32 -right-32 w-[420px] h-[420px] text-secondary opacity-[0.06] pointer-events-none rotate-12"
          aria-hidden="true"
        />
        <div className="relative max-w-[1140px] mx-auto px-5 md:px-16 pt-8 md:pt-14 lg:pt-20 pb-14 md:pb-20">
          {/* Breadcrumb */}
          <nav className="text-xs text-on-surface-variant">
            <Link to="/" className="hover:text-primary">HOME</Link>
            <span className="mx-2">›</span>
            <span className="text-secondary uppercase tracking-wider">{category.name}</span>
          </nav>

          <div className="mt-6 lg:grid lg:grid-cols-2 lg:gap-14 lg:items-center">
            {/* Image column — left on desktop */}
            {category.hero_image_url && (
              <div className="lg:order-1 max-w-md mx-auto lg:max-w-none lg:mx-0">
                <img
                  src={category.hero_image_url}
                  alt=""
                  className="w-full h-auto rounded-xl"
                  fetchPriority="high"
                  decoding="async"
                />
              </div>
            )}

            {/* Text column */}
            <div className={`mt-8 lg:mt-0 lg:order-2 ${category.hero_image_url ? '' : 'lg:col-span-2'}`}>
              <p className="font-label text-xs tracking-[0.2em] uppercase text-secondary mb-3">
                Expert Curation
              </p>
              <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl text-on-surface leading-[1.1]">
                {category.name} Essentials
              </h1>
              {category.description && (
                <p className="mt-5 text-on-surface-variant max-w-md md:text-lg leading-relaxed">
                  {category.description}
                </p>
              )}
              {category.cta_label && category.cta_url && (
                <a
                  href={category.cta_url}
                  target={category.cta_url.startsWith('http') ? '_blank' : undefined}
                  rel={category.cta_url.startsWith('http') ? 'noreferrer' : undefined}
                  className="mt-7 inline-flex items-center justify-center px-7 py-3 rounded-md bg-primary text-on-primary font-label text-sm tracking-wider uppercase shadow-lift hover:bg-primary-container transition"
                >
                  {category.cta_label}
                </a>
              )}
            </div>
          </div>
        </div>

        {category.intro_paragraph && <CurvedDivider tone="surface-container-low" />}
      </section>

      {/* "Why we curate" intro — tinted band, only renders if filled in */}
      {category.intro_paragraph && (
        <>
          <section className="bg-surface-container-low">
            <div className="max-w-[760px] mx-auto px-5 md:px-16 py-14 md:py-20 text-center">
              <Reveal>
                <p className="font-label text-xs tracking-[0.25em] uppercase text-secondary mb-5">
                  From Our Team
                </p>
                <p className="font-headline text-xl md:text-2xl text-on-surface italic leading-relaxed">
                  {category.intro_paragraph}
                </p>
              </Reveal>
            </div>
            <CurvedDivider tone="surface" />
          </section>
        </>
      )}

      {/* Top recommendation spotlight (only if there are other products too) */}
      {useSpotlight && (
        <section className="max-w-[1140px] mx-auto px-5 md:px-16 pt-10 md:pt-16">
          <Reveal>
            <div className="rounded-xl bg-surface-container-low shadow-lift overflow-hidden lg:grid lg:grid-cols-2 lg:items-center">
              {topProduct.amazon_image_urls?.[0] && (
                <Link to={`/product/${topProduct.slug}`} className="block bg-surface-container-lowest">
                  <img
                    src={topProduct.amazon_image_urls[0]}
                    alt={topProduct.display_title}
                    className="w-full aspect-square lg:aspect-auto lg:h-full object-contain p-8 md:p-12"
                  />
                </Link>
              )}
              <div className="p-8 md:p-12">
                <p className="font-label text-[11px] tracking-[0.2em] uppercase text-secondary mb-3">
                  Top Recommendation
                </p>
                <Link to={`/product/${topProduct.slug}`} className="hover:underline">
                  <h2 className="font-headline text-2xl md:text-3xl text-on-surface leading-snug">
                    {topProduct.display_title}
                  </h2>
                </Link>
                {topProduct.amazon_price && (
                  <p className="font-headline text-xl text-primary mt-2">
                    {formatPrice(topProduct.amazon_price)}
                  </p>
                )}
                {topProduct.short_description && (
                  <p className="mt-4 text-on-surface-variant leading-relaxed">
                    {topProduct.short_description}
                  </p>
                )}
                {topProduct.provider_note && (
                  <blockquote className="mt-5 pl-4 border-l-2 border-primary italic text-on-surface-variant text-sm leading-relaxed">
                    "{topProduct.provider_note}"
                  </blockquote>
                )}
                <Link
                  to={`/product/${topProduct.slug}`}
                  className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-md bg-primary text-on-primary font-label text-sm tracking-wider uppercase shadow-lift hover:bg-primary-container transition"
                >
                  View Details
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </Reveal>
        </section>
      )}

      {/* Product grid (the rest, or all if no spotlight) */}
      <section className="max-w-[1140px] mx-auto px-5 md:px-16 pt-10 md:pt-16 pb-4 md:pb-8">
        {products.length === 0 ? (
          <Reveal>
            <div className="rounded-xl bg-surface-container-low shadow-lift px-6 py-12 md:py-16 text-center">
              <Starfish className="w-12 h-12 mx-auto text-secondary opacity-60 mb-5" />
              <p className="font-headline text-2xl md:text-3xl text-on-surface">
                Curated picks coming soon
              </p>
              <p className="text-on-surface-variant mt-3 max-w-md mx-auto leading-relaxed">
                Our team is hand-selecting products for this category.
                In the meantime, browse the picks we've published elsewhere.
              </p>
              <Link
                to="/shop"
                className="mt-7 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-primary text-on-primary font-label text-sm tracking-wider uppercase shadow-lift hover:bg-primary-container transition"
              >
                Browse All Products
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </Reveal>
        ) : (
          <>
            <Reveal>
              <h2 className="font-headline text-2xl md:text-3xl text-on-surface">
                {useSpotlight ? 'More Picks' : 'Our Picks'}
              </h2>
            </Reveal>
            <Reveal delay={100} className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {gridProducts.map(p => (
                <article
                  key={p.id}
                  className="rounded-lg bg-surface-container-low shadow-lift overflow-hidden relative flex flex-col transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  {p.badge && (
                    <span className="absolute top-0 left-6 z-10 inline-flex items-center px-3 py-1.5 rounded-b-md bg-secondary-container text-on-secondary-container font-label text-[11px] tracking-[0.12em] uppercase">
                      {p.badge}
                    </span>
                  )}

                  {p.amazon_image_urls?.[0] && (
                    <Link to={`/product/${p.slug}`} className="block overflow-hidden">
                      <img
                        src={p.amazon_image_urls[0]}
                        alt={p.display_title}
                        className="w-full aspect-square object-contain p-6 bg-surface-container-lowest transition duration-500 hover:scale-[1.03]"
                      />
                    </Link>
                  )}

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <Link to={`/product/${p.slug}`} className="hover:underline">
                        <h3 className="font-headline text-lg lg:text-xl text-on-surface leading-snug">{p.display_title}</h3>
                      </Link>
                      {p.amazon_price && (
                        <p className="font-headline text-base lg:text-lg text-primary shrink-0">
                          {formatPrice(p.amazon_price)}
                        </p>
                      )}
                    </div>

                    {p.provider_note && (
                      <div className="mt-4 p-4 rounded-md bg-surface-container">
                        <p className="font-label text-[10px] tracking-[0.15em] uppercase text-on-surface-variant">
                          Provider's Note
                        </p>
                        <p className="italic text-sm text-on-surface-variant mt-1 leading-relaxed line-clamp-4">
                          "{p.provider_note}"
                        </p>
                      </div>
                    )}

                    <Link
                      to={`/product/${p.slug}`}
                      className="mt-auto pt-4 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-primary text-on-primary font-label text-sm tracking-wider shadow-lift hover:bg-primary-container transition"
                    >
                      View Details
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M13 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </Reveal>
          </>
        )}
      </section>

      {/* Related blog posts */}
      {recentPosts.length > 0 && (
        <section className="max-w-[1140px] mx-auto px-5 md:px-16 pt-12 md:pt-20">
          <Reveal>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="font-headline text-2xl md:text-3xl text-on-surface">Educational Resources</h2>
              <Link to="/blog" className="font-label text-xs tracking-wider uppercase text-primary hover:underline">
                View All →
              </Link>
            </div>
          </Reveal>
          <Reveal delay={100} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {recentPosts.map(p => (
              <article key={p.id} className="group">
                {p.cover_url && (
                  <Link to={`/blog/${p.slug}`} className="block overflow-hidden rounded-lg">
                    <img
                      src={p.cover_url}
                      alt=""
                      className="w-full aspect-[16/9] object-cover transition duration-500 group-hover:scale-105"
                    />
                  </Link>
                )}
                <Link to={`/blog/${p.slug}`} className="hover:underline">
                  <h3 className="font-headline text-xl text-on-surface leading-snug mt-3">{p.title}</h3>
                </Link>
                {p.excerpt && (
                  <p className="text-on-surface-variant text-sm mt-2 line-clamp-2">{p.excerpt}</p>
                )}
              </article>
            ))}
          </Reveal>
        </section>
      )}
    </>
  )
}
