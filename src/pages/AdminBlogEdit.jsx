import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import { supabase } from '../lib/supabase'
import { useAdminGuard } from '../hooks/useAdminGuard'
import { compressImage } from '../lib/compressImage'

export default function AdminBlogEdit() {
  const verified = useAdminGuard()
  const navigate = useNavigate()
  const { id } = useParams()

  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const [phase, setPhase] = useState('idle') // idle | saving | revising
  const [saveError, setSaveError] = useState('')
  const [uploadStatus, setUploadStatus] = useState('')

  // Revision UX state
  const [revisionInstruction, setRevisionInstruction] = useState('')
  const [previousBody, setPreviousBody] = useState(null)
  const [revisionError, setRevisionError] = useState('')
  const [revisionNote, setRevisionNote] = useState('')

  const bodyRef = useRef(null)
  const coverInputRef = useRef(null)
  const inlineInputRef = useRef(null)

  useEffect(() => {
    if (!verified) return
    supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) { setLoadError(error.message); setLoading(false); return }
        if (!data) { setLoadError('Post not found'); setLoading(false); return }
        setForm(data)
        setLoading(false)
      })
  }, [verified, id])

  function update(patch) { setForm(f => ({ ...f, ...patch })) }

  async function uploadToStorage(file) {
    setUploadStatus(`Compressing ${file.name}…`)
    const compressed = await compressImage(file)
    setUploadStatus(`Uploading (${Math.round(compressed.size / 1024)} KB)…`)
    const path = `blog/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`
    const { error } = await supabase.storage
      .from('public-assets')
      .upload(path, compressed, { contentType: 'image/jpeg' })
    if (error) throw error
    const { data: { publicUrl } } = supabase.storage
      .from('public-assets')
      .getPublicUrl(path)
    return publicUrl
  }

  async function handleCoverUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const url = await uploadToStorage(file)
      update({ cover_url: url })
      setUploadStatus('Cover image saved ✓')
    } catch (err) {
      setUploadStatus(`Failed: ${err.message}`)
    } finally {
      if (coverInputRef.current) coverInputRef.current.value = ''
    }
  }

  async function handleInlineImageUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const url = await uploadToStorage(file)
      const imgTag = `\n<img src="${url}" alt="" style="width:100%;border-radius:12px;margin:1.5rem 0" />\n`
      insertIntoBody(imgTag)
      setUploadStatus('Inline image inserted ✓')
    } catch (err) {
      setUploadStatus(`Failed: ${err.message}`)
    } finally {
      if (inlineInputRef.current) inlineInputRef.current.value = ''
    }
  }

  function insertIntoBody(text) {
    const ta = bodyRef.current
    if (!ta) {
      update({ body_html: (form.body_html || '') + text })
      return
    }
    const start = ta.selectionStart ?? form.body_html?.length ?? 0
    const end = ta.selectionEnd ?? start
    const current = form.body_html || ''
    const next = current.slice(0, start) + text + current.slice(end)
    update({ body_html: next })
    setTimeout(() => {
      ta.focus()
      ta.selectionStart = ta.selectionEnd = start + text.length
    }, 0)
  }

  async function handleRevise() {
    setRevisionError('')
    setRevisionNote('')
    if (!revisionInstruction.trim()) {
      setRevisionError('Tell Claude what to change (e.g. "shorter", "add a section on dosage").')
      return
    }
    setPhase('revising')

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      setRevisionError('Session expired. Please sign in again.')
      setPhase('idle')
      return
    }

    try {
      const r = await fetch('/api/revise-blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          body: form.body_html,
          instruction: revisionInstruction,
          title: form.title,
        }),
      })
      const payload = await r.json()
      if (!r.ok) {
        setRevisionError(payload.error || `Request failed (${r.status})`)
        setPhase('idle')
        return
      }
      // Stash current body for one-step undo before applying
      setPreviousBody(form.body_html)
      update({ body_html: payload.body })
      setRevisionInstruction('')
      setRevisionNote('Revision applied — preview below to review; save to commit.')
      setPhase('idle')
    } catch (err) {
      setRevisionError(err.message)
      setPhase('idle')
    }
  }

  function handleUndoRevision() {
    if (previousBody == null) return
    update({ body_html: previousBody })
    setPreviousBody(null)
    setRevisionNote('Undone — back to the previous version.')
  }

  async function handleSave(publishOverride) {
    setSaveError('')
    setPhase('saving')

    const publish = publishOverride !== undefined ? publishOverride : form.published
    const updates = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt,
      body_html: form.body_html,
      cover_url: form.cover_url,
      published: publish,
      published_at: publish && !form.published_at ? new Date().toISOString() : form.published_at,
      updated_at: new Date().toISOString(),
    }
    const { error } = await supabase.from('blog_posts').update(updates).eq('id', id)
    if (error) {
      setSaveError(error.message)
      setPhase('idle')
      return
    }
    navigate('/admin/blog')
  }

  if (!verified) return null
  if (loading) {
    return (
      <AdminLayout backTo="/admin/blog" backLabel="All Posts">
        <main className="max-w-[960px] mx-auto px-5 md:px-10 py-6 text-on-surface-variant">Loading…</main>
      </AdminLayout>
    )
  }
  if (loadError) {
    return (
      <AdminLayout backTo="/admin/blog" backLabel="All Posts">
        <main className="max-w-[960px] mx-auto px-5 md:px-10 py-6">
          <div className="p-4 rounded-md bg-error-container text-on-error-container text-sm">{loadError}</div>
        </main>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout backTo="/admin/blog" backLabel="All Posts">
      <main className="max-w-[960px] mx-auto px-5 md:px-10 py-6 pb-32">
        <div className="flex items-baseline justify-between flex-wrap gap-3">
          <h1 className="font-headline text-3xl text-on-surface">Edit Post</h1>
          <span className={`font-label text-[10px] tracking-wider uppercase px-2 py-1 rounded-sm ${
            form.published ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'
          }`}>
            {form.published ? 'Published' : 'Draft'}
          </span>
        </div>

        <div className="mt-8 space-y-6">
          {/* Basics */}
          <section className="rounded-xl bg-surface-container-low p-6 shadow-lift space-y-4">
            <label className="block">
              <span className="font-label text-xs tracking-wider uppercase text-on-surface-variant">Title</span>
              <input
                type="text"
                value={form.title || ''}
                onChange={e => update({ title: e.target.value })}
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
            </label>
            <label className="block">
              <span className="font-label text-xs tracking-wider uppercase text-on-surface-variant">Excerpt</span>
              <textarea
                rows={3}
                value={form.excerpt || ''}
                onChange={e => update({ excerpt: e.target.value })}
                className="input mt-1"
              />
            </label>
          </section>

          {/* Cover image */}
          <section className="rounded-xl bg-surface-container-low p-6 shadow-lift">
            <h2 className="font-headline text-xl text-on-surface mb-4">Cover Image</h2>
            {form.cover_url ? (
              <div className="space-y-3">
                <img src={form.cover_url} alt="" className="w-full aspect-[16/9] object-cover rounded-lg" />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    className="px-4 py-2 rounded-md bg-surface-container text-on-surface font-label text-xs tracking-wider uppercase hover:bg-surface-container-high transition"
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={() => update({ cover_url: '' })}
                    className="px-4 py-2 rounded-md text-on-surface-variant font-label text-xs tracking-wider uppercase hover:bg-error-container hover:text-on-error-container transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                className="w-full p-10 rounded-lg border-2 border-dashed border-outline-variant/60 hover:border-primary text-on-surface-variant hover:text-primary transition text-center"
              >
                <p className="font-headline text-lg">+ Upload cover image</p>
                <p className="text-xs mt-1">JPG / PNG / WebP — auto-compressed to ≤1200px, JPEG q=82</p>
              </button>
            )}
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
              className="hidden"
            />
          </section>

          {/* Body editor */}
          <section className="rounded-xl bg-surface-container-low p-6 shadow-lift">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <h2 className="font-headline text-xl text-on-surface">Body</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => inlineInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface-container text-on-surface font-label text-[11px] tracking-wider uppercase hover:bg-surface-container-high transition"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="m21 15-5-5L5 21" />
                  </svg>
                  Insert image
                </button>
              </div>
            </div>
            <textarea
              ref={bodyRef}
              rows={18}
              value={form.body_html || ''}
              onChange={e => update({ body_html: e.target.value })}
              className="input font-mono text-sm leading-relaxed"
            />
            {uploadStatus && (
              <p className="text-xs text-on-surface-variant mt-2">{uploadStatus}</p>
            )}
            <input
              ref={inlineInputRef}
              type="file"
              accept="image/*"
              onChange={handleInlineImageUpload}
              className="hidden"
            />
          </section>

          {/* Suggest Changes — AI revision */}
          <section className="rounded-xl bg-secondary-container/30 p-6 shadow-lift">
            <h2 className="font-headline text-xl text-on-secondary-container">Suggest Changes</h2>
            <p className="text-sm text-on-secondary-container/80 mt-1">
              Tell Claude what to tweak. The current body stays editable; one click reverts.
            </p>
            <textarea
              rows={3}
              value={revisionInstruction}
              onChange={e => setRevisionInstruction(e.target.value)}
              placeholder='e.g. "tighten the intro", "add a section on safe dosing", "soften the tone"'
              className="input mt-4"
              disabled={phase === 'revising'}
            />
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleRevise}
                disabled={phase === 'revising'}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-on-primary font-label text-xs tracking-wider uppercase shadow-lift hover:bg-primary-container transition disabled:opacity-60"
              >
                {phase === 'revising' ? (
                  <><Spinner /> Revising…</>
                ) : (
                  <>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                    Revise with AI
                  </>
                )}
              </button>
              {previousBody != null && (
                <button
                  type="button"
                  onClick={handleUndoRevision}
                  className="font-label text-xs tracking-wider uppercase text-primary hover:underline"
                >
                  Undo last revision
                </button>
              )}
            </div>
            {revisionNote && (
              <p className="mt-3 text-sm text-on-secondary-container">{revisionNote}</p>
            )}
            {revisionError && (
              <p className="mt-3 text-sm text-on-error-container bg-error-container rounded-md px-3 py-2">{revisionError}</p>
            )}
          </section>

          {/* Preview */}
          <section className="rounded-xl bg-surface-container-low p-6 shadow-lift">
            <h2 className="font-headline text-xl text-on-surface mb-4">Preview</h2>
            <article className="prose max-w-none">
              <h1 className="font-headline text-3xl text-on-surface mb-3">{form.title}</h1>
              {form.excerpt && <p className="text-on-surface-variant italic mb-6">{form.excerpt}</p>}
              {form.cover_url && (
                <img src={form.cover_url} alt="" className="w-full aspect-[16/9] object-cover rounded-lg mb-6" />
              )}
              <div dangerouslySetInnerHTML={{ __html: form.body_html || '' }} />
            </article>
          </section>

          {saveError && (
            <p className="text-sm text-on-error-container bg-error-container rounded-md px-3 py-2">{saveError}</p>
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

function Spinner() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" className="animate-spin">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.25" />
      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  )
}
