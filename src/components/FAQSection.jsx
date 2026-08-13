/**
 * Patient FAQ block for the service pages.
 *
 * Built on native <details>/<summary> rather than a JS accordion, for three
 * reasons: the answer text sits in the DOM even while collapsed, so crawlers
 * and language models read it without running our JavaScript; it opens and
 * closes with no JS at all; and the disclosure semantics come free, so no
 * aria-expanded wiring to get wrong.
 *
 * Also emits FAQPage structured data. Google restricted FAQ rich results to
 * authoritative government and health sites back in 2023, so this is unlikely
 * to produce collapsible snippets in search results for a private practice —
 * it is here because it gives AI crawlers an unambiguous question-and-answer
 * mapping instead of leaving them to infer one from the markup.
 *
 * `items` come from src/content/faqs.js. The `review` field is editorial
 * metadata and is deliberately not rendered.
 */

export default function FAQSection({
  eyebrow = 'Common Questions',
  heading,
  intro,
  items,
  id = 'faq',
  // Off where the neighbouring section is already a glass-band — two bands
  // running together read as one and lose the boundary.
  band = true,
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }

  return (
    <section id={id} className={`scroll-mt-24 ${band ? 'glass-band' : ''}`}>
      <div className="max-w-[1240px] mx-auto px-5 md:px-10 py-12 md:py-16">
        <p className="font-label text-xs tracking-[0.25em] uppercase text-secondary mb-5">
          {eyebrow}
        </p>
        <h2 className="font-headline text-3xl md:text-5xl leading-[1.15] max-w-2xl">
          {heading}
        </h2>
        {intro && (
          <p className="mt-7 text-on-surface-variant md:text-lg leading-relaxed max-w-2xl">
            {intro}
          </p>
        )}

        <div className="mt-12 max-w-3xl">
          {items.map(item => (
            <details
              key={item.q}
              className="group border-t border-outline-variant/60 last:border-b"
            >
              {/* list-none + the webkit rule remove the native disclosure
                  triangle in every browser we care about */}
              <summary className="flex items-start gap-5 py-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <h3 className="flex-1 font-headline text-lg md:text-xl leading-snug group-hover:text-primary transition">
                  {item.q}
                </h3>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  aria-hidden="true"
                  className="mt-1 shrink-0 text-primary transition-transform duration-300 group-open:rotate-180"
                >
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </summary>
              <p className="pb-7 pr-10 text-on-surface-variant leading-relaxed">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  )
}
