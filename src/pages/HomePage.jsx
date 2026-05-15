import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { formatPrice } from '../lib/format'
import Starfish from '../components/Starfish'
import Reveal from '../components/Reveal'

// Reusable curved divider. `tone` selects which color the SVG fills with,
// which should match the BACKGROUND of the section immediately below.
// `flipY` flips the curve vertically (use when transitioning OUT of a
// tinted band back to the base surface).
function CurvedDivider({ tone = 'surface-container-low', flipY = false }) {
  const colorClass = {
    'surface-container-low': 'text-surface-container-low',
    'surface': 'text-surface',
    'surface-container': 'text-surface-container',
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

function CategorySkeleton() {
  return (
    <div className="rounded-lg bg-[#fdf1f5] shadow-lift overflow-hidden animate-pulse">
      <div className="aspect-[16/10] bg-secondary-container/40" />
      <div className="p-5">
        <div className="h-5 bg-secondary-container/40 rounded w-1/2 mb-3" />
        <div className="h-3 bg-secondary-container/40 rounded w-full mb-2" />
        <div className="h-3 bg-secondary-container/40 rounded w-4/5" />
      </div>
    </div>
  )
}

function ProductSkeleton() {
  return (
    <div className="rounded-lg bg-surface-container-low shadow-lift overflow-hidden animate-pulse">
      <div className="aspect-square bg-surface-container-lowest" />
      <div className="p-5">
        <div className="h-2 bg-surface-container-high rounded w-1/3 mb-3" />
        <div className="h-4 bg-surface-container-high rounded w-3/4 mb-2" />
        <div className="h-4 bg-surface-container-high rounded w-1/4" />
      </div>
    </div>
  )
}

function PostSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[16/9] bg-surface-container-low rounded-lg mb-4" />
      <div className="h-5 bg-surface-container-low rounded w-3/4 mb-3" />
      <div className="h-3 bg-surface-container-low rounded w-full mb-2" />
      <div className="h-3 bg-surface-container-low rounded w-5/6" />
    </div>
  )
}

export default function HomePage() {
  // Each query has its own state so they render independently as data
  // arrives — no single slow query blocks the rest. `null` means loading,
  // `[]` means loaded-but-empty, populated array means we have data.
  const [categories, setCategories] = useState(null)
  const [categoriesError, setCategoriesError] = useState('')
  const [featuredProducts, setFeaturedProducts] = useState(null)
  const [recentPosts, setRecentPosts] = useState(null)

  useEffect(() => {
    supabase
      .from('categories')
      .select('id, slug, name, description, hero_image_url')
      .order('display_order')
      .then(({ data, error }) => {
        if (error) setCategoriesError(error.message)
        setCategories(data || [])
      })

    // Pull up to 50 published products and pick 3 at random on the client.
    // Cheap for a curated catalog and avoids a Postgres random() RPC.
    supabase
      .from('products')
      .select('id, slug, display_title, amazon_image_urls, amazon_price, badge')
      .eq('published', true)
      .limit(50)
      .then(({ data }) => {
        const shuffled = [...(data || [])].sort(() => Math.random() - 0.5)
        setFeaturedProducts(shuffled.slice(0, 3))
      })

    supabase
      .from('blog_posts')
      .select('id, slug, title, excerpt, cover_url, published_at')
      .eq('published', true)
      .order('published_at', { ascending: false })
      .limit(2)
      .then(({ data }) => setRecentPosts(data || []))
  }, [])

  return (
    <>
      {/* Hero — full-bleed with subtle warm radial gradient.
          Mobile: text stacked above image. Desktop (lg+): 2-column,
          image on the left, text on the right, vertically centered. */}
      <section className="hero-radial relative overflow-hidden">
        {/* Decorative starfish — large + very faint, in the top-right
            corner of the hero. Visual brand cue without distracting. */}
        <Starfish
          className="hidden md:block absolute -top-32 -right-32 w-[480px] h-[480px] text-secondary opacity-[0.07] pointer-events-none rotate-12"
        />

        <div className="relative max-w-[1140px] mx-auto px-5 md:px-16 pt-10 md:pt-16 lg:pt-20 pb-14 md:pb-24">
          <div className="lg:grid lg:grid-cols-2 lg:gap-14 lg:items-center">
            {/* Text column — order-2 on desktop pushes it to the right */}
            <div className="text-center lg:order-2 lg:text-left">
              <p className="font-label text-xs tracking-[0.2em] uppercase text-secondary mb-3">
                Expert Curation
              </p>
              <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl text-on-surface leading-[1.1]">
                Carefully Chosen.<br />OBGYN Approved.
              </h1>
              <p className="mt-5 text-on-surface-variant max-w-md mx-auto lg:mx-0 md:text-lg">
                Professional recommendations tailored for every stage of your health journey.
              </p>
              <Link
                to="/shop"
                className="mt-7 inline-flex items-center justify-center px-8 py-3.5 rounded-md bg-primary text-on-primary font-label text-sm tracking-wider uppercase shadow-lift hover:bg-primary-container transition"
              >
                Shop Now
              </Link>
            </div>

            {/* Image column — order-1 on desktop puts it on the left */}
            <div className="mt-10 lg:mt-0 lg:order-1 max-w-3xl mx-auto lg:max-w-none">
              <img
                src="/hero/hero.webp"
                alt=""
                width="1536"
                height="1024"
                fetchPriority="high"
                decoding="async"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>

        {/* Curve flowing into the tinted Categories band */}
        <CurvedDivider tone="surface-container-low" />
      </section>

      {/* Categories — tinted band */}
      <section className="bg-surface-container-low">
        <div className="max-w-[1140px] mx-auto px-5 md:px-16 pt-12 md:pt-20 pb-6 md:pb-12">
          <Reveal>
            <div className="text-center md:text-left">
              <h2 className="font-headline text-3xl md:text-4xl text-on-surface">Your Journey</h2>
              <p className="text-on-surface-variant mt-2">Explore wellness by category</p>
            </div>
          </Reveal>

          {categoriesError && (
            <div className="mt-8 p-4 rounded-md bg-error-container text-on-error-container text-sm">
              <strong>Supabase wiring check:</strong> {categoriesError}
            </div>
          )}

          <Reveal delay={100} className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories === null && !categoriesError &&
              Array.from({ length: 6 }).map((_, i) => <CategorySkeleton key={i} />)}

            {categories && categories.map(c => (
              <Link
                key={c.id}
                to={`/category/${c.slug}`}
                className="group relative block rounded-lg bg-[#fdf1f5] shadow-lift overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md"
              >
                {c.hero_image_url ? (
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={c.hero_image_url}
                      alt=""
                      className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="aspect-[16/10] bg-surface-container grid place-items-center">
                    <span className="font-label text-xs tracking-[0.15em] uppercase text-on-surface-variant/60">
                      Imagery coming soon
                    </span>
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-headline text-xl text-on-surface">{c.name}</h3>
                  <p className="text-on-surface-variant text-sm mt-2 line-clamp-2">{c.description}</p>
                </div>
              </Link>
            ))}
          </Reveal>
        </div>

        {/* Curve back out to the base surface — belly points down (same
            orientation as the divider at the top of this band) */}
        <CurvedDivider tone="surface" />
      </section>

      {/* Everything below sits on the base surface */}
      <main className="max-w-[1140px] mx-auto px-5 md:px-16 pb-16 md:pb-24">
        {/* Featured products — render skeletons while loading, hide section entirely if loaded-empty.
            Hidden on mobile (Shop Now in the hero already covers product discovery). */}
        {(featuredProducts === null || featuredProducts.length > 0) && (
          <section className="hidden md:block pt-4 md:pt-10">
            <Reveal>
              <div className="text-center md:text-left">
                <h2 className="font-headline text-3xl md:text-4xl text-on-surface">Featured Picks</h2>
                <p className="text-on-surface-variant mt-2">Our team's recent recommendations</p>
              </div>
            </Reveal>
            <Reveal delay={100} className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
              {featuredProducts === null &&
                Array.from({ length: 3 }).map((_, i) => <ProductSkeleton key={i} />)}

              {featuredProducts && featuredProducts.map(p => (
                <Link
                  key={p.id}
                  to={`/product/${p.slug}`}
                  className="group block rounded-lg bg-surface-container-low shadow-lift overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  {p.amazon_image_urls?.[0] && (
                    <img
                      src={p.amazon_image_urls[0]}
                      alt={p.display_title}
                      className="w-full aspect-square object-contain p-5 bg-surface-container-lowest transition duration-500 group-hover:scale-[1.03]"
                    />
                  )}
                  <div className="p-5">
                    {p.badge && (
                      <span className="inline-block font-label text-[10px] tracking-[0.15em] uppercase text-secondary mb-2">
                        {p.badge}
                      </span>
                    )}
                    <h3 className="font-headline text-lg text-on-surface leading-snug">{p.display_title}</h3>
                    {p.amazon_price && (
                      <p className="font-headline text-base text-primary mt-1">{formatPrice(p.amazon_price)}</p>
                    )}
                  </div>
                </Link>
              ))}
            </Reveal>
          </section>
        )}

        {/* Provider's Promise */}
        <Reveal>
          <section className="mt-16 md:mt-24 rounded-2xl bg-surface-container-low p-8 md:p-12 text-center shadow-lift">
            <Starfish className="w-10 h-10 mx-auto mb-4 text-primary" />
            <p className="font-label text-xs tracking-[0.2em] uppercase text-secondary mb-3">
              Provider's Promise
            </p>
            <blockquote className="font-headline text-xl md:text-2xl text-on-surface italic leading-snug max-w-2xl mx-auto">
              "We believe wellness isn't just a destination, but a curated journey of understanding your body's unique signals at every age."
            </blockquote>
            <p className="font-label text-xs tracking-wider uppercase text-on-surface-variant mt-5">
              The Beaches OBGYN Team · Board-Certified Specialists
            </p>
          </section>
        </Reveal>

        {/* Recent posts */}
        {(recentPosts === null || recentPosts.length > 0) && (
          <section className="mt-16 md:mt-24">
            <Reveal>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="font-headline text-3xl md:text-4xl text-on-surface">Educational Resources</h2>
                <Link to="/blog" className="font-label text-xs tracking-wider uppercase text-primary hover:underline">
                  View All →
                </Link>
              </div>
            </Reveal>
            <Reveal delay={100} className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {recentPosts === null &&
                Array.from({ length: 2 }).map((_, i) => <PostSkeleton key={i} />)}

              {recentPosts && recentPosts.map(p => (
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
                    <h3 className="font-headline text-xl text-on-surface leading-snug mt-4">{p.title}</h3>
                  </Link>
                  {p.excerpt && (
                    <p className="text-on-surface-variant text-sm mt-2 line-clamp-2">{p.excerpt}</p>
                  )}
                </article>
              ))}
            </Reveal>
          </section>
        )}
      </main>
    </>
  )
}
