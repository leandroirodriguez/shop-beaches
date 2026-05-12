import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import { supabase } from '../lib/supabase'
import { useAdminGuard } from '../hooks/useAdminGuard'

export default function AdminProductEdit() {
  const verified = useAdminGuard()
  const navigate = useNavigate()
  const { id } = useParams()

  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [saveError, setSaveError] = useState('')
  const [phase, setPhase] = useState('idle') // idle | saving
  const [form, setForm] = useState(null)
  const [categories, setCategories] = useState([])
  const [imagesText, setImagesText] = useState('')

  useEffect(() => {
    if (!verified) return

    supabase
      .from('categories')
      .select('id, slug, name')
      .order('display_order')
      .then(({ data }) => setCategories(data || []))

    supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) { setLoadError(error.message); setLoading(false); return }
        if (!data) { setLoadError('Product not found'); setLoading(false); return }
        setForm(data)
        setImagesText((data.amazon_image_urls || []).join('\n'))
        setLoading(false)
      })
  }, [verified, id])

  function update(patch) { setForm(f => ({ ...f, ...patch })) }
  function toggleCategory(catId) {
    setForm(f => {
      const ids = f.category_ids || []
      return {
        ...f,
        category_ids: ids.includes(catId) ? ids.filter(id => id !== catId) : [...ids, catId],
      }
    })
  }
  function updateBenefit(i, patch) {
    setForm(f => ({
      ...f,
      key_benefits: (f.key_benefits || []).map((b, idx) => idx === i ? { ...b, ...patch } : b),
    }))
  }
  function addBenefit() {
    setForm(f => ({
      ...f,
      key_benefits: [...(f.key_benefits || []), { title: '', body: '' }],
    }))
  }
  function removeBenefit(i) {
    setForm(f => ({
      ...f,
      key_benefits: (f.key_benefits || []).filter((_, idx) => idx !== i),
    }))
  }
  function updateStep(i, patch) {
    setForm(f => ({
      ...f,
      how_to_use: (f.how_to_use || []).map((s, idx) => idx === i ? { ...s, ...patch } : s),
    }))
  }
  function addStep() {
    setForm(f => {
      const list = f.how_to_use || []
      const nextStep = list.length > 0 ? Math.max(...list.map(s => s.step || 0)) + 1 : 1
      return { ...f, how_to_use: [...list, { step: nextStep, title: '', body: '' }] }
    })
  }
  function removeStep(i) {
    setForm(f => ({
      ...f,
      how_to_use: (f.how_to_use || []).filter((_, idx) => idx !== i),
    }))
  }

  async function handleSave(publishOverride) {
    setSaveError('')
    setPhase('saving')

    const images = imagesText
      .split(/\r?\n/)
      .map(s => s.trim())
      .filter(Boolean)

    const updates = {
      slug: form.slug,
      category_ids: form.category_ids || [],
      amazon_url: form.amazon_url,
      amazon_price: form.amazon_price,
      amazon_image_urls: images,
      rating: form.rating === '' ? null : form.rating,
      review_count: form.review_count === '' ? null : form.review_count,
      display_title: form.display_title,
      short_description: form.short_description,
      provider_note: form.provider_note,
      key_benefits: form.key_benefits,
      how_to_use: form.how_to_use,
      tags: form.tags,
      badge: form.badge || null,
      published: publishOverride !== undefined ? publishOverride : form.published,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase.from('products').update(updates).eq('id', id)
    if (error) {
      setSaveError(error.message)
      setPhase('idle')
      return
    }
    navigate('/admin/products')
  }

  if (!verified) return null

  if (loading) {
    return (
      <AdminLayout backTo="/admin/products" backLabel="All Products">
        <main className="max-w-[960px] mx-auto px-5 md:px-10 py-6 text-on-surface-variant">Loading…</main>
      </AdminLayout>
    )
  }

  if (loadError) {
    return (
      <AdminLayout backTo="/admin/products" backLabel="All Products">
        <main className="max-w-[960px] mx-auto px-5 md:px-10 py-6">
          <div className="p-4 rounded-md bg-error-container text-on-error-container text-sm">
            {loadError}
          </div>
        </main>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout backTo="/admin/products" backLabel="All Products">
      <main className="max-w-[960px] mx-auto px-5 md:px-10 py-6 pb-32">
        <div className="flex items-baseline justify-between flex-wrap gap-3">
          <h1 className="font-headline text-3xl text-on-surface">Edit Product</h1>
          <span className={`font-label text-[10px] tracking-wider uppercase px-2 py-1 rounded-sm ${
            form.published
              ? 'bg-primary text-on-primary'
              : 'bg-surface-container text-on-surface-variant'
          }`}>
            {form.published ? 'Published' : 'Draft'}
          </span>
        </div>
        <p className="text-on-surface-variant mt-1 text-sm">
          Changes save to <code className="text-xs bg-surface-container px-1.5 py-0.5 rounded">{form.slug}</code> on the products table.
        </p>

        <div className="mt-8 space-y-6">
          <Section title="Basics">
            <Row>
              <Field label="Display Title">
                <input
                  type="text"
                  value={form.display_title || ''}
                  onChange={e => update({ display_title: e.target.value })}
                  className="input"
                />
              </Field>
              <Field label="Slug (URL)">
                <input
                  type="text"
                  value={form.slug || ''}
                  onChange={e => update({ slug: e.target.value })}
                  className="input font-mono text-sm"
                />
              </Field>
            </Row>
            <Field label="Categories (pick one or more)">
              <div className="flex flex-wrap gap-2 mt-1">
                {categories.map(c => {
                  const selected = (form.category_ids || []).includes(c.id)
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
                value={form.badge || ''}
                onChange={e => update({ badge: e.target.value })}
                placeholder="OBGYN APPROVED, TOP RECOMMENDATION…"
                className="input mt-3"
              />
            </Field>
            <Row>
              <Field label="Price (display)">
                <input
                  type="text"
                  value={form.amazon_price || ''}
                  onChange={e => update({ amazon_price: e.target.value })}
                  placeholder="$34.00"
                  className="input"
                />
              </Field>
              <Field label="Star Rating (0–5)">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={form.rating ?? ''}
                  onChange={e => update({ rating: e.target.value === '' ? null : parseFloat(e.target.value) })}
                  placeholder="4.8"
                  className="input"
                />
              </Field>
            </Row>
            <Row>
              <Field label="# of Reviews">
                <input
                  type="number"
                  min="0"
                  value={form.review_count ?? ''}
                  onChange={e => update({ review_count: e.target.value === '' ? null : parseInt(e.target.value, 10) })}
                  placeholder="124"
                  className="input"
                />
              </Field>
              <Field label="Amazon URL">
                <input
                  type="url"
                  value={form.amazon_url || ''}
                  onChange={e => update({ amazon_url: e.target.value })}
                  className="input font-mono text-xs"
                />
              </Field>
            </Row>
            <Field label="Short Description">
              <textarea
                rows={3}
                value={form.short_description || ''}
                onChange={e => update({ short_description: e.target.value })}
                className="input"
              />
            </Field>
          </Section>

          <Section title="Images">
            <Field label="Image URLs (one per line)">
              <textarea
                rows={5}
                value={imagesText}
                onChange={e => setImagesText(e.target.value)}
                className="input font-mono text-xs"
                placeholder={"https://m.media-amazon.com/images/I/...jpg\nhttps://m.media-amazon.com/images/I/...jpg"}
              />
            </Field>
            {imagesText.trim() && (
              <div className="mt-3 grid grid-cols-4 gap-3">
                {imagesText.split(/\r?\n/).map(s => s.trim()).filter(Boolean).slice(0, 4).map((src, i) => (
                  <div key={i} className="aspect-square rounded-md overflow-hidden bg-surface-container-lowest border border-outline-variant/40">
                    <img src={src} alt="" className="w-full h-full object-contain p-1" />
                  </div>
                ))}
              </div>
            )}
          </Section>

          <Section title="Why We Recommend This">
            <Field label="Provider's Note">
              <textarea
                rows={5}
                value={form.provider_note || ''}
                onChange={e => update({ provider_note: e.target.value })}
                className="input italic"
              />
            </Field>
            <div className="space-y-3 mt-4">
              <div className="flex items-center justify-between">
                <p className="font-label text-xs tracking-wider uppercase text-on-surface-variant">Key Benefits</p>
                <button
                  type="button"
                  onClick={addBenefit}
                  className="font-label text-[10px] tracking-wider uppercase text-primary hover:underline"
                >
                  + Add benefit
                </button>
              </div>
              {(form.key_benefits || []).map((b, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-3 items-start">
                  <input
                    type="text"
                    value={b.title || ''}
                    onChange={e => updateBenefit(i, { title: e.target.value })}
                    className="input font-semibold"
                    placeholder="Title"
                  />
                  <input
                    type="text"
                    value={b.body || ''}
                    onChange={e => updateBenefit(i, { body: e.target.value })}
                    className="input"
                    placeholder="Description"
                  />
                  <button
                    type="button"
                    onClick={() => removeBenefit(i)}
                    aria-label="Remove benefit"
                    className="h-10 w-10 grid place-items-center rounded-md text-on-surface-variant hover:text-error hover:bg-error-container transition"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </Section>

          <Section title="How to Use">
            <div className="space-y-4">
              {(form.how_to_use || []).map((s, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="mt-1.5 w-7 h-7 rounded-full border-2 border-primary text-primary font-label font-semibold grid place-items-center shrink-0">
                    {s.step}
                  </span>
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={s.title || ''}
                      onChange={e => updateStep(i, { title: e.target.value })}
                      className="input font-semibold"
                      placeholder="Step title"
                    />
                    <textarea
                      rows={2}
                      value={s.body || ''}
                      onChange={e => updateStep(i, { body: e.target.value })}
                      className="input"
                      placeholder="Step body"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeStep(i)}
                    aria-label="Remove step"
                    className="h-10 w-10 grid place-items-center rounded-md text-on-surface-variant hover:text-error hover:bg-error-container transition"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addStep}
                className="font-label text-[10px] tracking-wider uppercase text-primary hover:underline"
              >
                + Add step
              </button>
            </div>
          </Section>

          {saveError && (
            <p className="text-sm text-on-error-container bg-error-container rounded-md px-3 py-2">
              {saveError}
            </p>
          )}
        </div>

        {/* Sticky save bar */}
        <div className="fixed bottom-0 inset-x-0 z-30 bg-surface-container border-t border-outline-variant/40">
          <div className="max-w-[960px] mx-auto px-5 md:px-10 py-3 flex items-center justify-end gap-3">
            {form.published ? (
              <button
                type="button"
                onClick={() => handleSave(false)}
                disabled={phase === 'saving'}
                className="px-5 py-2.5 rounded-md bg-surface-container-high text-on-surface font-label text-sm tracking-wider uppercase hover:bg-surface-container-highest transition disabled:opacity-60"
              >
                Unpublish
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSave(true)}
                disabled={phase === 'saving'}
                className="px-5 py-2.5 rounded-md bg-surface-container-high text-on-surface font-label text-sm tracking-wider uppercase hover:bg-surface-container-highest transition disabled:opacity-60"
              >
                Publish
              </button>
            )}
            <button
              type="button"
              onClick={() => handleSave()}
              disabled={phase === 'saving'}
              className="px-5 py-2.5 rounded-md bg-primary text-on-primary font-label text-sm tracking-wider uppercase shadow-lift hover:bg-primary-container transition disabled:opacity-60"
            >
              {phase === 'saving' ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>
      </main>
    </AdminLayout>
  )
}

function Section({ title, children }) {
  return (
    <section className="rounded-xl bg-surface-container-low p-6 shadow-lift">
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
