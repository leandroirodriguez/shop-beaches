import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const SYSTEM_PROMPT = `You are writing curated product copy for Beaches OBGYN, a women's health practice. The shop surfaces Amazon products our doctors recommend — never products we sell ourselves.

Your job: take a raw Amazon product listing and rewrite it into a calm, authoritative, *clinical wellness* product page. We focus on the FORMULATION and CATEGORY of product (e.g. "this DIM with Bioperine"), not the brand. Avoid hype, superlatives, and brand-name flattery.

Voice:
- Professional and warm — the voice of an OBGYN explaining why this product helps
- Specific over generic — name the active ingredient, mechanism, or feature that earned the recommendation
- Honest about limits — "may help with X" not "guaranteed to cure X"
- No FDA-style claims; no diagnosing

Output a single JSON object with these fields exactly:
{
  "display_title": "Clean title for our page (5–9 words, no brand spam, no all-caps)",
  "short_description": "1–2 sentence summary under the title (~25–45 words)",
  "provider_note": "2–4 sentence italicized recommendation in first-person plural (\\"We recommend this...\\"). Explain WHY this specific formulation. Mention the mechanism or feature that mattered. Realistic timeframe if relevant.",
  "key_benefits": [
    { "title": "Short benefit name (2–4 words)", "body": "One concise sentence." }
  ],
  "how_to_use": [
    { "step": 1, "title": "Step name (2–4 words)", "body": "One concise sentence." }
  ],
  "suggested_category_slug": "one of: pregnancy | nutrition-wellness | sexual-health | pcos | menopause",
  "badge": "Optional short uppercase badge for the card — e.g. \\"OBGYN APPROVED\\", \\"TOP RECOMMENDATION\\", \\"BRAIN DEVELOPMENT\\". Empty string if none fits.",
  "tags": ["lowercase short tags for filtering, 2–5 items"]
}

Provide 2–3 key_benefits and 2–4 how_to_use steps. Do not wrap the JSON in code fences. Do not include any prose before or after the JSON.`

function parseAsin(url) {
  const m = url.match(/(?:\/dp\/|\/gp\/product\/|asin=|\/d\/)([A-Z0-9]{10})/i)
  return m ? m[1].toUpperCase() : null
}

function buildAffiliateUrl(asin) {
  const tag = process.env.AMAZON_PARTNER_TAG
  return `https://www.amazon.com/dp/${asin}${tag ? `?tag=${tag}` : ''}`
}

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

  // Manual-paste mode: admin provides everything from the Amazon listing.
  // PA-API is being retired May 15, 2026 in favor of OAuth-based Creators API;
  // we'll add automated fetching once that integration is built.
  const {
    amazon_url,
    raw_title,
    raw_features,
    raw_price,
    raw_image_urls,
    raw_rating,
    raw_review_count,
  } = req.body || {}

  if (!amazon_url) return res.status(400).json({ error: 'amazon_url is required' })
  if (!raw_title) return res.status(400).json({ error: 'raw_title is required' })

  const asin = parseAsin(amazon_url)
  if (!asin) return res.status(400).json({ error: 'Could not parse ASIN from URL' })

  // Generate curated copy with Claude
  let draft
  try {
    const featuresList = (raw_features || '')
      .split('\n')
      .map(s => s.trim().replace(/^[-•*]\s*/, ''))
      .filter(Boolean)

    const prompt = `Amazon listing details (raw, pasted by editor):
Title: ${raw_title}
Price: ${raw_price || 'not provided'}
Features / bullets:
${featuresList.length ? featuresList.map(f => `- ${f}`).join('\n') : '(none provided)'}

Write the curated page for this product.`

    const response = await claude.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = response.content[0].text
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return res.status(500).json({ error: 'Failed to parse AI response' })
    draft = JSON.parse(jsonMatch[0])
  } catch (err) {
    return res.status(500).json({ error: `Claude call failed: ${err.message}` })
  }

  // Normalize image URLs (newline-separated input → array)
  const images = (raw_image_urls || '')
    .split(/\r?\n/)
    .map(s => s.trim())
    .filter(s => s.length > 0)

  // Parse rating + review_count tolerantly: accept "4.8", "4.8 out of 5",
  // "124", "1,234 ratings" etc. Return null if not parseable so we omit
  // the StarRow on the public page rather than showing 0.
  const rating = parseRating(raw_rating)
  const reviewCount = parseReviewCount(raw_review_count)

  return res.status(200).json({
    success: true,
    amazon: {
      asin,
      url: buildAffiliateUrl(asin),
      title: raw_title,
      price: raw_price || '',
      images,
      rating,
      review_count: reviewCount,
    },
    draft,
  })
}

function parseRating(raw) {
  if (raw == null || raw === '') return null
  const n = parseFloat(String(raw).replace(/[^\d.]/g, ''))
  return Number.isFinite(n) && n > 0 && n <= 5 ? n : null
}

function parseReviewCount(raw) {
  if (raw == null || raw === '') return null
  const n = parseInt(String(raw).replace(/[^\d]/g, ''), 10)
  return Number.isFinite(n) && n >= 0 ? n : null
}
