// Single source of truth for the Claude model used by the API routes.
//
// Why this file exists: the model ID was previously hardcoded in three
// separate routes. When claude-sonnet-4-20250514 was retired, all three
// broke with a 404 and each had to be found and edited by hand.
//
// Model IDs do get retired, so this will need updating again someday —
// but now it's one line, and CLAUDE_MODEL can override it from the Vercel
// dashboard to restore service without a code change or redeploy.
//
// Prefer an alias (claude-opus-5) over a dated snapshot
// (claude-opus-5-20260115). Aliases track the model and are longer-lived;
// dated snapshots are the ones that get retired out from under you — which
// is exactly what happened last time.
//
// Anthropic announces deprecations before retirement, so treat this as a
// scheduled maintenance item, not a surprise:
// https://platform.claude.com/docs/en/about-claude/models/overview
export const CLAUDE_MODEL = process.env.CLAUDE_MODEL || 'claude-opus-5'

// Pulls the assistant's text out of a response. Models think by default,
// which puts a thinking block at content[0] — indexing content[0].text
// returns undefined and throws downstream.
export function textFrom(response) {
  return response.content.find(b => b.type === 'text')?.text ?? ''
}
