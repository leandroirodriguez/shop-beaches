import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import { supabase } from '../lib/supabase'
import { useAdminGuard } from '../hooks/useAdminGuard'

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

export default function AdminProductNew() {
  const verified = useAdminGuard()
  const navigate = useNavigate()

  const [amazonUrl, setAmazonUrl] = useState('')
  const [rawTitle, setRawTitle] = useState('')
  const [rawFeatures, setRawFeatures] = useState('')
  const [rawPrice, setRawPrice] = useState('')
  const [rawImageUrls, setRawImageUrls] = useState('')
  const [rawRating, setRawRating] = useState('')
  const [rawReviewCount, setRawReviewCount] = useState('')

  const [phase, setPhase] = useState('idle') // idle | fetching | working | ready | saving
  const [fetchError, setFetchError] = useState('')
  const [error, setError] = useState('')
  const [amazon, setAmazon] = useState(null)
  const [draft, setDraft] = useState(null)
  const [categories, setCategories] = useState([])
  const [categoryIds, setCategoryIds] = useState([])

  useEffect(() => {
    if (!verified) return
    supabase
      .from('categories')
      .select('id, slug, name')
      .order('display_order')
      .then(({ data }) => setCategories(data || []))
  }, [verified])

  // Pre-select Claude's suggested category once draft + categories are loaded
  useEffect(() => {
    if (!draft?.suggested_category_slug || categories.length === 0) return
    if (categoryIds.length > 0) return // respect the user's prior selections
    const cat = categories.find(c => c.slug === draft.suggested_category_slug)
    if (cat) setCategoryIds([cat.id])
  }, [draft, categories, categoryIds.length])

  function toggleCategory(catId) {
    setCategoryIds(ids =>
      ids.includes(catId) ? ids.filter(id => id !== catId) : [...ids, catId]
    )
  }

  async function handleFetchFromAmazon() {
    setFetchError('')
    if (!amazonUrl) {
      setFetchError('Paste an Amazon URL first.')
      return
    }
    setPhase('fetching')

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      setFetchError('Session expired. Please sign in again.')
      setPhase('idle')
      return
    }

    try {
      const r = await fetch('/api/fetch-amazon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ amazon_url: amazonUrl }),
      })
      const payload = await r.json()
      if (!r.ok) {
        setFetchError(payload.error || `Request failed (${r.status})`)
        setPhase('idle')
        return
      }
      setRawTitle(payload.title || '')
      setRawFeatures((payload.features || []).join('\n'))
      setRawPrice(payload.price || '')
      setRawImageUrls((payload.images || []).join('\n'))
      if (payload.rating != null) setRawRating(String(payload.rating))
      if (payload.review_count != null) setRawReviewCount(String(payload.review_count))
      setPhase('idle')
    } catch (err) {
      setFetchError(err.message)
      setPhase('idle')
    }
  }

  async function handleGenerate(e) {
    e.preventDefault()
    setError('')
    setPhase('working')

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      setError('Session expired. Please sign in again.')
      setPhase('idle')
      return
    }

    try {
      const r = await fetch('/api/generate-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          amazon_url: amazonUrl,
          raw_title: rawTitle,
          raw_features: rawFeatures,
          raw_price: rawPrice,
          raw_image_urls: rawImageUrls,
          raw_rating: rawRating,
          raw_review_count: rawReviewCount,
        }),
      })
      const payload = await r.json()
      if (!r.ok) {
        setError(payload.error || `Request failed (${r.status})`)
        setPhase('idle')
        return
      }
      setAmazon(payload.amazon)
      setDraft(payload.draft)
      setPhase('ready')
    } catch (err) {
      setError(err.message)
      setPhase('idle')
    }
  }

  function updateDraft(patch) { setDraft(d => ({ ...d, ...patch })) }
  function updateBenefit(i, patch) {
    setDraft(d => ({
      ...d,
      key_benefits: d.key_benefits.map((b, idx) => (idx === i ? { ...b, ...patch } : b)),
    }))
  }
  function updateStep(i, patch) {
    setDraft(d => ({
      ...d,
      how_to_use: d.how_to_use.map((s, idx) => (idx === i ? { ...s, ...patch } : s)),
    }))
  }

  async function handleSave(publish) {
    setError('')
    setPhase('saving')
    const slug = slugify(draft.display_title)

    const { error: insertError } = await supabase.from('products').insert({
      slug,
      category_ids: categoryIds,
      amazon_url: amazon.url,
      amazon_asin: amazon.asin,
      amazon_title: amazon.title,
      amazon_price: amazon.price,
      amazon_image_urls: amazon.images,
      rating: amazon.rating,
      review_count: amazon.review_count,
      display_title: draft.display_title,
      short_description: draft.short_description,
      provider_note: draft.provider_note,
      key_benefits: draft.key_benefits,
      how_to_use: draft.how_to_use,
      tags: draft.tags || [],
      badge: draft.badge || null,
      published: publish,
    })

    if (insertError) {
      setError(insertError.message)
      setPhase('ready')
      return
    }
    navigate('/admin/products')
  }

  if (!verified) return null

  return (
    <AdminLayout backTo="/admin/products" backLabel="All Products">
      <main className="max-w-[960px] mx-auto px-5 md:px-10 py-6 pb-32">
        <h1 className="font-headline text-3xl text-on-surface">Add New Product</h1>
        <p className="text-on-surface-variant mt-1">
          Paste the Amazon listing details. AI will rewrite into the curated voice.
        </p>

        <details className="mt-4 rounded-md bg-secondary-container/30 text-on-secondary-container p-3 text-sm">
          <summary className="cursor-pointer font-semibold">How to gather the fields from Amazon</summary>
          <ol className="mt-2 list-decimal list-inside space-y-1">
            <li>Open the product page on Amazon.</li>
            <li>Copy the URL from your browser bar into <strong>Amazon URL</strong>.</li>
            <li>Copy the listing title into <strong>Title</strong>.</li>
            <li>Copy the bullet points under "About this item" into <strong>Features</strong>, one per line.</li>
            <li>Copy the price (e.g. "$34.00") into <strong>Price</strong>.</li>
            <li>For each product image, right-click → <strong>Copy image address</strong>. Paste each on its own line in <strong>Image URLs</strong>.</li>
          </ol>
        </details>

        <form onSubmit={handleGenerate} className="mt-6 glass rounded-xl p-6 space-y-4">
          <div>
            <label className="block">
              <span className="font-label text-xs tracking-wider uppercase text-on-surface-variant">
                Amazon Product URL <Required />
              </span>
              <input
                type="url"
                required
                value={amazonUrl}
                onChange={e => setAmazonUrl(e.target.value)}
                placeholder="https://www.amazon.com/dp/B07PXGQC1Q"
                className="input mt-2 font-mono text-sm"
                disabled={phase === 'working' || phase === 'fetching'}
              />
            </label>
            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={handleFetchFromAmazon}
                disabled={phase === 'working' || phase === 'fetching'}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-surface-container text-on-surface font-label text-xs tracking-wider uppercase hover:bg-surface-container-high transition disabled:opacity-60"
              >
                {phase === 'fetching' ? (
                  <><Spinner /> Fetching…</>
                ) : (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                    </svg>
                    Fetch from Amazon
                  </>
                )}
              </button>
              <span className="text-[11px] text-on-surface-variant">
                Auto-fills the four fields below via Creators API
              </span>
            </div>
            {fetchError && (
              <p className="mt-2 text-sm text-on-error-container bg-error-container rounded-md px-3 py-2">
                Couldn't fetch: {fetchError}. You can still fill the fields by hand.
              </p>
            )}
          </div>

          <label className="block">
            <span className="font-label text-xs tracking-wider uppercase text-on-surface-variant">
              Title <Required />
            </span>
            <input
              type="text"
              required
              value={rawTitle}
              onChange={e => setRawTitle(e.target.value)}
              placeholder="Exact title from the Amazon listing"
              className="input mt-2"
              disabled={phase === 'working'}
            />
          </label>

          <label className="block">
            <span className="font-label text-xs tracking-wider uppercase text-on-surface-variant">
              Features (one bullet per line)
            </span>
            <textarea
              rows={6}
              value={rawFeatures}
              onChange={e => setRawFeatures(e.target.value)}
              placeholder={"- Hormonal balance support\n- Bioperine for absorption\n- Non-GMO, Gluten-Free"}
              className="input mt-2 font-mono text-sm"
              disabled={phase === 'working'}
            />
          </label>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="block">
              <span className="font-label text-xs tracking-wider uppercase text-on-surface-variant">
                Price
              </span>
              <input
                type="text"
                value={rawPrice}
                onChange={e => setRawPrice(e.target.value)}
                placeholder="$34.00"
                className="input mt-2"
                disabled={phase === 'working'}
              />
            </label>
            <label className="block">
              <span className="font-label text-xs tracking-wider uppercase text-on-surface-variant">
                Star Rating (0–5)
              </span>
              <input
                type="text"
                value={rawRating}
                onChange={e => setRawRating(e.target.value)}
                placeholder="4.8"
                className="input mt-2"
                disabled={phase === 'working'}
              />
            </label>
            <label className="block">
              <span className="font-label text-xs tracking-wider uppercase text-on-surface-variant">
                # of Reviews
              </span>
              <input
                type="text"
                value={rawReviewCount}
                onChange={e => setRawReviewCount(e.target.value)}
                placeholder="124"
                className="input mt-2"
                disabled={phase === 'working'}
              />
            </label>
          </div>

          <label className="block">
            <span className="font-label text-xs tracking-wider uppercase text-on-surface-variant">
              Image URLs (one per line)
            </span>
            <textarea
              rows={4}
              value={rawImageUrls}
              onChange={e => setRawImageUrls(e.target.value)}
              placeholder={"https://m.media-amazon.com/images/I/...jpg\nhttps://m.media-amazon.com/images/I/...jpg"}
              className="input mt-2 font-mono text-xs"
              disabled={phase === 'working'}
            />
            <span className="block text-[11px] text-on-surface-variant mt-1">
              On Amazon: right-click any product photo → "Copy image address".
            </span>
          </label>

          {error && (
            <p className="text-sm text-on-error-container bg-error-container rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={phase === 'working' || phase === 'saving'}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-on-primary font-label text-sm tracking-wider uppercase shadow-lift hover:bg-primary-container transition disabled:opacity-60"
            >
              {phase === 'working' ? (
                <><Spinner /> Generating curated copy…</>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                  {draft ? 'Regenerate' : 'Generate Curated Copy'}
                </>
              )}
            </button>
            {draft && (
              <span className="font-label text-[10px] tracking-wider uppercase text-secondary">
                Draft ready below
              </span>
            )}
          </div>
        </form>

        {draft && amazon && (
          <div className="mt-8 space-y-6">
            {amazon.images?.[0] && (
              <div className="grid grid-cols-4 gap-3">
                {amazon.images.slice(0, 4).map((src, i) => (
                  <div key={i} className="aspect-square rounded-md overflow-hidden bg-surface-container">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            <Section title="Basics">
              <Row>
                <Field label="Display Title">
                  <input
                    type="text"
                    value={draft.display_title}
                    onChange={e => updateDraft({ display_title: e.target.value })}
                    className="input"
                  />
                </Field>
                <Field label="Price (display)">
                  <input
                    type="text"
                    value={amazon.price}
                    readOnly
                    className="input opacity-80"
                  />
                </Field>
              </Row>
              <Field label="Categories (pick one or more)">
                <div className="flex flex-wrap gap-2 mt-1">
                  {categories.map(c => {
                    const selected = categoryIds.includes(c.id)
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => toggleCategory(c.id)}
                        className={`px-3 py-1.5 rounded-full font-label text-xs tracking-wider transition ${
                          selected
                            ? 'bg-primary text-on-primary'
                            : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                        }`}
                      >
                        {c.name}
                      </button>
                    )
                  })}
                </div>
              </Field>
              <Field label="Badge (optional)">
                <input
                  type="text"
                  value={draft.badge || ''}
                  onChange={e => updateDraft({ badge: e.target.value })}
                  placeholder="OBGYN APPROVED, TOP RECOMMENDATION…"
                  className="input"
                />
              </Field>
              <Field label="Short Description">
                <textarea
                  rows={3}
                  value={draft.short_description}
                  onChange={e => updateDraft({ short_description: e.target.value })}
                  className="input"
                />
              </Field>
            </Section>

            <Section title="Why We Recommend This">
              <Field label="Provider's Note">
                <textarea
                  rows={5}
                  value={draft.provider_note}
                  onChange={e => updateDraft({ provider_note: e.target.value })}
                  className="input italic"
                />
              </Field>
              <div className="space-y-3 mt-3">
                <p className="font-label text-xs tracking-wider uppercase text-on-surface-variant">
                  Key Benefits
                </p>
                {draft.key_benefits.map((b, i) => (
                  <div key={i} className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={b.title}
                      onChange={e => updateBenefit(i, { title: e.target.value })}
                      className="input font-semibold"
                    />
                    <input
                      type="text"
                      value={b.body}
                      onChange={e => updateBenefit(i, { body: e.target.value })}
                      className="input md:col-span-2"
                    />
                  </div>
                ))}
              </div>
            </Section>

            <Section title="How to Use">
              <div className="space-y-4">
                {draft.how_to_use.map((s, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="mt-1.5 w-7 h-7 rounded-full border-2 border-primary text-primary font-label font-semibold grid place-items-center shrink-0">
                      {s.step}
                    </span>
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={s.title}
                        onChange={e => updateStep(i, { title: e.target.value })}
                        className="input font-semibold"
                      />
                      <textarea
                        rows={2}
                        value={s.body}
                        onChange={e => updateStep(i, { body: e.target.value })}
                        className="input"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <div className="rounded-xl bg-secondary-container/30 p-5 text-sm text-on-secondary-container">
              <p className="font-label text-[11px] tracking-[0.15em] uppercase mb-1">Source</p>
              <p className="font-mono text-xs break-all">
                ASIN: <strong>{amazon.asin}</strong> · <a href={amazon.url} target="_blank" rel="noreferrer" className="underline">{amazon.url}</a>
              </p>
            </div>
          </div>
        )}

        {draft && (
          <div className="fixed bottom-0 inset-x-0 z-30 bg-white/70 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_-1px_3px_rgb(47_86_100_/_0.07)]">
            <div className="max-w-[960px] mx-auto px-5 md:px-10 py-3 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => handleSave(false)}
                disabled={phase === 'saving'}
                className="px-5 py-2.5 rounded-md bg-surface-container-high text-on-surface font-label text-sm tracking-wider uppercase hover:bg-surface-container-highest transition disabled:opacity-60"
              >
                Save Draft
              </button>
              <button
                type="button"
                onClick={() => handleSave(true)}
                disabled={phase === 'saving'}
                className="px-5 py-2.5 rounded-md bg-primary text-on-primary font-label text-sm tracking-wider uppercase shadow-lift hover:bg-primary-container transition disabled:opacity-60"
              >
                {phase === 'saving' ? 'Saving…' : 'Publish'}
              </button>
            </div>
          </div>
        )}
      </main>
    </AdminLayout>
  )
}

function Required() {
  return <span className="text-error">*</span>
}
function Section({ title, children }) {
  return (
    <section className="glass rounded-xl p-6">
      <h2 className="font-headline text-xl text-on-surface mb-4">{title}</h2>
      {children}
    </section>
  )
}
function Field({ label, children }) {
  return (
    <label className="block">
      <span className="font-label text-xs tracking-wider uppercase text-on-surface-variant">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  )
}
function Row({ children }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">{children}</div>
}
function Spinner() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" className="animate-spin">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.25" />
      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  )
}
