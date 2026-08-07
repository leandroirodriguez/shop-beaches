/**
 * Page backdrop: soft coastal color blobs that give the translucent `.glass` /
 * `.glass-band` surfaces something varied to blur over.
 *
 * Anchored to the DOCUMENT, not the viewport, and starting one full viewport
 * down. Two consequences, both deliberate:
 *   - the first screen (contact bar, alliance ribbon, header, hero) renders on
 *     plain surface, exactly as it did before the glass work
 *   - the field then drifts past as you scroll, so the tint under the glass
 *     keeps changing instead of sitting static behind everything
 *
 * Blob offsets are percentages of the below-the-fold region, so they spread
 * across the page whatever its length. The first one is in rem so its blur
 * never clips against the container's top edge on short pages.
 */
export default function BackgroundDecor() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-[100vh] bottom-0 z-0 overflow-hidden"
    >
      {/* Teal is capped at /28: it lands under the left-hand copy column on
          /shop, where text sits bare on the page with no surface behind it.
          Above ~/32 that copy drops under 4.5:1. */}
      <div className="absolute -left-32 top-32 h-[42rem] w-[42rem] rounded-full bg-brand-500/28 blur-3xl" />
      <div className="absolute -right-40 top-[18%] h-[46rem] w-[46rem] rounded-full bg-secondary-fixed-dim/38 blur-3xl" />
      <div className="absolute left-[12%] top-[42%] h-[40rem] w-[40rem] rounded-full bg-primary/28 blur-3xl" />
      <div className="absolute right-[6%] top-[64%] h-[34rem] w-[34rem] rounded-full bg-primary-container/45 blur-3xl" />
      <div className="absolute -left-24 top-[85%] h-[38rem] w-[38rem] rounded-full bg-secondary-fixed-dim/32 blur-3xl" />
    </div>
  )
}
