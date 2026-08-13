/**
 * Per-route title, description and canonical path.
 *
 * One map, two consumers:
 *   - <RouteMeta> renders these into <head> at runtime, so client-side
 *     navigation updates the tab title and meta tags
 *   - scripts/prerender.js reads the same map to write real <head> tags into
 *     the static HTML, which is what non-JS crawlers actually read
 *
 * Keep titles under about 60 characters and descriptions under about 155, or
 * search engines truncate them.
 */

// CHANGE THIS if the practice pages move to their own domain. It only affects
// the canonical URLs and og:url — get it wrong and canonicals point at pages
// that do not exist.
export const SITE_URL = 'https://shop.beachesobgyn.com'

const DEFAULT_META = {
  title: 'Beaches OBGYN Shop',
  description:
    'OBGYN-approved supplements and wellness products, carefully curated for every stage of your health journey.',
}

export const ROUTE_META = {
  '/': DEFAULT_META,

  '/mainclone': {
    title: 'Beaches OBGYN | Women’s Healthcare in Jacksonville Beach, FL',
    description:
      'Obstetric and gynecologic care from Jacksonville Beach’s trusted physicians. Independent practice, deliveries at Baptist Beaches, 4.8 stars across 1,500+ reviews.',
  },

  '/obclone': {
    title: 'Obstetrics & Prenatal Care | Beaches OBGYN, Jacksonville Beach',
    description:
      'Prenatal care and delivery at Baptist Medical Center Beaches. Meet your whole delivery team before the day arrives. Answers to common pregnancy questions.',
  },

  '/gynclone': {
    title: 'Gynecology Services | Beaches OBGYN, Jacksonville Beach FL',
    description:
      'Well-woman exams, contraception, fibroids, infertility and sexual health care in Jacksonville Beach. Answers to the questions patients ask us most.',
  },

  '/misclone': {
    title: 'Minimally Invasive & Robotic Surgery | Beaches OBGYN',
    description:
      'Laparoscopic, hysteroscopic and da Vinci robotic gynecologic surgery in Jacksonville Beach — smaller incisions, shorter recovery. Common questions answered.',
  },

  '/hrtclone': {
    title: 'Menopause & Hormone Health | Beaches OBGYN, Jacksonville Beach',
    description:
      'Perimenopause, menopause and hormone replacement therapy in Jacksonville Beach. Is HRT safe? Who is a candidate? Straight answers from our physicians.',
  },

  '/aboutclone': {
    title: 'Our Physicians | Beaches OBGYN, Jacksonville Beach FL',
    description:
      'Meet the obstetricians, gynecologists and advanced practice providers caring for women across the Jacksonville Beaches.',
  },

  '/newclone': {
    title: 'New Patients | Beaches OBGYN, Jacksonville Beach FL',
    description:
      'What to expect at your first visit, forms to bring, and how to request an appointment with Beaches OBGYN in Jacksonville Beach.',
  },

  '/contactclone': {
    title: 'Contact & Locations | Beaches OBGYN, Jacksonville Beach FL',
    description:
      'Two offices serving the Jacksonville Beaches — Roberts Drive in Jacksonville Beach and RG Skinner Parkway in Jacksonville. Call (904) 241-9775.',
  },

  '/shop': {
    title: 'Shop All | Beaches OBGYN',
    description:
      'Supplements and wellness products hand-picked by our physicians for every stage of your health journey. Never sponsored.',
  },

  '/blog': {
    title: 'Blog | Beaches OBGYN',
    description:
      'Women’s health writing from the physicians of Beaches OBGYN — pregnancy, gynecology, menopause and everyday wellness.',
  },
}

// Routes prerendered to static HTML at build time.
//
// Only the practice pages. They render entirely from constants in the source,
// so what a crawler gets is exactly what a browser gets. Everything else is
// left out on purpose: /, /shop, /blog and the :slug routes load their content
// from Supabase inside an effect, which does not run during prerendering, so
// they would emit HTML showing an empty product grid or no posts. Publishing
// that is worse than publishing nothing.
//
// Those routes still get correct per-route <head> tags at runtime via
// <RouteMeta>. Prerendering them properly means fetching Supabase at build
// time — a reasonable next step, but a separate one.
export const PRERENDER_ROUTES = [
  '/mainclone',
  '/obclone',
  '/gynclone',
  '/misclone',
  '/hrtclone',
  '/aboutclone',
  '/newclone',
  '/contactclone',
]

export function metaForPath(pathname) {
  return ROUTE_META[pathname] || DEFAULT_META
}
