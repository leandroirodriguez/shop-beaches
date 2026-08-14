import { useLocation } from 'react-router-dom'
import { SITE_URL, metaForPath, robotsFor } from '../seo/routeMeta'

/**
 * Keeps <head> in step with the current route.
 *
 * React 19 hoists <title>, <meta> and <link> rendered anywhere in the tree up
 * into <head>, so this needs no helmet library. It handles client-side
 * navigation only — the first paint of a prerendered page already has correct
 * tags written into the HTML by scripts/prerender.js, and React replaces them
 * with identical values on mount.
 */
export default function RouteMeta() {
  const { pathname } = useLocation()

  // During prerendering React would emit these tags inline, inside #root in
  // the body, which is not where they belong. scripts/prerender.js writes the
  // real ones into <head> from the same map, so render nothing on the server.
  if (typeof document === 'undefined') return null

  const { title, description } = metaForPath(pathname)
  const canonical = `${SITE_URL}${pathname}`
  const robots = robotsFor(pathname)

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      {robots && <meta name="robots" content={robots} />}
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta name="twitter:card" content="summary_large_image" />
    </>
  )
}
