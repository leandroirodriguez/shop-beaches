import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import { supabase } from '../lib/supabase'
import { useAdminGuard } from '../hooks/useAdminGuard'

const topicIdeas = [
  'The Most Important Vitamins for PCOS Patients',
  'Estrogen Dominance: Causes & Solutions',
  'A Practical Guide to Prenatal Nutrition',
  'Managing Hormonal Acne with Nutrition',
  'Postpartum Recovery: Supplements Worth Considering',
]

export default function AdminBlogNew() {
  const verified = useAdminGuard()
  const navigate = useNavigate()
  const [topic, setTopic] = useState('')
  const [styleNotes, setStyleNotes] = useState('')
  const [phase, setPhase] = useState('idle')
  const [error, setError] = useState('')
  const [draft, setDraft] = useState(null)

  async function handleGenerate(e) {
    e.preventDefault()
    setError('')
    setPhase('generating')

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      setError('Session expired. Please sign in again.')
      setPhase('idle')
      return
    }

    try {
      const r = await fetch('/api/generate-blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ topic, style: styleNotes }),
      })
      const payload = await r.json()
      if (!r.ok) {
        setError(payload.error || `Request failed (${r.status})`)
        setPhase('idle')
        return
      }
      setDraft(payload.draft)
      setPhase('ready')
    } catch (err) {
      setError(err.message)
      setPhase('idle')
    }
  }

  function updateDraft(patch) { setDraft(d => ({ ...d, ...patch })) }

  async function handleSave(publish) {
    setError('')
    setPhase('saving')
    const { error: insertError } = await supabase.from('blog_posts').insert({
      title: draft.title,
      slug: draft.slug,
      excerpt: draft.excerpt,
      body_html: draft.body_html,
      published: publish,
      published_at: publish ? new Date().toISOString() : null,
    })
    if (insertError) {
      setError(insertError.message)
      setPhase('ready')
      return
    }
    navigate('/admin/blog')
  }

  if (!verified) return null

  return (
    <AdminLayout backTo="/admin/blog" backLabel="All Posts">
      <main className="max-w-[960px] mx-auto px-5 md:px-10 py-6 pb-32">
        <h1 className="font-headline text-3xl text-on-surface">Generate New Post</h1>
        <p className="text-on-surface-variant mt-1">
          Give Claude a topic. It will draft a full article in the practice's voice.
        </p>

        <form onSubmit={handleGenerate} className="mt-8 glass rounded-xl p-6 space-y-4">
          <label className="block">
            <span className="font-label text-xs tracking-wider uppercase text-on-surface-variant">Topic</span>
            <input
              type="text"
              required
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. The Most Important Vitamins for PCOS Patients"
              className="input mt-1"
              disabled={phase === 'generating'}
            />
          </label>

          <div>
            <p className="font-label text-xs tracking-wider uppercase text-on-surface-variant mb-2">
              Or pick a suggestion
            </p>
            <div className="flex flex-wrap gap-2">
              {topicIdeas.map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTopic(t)}
                  className="px-3 py-1.5 rounded-full bg-secondary-container/40 text-on-secondary-container text-xs hover:bg-secondary-container transition"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="font-label text-xs tracking-wider uppercase text-on-surface-variant">
              Style notes (optional)
            </span>
            <textarea
              rows={2}
              value={styleNotes}
              onChange={e => setStyleNotes(e.target.value)}
              placeholder="e.g. focus on the postpartum stage, keep under 800 words"
              className="input mt-1"
            />
          </label>

          {error && (
            <p className="text-sm text-on-error-container bg-error-container rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={phase === 'generating'}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-primary text-on-primary font-label text-sm tracking-wider uppercase shadow-lift hover:bg-primary-container transition disabled:opacity-60"
          >
            {phase === 'generating' ? (
              <><Spinner /> Drafting…</>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                {draft ? 'Regenerate' : 'Generate Draft'}
              </>
            )}
          </button>
        </form>

        {draft && (
          <div className="mt-8 space-y-6">
            <section className="glass rounded-xl p-6 space-y-4">
              <label className="block">
                <span className="font-label text-xs tracking-wider uppercase text-on-surface-variant">Title</span>
                <input
                  type="text"
                  value={draft.title}
                  onChange={e => updateDraft({ title: e.target.value })}
                  className="input mt-1 font-headline text-lg"
                />
              </label>
              <label className="block">
                <span className="font-label text-xs tracking-wider uppercase text-on-surface-variant">Slug (URL)</span>
                <input
                  type="text"
                  value={draft.slug}
                  onChange={e => updateDraft({ slug: e.target.value })}
                  className="input mt-1 font-mono text-sm"
                />
              </label>
              <label className="block">
                <span className="font-label text-xs tracking-wider uppercase text-on-surface-variant">Excerpt</span>
                <textarea
                  rows={3}
                  value={draft.excerpt}
                  onChange={e => updateDraft({ excerpt: e.target.value })}
                  className="input mt-1"
                />
              </label>
            </section>

            <section className="glass rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-headline text-xl text-on-surface">Body</h2>
                <p className="font-label text-[11px] tracking-wider uppercase text-on-surface-variant">
                  HTML — rich editor lands later
                </p>
              </div>
              <textarea
                rows={18}
                value={draft.body_html}
                onChange={e => updateDraft({ body_html: e.target.value })}
                className="input font-mono text-sm leading-relaxed"
              />
            </section>

            <section className="glass rounded-xl p-6">
              <h2 className="font-headline text-xl text-on-surface mb-4">Preview</h2>
              <article className="prose max-w-none">
                <h1 className="font-headline text-3xl text-on-surface mb-3">{draft.title}</h1>
                <p className="text-on-surface-variant italic mb-6">{draft.excerpt}</p>
                <div dangerouslySetInnerHTML={{ __html: draft.body_html }} />
              </article>
            </section>
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

function Spinner() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" className="animate-spin">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.25" />
      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
    </svg>
  )
}
