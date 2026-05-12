import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function BlogPostPage() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) { setStatus('not-found'); return }
        setPost(data)
        setStatus('ok')
      })
  }, [slug])

  if (status === 'loading') {
    return <main className="max-w-[720px] mx-auto px-5 py-12 text-on-surface-variant">Loading…</main>
  }
  if (status === 'not-found' || !post) {
    return (
      <main className="max-w-[720px] mx-auto px-5 py-12 text-center">
        <h1 className="font-headline text-2xl text-on-surface">Post not found</h1>
        <Link to="/blog" className="inline-block mt-4 font-label text-sm tracking-wider uppercase text-primary hover:underline">
          Back to Blog
        </Link>
      </main>
    )
  }

  return (
    <main className="max-w-[720px] mx-auto px-5 pb-24">
      <nav className="pt-6 text-xs text-on-surface-variant">
        <Link to="/" className="hover:text-primary">HOME</Link>
        <span className="mx-2">›</span>
        <Link to="/blog" className="hover:text-primary">BLOG</Link>
      </nav>

      <article className="mt-6">
        {post.cover_url && (
          <img src={post.cover_url} alt="" className="w-full aspect-[16/9] object-cover rounded-lg mb-8" />
        )}

        <p className="font-label text-[11px] tracking-[0.15em] uppercase text-on-surface-variant">
          {post.published_at && new Date(post.published_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
        <h1 className="font-headline text-4xl text-on-surface mt-2 leading-tight">{post.title}</h1>
        {post.excerpt && (
          <p className="text-on-surface-variant text-lg mt-4 leading-relaxed italic">{post.excerpt}</p>
        )}

        <div className="prose max-w-none mt-8" dangerouslySetInnerHTML={{ __html: post.body_html || '' }} />
      </article>

      <footer className="mt-16 pt-8 border-t border-outline-variant/40 text-center">
        <Link to="/blog" className="font-label text-sm tracking-wider uppercase text-primary hover:underline">
          ← More Articles
        </Link>
      </footer>
    </main>
  )
}
