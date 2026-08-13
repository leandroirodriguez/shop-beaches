import { renderToString } from 'react-dom/server'
// react-router v7 dropped the react-router-dom/server entry; StaticRouter now
// comes from the react-router core package (a transitive dep of react-router-dom).
import { StaticRouter } from 'react-router'
import App from './App.jsx'

// Re-exported so the prerender script can read the route map out of the same
// SSR bundle instead of needing a second one built just for it.
export { PRERENDER_ROUTES, ROUTE_META, SITE_URL } from './seo/routeMeta.js'

/**
 * Server entry, used only by scripts/prerender.js at build time. The browser
 * never loads this.
 *
 * No <StrictMode> here: it double-renders, which is useful for catching
 * effect bugs in development and pointless when producing a single HTML
 * string. Effects do not run during renderToString at all, which is why the
 * Supabase-backed routes are excluded from PRERENDER_ROUTES.
 */
export function render(url) {
  return renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>,
  )
}
