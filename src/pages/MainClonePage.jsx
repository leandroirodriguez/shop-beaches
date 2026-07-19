// Hidden design prototype for the practice website — a reimagining of
// toplinemd.com/beaches-obgyn in the shop's coastal palette and type
// system. Not linked from anywhere; reachable only at /mainclone.

import { useRef } from 'react'
import Starfish from '../components/Starfish'
import { PracticeHeader, PracticeFooter, APPOINTMENT_URL } from '../components/PracticeChrome'

const PILLARS = [
  { title: 'Obstetrics', text: 'Attentive prenatal care through delivery and beyond, with our physicians beside you at Baptist Beaches.' },
  { title: 'Gynecology', text: 'Annual wellness, preventive screenings, and thoughtful treatment for every stage of your health.' },
  { title: 'Surgery', text: 'Advanced minimally invasive and robotic techniques that mean smaller incisions and faster recoveries.' },
  { title: 'Menopause & Hormonal Health', text: 'Evidence-based guidance and hormone therapy tailored to how you want to feel.' },
]

const PHYSICIANS = [
  { name: 'John Bordelon', credentials: 'MD, FACOG', interests: 'Endometrial ablation, laparoscopy, hysteroscopy, da Vinci robotic surgery', tenure: 'With the practice since 1991' },
  { name: 'Kimberly Manek', credentials: 'MD, FACOG', interests: 'Gynecologic oncology, comprehensive obstetric care', tenure: null },
  { name: 'Laura Peter', credentials: 'DO, FACOG', interests: 'Whole-person osteopathic approach to obstetrics and gynecology', tenure: null },
  { name: 'Anita Patel', credentials: 'MD, FACOG', interests: 'Minimally invasive surgery, abnormal uterine bleeding, pelvic pain, menopause care', tenure: 'Jacksonville native' },
  { name: 'Rebekah Richmond', credentials: 'MD, FACOG', interests: 'Hormone replacement, contraceptive management; Chair, Women & Children Services at Baptist Beaches', tenure: 'Jacksonville native' },
  { name: 'Leandro Rodriguez', credentials: 'MD, FACOG', interests: 'Gynecologic ultrasound, minimally invasive procedures; Chief of Medical Staff at Baptist Beaches', tenure: 'Practicing since 2005' },
  { name: 'Joana Fischer', credentials: 'MD', interests: 'Menstrual health education, family planning · Bilingual, English & Spanish', tenure: null },
  { name: 'Rakiya Miller', credentials: 'MD', interests: 'Minimally invasive gynecology — AAGL Excellence Award recipient', tenure: null },
  { name: 'Malinda Moussa', credentials: 'APRN', interests: 'Comprehensive women’s healthcare across every stage of life', tenure: 'With the practice since 2000' },
  { name: 'Gabrielle Ahrens', credentials: 'APRN', interests: 'Labor and delivery, postpartum support — DAISY Award recipient, 2024', tenure: null },
  { name: 'Katherine Dorsey', credentials: 'APRN', interests: 'Maternal and newborn care; former Director, Maternal Newborn Service Line', tenure: '15+ years in healthcare' },
]

// Soft neutral portrait backdrops, cycled across the carousel
const PORTRAIT_TINTS = ['bg-primary-container/50', 'bg-secondary-container/60', 'bg-tertiary-container/70']

const SERVICES = [
  { label: 'Obstetrics', image: '/categories/pregnancy.webp', text: 'From your first ultrasound to delivery day at Baptist Beaches, our physicians guide every pregnancy personally — no rotating strangers, no surprises.' },
  { label: 'Gynecology', image: '/categories/nutrition.webp', text: 'Preventive care, screenings, and treatment delivered with unhurried attention, in a practice built around long-term relationships.' },
  { label: 'Minimally Invasive Surgery', image: '/categories/pcos.webp', text: 'Laparoscopic, hysteroscopic, and da Vinci robotic techniques that shorten recovery and keep you close to home.' },
  { label: 'Menopause Care', image: '/categories/perimenopause.webp', text: 'A calm, evidence-based path through perimenopause and beyond — sleep, mood, and vitality included.' },
  { label: 'Hormone Therapy', image: '/categories/trtsupport.webp', text: 'Individualized hormone replacement designed around your labs, your symptoms, and your goals.' },
]

function initials(name) {
  return name.split(' ').map(w => w[0]).join('')
}

export default function MainClonePage() {
  const trackRef = useRef(null)

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
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 py-24 md:py-32">
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

          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PILLARS.map(p => (
              <div key={p.title} className="bg-surface-container-lowest rounded-lg shadow-lift p-8">
                <h3 className="font-headline text-xl leading-snug">{p.title}</h3>
                <div className="w-8 h-px bg-secondary-fixed-dim my-4" />
                <p className="text-sm text-on-surface-variant leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Physicians ---------- */}
      <section id="physicians" className="max-w-[1240px] mx-auto px-5 md:px-10 py-24 md:py-32">
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
          className="mt-12 flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 -mx-5 px-5 md:mx-0 md:px-0 scroll-smooth"
        >
          {PHYSICIANS.map((d, i) => (
            <article key={d.name} className="snap-start shrink-0 w-72 md:w-80">
              <div className={`aspect-[4/5] rounded-lg ${PORTRAIT_TINTS[i % PORTRAIT_TINTS.length]} relative overflow-hidden flex items-center justify-center`}>
                <Starfish className="absolute -bottom-10 -right-10 w-40 h-40 text-primary opacity-[0.07]" />
                <span className="font-headline text-6xl text-primary/70">{initials(d.name)}</span>
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

      {/* ---------- Services ---------- */}
      <section id="services" className="bg-surface-container-low">
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 py-24 md:py-32">
          <p className="font-label text-xs tracking-[0.25em] uppercase text-secondary mb-5">Services</p>
          <h2 className="font-headline text-3xl md:text-5xl leading-[1.15] max-w-2xl">
            Comprehensive care, delivered personally.
          </h2>

          <div className="mt-16 space-y-20">
            {SERVICES.map((s, i) => (
              <div key={s.label} className={`grid md:grid-cols-2 gap-8 md:gap-16 items-center ${i % 2 ? 'md:[direction:rtl]' : ''}`}>
                <div className="[direction:ltr]">
                  <img src={s.image} alt={s.label} className="rounded-lg shadow-lift w-full aspect-[4/3] object-cover" />
                </div>
                <div className="[direction:ltr]">
                  <h3 className="font-label text-sm tracking-[0.25em] uppercase text-primary">{s.label}</h3>
                  <div className="w-10 h-px bg-secondary-fixed-dim my-5" />
                  <p className="text-on-surface-variant md:text-lg leading-relaxed max-w-md">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Closing CTA ---------- */}
      <section className="max-w-[1240px] mx-auto px-5 md:px-10 py-24 md:py-32 text-center">
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
