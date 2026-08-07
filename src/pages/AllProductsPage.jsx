import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { formatPrice } from '../lib/format'

function ProductSkeleton() {
  return (
    <div className="card-soft rounded-lg overflow-hidden animate-pulse">
      <div className="aspect-square bg-surface-container-lowest" />
      <div className="p-5">
        <div className="h-2 bg-surface-container-high rounded w-1/3 mb-3" />
        <div className="h-4 bg-surface-container-high rounded w-3/4 mb-2" />
        <div className="h-4 bg-surface-container-high rounded w-1/4" />
      </div>
    </div>
  )
}

// Sexual Health always sorts after every other category, per practice
// preference — everything else keeps its admin-defined display_order.
const LAST_SLUG = 'sexual-health'

export default function AllProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeSlug = searchParams.get('category') || ''

  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState(null)

  // Load category list once
  useEffect(() => {
    supabase
      .from('categories')
      .select('id, slug, name')
      .order('display_order')
      .then(({ data }) =>
        setCategories([
          ...(data || []).filter(c => c.slug !== LAST_SLUG),
          ...(data || []).filter(c => c.slug === LAST_SLUG),
        ])
      )
  }, [])

  // Reload products whenever the filter changes
  useEffect(() => {
    setProducts(null)

    async function load() {
      if (!activeSlug) {
        const { data } = await supabase
          .from('products')
          .select('id, slug, display_title, amazon_image_urls, amazon_price, badge, category_ids')
          .eq('published', true)
          .order('is_top_recommendation', { ascending: false })
          .order('created_at', { ascending: false })
        setProducts(data || [])
        return
      }

      // Resolve slug → category id, then filter products by array containment
      const { data: cat } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', activeSlug)
        .maybeSingle()

      if (!cat) {
        setProducts([])
        return
      }

      const { data } = await supabase
        .from('products')
        .select('id, slug, display_title, amazon_image_urls, amazon_price, badge')
        .eq('published', true)
        .contains('category_ids', [cat.id])
        .order('is_top_recommendation', { ascending: false })
        .order('created_at', { ascending: false })
      setProducts(data || [])
    }

    load()
  }, [activeSlug])

  function setCategory(slug) {
    if (slug) setSearchParams({ category: slug })
    else setSearchParams({})
  }

  return (
    <main className="max-w-[1140px] mx-auto px-5 md:px-16 pt-10 md:pt-14 pb-24">
      <div className="text-center md:text-left">
        <p className="font-label text-xs tracking-[0.2em] uppercase text-secondary mb-3">
          Expert Curation
        </p>
        <h1 className="font-headline text-4xl md:text-5xl text-on-surface leading-[1.1]">
          All Products
        </h1>
        <p className="mt-4 text-on-surface-variant max-w-xl md:text-lg">
          Every product on this page has been hand-picked by our OBGYN team.
          Filter by category to find what fits your stage of care.
        </p>
      </div>

      {/* Filter pills */}
      <div className="mt-8 flex flex-wrap gap-2">
        <FilterPill active={!activeSlug} onClick={() => setCategory('')}>
          All Products
        </FilterPill>
        {categories.map(c => (
          <FilterPill
            key={c.id}
            active={activeSlug === c.slug}
            onClick={() => setCategory(c.slug)}
          >
            {c.name}
          </FilterPill>
        ))}
      </div>

      {/* Loading */}
      {(products === null || (!activeSlug && categories.length === 0)) && (
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)}
        </div>
      )}

      {/* Empty */}
      {products && products.length === 0 && (
        <div className="mt-10 p-10 rounded-lg bg-white/45 backdrop-blur border border-dashed border-outline-variant/60 text-center">
          <p className="font-headline text-xl text-on-surface">No products in this category yet</p>
          <p className="text-on-surface-variant text-sm mt-2">
            We're still curating this list — check back soon.
          </p>
        </div>
      )}

      {/* Filtered: flat grid */}
      {activeSlug && products && products.length > 0 && (
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}

      {/* Unfiltered: grouped by primary category */}
      {!activeSlug && products && products.length > 0 && categories.length > 0 && (
        <div className="mt-4">
          {groupByCategory(products, categories).map(({ category, items }) => (
            <section key={category.id} className="mt-12">
              <div className="flex items-baseline justify-between border-b border-outline-variant/60 pb-3">
                <h2 className="font-headline text-2xl md:text-3xl text-on-surface">
                  {category.name}
                </h2>
                {category.slug && (
                  <button
                    type="button"
                    onClick={() => setCategory(category.slug)}
                    className="font-label text-xs tracking-[0.15em] uppercase text-primary hover:underline"
                  >
                    View only
                  </button>
                )}
              </div>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {items.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  )
}

// Buckets products under their primary category (category_ids[0]) in the
// given category order; products with no recognized category land in a
// trailing "More Products" group (kept ahead of the forced-last category).
function groupByCategory(products, categories) {
  const byId = new Map(categories.map(c => [c.id, []]))
  const orphans = []
  for (const p of products) {
    const bucket = byId.get(p.category_ids?.[0])
    if (bucket) bucket.push(p)
    else orphans.push(p)
  }
  const groups = categories
    .map(c => ({ category: c, items: byId.get(c.id) }))
    .filter(g => g.items.length > 0)
  if (orphans.length > 0) {
    const at = Math.max(0, groups.length - (groups.at(-1)?.category.slug === LAST_SLUG ? 1 : 0))
    groups.splice(at, 0, { category: { id: 'other', slug: '', name: 'More Products' }, items: orphans })
  }
  return groups
}

function ProductCard({ product: p }) {
  return (
    <Link
      to={`/product/${p.slug}`}
      className="group block card-soft rounded-lg overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md"
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
  )
}

function FilterPill({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-full font-label text-xs tracking-wider transition ${
        active
          // Active stays fully opaque — a translucent selected state doesn't
          // hold enough contrast against the blob field to read as "on".
          ? 'bg-primary text-on-primary shadow-lift'
          : 'bg-white/45 backdrop-blur border border-white/50 text-on-surface hover:bg-white/70'
      }`}
    >
      {children}
    </button>
  )
}
