import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import { supabase } from '../lib/supabase'
import { useAdminGuard } from '../hooks/useAdminGuard'

export default function AdminCategoryEdit() {
  const verified = useAdminGuard()
  const navigate = useNavigate()
  const { id } = useParams()

  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [saveError, setSaveError] = useState('')
  const [phase, setPhase] = useState('idle')

  useEffect(() => {
    if (!verified) return
    supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) { setLoadError(error.message); setLoading(false); return }
        if (!data) { setLoadError('Category not found'); setLoading(false); return }
        setForm(data)
        setLoading(false)
      })
  }, [verified, id])

  function update(patch) { setForm(f => ({ ...f, ...patch })) }

  async function handleSave() {
    setSaveError('')
    setPhase('saving')

    const updates = {
      slug: form.slug,
      name: form.name,
      description: form.description,
      hero_image_url: form.hero_image_url,
      display_order: form.display_order,
    }
    const { error } = await supabase.from('categories').update(updates).eq('id', id)
    if (error) {
      setSaveError(error.message)
      setPhase('idle')
      return
    }
    navigate('/admin/categories')
  }

  if (!verified) return null

  if (loading) {
    return (
      <AdminLayout backTo="/admin/categories" backLabel="All Categories">
        <main className="max-w-[760px] mx-auto px-5 md:px-10 py-6 text-on-surface-variant">Loading…</main>
      </AdminLayout>
    )
  }

  if (loadError) {
    return (
      <AdminLayout backTo="/admin/categories" backLabel="All Categories">
        <main className="max-w-[760px] mx-auto px-5 md:px-10 py-6">
          <div className="p-4 rounded-md bg-error-container text-on-error-container text-sm">
            {loadError}
          </div>
        </main>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout backTo="/admin/categories" backLabel="All Categories">
      <main className="max-w-[760px] mx-auto px-5 md:px-10 py-6 pb-32">
        <h1 className="font-headline text-3xl text-on-surface">Edit Category</h1>
        <p className="text-on-surface-variant text-sm mt-1">
          Public URL: <code className="text-xs bg-surface-container px-1.5 py-0.5 rounded">/category/{form.slug}</code>
        </p>

        <div className="mt-8 space-y-6">
          <section className="rounded-xl bg-surface-container-low p-6 shadow-lift space-y-4">
            <label className="block">
              <span className="font-label text-xs tracking-wider uppercase text-on-surface-variant">Name</span>
              <input
                type="text"
                value={form.name || ''}
                onChange={e => update({ name: e.target.value })}
                className="input mt-1 font-headline text-lg"
              />
            </label>

            <label className="block">
              <span className="font-label text-xs tracking-wider uppercase text-on-surface-variant">Slug (URL)</span>
              <input
                type="text"
                value={form.slug || ''}
                onChange={e => update({ slug: e.target.value })}
                className="input mt-1 font-mono text-sm"
              />
              <span className="block text-[11px] text-on-surface-variant mt-1">
                Changing the slug breaks existing links. Don't touch unless intentional.
              </span>
            </label>

            <label className="block">
              <span className="font-label text-xs tracking-wider uppercase text-on-surface-variant">Description</span>
              <textarea
                rows={3}
                value={form.description || ''}
                onChange={e => update({ description: e.target.value })}
                className="input mt-1"
              />
            </label>

            <label className="block">
              <span className="font-label text-xs tracking-wider uppercase text-on-surface-variant">Hero Image URL</span>
              <input
                type="text"
                value={form.hero_image_url || ''}
                onChange={e => update({ hero_image_url: e.target.value })}
                placeholder="/categories/pregnancy.webp or full URL"
                className="input mt-1 font-mono text-xs"
              />
              {form.hero_image_url && (
                <div className="mt-3 w-full max-w-xs aspect-[16/10] rounded-md overflow-hidden bg-surface-container">
                  <img src={form.hero_image_url} alt="" className="w-full h-full object-cover" />
                </div>
              )}
            </label>

            <label className="block">
              <span className="font-label text-xs tracking-wider uppercase text-on-surface-variant">Display Order</span>
              <input
                type="number"
                value={form.display_order ?? ''}
                onChange={e => update({ display_order: e.target.value === '' ? null : parseInt(e.target.value, 10) })}
                className="input mt-1 w-32"
              />
              <span className="block text-[11px] text-on-surface-variant mt-1">
                Lower numbers appear first on the homepage grid.
              </span>
            </label>
          </section>

          {saveError && (
            <p className="text-sm text-on-error-container bg-error-container rounded-md px-3 py-2">
              {saveError}
            </p>
          )}
        </div>

        <div className="fixed bottom-0 inset-x-0 z-30 bg-surface-container border-t border-outline-variant/40">
          <div className="max-w-[760px] mx-auto px-5 md:px-10 py-3 flex items-center justify-end">
            <button
              type="button"
              onClick={handleSave}
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
