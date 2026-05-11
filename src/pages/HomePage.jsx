import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function HomePage() {
  const [categories, setCategories] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    supabase
      .from('categories')
      .select('id, slug, name, description, icon')
      .order('display_order', { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          setStatus(`error: ${error.message}`)
          return
        }
        setCategories(data || [])
        setStatus('ok')
      })
  }, [])

  return (
    <main className="max-w-[1140px] mx-auto px-5 md:px-16 pb-24">
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
        <button
          type="button"
          className="mt-6 inline-flex items-center justify-center px-8 py-3 rounded-md bg-primary text-on-primary font-label text-sm tracking-wider uppercase shadow-lift hover:bg-primary-container transition"
        >
          Shop Now
        </button>
      </section>

      <section className="mt-12">
        <h2 className="font-headline text-2xl text-on-surface">Your Journey</h2>
        <p className="text-on-surface-variant text-sm mt-1">Explore wellness by category</p>

        {status === 'loading' && (
          <p className="mt-8 text-on-surface-variant">Loading categories…</p>
        )}
        {status !== 'ok' && status !== 'loading' && (
          <div className="mt-8 p-4 rounded-md bg-error-container text-on-error-container text-sm">
            <strong>Supabase wiring check:</strong> {status}
            <p className="mt-2 text-xs">
              Once you paste your <code>VITE_SUPABASE_URL</code> and{' '}
              <code>VITE_SUPABASE_ANON_KEY</code> into <code>.env</code> and run{' '}
              <code>supabase-setup.sql</code>, this section will populate.
            </p>
          </div>
        )}
        {status === 'ok' && categories.length === 0 && (
          <div className="mt-8 p-4 rounded-md bg-surface-container text-on-surface-variant text-sm">
            Connected to Supabase. No categories yet — add some via the admin page once it's built.
          </div>
        )}
        {status === 'ok' && categories.length > 0 && (
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
    </main>
  )
}
