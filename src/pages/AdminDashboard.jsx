import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import { supabase } from '../lib/supabase'

const tileMeta = [
  {
    to: '/admin/products',
    table: 'products',
    title: 'Products',
    body: 'Add and curate Amazon Associates picks. Paste a URL, let AI draft the page, edit, publish.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    to: '/admin/blog',
    table: 'blog_posts',
    title: 'Blog',
    body: 'Generate educational articles from a topic. AI-draft, edit, publish to the public blog.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    to: '/admin/categories',
    table: 'categories',
    title: 'Categories',
    body: 'Edit the wellness categories that group products. Rename, change descriptions, swap imagery.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
]

export default function AdminDashboard() {
  const [counts, setCounts] = useState({})

  useEffect(() => {
    Promise.all(
      tileMeta.map(t =>
        supabase
          .from(t.table)
          .select('*', { count: 'exact', head: true })
          .then(({ count }) => [t.table, count ?? 0])
      )
    ).then(results => setCounts(Object.fromEntries(results)))
  }, [])

  return (
    <AdminLayout>
      <main className="max-w-[960px] mx-auto px-5 md:px-10 py-10">
        <h1 className="font-headline text-3xl text-on-surface">Dashboard</h1>
        <p className="text-on-surface-variant mt-2">Choose an area to manage.</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {tileMeta.map(t => {
            const count = counts[t.table]
            return (
              <Link
                key={t.to}
                to={t.to}
                className="glass p-6 rounded-xl hover:bg-white/70 transition block"
              >
                <div className="flex items-start justify-between">
                  <div className="w-11 h-11 rounded-md bg-primary text-on-primary grid place-items-center">
                    {t.icon}
                  </div>
                  <span className="font-label text-[10px] tracking-[0.15em] uppercase text-on-surface-variant">
                    {count == null ? '…' : `${count} ${count === 1 ? 'item' : 'items'}`}
                  </span>
                </div>
                <h2 className="font-headline text-xl text-on-surface mt-4">{t.title}</h2>
                <p className="text-on-surface-variant text-sm mt-2 leading-relaxed">{t.body}</p>
              </Link>
            )
          })}
        </div>
      </main>
    </AdminLayout>
  )
}
