// Hidden design prototype for the practice website — a reimagining of
// toplinemd.com/beaches-obgyn in the shop's coastal palette and type
// system. Not linked from anywhere; reachable only at /mainclone.

import { useRef } from 'react'
import Starfish from '../components/Starfish'
import { PracticeHeader, PracticeFooter, APPOINTMENT_URL } from '../components/PracticeChrome'

const PHYSICIANS = [
  { name: 'Leandro Rodriguez', photo: '/providers/rodriguez.jpg', credentials: 'MD, FACOG', interests: 'Gynecologic ultrasound, minimally invasive procedures; Past Chief of the Medical Staff at Baptist Beaches · Bilingual, English & Spanish', tenure: 'Practicing since 2005' },
  { name: 'Rebekah Richmond', photo: '/providers/richmond.jpg', credentials: 'MD, FACOG', interests: 'Hormone replacement, contraceptive management; Past Chair, Women & Children Services at Baptist Beaches', tenure: 'Jacksonville native' },
  { name: 'Laura Peter', photo: '/providers/peter.jpg', credentials: 'DO, FACOG', interests: 'Whole-person osteopathic approach to obstetrics and gynecology; Current Chair, Women & Children Services at Baptist Beaches', tenure: null },
  { name: 'Kimberly Manek', photo: '/providers/manek.jpg', credentials: 'MD, FACOG', interests: 'Comprehensive obstetric care; builds lasting relationships with patients through every stage of life', tenure: null },
  { name: 'Anita Patel', photo: '/providers/patel.jpg', credentials: 'MD, FACOG', interests: 'Obstetrics, minimally invasive surgery, abnormal uterine bleeding, pelvic pain, menopause care', tenure: 'Jacksonville native' },
  { name: 'Joana Fischer', photo: '/providers/fischer.jpg', credentials: 'MD', interests: 'Menstrual health education, family planning · Bilingual, English & Spanish', tenure: null },
  { name: 'Rakiya Miller', photo: '/providers/miller.jpg', credentials: 'MD, FACOG', interests: 'Minimally invasive gynecology — AAGL Excellence Award recipient', tenure: null },
  { name: 'John Bordelon', photo: '/providers/bordelon.jpg', credentials: 'MD, FACOG', interests: 'Founding physician of Beaches OBGYN; endometrial ablation, laparoscopy, hysteroscopy, da Vinci robotic surgery', tenure: 'Founding physician · Retired 8/2026' },
]

// Soft neutral portrait backdrops, cycled across the carousel
const PORTRAIT_TINTS = ['bg-primary-container/50', 'bg-secondary-container/60', 'bg-tertiary-container/70']

// Apple-style tile grid. Each tile's `bg` should match its image's
// background so the photo blends into the tile. `dark` flips text/buttons
// to light. Source each image on the matching background color below.
const SERVICES = [
  {
    label: 'Obstetrics', cta: 'Obstetrics', dark: false, bg: '#D9CFC3',
    tagline: 'Prenatal visits in our office, delivery at Baptist Beaches, and a doctor you’ve already met.',
    image: '/services/pregnancy.jpg',
    learnHref: '/obclone',
  },
  {
    label: 'Minimally Invasive Surgery', cta: 'Surgery', dark: true, bg: '#16242C',
    tagline: 'Laparoscopic and da Vinci robotic surgery through small incisions. Many patients go home the same day.',
    image: '/davinci/surgery-tile-teal.jpg',
    learnHref: '/misclone',
  },
  {
    label: 'Gynecology', cta: 'Gynecology', dark: false, bg: '#BFCEC7',
    tagline: 'Annual exams, contraception, abnormal bleeding and pelvic pain, at both offices.',
    image: '/services/gyn.jpg',
    learnHref: '/gynclone',
  },
  {
    label: 'Menopause & Hormone Health', cta: 'Hormone health', dark: true, bg: '#2F5665',
    tagline: 'Hot flashes, sleep, mood and bone health, with hormone therapy when it fits you.',
    image: '/services/meno.jpg',
    learnHref: '/hrtclone',
  },
]

// At-a-glance numbers under the intro. Founded 1997; the provider count is
// the seven active physicians plus three APRNs.
const FACTS = [
  { value: `${new Date().getFullYear() - 1997}`, label: 'years at the Beaches' },
  { value: '10', label: 'physicians and nurse practitioners' },
  { value: '2', label: 'offices: Jax Beach and Skinner Parkway' },
  { value: '4.8★', label: 'from 1,517 Google reviews' },
]

const OFFICES = [
  { name: 'Jacksonville Beach', street: '1577 Roberts Drive, Suite 323', city: 'Jacksonville Beach, FL 32250' },
  { name: 'Skinner Parkway', street: '9010 RG Skinner Parkway, Suite 102', city: 'Jacksonville, FL 32256' },
]

function initials(name) {
  return name.split(' ').map(w => w[0]).join('')
}

// One pinned 5-star Google review (4.8★ average across 1,517 reviews),
// chosen because it names the physician and says something specific.
const REVIEWS = { rating: '4.8', count: '1,517', url: 'https://share.google/FYrlh9BwE5FjjqBus' }
const FEATURED_REVIEW = {
  quote: 'He is very methodical and does a great job with simple procedures as well as robotic surgeries. Although he has a lot of patients, he never seems to be in a hurry to get you out the door.',
  author: 'Google review, about Dr. Rodriguez',
}

function Stars({ className = '' }) {
  return (
    <div className={`flex gap-1 ${className}`} aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z" />
        </svg>
      ))}
    </div>
  )
}

export default function MainClonePage() {
  const trackRef = useRef(null)

  function scrollTrack(dir) {
    const el = trackRef.current
    if (el) el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: 'smooth' })
  }

  return (
    <div className="text-on-surface">
      <PracticeHeader />

      {/* ---------- Hero ---------- */}
      <section id="top" className="relative overflow-hidden min-h-[560px] h-[calc(100vh-5rem)] md:h-[calc(100vh-6rem)] max-h-[900px]">
        <img
          src="/hero/newhero.jpg" alt="Three women of different ages walking together on the beach at sunset"
          className="absolute inset-0 w-full h-full object-cover object-[center_55%]"
        />
        {/* Teal scrim keeps the overlaid text readable against the bright sky */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#2c2825]/75 via-[#2c2825]/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2c2825]/40 via-transparent to-transparent" />

        <div className="relative z-10 max-w-[1240px] mx-auto px-5 md:px-10 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="font-headline text-5xl md:text-6xl xl:text-7xl leading-[1.05] text-white">
              We deliver at Baptist Beaches, and we see you at our two
              Jacksonville offices.
            </h1>
            <p className="mt-7 text-lg md:text-xl text-white/85 leading-relaxed max-w-lg">
              Seven physicians and three nurse practitioners. Pregnancy,
              gynecology, robotic surgery and menopause care, with
              Spanish-speaking physicians on staff.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
              <a
                href={APPOINTMENT_URL}
                className="inline-block font-label text-sm bg-surface text-primary px-8 py-4 rounded-full shadow-lift hover:bg-primary-container hover:text-on-primary-container transition"
              >
                Request an appointment
              </a>
              <a href="sms:9044416725" className="text-white/90 underline underline-offset-4 decoration-white/40 hover:decoration-white transition">
                Or text us at (904) 441-6725
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Why Beaches OBGYN ---------- */}
      <section className="relative overflow-hidden glass-band">
        <Starfish className="absolute -top-20 -left-24 w-72 h-72 text-primary-fixed-dim opacity-10 rotate-12 pointer-events-none" />
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 py-12 md:py-16">
          <div className="max-w-3xl">
            <h2 className="font-headline text-3xl md:text-5xl leading-[1.15]">
              Physician-owned since 1997. No hospital system, no private-equity
              owner. The doctors who run the practice are the ones who see you.
            </h2>
            <p className="mt-7 text-on-surface-variant md:text-lg leading-relaxed max-w-2xl">
              We deliver our patients&rsquo; babies at Baptist Beaches Medical
              Center. Three of our physicians have chaired its Women &amp;
              Children Services or led its medical staff. Malinda Moussa, APRN,
              has cared for patients here since 2000.
            </p>
          </div>
          <dl className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 border-t border-outline-variant/50 pt-8">
            {FACTS.map(f => (
              <div key={f.label}>
                <dt className="sr-only">{f.label}</dt>
                <dd>
                  <span className="block font-headline text-4xl md:text-5xl text-primary">{f.value}</span>
                  <span className="mt-2 block text-sm text-on-surface-variant leading-snug">{f.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------- Physicians ---------- */}
      <section id="physicians" className="max-w-[1240px] mx-auto px-5 md:px-10 py-12 md:py-16">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="font-headline text-3xl md:text-5xl leading-[1.15]">The doctors you&rsquo;ll actually see</h2>
            <p className="mt-4 text-on-surface-variant md:text-lg">Two of our physicians see patients in Spanish.</p>
          </div>
          <div className="hidden md:flex gap-3">
            <button
              type="button"
              onClick={() => scrollTrack(-1)}
              aria-label="Previous providers"
              className="w-12 h-12 rounded-full border border-outline-variant text-on-surface hover:bg-primary hover:text-on-primary hover:border-primary transition"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => scrollTrack(1)}
              aria-label="Next providers"
              className="w-12 h-12 rounded-full border border-outline-variant text-on-surface hover:bg-primary hover:text-on-primary hover:border-primary transition"
            >
              →
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="mt-12 flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 -mx-5 pl-8 pr-5 md:mx-0 md:pl-0 md:pr-0 scroll-smooth scroll-pl-8 md:scroll-pl-0"
        >
          {PHYSICIANS.map((d, i) => (
            <article key={d.name} className="snap-start shrink-0 w-72 md:w-80">
              <div className={`aspect-[4/5] ${PORTRAIT_TINTS[i % PORTRAIT_TINTS.length]} relative overflow-hidden flex items-center justify-center`}>
                {d.photo ? (
                  <img
                    src={d.photo}
                    alt={`Portrait of ${d.name}`}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <Starfish className="absolute -bottom-10 -right-10 w-40 h-40 text-primary opacity-[0.07]" />
                    <span className="font-headline text-6xl text-primary/70">{initials(d.name)}</span>
                  </>
                )}
              </div>
              <h3 className="mt-5 font-headline text-xl leading-snug">
                {d.name}, <span className="text-on-surface-variant text-lg">{d.credentials}</span>
              </h3>
              <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">{d.interests}</p>
              {d.tenure && (
                <p className="mt-2 font-label text-[10px] tracking-[0.18em] uppercase text-secondary">{d.tenure}</p>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* ---------- Testimonials ---------- */}
      <section className="relative overflow-hidden bg-primary text-on-primary">
        <Starfish className="absolute -bottom-24 -left-24 w-80 h-80 text-on-primary opacity-[0.06] rotate-12 pointer-events-none" />
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 py-12 md:py-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <h2 className="font-headline text-3xl md:text-5xl leading-[1.15] max-w-xl">
              In our patients&rsquo; words
            </h2>
            <div className="shrink-0">
              <div className="flex items-center gap-3">
                <span className="font-headline text-5xl">{REVIEWS.rating}</span>
                <Stars className="text-secondary-fixed-dim" />
              </div>
              <p className="mt-2 text-sm text-on-primary/70">
                from {REVIEWS.count} Google reviews ·{' '}
                <a href={REVIEWS.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 decoration-on-primary/40 hover:decoration-on-primary hover:text-on-primary transition">
                  Read them on Google &rarr;
                </a>
              </p>
            </div>
          </div>

          <blockquote className="mt-14 max-w-3xl">
            <p className="font-headline text-2xl md:text-4xl leading-[1.3]">
              &ldquo;{FEATURED_REVIEW.quote}&rdquo;
            </p>
            <footer className="mt-6 text-sm text-on-primary/70">
              &mdash; {FEATURED_REVIEW.author}
            </footer>
          </blockquote>
        </div>
      </section>

      {/* ---------- Services (Apple-style tile grid) ---------- */}
      <section id="services" className="glass-band">
        <div className="max-w-[1680px] mx-auto px-0 sm:px-4 md:px-6 py-4 md:py-6">
          <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
            {SERVICES.map(s => (
              <article
                key={s.label}
                style={{ backgroundColor: s.bg }}
                className={`group relative flex flex-col items-center overflow-hidden aspect-[4/5] sm:aspect-square sm:min-h-[30rem] xl:aspect-auto xl:h-[38rem] ${
                  s.dark ? 'text-white' : 'text-on-surface'
                }`}
              >
                <div className="relative z-10 pt-12 md:pt-14 px-6 text-center">
                  <h3 className="font-headline text-3xl md:text-4xl leading-tight">{s.label}</h3>
                  <p className={`mt-3 text-sm md:text-base ${s.dark ? 'text-white/75' : 'text-on-surface-variant'}`}>
                    {s.tagline}
                  </p>
                  <div className="mt-6 flex items-center justify-center">
                    <a
                      href={s.learnHref}
                      className={`font-label text-sm px-6 py-2.5 rounded-full transition ${
                        s.dark
                          ? 'bg-white text-on-surface hover:bg-white/85'
                          : 'bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container'
                      }`}
                    >
                      {s.cta} &rarr;
                    </a>
                  </div>
                </div>
                <div className="relative mt-8 w-full flex-1 min-h-0">
                  {s.cover && (
                    <div
                      className="absolute inset-x-0 top-0 h-16 z-10 pointer-events-none"
                      style={{ background: `linear-gradient(to bottom, ${s.bg}, transparent)` }}
                    />
                  )}
                  <img
                    src={s.image}
                    alt={s.label}
                    loading="lazy"
                    className={`absolute inset-0 w-full h-full object-bottom ${s.cover ? 'object-cover' : 'object-contain'}`}
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Closing CTA ---------- */}
      <section className="max-w-[1240px] mx-auto px-5 md:px-10 py-12 md:py-16">
        <h2 className="font-headline text-3xl md:text-5xl leading-[1.15]">
          Accepting new patients at both offices.
        </h2>
        <div className="mt-10 grid sm:grid-cols-2 gap-8 max-w-3xl">
          {OFFICES.map(o => (
            <div key={o.name} className="border-t border-outline-variant/60 pt-5">
              <h3 className="font-headline text-xl">{o.name}</h3>
              <p className="mt-2 text-on-surface-variant leading-relaxed">
                {o.street}<br />{o.city}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-on-surface-variant">
          Call <a href="tel:9042419775" className="text-primary hover:underline">(904) 241-9775</a>
          {' · '}Text <a href="sms:9044416725" className="text-primary hover:underline">(904) 441-6725</a>
          {' · '}Mon–Thu 9–12 &amp; 2–5, Fri 9–12
        </p>
        <a
          href={APPOINTMENT_URL}
          className="mt-8 inline-block font-label text-sm bg-primary text-on-primary px-8 py-4 rounded-full shadow-lift hover:bg-primary-container hover:text-on-primary-container transition"
        >
          Request an appointment
        </a>
      </section>

      <PracticeFooter />
    </div>
  )
}
