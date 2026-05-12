import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import { supabase } from '../lib/supabase'
import { useAdminGuard } from '../hooks/useAdminGuard'

export default function AdminCategories() {
  const verified = useAdminGuard()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!verified) return
    supabase
      .from('categories')
      .select('id, slug, name, description, hero_image_url, display_order')
      .order('display_order')
      .then(({ data }) => {
        setCategories(data || [])
        setLoading(false)
      })
  }, [verified])

  if (!verified) return null

  return (
    <AdminLayout backTo="/admin/dashboard" backLabel="Dashboard">
      <main className="max-w-[960px] mx-auto px-5 md:px-10 py-6">
        <h1 className="font-headline text-3xl text-on-surface">Categories</h1>
        <p className="text-on-surface-variant mt-1">
          {loading ? 'Loading…' : `${categories.length} categor${categories.length === 1 ? 'y' : 'ies'}`}
        </p>

        {!loading && categories.length > 0 && (
          <ul className="mt-8 divide-y divide-outline-variant/40 border-y border-outline-variant/40">
            {categories.map(c => (
              <li key={c.id} className="py-4 flex items-center gap-4">
                <div className="w-16 h-12 rounded-md bg-surface-container shrink-0 overflow-hidden">
                  {c.hero_image_url && (
                    <img src={c.hero_image_url} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/category/${c.slug}`}
                    target="_blank"
                    className="font-headline text-on-surface hover:underline truncate block"
                  >
                    {c.name}
                  </Link>
                  <p className="text-xs text-on-surface-variant truncate">
                    /{c.slug} · order {c.display_order}
                  </p>
                </div>
                <Link
                  to={`/admin/categories/${c.id}/edit`}
                  aria-label="Edit"
                  className="w-9 h-9 grid place-items-center rounded-md text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-6 text-xs text-on-surface-variant">
          Adding new categories or deleting existing ones isn't built yet —
          edit directly in Supabase Table Editor for those operations.
        </p>
      </main>
    </AdminLayout>
  )
}
