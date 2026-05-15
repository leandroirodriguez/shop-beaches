import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function BlogPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, cover_url, published_at')
      .eq('published', true)
      .order('published_at', { ascending: false })
      .then(({ data }) => {
        setPosts(data || [])
        setLoading(false)
      })
  }, [])

  return (
    <main className="max-w-[720px] mx-auto px-5 pb-24">
      <header className="pt-8">
        <p className="font-label text-xs tracking-[0.2em] uppercase text-secondary mb-2">
          Educational Resources
        </p>
        <h1 className="font-headline text-4xl text-on-surface">From Our Practice</h1>
        <p className="text-on-surface-variant mt-3 leading-relaxed">
          Evidence-based articles on women's health, supplementation, and wellness — written by the Beaches OBGYN team.
        </p>
      </header>

      {loading ? (
        <p className="mt-12 text-on-surface-variant">Loading articles…</p>
      ) : posts.length === 0 ? (
        <div className="mt-10 p-10 rounded-lg bg-surface-container-low border border-dashed border-outline-variant/60 text-center">
          <p className="font-headline text-xl text-on-surface">No posts yet</p>
          <p className="text-on-surface-variant text-sm mt-2">Articles will appear here once published.</p>
        </div>
      ) : (
        <div className="mt-10 space-y-8">
          {posts.map(p => (
            <article key={p.id} className="border-b border-outline-variant/40 pb-8 last:border-b-0">
              {p.cover_url && (
                <Link to={`/blog/${p.slug}`}>
                  <img src={p.cover_url} alt="" className="w-full aspect-[16/9] object-cover rounded-lg mb-4" />
                </Link>
              )}
              <p className="font-label text-[11px] tracking-[0.15em] uppercase text-on-surface-variant">
                {p.published_at && new Date(p.published_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
              <Link to={`/blog/${p.slug}`} className="hover:underline">
                <h2 className="font-headline text-2xl text-on-surface mt-2 leading-snug">{p.title}</h2>
              </Link>
              {p.excerpt && <p className="text-on-surface-variant mt-3 leading-relaxed">{p.excerpt}</p>}
              <Link
                to={`/blog/${p.slug}`}
                className="inline-flex items-center gap-1 mt-3 font-label text-sm tracking-wider text-primary hover:underline"
              >
                Read more
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </Link>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}
