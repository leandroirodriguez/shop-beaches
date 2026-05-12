import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'
import amazonPaapi from 'amazon-paapi'

const claude = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const PA_API_COMMON = {
  AccessKey: process.env.AMAZON_ACCESS_KEY,
  SecretKey: process.env.AMAZON_SECRET_KEY,
  PartnerTag: process.env.AMAZON_PARTNER_TAG,
  PartnerType: 'Associates',
  Marketplace: 'www.amazon.com',
}

const PA_API_RESOURCES = [
  'Images.Primary.Large',
  'Images.Variants.Large',
  'ItemInfo.Title',
  'ItemInfo.ByLineInfo',
  'ItemInfo.ProductInfo',
  'ItemInfo.Features',
  'ItemInfo.ContentInfo',
  'Offers.Listings.Price',
]

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
  return `https://www.amazon.com/dp/${asin}?tag=${process.env.AMAZON_PARTNER_TAG}`
}

function flattenPaapiItem(item) {
  const info = item.ItemInfo || {}
  const features = info.Features?.DisplayValues || []
  const title = info.Title?.DisplayValue || ''
  const brand = info.ByLineInfo?.Brand?.DisplayValue || ''
  const price =
    item.Offers?.Listings?.[0]?.Price?.DisplayAmount ||
    item.Offers?.Listings?.[0]?.Price?.Amount?.toString() ||
    ''
  const primary = item.Images?.Primary?.Large?.URL
  const variants = (item.Images?.Variants || [])
    .map(v => v.Large?.URL)
    .filter(Boolean)
  return {
    asin: item.ASIN,
    title,
    brand,
    features,
    price,
    images: [primary, ...variants].filter(Boolean),
  }
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

  // Parse + validate input
  const { amazon_url } = req.body || {}
  if (!amazon_url) return res.status(400).json({ error: 'amazon_url is required' })

  const asin = parseAsin(amazon_url)
  if (!asin) return res.status(400).json({ error: 'Could not parse ASIN from URL' })

  // 1) Fetch from Amazon PA-API
  let amazon
  try {
    const data = await amazonPaapi.GetItems(PA_API_COMMON, {
      ItemIds: [asin],
      Resources: PA_API_RESOURCES,
    })
    const item = data?.ItemsResult?.Items?.[0]
    if (!item) {
      const errs = data?.Errors?.map(e => e.Message).join('; ')
      return res.status(502).json({ error: `Amazon returned no item${errs ? `: ${errs}` : ''}` })
    }
    amazon = flattenPaapiItem(item)
  } catch (err) {
    return res.status(502).json({ error: `PA-API call failed: ${err.message}` })
  }

  // 2) Generate curated copy with Claude
  let draft
  try {
    const prompt = `Amazon listing details (raw):
Title: ${amazon.title}
Brand: ${amazon.brand}
Price: ${amazon.price}
Features:
${amazon.features.map(f => `- ${f}`).join('\n')}

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

  // 3) Return combined payload (don't persist yet — admin reviews + saves)
  return res.status(200).json({
    success: true,
    amazon: {
      asin,
      url: buildAffiliateUrl(asin),
      title: amazon.title,
      brand: amazon.brand,
      price: amazon.price,
      images: amazon.images,
    },
    draft,
  })
}
