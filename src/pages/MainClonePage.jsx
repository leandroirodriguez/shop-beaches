// Hidden design prototype for the practice website — a reimagining of
// toplinemd.com/beaches-obgyn in the shop's coastal palette and type
// system. Not linked from anywhere; reachable only at /mainclone.

import { useRef, useState } from 'react'
import Starfish from '../components/Starfish'
import { PracticeHeader, PracticeFooter, APPOINTMENT_URL } from '../components/PracticeChrome'

const PHYSICIANS = [
  { name: 'Leandro Rodriguez', photo: '/providers/rodriguez.jpg', credentials: 'MD, FACOG', interests: 'Gynecologic ultrasound, minimally invasive procedures; Chief of Medical Staff at Baptist Beaches', tenure: 'Practicing since 2005' },
  { name: 'Rebekah Richmond', photo: '/providers/richmond.jpg', credentials: 'MD, FACOG', interests: 'Hormone replacement, contraceptive management; Chair, Women & Children Services at Baptist Beaches', tenure: 'Jacksonville native' },
  { name: 'Laura Peter', photo: '/providers/peter.jpg', credentials: 'DO, FACOG', interests: 'Whole-person osteopathic approach to obstetrics and gynecology', tenure: null },
  { name: 'Kimberly Manek', photo: '/providers/manek.jpg', credentials: 'MD, FACOG', interests: 'Gynecologic oncology, comprehensive obstetric care', tenure: null },
  { name: 'Anita Patel', photo: '/providers/patel.jpg', credentials: 'MD, FACOG', interests: 'Minimally invasive surgery, abnormal uterine bleeding, pelvic pain, menopause care', tenure: 'Jacksonville native' },
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
    label: 'Obstetrics', dark: false, bg: '#D9CFC3', zoom: 1.1,
    tagline: 'Personal pregnancy care, from first visit to delivery.',
    image: '/services/pregnancy.jpg',
    learnHref: 'https://www.toplinemd.com/beaches-obgyn/ob-services/',
  },
  {
    label: 'Minimally Invasive Surgery', dark: true, bg: '#16242C', cover: true,
    tagline: 'Advanced laparoscopic and da Vinci robotic techniques.',
    image: '/davinci/surgery-tile-teal.jpg',
    learnHref: '/misclone',
  },
  {
    label: 'Gynecology', dark: false, bg: '#BFCEC7', zoom: 1.1,
    tagline: 'Preventive and wellness care built on lasting relationships.',
    image: '/services/gyn.jpg',
    learnHref: 'https://www.toplinemd.com/beaches-obgyn/gyn-services/',
  },
  {
    label: 'Menopause & Hormone Health', dark: true, bg: '#2F5665', zoom: 1.1,
    tagline: 'Evidence-based hormone therapy, tailored to how you feel.',
    image: '/services/meno.jpg',
    learnHref: 'https://www.toplinemd.com/beaches-obgyn/gyn-services/',
  },
]

function initials(name) {
  return name.split(' ').map(w => w[0]).join('')
}

// Real 5-star reviews drawn from the practice's Google/aggregated patient
// reviews (4.8★ average across 1,517 reviews). Two are picked at random on
// each page load. Attributed to "Verified patient" since reviewer names
// aren't reproduced here.
const REVIEWS = {
  rating: '4.8',
  count: '1,517',
  pool: [
    { quote: 'Dr. Rodriguez and Dr. Peter are amazing, and the staff is always very nice and friendly. They really do care for their patients.', author: 'Verified Google review' },
    { quote: 'Dr. Rodriguez goes above and beyond for his patients. He is a caring and compassionate doctor.', author: 'Verified patient' },
    { quote: 'Dr. Rodriguez has been my OB/GYN for over ten years and I have no complaints. He’s always so attentive, pleasant, and caring — he makes it a much more comfortable experience.', author: 'Verified patient' },
    { quote: 'He is very methodical and does a great job with simple procedures as well as robotic surgeries. Although he has a lot of patients, he never seems to be in a hurry to get you out the door.', author: 'Verified patient' },
    { quote: 'Dr. Manek is one of the best doctors I have ever had — kind, friendly, and knowledgeable. From our first meeting she listened to all of my questions and concerns and answered every one.', author: 'Verified patient' },
    { quote: 'Dr. Manek is a wonderful and attentive OBGYN. She took great care of me and my son during my high-risk pregnancy. I would highly recommend her.', author: 'Verified patient' },
    { quote: 'She made me feel comfortable during my exams. She took the time to ask what my concern was, and her warm, caring personality put me completely at ease.', author: 'Verified patient' },
    { quote: 'I always appreciate the personable yet professional manner. Exams are quick, easy, and efficient, and I love being able to message through the portal if I need anything between visits.', author: 'Verified patient' },
    { quote: 'Dr. Richmond was extraordinarily compassionate and kind, and put me at ease during my very first visit. I truly appreciated the time she spent speaking with me before my exam.', author: 'Verified patient' },
    { quote: 'She made us feel like family and always takes the time to answer all of our questions — we never feel rushed.', author: 'Verified patient' },
    { quote: 'Very much recommend this location for your pregnancy journey and care. The medical staff is fantastic.', author: 'Verified patient' },
    { quote: 'Excellent service — the doctor explains everything and answers any questions you might have.', author: 'Verified patient' },
  ],
}

// The first review stays featured on top; two distinct reviews from the
// rest are chosen at random once per mount for the cards below.
const FEATURED_REVIEW = REVIEWS.pool[0]

function pickTwoReviews() {
  const pool = REVIEWS.pool.slice(1)
  const i = Math.floor(Math.random() * pool.length)
  let j = Math.floor(Math.random() * (pool.length - 1))
  if (j >= i) j += 1
  return [pool[i], pool[j]]
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
  const [shownReviews] = useState(pickTwoReviews)

  function scrollTrack(dir) {
    const el = trackRef.current
    if (el) el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: 'smooth' })
  }

  return (
    <div className="bg-surface text-on-surface">
      <PracticeHeader />

      {/* ---------- Hero ---------- */}
      <section id="top" className="relative overflow-hidden min-h-[560px] h-[calc(100vh-5rem)] md:h-[calc(100vh-6rem)] max-h-[900px]">
        <img
          src="/hero/chapter.jpg"
          alt="A woman walking along the shoreline at sunrise in Jacksonville Beach"
          className="absolute inset-0 w-full h-full object-cover object-[center_35%]"
        />
        {/* Teal scrim keeps the overlaid text readable against the bright sky */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a44]/75 via-[#1e3a44]/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1e3a44]/40 via-transparent to-transparent" />

        <div className="relative z-10 max-w-[1240px] mx-auto px-5 md:px-10 h-full flex items-center">
          <div className="max-w-2xl">
            <p className="font-label text-xs tracking-[0.25em] uppercase text-primary-container mb-6">
              Beaches OBGYN · Jacksonville Beach
            </p>
            <h1 className="font-headline text-5xl md:text-6xl xl:text-7xl leading-[1.05] text-white">
              Women&rsquo;s Healthcare for Every Chapter of Life
            </h1>
            <p className="mt-7 text-lg md:text-xl text-white/85 leading-relaxed max-w-lg">
              Personalized obstetric and gynecologic care from Jacksonville
              Beach&rsquo;s trusted physicians.
            </p>
            <a
              href={APPOINTMENT_URL}
              className="mt-10 inline-block font-label text-xs tracking-[0.2em] uppercase bg-surface text-primary px-8 py-4 rounded-full shadow-lift hover:bg-primary-container hover:text-on-primary-container transition"
            >
              Schedule an Appointment
            </a>
          </div>
        </div>
      </section>

      {/* ---------- Why Beaches OBGYN ---------- */}
      <section className="relative overflow-hidden bg-surface-container-low">
        <Starfish className="absolute -top-20 -left-24 w-72 h-72 text-primary-fixed-dim opacity-10 rotate-12 pointer-events-none" />
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 py-12 md:py-16">
          <div className="max-w-3xl">
            <p className="font-label text-xs tracking-[0.25em] uppercase text-secondary mb-5">Why Beaches OBGYN</p>
            <h2 className="font-headline text-3xl md:text-5xl leading-[1.15]">
              An independent, physician-owned practice caring for the women of
              the Beaches for more than 25 years.
            </h2>
            <p className="mt-7 text-on-surface-variant md:text-lg leading-relaxed max-w-2xl">
              Our physicians live here, practice here, and deliver here — at
              Baptist Beaches Medical Center, minutes from the ocean. From a
              first well-woman visit to delivery day and through menopause, we
              provide comprehensive women&rsquo;s health care built on
              relationships that last.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- Physicians ---------- */}
      <section id="physicians" className="max-w-[1240px] mx-auto px-5 md:px-10 py-12 md:py-16">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="font-label text-xs tracking-[0.25em] uppercase text-secondary mb-5">Our Team</p>
            <h2 className="font-headline text-3xl md:text-5xl leading-[1.15]">Meet Our Physicians</h2>
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

      {/* ---------- Services (Apple-style tile grid) ---------- */}
      <section id="services" className="bg-surface-container-low">
        <div className="max-w-[1680px] mx-auto px-4 md:px-6 py-4 md:py-6">
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
                      className={`font-label text-[11px] tracking-[0.15em] uppercase px-6 py-2.5 rounded-full transition ${
                        s.dark
                          ? 'bg-white text-on-surface hover:bg-white/85'
                          : 'bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container'
                      }`}
                    >
                      Learn more
                    </a>
                  </div>
                </div>
                <div className="relative mt-8 w-full flex-1">
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
                    style={{ '--z': s.zoom || 1, '--zs': Math.min(s.zoom || 1, 1.08) }}
                    className={`w-full h-full object-bottom origin-bottom [transform:scale(var(--zs))] sm:[transform:scale(var(--z))] ${s.cover ? 'object-cover' : 'object-contain'}`}
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Testimonials ---------- */}
      <section className="relative overflow-hidden bg-primary text-on-primary">
        <Starfish className="absolute -bottom-24 -left-24 w-80 h-80 text-on-primary opacity-[0.06] rotate-12 pointer-events-none" />
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 py-12 md:py-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="font-label text-xs tracking-[0.25em] uppercase text-primary-container mb-5">Patient Stories</p>
              <h2 className="font-headline text-3xl md:text-5xl leading-[1.15] max-w-xl">
                Trusted by women across the Beaches.
              </h2>
            </div>
            <div className="shrink-0">
              <div className="flex items-center gap-3">
                <span className="font-headline text-5xl">{REVIEWS.rating}</span>
                <Stars className="text-secondary-fixed-dim" />
              </div>
              <p className="mt-2 font-label text-[11px] tracking-[0.15em] uppercase text-on-primary/70">
                {REVIEWS.count} Google reviews
              </p>
            </div>
          </div>

          <blockquote className="mt-14 max-w-3xl">
            <p className="font-headline text-2xl md:text-4xl leading-[1.3]">
              &ldquo;{FEATURED_REVIEW.quote}&rdquo;
            </p>
            <footer className="mt-6 font-label text-[11px] tracking-[0.2em] uppercase text-on-primary/70">
              {FEATURED_REVIEW.author}
            </footer>
          </blockquote>

          <div className="mt-14 grid md:grid-cols-2 gap-5">
            {shownReviews.map(r => (
              <figure key={r.quote} className="flex flex-col bg-on-primary/[0.06] p-8 md:p-10 border border-on-primary/10">
                <Stars className="text-secondary-fixed-dim mb-5" />
                <blockquote className="font-headline text-xl md:text-2xl leading-[1.4] text-on-primary/95">
                  &ldquo;{r.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 font-label text-[10px] tracking-[0.2em] uppercase text-on-primary/60">
                  {r.author}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Closing CTA ---------- */}
      <section className="max-w-[1240px] mx-auto px-5 md:px-10 py-12 md:py-16 text-center">
        <Starfish className="w-12 h-12 mx-auto mb-6 text-primary" />
        <h2 className="font-headline text-3xl md:text-5xl leading-[1.15]">
          With you every step of the way.
        </h2>
        <a
          href={APPOINTMENT_URL}
          className="mt-10 inline-block font-label text-xs tracking-[0.2em] uppercase bg-primary text-on-primary px-8 py-4 rounded-full shadow-lift hover:bg-primary-container hover:text-on-primary-container transition"
        >
          Schedule an Appointment
        </a>
      </section>

      <PracticeFooter />
    </div>
  )
}
