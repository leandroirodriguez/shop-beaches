// Hidden design prototype — reimagining of the practice's New Patients
// page in the coastal palette and type system. Not linked from anywhere;
// reachable only at /newclone.

import { useEffect } from 'react'
import Starfish from '../components/Starfish'
import { PracticeHeader, PracticeFooter } from '../components/PracticeChrome'

const LIVE_NEW_PATIENTS = 'https://www.toplinemd.com/beaches-obgyn/new-patients/'

const CONTACT_METHODS = [
  {
    label: 'Call Us',
    value: '(904) 241-9775',
    href: 'tel:9042419775',
    text: 'Speak with our front desk during office hours to schedule your first visit.',
  },
  {
    label: 'Text Us',
    value: '(904) 441-6725',
    href: 'sms:9044416725',
    text: 'Send a text and we’ll reply through Klara, our HIPAA-compliant messaging platform.',
  },
  {
    label: 'Message Us',
    value: 'Secure messaging',
    href: LIVE_NEW_PATIENTS,
    text: 'Use the message widget on our site to reach the team — no phone call needed.',
  },
]

const VISIT_STEPS = [
  {
    title: 'Complete your forms ahead of time',
    text: 'Download the new patient package below and fill it out at home, where your records and medication lists are handy.',
  },
  {
    title: 'Arrive 15–20 minutes early',
    text: 'A little cushion lets us verify your information and get you back to the exam room on schedule.',
  },
  {
    title: 'Bring your previous records',
    text: 'Prior medical records help your physician understand your history from the very first visit.',
  },
]

// Real PDFs hosted on the live TopLine MD site. Filenames are verbatim,
// including the "Relase" typo in the medical-records URL (the corrected
// spelling 404s).
const FORMS_BASE = 'https://www.toplinemd.com/beaches-obgyn/wp-content/uploads/sites/166/2021/06'
const FORMS = [
  { name: 'Beaches OBGYN New Patient Package', note: 'The complete intake packet for your first visit.', href: `${FORMS_BASE}/New-Patient-Package-1.pdf` },
  { name: 'Medical Records Release Authorization', note: 'Lets us request records from your previous providers.', href: `${FORMS_BASE}/Medical-Records-Relase.pdf` },
  { name: 'Minor Consent Form', note: 'Required for patients under age 18.', href: `${FORMS_BASE}/Minor-Consent.pdf` },
  { name: 'Baptist Medical Center Beaches Campus Map', note: 'Find your way around the hospital campus.', href: `${FORMS_BASE}/bchCampusMap.pdf` },
  { name: 'Privacy Notice', note: 'How your health information is protected and used.', href: `${FORMS_BASE}/Privacy-Notice.pdf` },
]

export default function NewClonePage() {
  // On a cross-route load to /newclone#appointment the browser's native
  // fragment scroll fires before React renders the section, so scroll
  // ourselves after mount. (Same-page hash clicks still scroll natively.)
  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (!hash) return
    requestAnimationFrame(() => {
      document.getElementById(decodeURIComponent(hash))?.scrollIntoView({ behavior: 'smooth' })
    })
  }, [])

  return (
    <div className="text-on-surface">
      <PracticeHeader />

      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden glass-band">
        <Starfish className="absolute -top-24 -right-24 w-96 h-96 text-primary-fixed-dim opacity-10 rotate-12 pointer-events-none" />
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 py-24 md:py-36">
          <p className="font-label text-xs tracking-[0.25em] uppercase text-secondary mb-6">
            New Patients
          </p>
          <h1 className="font-headline text-4xl md:text-6xl leading-[1.08] max-w-3xl">
            Welcome. We&rsquo;re always happy to meet new patients.
          </h1>
          <p className="mt-8 text-on-surface-variant md:text-lg leading-relaxed max-w-2xl">
            Joining our Jacksonville Beach obstetrics and gynecology practice
            is simple — reach out however you prefer, complete your forms at
            home, and we&rsquo;ll take care of the rest.
          </p>
          <a
            href="#appointment"
            className="mt-10 inline-block font-label text-xs tracking-[0.2em] uppercase bg-primary text-on-primary px-8 py-4 rounded-full shadow-lift hover:bg-primary-container hover:text-on-primary-container transition"
          >
            Request an Appointment
          </a>
        </div>
      </section>

      {/* ---------- Request an appointment ---------- */}
      <section id="appointment" className="max-w-[1240px] mx-auto px-5 md:px-10 py-24 md:py-32">
        <p className="font-label text-xs tracking-[0.25em] uppercase text-secondary mb-5">Request an Appointment</p>
        <h2 className="font-headline text-3xl md:text-5xl leading-[1.15] max-w-2xl">
          Three easy ways to reach us.
        </h2>
        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {CONTACT_METHODS.map(m => (
            <a
              key={m.label}
              href={m.href}
              className="group card-soft p-8 md:p-10 hover:shadow-lift transition"
            >
              <p className="font-label text-[10px] tracking-[0.2em] uppercase text-secondary">{m.label}</p>
              <p className="mt-3 font-headline text-2xl text-primary group-hover:underline">{m.value}</p>
              <div className="w-8 h-px bg-secondary-fixed-dim my-4" />
              <p className="text-sm text-on-surface-variant leading-relaxed">{m.text}</p>
            </a>
          ))}
        </div>
        <p className="mt-8 text-sm text-on-surface-variant max-w-2xl">
          Messages sent on weekdays are typically answered the same day;
          weekend messages are returned Monday morning. All messaging runs on
          Klara, a HIPAA-compliant platform that keeps your information
          private.
        </p>
      </section>

      {/* ---------- First visit ---------- */}
      <section className="relative overflow-hidden glass-band">
        <Starfish className="absolute -bottom-24 -left-24 w-80 h-80 text-primary-fixed-dim opacity-10 -rotate-12 pointer-events-none" />
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 py-24 md:py-32">
          <p className="font-label text-xs tracking-[0.25em] uppercase text-secondary mb-5">Your First Visit</p>
          <h2 className="font-headline text-3xl md:text-5xl leading-[1.15] max-w-2xl">
            Three small steps before you arrive.
          </h2>
          <div className="mt-14 grid md:grid-cols-3 gap-x-12 gap-y-10">
            {VISIT_STEPS.map((s, i) => (
              <div key={s.title} className="border-t border-outline-variant/60 pt-7">
                <span className="font-headline text-3xl text-secondary-fixed-dim">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-4 font-headline text-xl leading-snug">{s.title}</h3>
                <p className="mt-3 text-sm md:text-base text-on-surface-variant leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Forms ---------- */}
      <section className="max-w-[1240px] mx-auto px-5 md:px-10 py-24 md:py-32">
        <p className="font-label text-xs tracking-[0.25em] uppercase text-secondary mb-5">New Patient Forms</p>
        <h2 className="font-headline text-3xl md:text-5xl leading-[1.15] max-w-2xl">
          Everything you need, ready to download.
        </h2>
        <div className="mt-14 grid md:grid-cols-2 gap-5">
          {FORMS.map(f => (
            <a
              key={f.name}
              href={f.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-6 card-soft p-7 hover:shadow-lift transition"
            >
              <span className="shrink-0 w-12 h-12 rounded-full bg-primary-container/60 text-primary flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 4v12m0 0l-4-4m4 4l4-4M5 20h14" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span>
                <span className="block font-headline text-lg leading-snug group-hover:underline">{f.name}</span>
                <span className="block mt-1 text-sm text-on-surface-variant">{f.note}</span>
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* ---------- Closing CTA ---------- */}
      <section className="glass-band">
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 py-24 md:py-32 text-center">
          <Starfish className="w-12 h-12 mx-auto mb-6 text-primary" />
          <h2 className="font-headline text-3xl md:text-5xl leading-[1.15] max-w-2xl mx-auto">
            We look forward to caring for you.
          </h2>
          <a
            href="#appointment"
            className="mt-10 inline-block font-label text-xs tracking-[0.2em] uppercase bg-primary text-on-primary px-8 py-4 rounded-full shadow-lift hover:bg-primary-container hover:text-on-primary-container transition"
          >
            Request an Appointment
          </a>
        </div>
      </section>

      <PracticeFooter />
    </div>
  )
}
