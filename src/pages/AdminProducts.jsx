import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import { supabase } from '../lib/supabase'
import { useAdminGuard } from '../hooks/useAdminGuard'
import { formatPrice } from '../lib/format'

export default function AdminProducts() {
  const verified = useAdminGuard()
  const [products, setProducts] = useState([])
  const [categoriesMap, setCategoriesMap] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!verified) return
    Promise.all([
      supabase
        .from('products')
        .select('id, slug, display_title, amazon_price, amazon_image_urls, published, badge, category_ids')
        .order('created_at', { ascending: false }),
      supabase
        .from('categories')
        .select('id, name'),
    ]).then(([{ data: prods }, { data: cats }]) => {
      setProducts(prods || [])
      setCategoriesMap(Object.fromEntries((cats || []).map(c => [c.id, c.name])))
      setLoading(false)
    })
  }, [verified])

  function categoryNames(catIds) {
    return (catIds || [])
      .map(id => categoriesMap[id])
      .filter(Boolean)
      .join(' · ') || 'Uncategorized'
  }

  async function togglePublish(p) {
    const { error } = await supabase
      .from('products')
      .update({ published: !p.published })
      .eq('id', p.id)
    if (!error) {
      setProducts(prev => prev.map(x => (x.id === p.id ? { ...x, published: !p.published } : x)))
    }
  }

  async function remove(p) {
    if (!confirm(`Delete "${p.display_title}"? This cannot be undone.`)) return
    const { error } = await supabase.from('products').delete().eq('id', p.id)
    if (!error) setProducts(prev => prev.filter(x => x.id !== p.id))
  }

  if (!verified) return null

  return (
    <AdminLayout backTo="/admin/dashboard" backLabel="Dashboard">
      <main className="max-w-[960px] mx-auto px-5 md:px-10 py-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-headline text-3xl text-on-surface">Products</h1>
            <p className="text-on-surface-variant mt-1">
              {loading ? 'Loading…' : `${products.length} ${products.length === 1 ? 'item' : 'items'}`}
            </p>
          </div>
          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-primary text-on-primary font-label text-sm tracking-wider uppercase shadow-lift hover:bg-primary-container transition"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add New Product
          </Link>
        </div>

        {!loading && products.length === 0 ? (
          <div className="mt-10 p-10 rounded-xl bg-surface-container-low border border-dashed border-outline-variant/60 text-center">
            <p className="font-headline text-xl text-on-surface">No products yet</p>
            <p className="text-on-surface-variant text-sm mt-2 max-w-md mx-auto">
              Click <strong>Add New Product</strong> to paste an Amazon URL and let AI draft the curated page. You'll review and edit before it publishes.
            </p>
          </div>
        ) : (
          <ul className="mt-8 divide-y divide-outline-variant/40 border-y border-outline-variant/40">
            {products.map(p => (
              <li key={p.id} className="py-4 flex items-center gap-4">
                <div className="w-14 h-14 rounded-md bg-surface-container shrink-0 overflow-hidden">
                  {p.amazon_image_urls?.[0] && (
                    <img src={p.amazon_image_urls[0]} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${p.slug}`} target="_blank" className="font-headline text-on-surface truncate hover:underline block">
                    {p.display_title}
                  </Link>
                  <p className="text-xs text-on-surface-variant">
                    {categoryNames(p.category_ids)} · {formatPrice(p.amazon_price) || '—'}
                  </p>
                </div>
                <button
                  onClick={() => togglePublish(p)}
                  className={`font-label text-[10px] tracking-wider uppercase px-2 py-1 rounded-sm transition ${
                    p.published
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {p.published ? 'Published' : 'Draft'}
                </button>
                <Link
                  to={`/admin/products/${p.id}/edit`}
                  aria-label="Edit"
                  className="w-9 h-9 grid place-items-center rounded-md text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </Link>
                <button
                  onClick={() => remove(p)}
                  aria-label="Delete"
                  className="w-9 h-9 grid place-items-center rounded-md text-on-surface-variant hover:text-error hover:bg-error-container transition"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-2 14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L5 6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </AdminLayout>
  )
}
