import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function HomePage() {
  const [categories, setCategories] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [recentPosts, setRecentPosts] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    async function load() {
      const [cats, prods, posts] = await Promise.all([
        supabase
          .from('categories')
          .select('id, slug, name, description, hero_image_url')
          .order('display_order'),
        supabase
          .from('products')
          .select('id, slug, display_title, amazon_image_urls, amazon_price, badge')
          .eq('published', true)
          .order('is_top_recommendation', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(3),
        supabase
          .from('blog_posts')
          .select('id, slug, title, excerpt, cover_url, published_at')
          .eq('published', true)
          .order('published_at', { ascending: false })
          .limit(2),
      ])
      if (cats.error) {
        setStatus(`error: ${cats.error.message}`)
        return
      }
      setCategories(cats.data || [])
      setFeaturedProducts(prods.data || [])
      setRecentPosts(posts.data || [])
      setStatus('ok')
    }
    load()
  }, [])

  return (
    <main className="max-w-[1140px] mx-auto px-5 md:px-16 pb-24">
      {/* Hero */}
      <section className="text-center pt-10 pb-12">
        <p className="font-label text-xs tracking-[0.2em] uppercase text-secondary mb-3">
          Expert Curation
        </p>
        <h1 className="font-headline text-4xl md:text-5xl text-on-surface leading-tight">
          Carefully Chosen.<br />OBGYN Approved.
        </h1>
        <p className="mt-4 text-on-surface-variant max-w-md mx-auto">
          Professional recommendations tailored for every stage of your health journey.
        </p>
        <Link
          to={featuredProducts[0] ? `/product/${featuredProducts[0].slug}` : '/category/pregnancy'}
          className="mt-6 inline-flex items-center justify-center px-8 py-3 rounded-md bg-primary text-on-primary font-label text-sm tracking-wider uppercase shadow-lift hover:bg-primary-container transition"
        >
          Shop Now
        </Link>
      </section>

      {/* Categories */}
      <section className="mt-8">
        <h2 className="font-headline text-2xl text-on-surface">Your Journey</h2>
        <p className="text-on-surface-variant text-sm mt-1">Explore wellness by category</p>

        {status === 'loading' && <p className="mt-8 text-on-surface-variant">Loading categories…</p>}
        {status !== 'ok' && status !== 'loading' && (
          <div className="mt-8 p-4 rounded-md bg-error-container text-on-error-container text-sm">
            <strong>Supabase wiring check:</strong> {status}
          </div>
        )}
        {status === 'ok' && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(c => (
              <Link
                key={c.id}
                to={`/category/${c.slug}`}
                className="block p-6 rounded-lg bg-surface-container shadow-lift hover:bg-surface-container-high transition"
              >
                <h3 className="font-headline text-xl text-on-surface">{c.name}</h3>
                <p className="text-on-surface-variant text-sm mt-2 line-clamp-2">{c.description}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured products */}
      {featuredProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="font-headline text-2xl text-on-surface">Featured Picks</h2>
          <p className="text-on-surface-variant text-sm mt-1">Our team's recent recommendations</p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredProducts.map(p => (
              <Link
                key={p.id}
                to={`/product/${p.slug}`}
                className="block rounded-lg bg-surface-container-low shadow-lift hover:bg-surface-container transition overflow-hidden"
              >
                {p.amazon_image_urls?.[0] && (
                  <img
                    src={p.amazon_image_urls[0]}
                    alt={p.display_title}
                    className="w-full aspect-square object-contain p-4 bg-surface-container-lowest"
                  />
                )}
                <div className="p-4">
                  {p.badge && (
                    <span className="inline-block font-label text-[10px] tracking-[0.15em] uppercase text-secondary mb-2">
                      {p.badge}
                    </span>
                  )}
                  <h3 className="font-headline text-lg text-on-surface leading-snug">{p.display_title}</h3>
                  {p.amazon_price && <p className="font-headline text-base text-primary mt-1">{p.amazon_price}</p>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Provider's Promise */}
      <section className="mt-16 rounded-xl bg-surface-container-low p-8 text-center shadow-lift">
        <p className="font-label text-xs tracking-[0.2em] uppercase text-secondary mb-3">
          Provider's Promise
        </p>
        <blockquote className="font-headline text-xl text-on-surface italic leading-snug">
          "We believe wellness isn't just a destination, but a curated journey of understanding your body's unique signals at every age."
        </blockquote>
        <p className="font-label text-xs tracking-wider uppercase text-on-surface-variant mt-4">
          The Beaches OBGYN Team · Board-Certified Specialists
        </p>
      </section>

      {/* Recent posts */}
      {recentPosts.length > 0 && (
        <section className="mt-16">
          <div className="flex items-center justify-between">
            <h2 className="font-headline text-2xl text-on-surface">Educational Resources</h2>
            <Link to="/blog" className="font-label text-xs tracking-wider uppercase text-primary hover:underline">
              View All →
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentPosts.map(p => (
              <article key={p.id} className="border-b border-outline-variant/40 pb-6 md:border-0 md:pb-0">
                {p.cover_url && (
                  <Link to={`/blog/${p.slug}`}>
                    <img src={p.cover_url} alt="" className="w-full aspect-[16/9] object-cover rounded-lg mb-3" />
                  </Link>
                )}
                <Link to={`/blog/${p.slug}`} className="hover:underline">
                  <h3 className="font-headline text-xl text-on-surface leading-snug">{p.title}</h3>
                </Link>
                {p.excerpt && <p className="text-on-surface-variant text-sm mt-2 line-clamp-2">{p.excerpt}</p>}
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
