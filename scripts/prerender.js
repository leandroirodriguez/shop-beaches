/**
 * Writes a real HTML file for each static practice route.
 *
 * Why this exists: the site is a client-rendered SPA, so every route used to
 * serve an empty <div id="root">. Googlebot runs JavaScript and would
 * eventually see the content, but most AI crawlers — GPTBot, OAI-SearchBot,
 * ClaudeBot, PerplexityBot — fetch raw HTML and do not execute it. Without
 * this step the FAQ answers and structured data are invisible to exactly the
 * systems they were written for.
 *
 * Run as part of `npm run build`:
 *   1. vite build            → client bundle + dist/index.html template
 *   2. vite build --ssr      → node-loadable bundle of the same app
 *   3. this script           → renders each route, writes dist/<route>.html
 *
 * The client still boots with createRoot rather than hydrateRoot, so React
 * discards this markup and renders fresh on load. That is deliberate: it
 * sidesteps every hydration-mismatch class of bug for markup whose only job
 * is to be read by crawlers. The tradeoff is that the prerendered HTML is not
 * reused by the browser. If that ever shows up as a visible flash, switching
 * to hydrateRoot is the fix — but MainClonePage picks its reviews with
 * Math.random(), so that must be made deterministic first or hydration will
 * mismatch on every load.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')

const { render, PRERENDER_ROUTES, ROUTE_META, SITE_URL } = await import(
  join(root, 'dist-ssr', 'entry-server.js')
)

const template = readFileSync(join(dist, 'index.html'), 'utf-8')

// Escape for an HTML attribute value. Descriptions contain apostrophes and
// could contain quotes; unescaped, one stray " would truncate the tag.
const attr = s =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

function headFor(pathname) {
  const { title, description } = ROUTE_META[pathname]
  const canonical = `${SITE_URL}${pathname}`
  return [
    `<title>${attr(title)}</title>`,
    `<meta name="description" content="${attr(description)}" />`,
    `<link rel="canonical" href="${canonical}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${attr(title)}" />`,
    `<meta property="og:description" content="${attr(description)}" />`,
    `<meta property="og:url" content="${canonical}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ].join('\n    ')
}

let written = 0

for (const pathname of PRERENDER_ROUTES) {
  if (!ROUTE_META[pathname]) {
    throw new Error(
      `prerender: "${pathname}" is in PRERENDER_ROUTES but has no entry in ROUTE_META`,
    )
  }

  const appHtml = render(pathname)

  const html = template
    // Replace the template's static <title> and description with this route's
    .replace(/<title>.*?<\/title>\s*/s, '')
    .replace(/<meta name="description"[^>]*>\s*/, '')
    .replace('</head>', `  ${headFor(pathname)}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)

  const file = join(dist, `${pathname.replace(/^\//, '')}.html`)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, html)
  written++
  console.log(`  prerendered ${pathname} → dist${pathname}.html`)
}

// Sitemap covering the prerendered routes only. Listing a route here is what
// invites crawlers to index it, so it deliberately tracks PRERENDER_ROUTES
// rather than every route in ROUTE_META — no point advertising pages that
// still serve an empty shell to anything that does not run JavaScript.
const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...PRERENDER_ROUTES.map(p => `  <url><loc>${SITE_URL}${p}</loc></url>`),
  '</urlset>',
].join('\n')

writeFileSync(join(dist, 'sitemap.xml'), sitemap)
console.log(`  wrote sitemap.xml (${PRERENDER_ROUTES.length} urls)`)

console.log(`\nprerender: wrote ${written} page${written === 1 ? '' : 's'}`)
