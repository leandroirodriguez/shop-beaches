// Hidden design prototype — reimagining of the practice's GYN Services
// page in the coastal palette and type system. Not linked from anywhere;
// reachable only at /gynclone. Content mirrors the live TopLine MD
// beaches-obgyn/gyn-services page.

import { useState } from 'react'
import Starfish from '../components/Starfish'
import { PracticeHeader, PracticeFooter, APPOINTMENT_URL } from '../components/PracticeChrome'

// The eight service areas listed on the live page, each given a short,
// plain-language description drawn from the practice's own copy.
const SERVICES = [
  {
    title: 'Wellness Exams',
    text: 'Annual well-woman visits for women 18 and older or who are sexually active — Pap smears and pelvic examinations that screen for changes early and keep your routine health on track.',
  },
  {
    title: 'Contraceptive Care',
    text: 'Birth-control matched to your body, lifestyle, and health goals — from the pill to long-acting methods — chosen together after an honest conversation about what fits your life.',
  },
  {
    title: 'Sexual Health & Wellness',
    text: 'Confidential, judgment-free care for intimacy, discomfort, and screening — the kind of unhurried conversation that helps you feel like yourself again.',
  },
  {
    title: 'Hormone Replacement',
    text: 'Patient-specific hormone replacement therapy for menopausal symptoms when indicated — tailored to how you actually feel, not a one-size-fits-all chart.',
  },
  {
    title: 'Adolescent Gynecology & Counseling',
    text: 'A gentle first gynecologic visit for teens — education, reassurance, and honest answers, at a pace that respects where she is.',
  },
  {
    title: 'Infertility',
    text: 'Early evaluation and guidance when conceiving is taking longer than hoped — testing, timelines, and a clear next step forward.',
  },
  {
    title: 'Fibroids',
    text: 'Diagnosis and management of uterine fibroids — from watchful monitoring to minimally invasive treatment when symptoms start to interfere with daily life.',
  },
  {
    title: 'Breast Problems',
    text: 'Evaluation of breast concerns — lumps, pain, and changes — with prompt imaging referrals and follow-through so nothing is left unanswered.',
  },
]

// Screens of the Wellness app, offered to weight-loss patients (the
// gynecology counterpart to the OB Prenatal Guide app).
const APP_SHOTS = [
  { src: '/app/wellness-profile.png', label: 'Nutrition profile', alt: 'Wellness app nutrition profile: daily calorie target, macro distribution, BMR and TDEE' },
  { src: '/app/wellness-meals.png', label: 'Weekly meal plan', alt: 'Wellness app AI-personalized weekly meal plan with per-day calorie and macro totals' },
  { src: '/app/wellness-recipe.png', label: 'Guided recipes', alt: 'Wellness app recipe detail with ingredients, instructions, and per-meal macros' },
  { src: '/app/wellness-outcomes.png', label: 'GLP-1 guidance', alt: 'Wellness app GLP-1 expected outcomes with a 72-week weight projection chart' },
]

const APP_FEATURES = [
  { title: 'Your calorie & macro targets', text: 'A daily calorie goal and protein/carb/fat split, calculated from your own metabolism.' },
  { title: 'AI weekly meal plans', text: 'A full week of meals built to your targets — regenerate any day until it fits your taste.' },
  { title: 'Guided recipes', text: 'Step-by-step recipes with per-meal calories and macros, so cooking to plan is simple.' },
  { title: 'GLP-1 guidance', text: 'Clear, clinical information on GLP-1 medications — expected outcomes, dosing, and side effects.' },
  { title: 'Progress tracking', text: 'See your weight trajectory over time against evidence-based projections.' },
  { title: 'One tap to reach us', text: 'Message the practice directly from the app whenever a question comes up.' },
]

// Simulated iPhone: brushed-silver titanium bezel, rounded screen, island
function PhoneFrame({ src, label, alt }) {
  return (
    <figure className="flex flex-col items-center w-full">
      <div className="relative w-full rounded-[2.2rem] bg-gradient-to-b from-[#dfe2e6] via-[#b9bdc3] to-[#cfd2d7] p-[1.6%] shadow-[0_30px_60px_-18px_rgba(0,0,0,0.5)] ring-1 ring-black/20">
        <div className="relative overflow-hidden rounded-[1.95rem] bg-black ring-1 ring-black/60">
          <img src={src} alt={alt} loading="lazy" className="block w-full" />
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

export default function GynClonePage() {
  const [activeShot, setActiveShot] = useState(0)
  const n = APP_SHOTS.length

  return (
    <div className="bg-surface text-on-surface">
      <PracticeHeader />

      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden min-h-[560px] h-[60vh] max-h-[680px]">
        <img
          src="/hero/gynhero.jpg"
          alt="A woman standing on the beach at sunset"
          className="absolute inset-0 w-full h-full object-cover object-[center_45%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2c2825]/80 via-[#2c2825]/45 to-[#2c2825]/10" />
        <div className="relative z-10 max-w-[1240px] mx-auto px-5 md:px-10 h-full flex items-center">
          <div className="max-w-2xl">
            <p className="font-label text-xs tracking-[0.25em] uppercase text-primary-container mb-6">
              Services · Gynecology
            </p>
            <h1 className="font-headline text-4xl md:text-5xl xl:text-6xl leading-[1.08] text-white">
              Gynecology in Jacksonville Beach, Florida
            </h1>
            <p className="mt-6 text-lg text-white/85 leading-relaxed max-w-lg">
              A full range of gynecologic care for women of every age — from
              your first visit through menopause, with physicians who know you
              by name.
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

      {/* ---------- Services ---------- */}
      <section className="max-w-[1240px] mx-auto px-5 md:px-10 py-12 md:py-16">
        <p className="font-label text-xs tracking-[0.25em] uppercase text-secondary mb-5">Care for Every Age</p>
        <h2 className="font-headline text-3xl md:text-5xl leading-[1.15] max-w-2xl">
          Everything you need, under one roof.
        </h2>
        <p className="mt-6 text-on-surface-variant md:text-lg leading-relaxed max-w-2xl">
          Whether it&rsquo;s a routine annual visit or a concern that&rsquo;s
          been on your mind, our physicians offer the full range of gynecologic
          services — the same trusted faces, from your teens through menopause.
        </p>
        <div className="mt-12 grid md:grid-cols-2 gap-x-16 gap-y-10">
          {SERVICES.map(s => (
            <div key={s.title} className="border-t border-outline-variant/60 pt-7">
              <h3 className="font-headline text-xl leading-snug">{s.title}</h3>
              <p className="mt-3 text-sm md:text-base text-on-surface-variant leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Minimally invasive surgery band ---------- */}
      <section className="relative overflow-hidden bg-primary text-on-primary">
        <Starfish className="absolute -bottom-32 -right-28 w-[26rem] h-[26rem] text-on-primary opacity-[0.05] rotate-12 pointer-events-none" />
        {/* Right padding removed on md+ so the instrument bleeds to the
            viewport edge; the 1728px cap restores a margin on very wide
            screens, making the tool look like it exits the window border */}
        <div className="max-w-[1728px] mx-auto px-5 md:pl-10 md:pr-0 py-16 md:py-24 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="max-w-xl md:pr-4">
            <p className="font-label text-xs tracking-[0.25em] uppercase text-primary-container mb-5">
              When Surgery Is the Answer
            </p>
            <h2 className="font-headline text-3xl md:text-5xl leading-[1.15]">
              Minimally invasive, by design.
            </h2>
            <p className="mt-6 text-on-primary/80 md:text-lg leading-relaxed">
              When a procedure is needed, our surgeons work through the smallest
              possible openings — laparoscopic tools and da Vinci robotic
              assistance — for less scarring, less pain, and a faster return to
              your life.
            </p>
            <a
              href="/misclone"
              className="mt-10 inline-block font-label text-xs tracking-[0.2em] uppercase bg-white text-primary px-8 py-4 rounded-full shadow-lift hover:bg-primary-container hover:text-on-primary-container transition"
            >
              Explore Minimally Invasive Surgery
            </a>
          </div>
          <div className="relative -mr-5 md:mr-0">
            {/* Transparent cutout, anchored right so it runs off the edge.
                The -mr-5 cancels the container's px-5 right padding on mobile
                so the instrument bleeds to the screen edge there too (md+
                already bleeds via the container's pr-0). */}
            <img
              src="/davinci/vessel-sealer-cutout.png"
              alt="A da Vinci robotic surgical instrument"
              loading="lazy"
              className="w-full object-contain object-right [filter:drop-shadow(0_25px_35px_rgba(0,0,0,0.35))]"
            />
          </div>
        </div>
      </section>

      {/* ---------- Wellness & weight-loss program ----------
          NOTE: body copy is placeholder — the source Facebook post is
          behind a login wall. Replace with the program's real specifics
          (what's included, eligibility, any medications) before publish. */}
      <section className="bg-surface-container-low">
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 py-12 md:py-16 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <figure className="max-w-sm mx-auto md:mx-0 w-full">
            <img
              src="/providers/dorsey.jpg"
              alt="Katherine Dorsey, wellness and weight-loss program lead"
              loading="lazy"
              className="w-full aspect-square object-cover rounded-2xl shadow-lift"
            />
            <figcaption className="mt-4">
              <p className="font-headline text-lg leading-snug">Katherine Dorsey</p>
              <p className="mt-0.5 text-sm text-on-surface-variant">Wellness &amp; Weight-Loss Program Lead</p>
            </figcaption>
          </figure>
          <div>
            <p className="font-label text-xs tracking-[0.25em] uppercase text-secondary mb-5">Wellness &amp; Weight Loss</p>
            <h2 className="font-headline text-3xl md:text-5xl leading-[1.15]">
              Weight management isn&rsquo;t one-size-fits-all.
            </h2>
            <p className="mt-6 text-on-surface-variant md:text-lg leading-relaxed">
              Our wellness and weight-loss program, led by Katherine Dorsey,
              pairs you with a dedicated provider to build a plan around your
              body, your history, and your goals — medically supervised,
              sustainable, and designed for how you actually live.
            </p>
            <p className="mt-4 text-on-surface-variant md:text-lg leading-relaxed">
              It&rsquo;s a whole-person approach that fits naturally alongside
              your gynecologic care, so the team guiding your wellness already
              knows your health story.
            </p>
            <a
              href={APPOINTMENT_URL}
              className="mt-10 inline-block font-label text-xs tracking-[0.2em] uppercase bg-primary text-on-primary px-8 py-4 rounded-full shadow-lift hover:bg-primary-container hover:text-on-primary-container transition"
            >
              Request an Appointment
            </a>
          </div>
        </div>
      </section>

      {/* ---------- Wellness app showcase (mirrors the OB Prenatal Guide) ---------- */}
      <section className="relative overflow-hidden bg-primary text-on-primary">
        <Starfish className="absolute -bottom-32 -left-28 w-[26rem] h-[26rem] text-on-primary opacity-[0.05] -rotate-12 pointer-events-none" />
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 py-16 md:py-24">
          {/* Centered intro */}
          <div className="max-w-2xl mx-auto text-center">
            <p className="font-label text-xs tracking-[0.25em] uppercase text-primary-container mb-5">
              For Our Patients
            </p>
            <h2 className="font-headline text-3xl md:text-5xl leading-[1.15]">
              The Beaches OBGYN Wellness app, in your pocket.
            </h2>
            <p className="mt-6 text-on-primary/80 md:text-lg leading-relaxed">
              Just like our Prenatal Guide, every wellness and weight-loss
              patient gets our companion app — a personalized, physician-guided
              plan for nutrition, meals, and GLP-1 care, built by the team that
              already knows your health story.
            </p>
          </div>

          {/* Desktop: even aligned row */}
          <div className="mt-16 hidden md:flex justify-center items-start gap-5 lg:gap-8 max-w-5xl mx-auto">
            {APP_SHOTS.map(s => (
              <PhoneFrame key={s.src} src={s.src} label={s.label} alt={s.alt} />
            ))}
          </div>

          {/* Mobile: overlapping carousel — center phone in front, neighbors peek */}
          <div className="mt-12 md:hidden">
            <div className="relative mx-auto max-w-[20rem] h-[32rem]">
              {APP_SHOTS.map((s, i) => {
                const rel = (i - activeShot + n) % n // 0 active, 1 right, n-1 left
                const isActive = rel === 0
                const isRight = rel === 1
                const isLeft = rel === n - 1
                if (!isActive && !isRight && !isLeft) {
                  return (
                    <div
                      key={s.src}
                      className="absolute top-1/2 left-1/2 opacity-0 pointer-events-none"
                      style={{ transform: 'translate(-50%, -50%) scale(0.9)' }}
                      aria-hidden="true"
                    >
                      <PhoneFrame src={s.src} alt={s.alt} />
                    </div>
                  )
                }
                const offset = isRight ? 60 : -60
                return (
                  <div
                    key={s.src}
                    className={`absolute top-1/2 left-1/2 transition-all duration-300 ease-out ${
                      isActive ? 'z-20 w-[64%]' : 'z-10 w-[58%] opacity-40'
                    }`}
                    style={{
                      transform: isActive
                        ? 'translate(-50%, -50%)'
                        : `translate(calc(-50% + ${offset}%), -50%) scale(0.9)`,
                    }}
                    aria-hidden={!isActive}
                  >
                    <PhoneFrame src={s.src} alt={s.alt} />
                  </div>
                )
              })}
            </div>

            {/* Carousel controls */}
            <div className="mt-8 flex items-center justify-center gap-5">
              <button
                type="button"
                onClick={() => setActiveShot((activeShot + n - 1) % n)}
                aria-label="Previous screen"
                className="w-11 h-11 rounded-full bg-white text-primary flex items-center justify-center shadow-lift hover:bg-primary-container transition"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <div className="flex gap-2">
                {APP_SHOTS.map((s, i) => (
                  <button
                    key={s.src}
                    type="button"
                    onClick={() => setActiveShot(i)}
                    aria-label={`Show ${s.label}`}
                    className={`w-2 h-2 rounded-full transition ${i === activeShot ? 'bg-primary-container' : 'bg-on-primary/30'}`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => setActiveShot((activeShot + 1) % n)}
                aria-label="Next screen"
                className="w-11 h-11 rounded-full bg-white text-primary flex items-center justify-center shadow-lift hover:bg-primary-container transition"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
            <p className="mt-6 text-center font-label text-[11px] tracking-[0.18em] uppercase text-on-primary/80">
              {APP_SHOTS[activeShot].label}
            </p>
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
            Free for wellness patients — ask for your invite at your first visit.
          </p>
        </div>
      </section>

      {/* ---------- Closing CTA ---------- */}
      <section className="max-w-[1240px] mx-auto px-5 md:px-10 py-12 md:py-16 text-center">
        <Starfish className="w-12 h-12 mx-auto mb-6 text-primary" />
        <h2 className="font-headline text-3xl md:text-5xl leading-[1.15] max-w-2xl mx-auto">
          Your health deserves a familiar face.
        </h2>
        <p className="mt-6 text-on-surface-variant md:text-lg leading-relaxed max-w-xl mx-auto">
          Schedule your visit at either of our Jacksonville Beach offices — call{' '}
          <a href="tel:+19042419775" className="text-primary underline-offset-2 hover:underline">(904) 241-9775</a>{' '}
          or request an appointment online.
        </p>
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
