import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function CategoryPage() {
  const { slug } = useParams()
  const [category, setCategory] = useState(null)
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    async function load() {
      const { data: cat } = await supabase
        .from('categories')
        .select('id, slug, name, description, hero_image_url')
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

  // Collect unique tags for filter chips
  const allTags = Array.from(new Set(products.flatMap(p => p.tags || [])))

  return (
    <main className="max-w-[720px] md:max-w-[1140px] mx-auto px-5 md:px-10 pb-24">
      {/* Header section — constrained to a narrower readable width */}
      <div className="md:max-w-[760px]">
        {/* Breadcrumb */}
        <nav className="pt-6 text-xs text-on-surface-variant">
          <Link to="/" className="hover:text-primary">HOME</Link>
          <span className="mx-2">›</span>
          <span className="text-secondary uppercase tracking-wider">{category.name}</span>
        </nav>

        <h1 className="font-headline text-4xl md:text-5xl text-on-surface mt-3">{category.name} Essentials</h1>
        {category.description && (
          <p className="text-on-surface-variant mt-3 leading-relaxed md:text-lg">{category.description}</p>
        )}

        {allTags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {allTags.slice(0, 6).map(t => (
              <span
                key={t}
                className="px-3 py-1.5 rounded-full bg-secondary-container/40 text-on-secondary-container text-xs"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {products.length === 0 ? (
        <div className="mt-10 p-10 rounded-xl bg-surface-container-low border border-dashed border-outline-variant/60 text-center">
          <p className="font-headline text-xl text-on-surface">No products yet</p>
          <p className="text-on-surface-variant text-sm mt-2">Check back soon — we're curating this category now.</p>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map(p => (
            <article
              key={p.id}
              className="rounded-xl bg-surface-container-low shadow-lift overflow-hidden relative flex flex-col transition hover:-translate-y-0.5 hover:shadow-md"
            >
              {p.is_top_recommendation && (
                <span className="absolute top-0 left-6 z-10 inline-flex items-center px-3 py-1.5 rounded-b-md bg-secondary text-on-secondary font-label text-[11px] tracking-[0.12em] uppercase">
                  Top Recommendation
                </span>
              )}
              {!p.is_top_recommendation && p.badge && (
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
                    <h2 className="font-headline text-lg lg:text-xl text-on-surface leading-snug">{p.display_title}</h2>
                  </Link>
                  {p.amazon_price && <p className="font-headline text-base lg:text-lg text-primary shrink-0">{p.amazon_price}</p>}
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
        </div>
      )}
    </main>
  )
}
