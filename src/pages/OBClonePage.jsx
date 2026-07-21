// Hidden design prototype — reimagining of the practice's OB Services
// page in the coastal palette and type system, plus a showcase of the
// Beaches OBGYN Prenatal Guide app. Not linked from anywhere; reachable
// only at /obclone.

import Starfish from '../components/Starfish'
import { PracticeHeader, PracticeFooter, APPOINTMENT_URL } from '../components/PracticeChrome'

const JOURNEY = [
  {
    title: 'Prenatal Care',
    text: 'Regular visits with your obstetrician from the first confirmation onward — ultrasounds in the first and second trimesters, and routine lab screenings that watch for complications and genetic conditions before they become surprises.',
  },
  {
    title: 'Personal Care',
    text: 'You meet the whole delivery team during your prenatal visits, so the face beside you on delivery day is one you already know. No rotating strangers — that is the point of an independent practice.',
  },
  {
    title: 'Delivery at Baptist Beaches',
    text: 'Our physicians deliver at Baptist Medical Center Beaches in renovated private suites with home-like comforts — rocking chair, sleeper sofa for your partner — equipped for everything from labor through postpartum care.',
  },
  {
    title: 'Our Philosophy',
    text: 'Doctors with more than twenty years of OBGYN experience, balancing modern medicine with a calm, unhurried approach to every pregnancy.',
  },
]

const APP_FEATURES = [
  { title: 'Week-by-week tracker', text: 'Gestational age, due-date countdown, and how your baby is growing — updated every day.' },
  { title: 'Your visit timeline', text: 'Every appointment, lab, and ultrasound mapped by week, from your first OB visit to your anatomy scan and beyond.' },
  { title: 'Medication safety guide', text: 'Searchable, trimester-aware guidance on which everyday medications are safe — and which to avoid.' },
  { title: 'Tools for the big moments', text: 'A contraction timer and kick counter, plus diet guidance for every stage.' },
  { title: 'One tap to reach us', text: 'Call or message the practice directly from the app whenever a question comes up.' },
]

const SCREENSHOTS = [
  { src: '/app/home.png', label: 'Track your week', alt: 'Prenatal Guide home screen showing gestational age, due date, and baby size' },
  { src: '/app/timeline.png', label: 'Visit timeline', alt: 'Timeline screen mapping prenatal visits, labs, and ultrasounds week by week' },
  { src: '/app/meds.png', label: 'Medication guide', alt: 'Medication guide screen listing safe options and medications to avoid' },
]

const DELIVERY_TEAM = [
  { name: 'Leandro Rodriguez', credentials: 'MD, FACOG', photo: '/providers/rodriguez.jpg' },
  { name: 'Laura Peter', credentials: 'DO, FACOG', photo: '/providers/peter.jpg' },
  { name: 'Kimberly Manek', credentials: 'MD, FACOG', photo: '/providers/manek.jpg' },
  { name: 'Anita Patel', credentials: 'MD, FACOG', photo: '/providers/patel.jpg' },
  { name: 'Joana Fischer', credentials: 'MD', photo: '/providers/fischer.jpg' },
  { name: 'Rakiya Miller', credentials: 'MD, FACOG', photo: '/providers/miller.jpg' },
]

// Simulated iPhone: brushed-silver titanium bezel, rounded screen, island
function PhoneFrame({ src, label, alt }) {
  return (
    <figure className="flex flex-col items-center w-full">
      {/* Thin titanium rail → hairline black edge → screen */}
      <div className="relative w-full rounded-[2.2rem] bg-gradient-to-b from-[#dfe2e6] via-[#b9bdc3] to-[#cfd2d7] p-[1.6%] shadow-[0_30px_60px_-18px_rgba(0,0,0,0.5)] ring-1 ring-black/20">
        <div className="relative overflow-hidden rounded-[1.95rem] bg-black ring-1 ring-black/60">
          <img src={src} alt={alt} loading="lazy" className="block w-full" />
          {/* Dynamic island */}
          <div className="absolute top-[2.5%] left-1/2 -translate-x-1/2 h-[3.5%] w-[32%] rounded-full bg-black" />
        </div>
      </div>
      {label && (
        <figcaption className="mt-5 font-label text-[11px] tracking-[0.18em] uppercase text-on-primary/70">
          {label}
        </figcaption>
      )}
    </figure>
  )
}

export default function OBClonePage() {
  return (
    <div className="bg-surface text-on-surface">
      <PracticeHeader />

      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden min-h-[420px] h-[55vh] max-h-[640px]">
        <img
          src="/hero/obhero.jpg"
          alt="An expectant mother standing on the shoreline at sunset"
          className="absolute inset-0 w-full h-full object-cover object-[center_40%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a44]/80 via-[#1e3a44]/45 to-[#1e3a44]/10" />
        <div className="relative z-10 max-w-[1240px] mx-auto px-5 md:px-10 h-full flex items-center">
          <div className="max-w-2xl">
            <p className="font-label text-xs tracking-[0.25em] uppercase text-primary-container mb-6">
              Services · Obstetrics
            </p>
            <h1 className="font-headline text-4xl md:text-5xl xl:text-6xl leading-[1.08] text-white">
              Obstetrics in Jacksonville Beach, Florida
            </h1>
            <p className="mt-6 text-lg text-white/85 leading-relaxed max-w-lg">
              VIP prenatal care from physicians who know you by name — from
              your first visit to delivery day at Baptist Beaches.
            </p>
            <a
              href={APPOINTMENT_URL}
              className="mt-10 inline-block font-label text-xs tracking-[0.2em] uppercase bg-surface text-primary px-8 py-4 rounded-full shadow-lift hover:bg-primary-container hover:text-on-primary-container transition"
            >
              Request an Appointment
            </a>
          </div>
        </div>
      </section>

      {/* ---------- The journey ---------- */}
      <section className="max-w-[1240px] mx-auto px-5 md:px-10 py-12 md:py-16">
        <p className="font-label text-xs tracking-[0.25em] uppercase text-secondary mb-5">Your Pregnancy, Cared For</p>
        <h2 className="font-headline text-3xl md:text-5xl leading-[1.15] max-w-2xl">
          Every step, with the same trusted team.
        </h2>
        <div className="mt-12 grid md:grid-cols-2 gap-x-16 gap-y-10">
          {JOURNEY.map(j => (
            <div key={j.title} className="border-t border-outline-variant/60 pt-7">
              <h3 className="font-headline text-xl leading-snug">{j.title}</h3>
              <p className="mt-3 text-sm md:text-base text-on-surface-variant leading-relaxed">{j.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Delivery team ---------- */}
      <section className="bg-surface-container-low">
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 py-12 md:py-16">
          <p className="font-label text-xs tracking-[0.25em] uppercase text-secondary mb-5">Your Delivery Team</p>
          <h2 className="font-headline text-3xl md:text-5xl leading-[1.15] max-w-2xl">
            The only faces you&rsquo;ll see on delivery day.
          </h2>
          <p className="mt-6 text-on-surface-variant md:text-lg leading-relaxed max-w-2xl">
            These six physicians practice obstetrics at Baptist Beaches — and
            you&rsquo;ll meet each of them during your prenatal visits, so
            whoever is on call when your baby arrives is already someone you
            know.
          </p>
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5">
            {DELIVERY_TEAM.map(d => (
              <div key={d.name}>
                <img
                  src={d.photo}
                  alt={`Portrait of ${d.name}`}
                  loading="lazy"
                  className="w-full aspect-[4/5] object-cover shadow-lift"
                />
                <h3 className="mt-4 font-headline text-lg leading-snug">{d.name}</h3>
                <p className="mt-0.5 text-sm text-on-surface-variant">{d.credentials}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Prenatal Guide app ---------- */}
      <section className="relative overflow-hidden bg-primary text-on-primary">
        <Starfish className="absolute -bottom-32 -left-28 w-[26rem] h-[26rem] text-on-primary opacity-[0.05] -rotate-12 pointer-events-none" />
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 py-16 md:py-24">
          {/* Centered intro */}
          <div className="max-w-2xl mx-auto text-center">
            <p className="font-label text-xs tracking-[0.25em] uppercase text-primary-container mb-5">
              For Our Patients
            </p>
            <h2 className="font-headline text-3xl md:text-5xl leading-[1.15]">
              The Beaches OBGYN Prenatal Guide, in your pocket.
            </h2>
            <p className="mt-6 text-on-primary/80 md:text-lg leading-relaxed">
              Every Beaches OBGYN patient gets our Prenatal Guide app — a calm,
              week-by-week companion for your entire pregnancy, built by the
              physicians who will deliver your baby.
            </p>
          </div>

          {/* Even row of three phones, aligned */}
          <div className="mt-16 flex justify-center items-start gap-4 sm:gap-6 md:gap-10 max-w-3xl mx-auto">
            {SCREENSHOTS.map(s => (
              <PhoneFrame key={s.src} src={s.src} label={s.label} alt={s.alt} />
            ))}
          </div>

          {/* Feature grid */}
          <dl className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-8 max-w-4xl mx-auto">
            {APP_FEATURES.map(f => (
              <div key={f.title} className="flex gap-4">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary-container shrink-0" />
                <div>
                  <dt className="font-headline text-lg leading-snug">{f.title}</dt>
                  <dd className="mt-1 text-sm text-on-primary/70 leading-relaxed">{f.text}</dd>
                </div>
              </div>
            ))}
          </dl>

          <p className="mt-12 text-center text-sm text-on-primary/70">
            Free for patients — ask for your invite at your first prenatal visit.
          </p>
        </div>
      </section>

      {/* ---------- Closing CTA ---------- */}
      <section className="max-w-[1240px] mx-auto px-5 md:px-10 py-12 md:py-16 text-center">
        <Starfish className="w-12 h-12 mx-auto mb-6 text-primary" />
        <h2 className="font-headline text-3xl md:text-5xl leading-[1.15] max-w-2xl mx-auto">
          Expecting? We&rsquo;d be honored to care for you.
        </h2>
        <a
          href={APPOINTMENT_URL}
          className="mt-10 inline-block font-label text-xs tracking-[0.2em] uppercase bg-primary text-on-primary px-8 py-4 rounded-full shadow-lift hover:bg-primary-container hover:text-on-primary-container transition"
        >
          Request an Appointment
        </a>
      </section>

      <PracticeFooter />
    </div>
  )
}
