import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const SYSTEM_PROMPT = `You write educational blog posts for Beaches OBGYN, a women's health practice.

Voice:
- Professional and warm — informed by clinical experience but written for patients
- Empowering — explain the "why" so readers can advocate for themselves
- Specific — name conditions, mechanisms, supplement classes; avoid vague wellness-speak
- Honest — acknowledge uncertainty when it exists; never promise outcomes; no FDA-style claims

Format the body in HTML (not markdown):
- Use <h2> for section headings, <h3> sparingly
- Use <p> for paragraphs
- Use <strong> for key terms
- Use <ul>/<li> for lists
- Use <blockquote> for emphasized takeaways
- 600–1000 words
- Do NOT include the title or any wrapping <article> tags

Output a single JSON object with these fields exactly:
{
  "title": "Blog post title (compelling, SEO-friendly, not clickbait)",
  "slug": "url-friendly-slug",
  "excerpt": "1–2 sentence summary for social sharing and previews",
  "body_html": "Full blog post body in HTML"
}

Do not wrap the JSON in code fences. Do not include any prose before or after the JSON.`

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

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

  const { topic, style } = req.body || {}
  if (!topic) return res.status(400).json({ error: 'topic is required' })

  const prompt = `Write a blog post about: ${topic}

${style ? `Style notes from the editor: ${style}` : ''}`

  try {
    const response = await claude.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = response.content[0].text
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return res.status(500).json({ error: 'Failed to parse AI response' })
    const draft = JSON.parse(jsonMatch[0])

    return res.status(200).json({ success: true, draft })
  } catch (err) {
    return res.status(500).json({ error: `Claude call failed: ${err.message}` })
  }
}
