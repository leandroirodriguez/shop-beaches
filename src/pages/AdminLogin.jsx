import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import { supabase } from '../lib/supabase'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Already signed in + admin? Skip the form.
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return
      const { data } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', session.user.id)
        .single()
      if (data?.is_admin) navigate('/admin/dashboard')
    })
  }, [navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) {
      setError(signInError.message)
      setSubmitting(false)
      return
    }

    const { data: profile } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', data.user.id)
      .single()

    if (!profile?.is_admin) {
      setError('This account does not have admin access.')
      await supabase.auth.signOut()
      setSubmitting(false)
      return
    }

    navigate('/admin/dashboard')
  }

  return (
    <AdminLayout>
      <main className="min-h-svh grid place-items-center px-5">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <p className="font-label text-xs tracking-[0.2em] uppercase text-secondary mb-2">
              Beaches OBGYN
            </p>
            <h1 className="font-headline text-3xl text-on-surface">Admin Sign In</h1>
            <p className="text-on-surface-variant text-sm mt-2">
              Manage products, blog posts, and curated content.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-surface-container-low rounded-xl p-6 shadow-lift space-y-4">
            <label className="block">
              <span className="font-label text-xs tracking-wider uppercase text-on-surface-variant">
                Email
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@beachesobgyn.com"
                className="input mt-1"
              />
            </label>

            <label className="block">
              <span className="font-label text-xs tracking-wider uppercase text-on-surface-variant">
                Password
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
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
              disabled={submitting}
              className="w-full py-3 rounded-md bg-primary text-on-primary font-label text-sm tracking-wider uppercase shadow-lift hover:bg-primary-container transition disabled:opacity-60"
            >
              {submitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </main>
    </AdminLayout>
  )
}
