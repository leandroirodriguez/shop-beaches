import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import { supabase } from '../lib/supabase'
import { useAdminGuard } from '../hooks/useAdminGuard'

export default function AdminBlog() {
  const verified = useAdminGuard()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!verified) return
    supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, published, published_at, created_at')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setPosts(data || [])
        setLoading(false)
      })
  }, [verified])

  async function togglePublish(p) {
    const update = {
      published: !p.published,
      published_at: !p.published ? new Date().toISOString() : null,
    }
    const { error } = await supabase.from('blog_posts').update(update).eq('id', p.id)
    if (!error) setPosts(prev => prev.map(x => (x.id === p.id ? { ...x, ...update } : x)))
  }

  async function remove(p) {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return
    const { error } = await supabase.from('blog_posts').delete().eq('id', p.id)
    if (!error) setPosts(prev => prev.filter(x => x.id !== p.id))
  }

  if (!verified) return null

  return (
    <AdminLayout backTo="/admin/dashboard" backLabel="Dashboard">
      <main className="max-w-[960px] mx-auto px-5 md:px-10 py-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-headline text-3xl text-on-surface">Blog</h1>
            <p className="text-on-surface-variant mt-1">
              {loading ? 'Loading…' : `${posts.length} ${posts.length === 1 ? 'post' : 'posts'}`}
            </p>
          </div>
          <Link
            to="/admin/blog/new"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-primary text-on-primary font-label text-sm tracking-wider uppercase shadow-lift hover:bg-primary-container transition"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Generate New Post
          </Link>
        </div>

        {!loading && posts.length === 0 ? (
          <div className="mt-10 p-10 rounded-xl bg-white/45 backdrop-blur border border-dashed border-outline-variant/60 text-center">
            <p className="font-headline text-xl text-on-surface">No posts yet</p>
            <p className="text-on-surface-variant text-sm mt-2 max-w-md mx-auto">
              Click <strong>Generate New Post</strong>, give Claude a topic, and an article will be drafted in your house voice.
            </p>
          </div>
        ) : (
          <ul className="mt-8 divide-y divide-outline-variant/40 border-y border-outline-variant/40">
            {posts.map(p => (
              <li key={p.id} className="py-4 flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <Link to={`/blog/${p.slug}`} target="_blank" className="font-headline text-on-surface hover:underline block">
                    {p.title}
                  </Link>
                  <p className="text-sm text-on-surface-variant mt-1 line-clamp-2">{p.excerpt}</p>
                </div>
                <button
                  onClick={() => togglePublish(p)}
                  className={`font-label text-[10px] tracking-wider uppercase px-2 py-1 rounded-sm transition shrink-0 ${
                    p.published
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {p.published ? 'Published' : 'Draft'}
                </button>
                <Link
                  to={`/admin/blog/${p.id}/edit`}
                  aria-label="Edit"
                  className="w-9 h-9 grid place-items-center rounded-md text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition shrink-0"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </Link>
                <button
                  onClick={() => remove(p)}
                  aria-label="Delete"
                  className="w-9 h-9 grid place-items-center rounded-md text-on-surface-variant hover:text-error hover:bg-error-container transition shrink-0"
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
