import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const SYSTEM_PROMPT = `You are an editor revising existing educational blog posts for Beaches OBGYN, a women's health practice.

Voice (already established in the post):
- Professional and warm, informed by clinical experience but written for patients
- Empowering — explain the "why" so readers can advocate for themselves
- Honest about uncertainty; never promise outcomes; no FDA-style claims

When revising:
- Preserve the post's existing structure (h2/h3 hierarchy, paragraph breaks, lists, blockquotes, inline <img> tags)
- Keep all images exactly where they are; do not invent, remove, or relocate <img> tags
- Apply the editor's instruction faithfully — if they ask for "shorter" make it shorter, if "more practical" lean concrete
- Do NOT invent medical claims or specific dosages that weren't already in the source
- Stay in HTML (not markdown). Reuse the same tags the original used.

Output ONLY the revised HTML body. No preamble, no explanation, no code fences, no markdown. Just the revised <p>, <h2>, <ul>, etc. tags ready to drop back into the editor.`

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  // Authn + admin check
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' })
  const token = authHeader.replace('Bearer ', '')

  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) return res.status(401).json({ error: 'Invalid token' })

  const { data: profile } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single()
  if (!profile?.is_admin) return res.status(403).json({ error: 'Admin access required' })

  const { body, instruction, title } = req.body || {}
  if (!body) return res.status(400).json({ error: 'body is required' })
  if (!instruction) return res.status(400).json({ error: 'instruction is required' })

  const prompt = `Title: ${title || '(no title)'}

Current HTML body:
${body}

Editor's revision instruction:
${instruction}`

  try {
    const response = await claude.messages.create({
      model: 'claude-opus-5',
      max_tokens: 16000,
      output_config: { effort: 'medium' },
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    })

    let revised = (response.content.find(b => b.type === 'text')?.text ?? '').trim()

    // Strip accidental code fences if Claude wraps the output
    if (revised.startsWith('```')) {
      revised = revised.replace(/^```(?:html)?\s*\n?/, '').replace(/\n?```\s*$/, '')
    }

    return res.status(200).json({ success: true, body: revised })
  } catch (err) {
    return res.status(500).json({ error: `Claude call failed: ${err.message}` })
  }
}
