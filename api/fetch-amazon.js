// Wraps Amazon Creators API GetItems for the admin "Add Product" flow.
// Reverse-engineered from the official Node SDK (creatorsapi-nodejs-sdk),
// reimplemented in fetch() so we don't have to vendor the SDK zip.
//
// Auth model:
//   v2.x — Cognito client_credentials, form-encoded, regional endpoints
//   v3.x — Login-with-Amazon client_credentials, JSON body, single endpoint
// We add a Version suffix on the Authorization header only for v2.x.

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const TOKEN_ENDPOINTS = {
  '2.1': 'https://creatorsapi.auth.us-east-1.amazoncognito.com/oauth2/token',
  '2.2': 'https://creatorsapi.auth.eu-south-2.amazoncognito.com/oauth2/token',
  '2.3': 'https://creatorsapi.auth.us-west-2.amazoncognito.com/oauth2/token',
  '3.1': 'https://api.amazon.com/auth/o2/token',
  '3.2': 'https://api.amazon.co.uk/auth/o2/token',
  '3.3': 'https://api.amazon.co.jp/auth/o2/token',
}

const API_BASE = 'https://creatorsapi.amazon'

// Cache the OAuth token in the function-instance memory. Vercel keeps
// warm instances around for a while, so this dramatically reduces
// token-endpoint round-trips. 1hr token life with a 30s safety margin.
let cachedToken = null
let cachedTokenExpiresAt = 0

function parseAsin(url) {
  const m = url.match(/(?:\/dp\/|\/gp\/product\/|asin=|\/d\/)([A-Z0-9]{10})/i)
  return m ? m[1].toUpperCase() : null
}

async function getAccessToken() {
  if (cachedToken && Date.now() < cachedTokenExpiresAt) return cachedToken

  const version = process.env.AMAZON_CREDENTIAL_VERSION || '3.1'
  const endpoint = TOKEN_ENDPOINTS[version]
  if (!endpoint) throw new Error(`Unsupported AMAZON_CREDENTIAL_VERSION: ${version}`)

  const isLwa = version.startsWith('3.')
  const credentialId = process.env.AMAZON_CREDENTIAL_ID
  const credentialSecret = process.env.AMAZON_CREDENTIAL_SECRET
  if (!credentialId || !credentialSecret) {
    throw new Error('Missing AMAZON_CREDENTIAL_ID or AMAZON_CREDENTIAL_SECRET env var')
  }

  const scope = isLwa ? 'creatorsapi::default' : 'creatorsapi/default'

  let response
  if (isLwa) {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: credentialId,
        client_secret: credentialSecret,
        scope,
      }),
    })
  } else {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: credentialId,
        client_secret: credentialSecret,
        scope,
      }).toString(),
    })
  }

  if (!response.ok) {
    const text = await response.text()
    cachedToken = null
    throw new Error(`Token endpoint returned ${response.status}: ${text}`)
  }

  const data = await response.json()
  if (!data.access_token) throw new Error('No access_token in token response')

  cachedToken = data.access_token
  cachedTokenExpiresAt = Date.now() + ((data.expires_in || 3600) - 30) * 1000
  return cachedToken
}

async function getItems(asins) {
  const token = await getAccessToken()
  const version = process.env.AMAZON_CREDENTIAL_VERSION || '3.1'
  const isLwa = version.startsWith('3.')

  const authValue = isLwa
    ? `Bearer ${token}`
    : `Bearer ${token}, Version ${version}`

  const response = await fetch(`${API_BASE}/catalog/v1/getItems`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authValue,
      'x-marketplace': process.env.AMAZON_MARKETPLACE || 'www.amazon.com',
    },
    body: JSON.stringify({
      partnerTag: process.env.AMAZON_PARTNER_TAG,
      itemIds: asins,
      resources: [
        'images.primary.large',
        'images.variants.large',
        'itemInfo.title',
        'itemInfo.features',
        'offersV2.listings.price',
      ],
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    // If unauthorized, clear cached token so the next call retries auth
    if (response.status === 401) cachedToken = null
    throw new Error(`Creators API returned ${response.status}: ${text}`)
  }

  return response.json()
}

function flattenItem(item) {
  const primary = item.images?.primary?.large?.url
  const variants = (item.images?.variants || [])
    .map(v => v.large?.url)
    .filter(Boolean)

  return {
    asin: item.asin,
    detail_page_url: item.detailPageURL || '',
    title: item.itemInfo?.title?.displayValue || '',
    features: item.itemInfo?.features?.displayValues || [],
    price: item.offersV2?.listings?.[0]?.price?.money?.displayAmount || '',
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

  const { amazon_url } = req.body || {}
  if (!amazon_url) return res.status(400).json({ error: 'amazon_url is required' })

  const asin = parseAsin(amazon_url)
  if (!asin) return res.status(400).json({ error: 'Could not parse ASIN from URL' })

  try {
    const data = await getItems([asin])
    const item = data?.itemsResult?.items?.[0]
    if (!item) {
      const errs = (data?.errors || []).map(e => e.message || e.code).join('; ')
      return res.status(502).json({ error: `No item returned${errs ? `: ${errs}` : ''}` })
    }
    return res.status(200).json({ success: true, ...flattenItem(item) })
  } catch (err) {
    return res.status(502).json({ error: err.message })
  }
}
