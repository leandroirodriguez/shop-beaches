import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function ProductSkeleton() {
  return (
    <div className="rounded-xl bg-surface-container-low shadow-lift overflow-hidden animate-pulse">
      <div className="aspect-square bg-surface-container-lowest" />
      <div className="p-5">
        <div className="h-2 bg-surface-container-high rounded w-1/3 mb-3" />
        <div className="h-4 bg-surface-container-high rounded w-3/4 mb-2" />
        <div className="h-4 bg-surface-container-high rounded w-1/4" />
      </div>
    </div>
  )
}

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
      .then(({ data }) => setCategories(data || []))
  }, [])

  // Reload products whenever the filter changes
  useEffect(() => {
    setProducts(null)

    async function load() {
      if (!activeSlug) {
        const { data } = await supabase
          .from('products')
          .select('id, slug, display_title, amazon_image_urls, amazon_price, badge')
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

      {/* Product grid */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {products === null && Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)}

        {products && products.length === 0 && (
          <div className="col-span-full p-10 rounded-xl bg-surface-container-low border border-dashed border-outline-variant/60 text-center">
            <p className="font-headline text-xl text-on-surface">No products in this category yet</p>
            <p className="text-on-surface-variant text-sm mt-2">
              We're still curating this list — check back soon.
            </p>
          </div>
        )}

        {products && products.map(p => (
          <Link
            key={p.id}
            to={`/product/${p.slug}`}
            className="group block rounded-xl bg-surface-container-low shadow-lift overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md"
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
                <p className="font-headline text-base text-primary mt-1">{p.amazon_price}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}

function FilterPill({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-full font-label text-xs tracking-wider transition ${
        active
          ? 'bg-primary text-on-primary shadow-lift'
          : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
      }`}
    >
      {children}
    </button>
  )
}
