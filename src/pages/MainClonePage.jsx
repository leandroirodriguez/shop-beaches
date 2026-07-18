// Hidden design prototype for the practice website — a reimagining of
// toplinemd.com/beaches-obgyn in the shop's coastal palette and type
// system. Not linked from anywhere; reachable only at /mainclone.

import { useRef, useState } from 'react'
import logo from '../assets/logo.svg'
import Starfish from '../components/Starfish'

const NAV = [
  { label: 'About', href: 'https://www.toplinemd.com/beaches-obgyn/about/' },
  {
    label: 'Services',
    href: '#services',
    children: [
      { label: 'GYN Services', href: 'https://www.toplinemd.com/beaches-obgyn/gyn-services/' },
      { label: 'OB Services', href: 'https://www.toplinemd.com/beaches-obgyn/ob-services/' },
      { label: 'Minimally Invasive Surgery', href: 'https://www.toplinemd.com/beaches-obgyn/minimally-invasive-surgery/' },
    ],
  },
  { label: 'Our Team', href: '#physicians' },
  {
    label: 'Patient Resources',
    href: 'https://www.toplinemd.com/beaches-obgyn/new-patients/',
    children: [
      { label: 'Blog', href: 'https://www.toplinemd.com/beaches-obgyn/blog/' },
      { label: 'New Patients', href: 'https://www.toplinemd.com/beaches-obgyn/new-patients/' },
      { label: 'Terms and Policies', href: 'https://www.toplinemd.com/practice-terms-policies/' },
    ],
  },
  { label: 'Shop', href: 'https://shop.beachesobgyn.com/' },
  { label: 'Pay My Bill', href: 'https://www.toplinemd.com/beaches-obgyn/' },
  { label: 'Contact', href: 'https://www.toplinemd.com/beaches-obgyn/contact/' },
]

const APPOINTMENT_URL = 'https://www.toplinemd.com/beaches-obgyn/new-patients/#appoitment'

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
  const [menuOpen, setMenuOpen] = useState(false)
  const trackRef = useRef(null)

  function scrollTrack(dir) {
    const el = trackRef.current
    if (el) el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: 'smooth' })
  }

  return (
    <div className="bg-surface text-on-surface">
      {/* ---------- Navigation ---------- */}
      <header className="sticky top-0 z-40 bg-surface-container-lowest/95 backdrop-blur border-b border-outline-variant/40">
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 h-20 md:h-24 flex items-center gap-6">
          <a href="#top" aria-label="Beaches OBGYN">
            <img src={logo} alt="Beaches OBGYN" className="block h-12 md:h-14 w-auto" />
          </a>

          <nav className="hidden lg:flex items-center gap-6 ml-auto">
            {NAV.map(item => (
              <div key={item.label} className="relative group">
                <a
                  href={item.href}
                  className="font-label text-[11px] tracking-[0.18em] uppercase text-on-surface hover:text-primary transition whitespace-nowrap"
                >
                  {item.label}
                </a>
                {item.children && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
                    <div className="bg-surface-container-lowest shadow-lift rounded-lg border border-outline-variant/40 py-2 min-w-56">
                      {item.children.map(c => (
                        <a
                          key={c.label}
                          href={c.href}
                          className="block px-5 py-2.5 font-label text-[11px] tracking-[0.12em] uppercase text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition whitespace-nowrap"
                        >
                          {c.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <a
              href={APPOINTMENT_URL}
              className="font-label text-[11px] tracking-[0.18em] uppercase bg-primary text-on-primary px-5 py-3 rounded-full hover:bg-primary-container hover:text-on-primary-container transition whitespace-nowrap"
            >
              Request an Appointment
            </a>
          </nav>

          <button
            type="button"
            className="lg:hidden ml-auto p-2 text-on-surface"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen(o => !o)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {menuOpen
                ? <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                : <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <nav className="lg:hidden border-t border-outline-variant/40 bg-surface-container-lowest px-5 py-4">
            {NAV.map(item => (
              <div key={item.label} className="py-1">
                <a href={item.href} onClick={() => setMenuOpen(false)} className="block py-2 font-label text-xs tracking-[0.18em] uppercase text-on-surface">
                  {item.label}
                </a>
                {item.children?.map(c => (
                  <a key={c.label} href={c.href} onClick={() => setMenuOpen(false)} className="block py-1.5 pl-4 font-label text-[11px] tracking-[0.12em] uppercase text-on-surface-variant">
                    {c.label}
                  </a>
                ))}
              </div>
            ))}
            <a href={APPOINTMENT_URL} className="mt-3 inline-block font-label text-xs tracking-[0.18em] uppercase bg-primary text-on-primary px-5 py-3 rounded-full">
              Request an Appointment
            </a>
          </nav>
        )}
      </header>

      {/* ---------- Hero ---------- */}
      <section id="top" className="relative overflow-hidden">
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 grid lg:grid-cols-2 items-center gap-10 lg:gap-16 py-14 lg:py-0">
          <div className="lg:py-28 relative z-10">
            <p className="font-label text-xs tracking-[0.25em] uppercase text-secondary mb-6">
              Beaches OBGYN · Jacksonville Beach
            </p>
            <h1 className="font-headline text-5xl md:text-6xl xl:text-7xl leading-[1.05] text-on-surface">
              Women&rsquo;s Healthcare for Every Chapter of Life
            </h1>
            <p className="mt-7 text-lg md:text-xl text-on-surface-variant leading-relaxed max-w-lg">
              Personalized obstetric and gynecologic care from Jacksonville
              Beach&rsquo;s trusted physicians.
            </p>
            <a
              href={APPOINTMENT_URL}
              className="mt-10 inline-block font-label text-xs tracking-[0.2em] uppercase bg-primary text-on-primary px-8 py-4 rounded-full shadow-lift hover:bg-primary-container hover:text-on-primary-container transition"
            >
              Schedule an Appointment
            </a>
          </div>
          <div className="relative lg:h-[calc(100vh-6rem)] lg:min-h-[560px] lg:max-h-[760px]">
            <img
              src="/hero/chapter.jpg"
              alt="A woman walking along the shoreline at sunrise in Jacksonville Beach"
              className="w-full h-full object-cover rounded-xl lg:rounded-none lg:rounded-b-xl aspect-square lg:aspect-auto"
            />
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

      {/* ---------- Footer — content mirrors toplinemd.com/beaches-obgyn ---------- */}
      <footer className="bg-primary text-on-primary">
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 py-16 grid gap-10 md:grid-cols-3">
          <div>
            <h4 className="font-label text-xs tracking-[0.2em] uppercase text-primary-container mb-5">Contact Information</h4>
            <p className="text-sm leading-relaxed opacity-90">
              1577 Roberts Drive, Suite 323<br />
              Jacksonville Beach, FL 32250
            </p>
            <p className="mt-4 text-sm leading-relaxed opacity-90">
              9010 RG Skinner Parkway, Suite 102<br />
              Jacksonville, FL 32256
            </p>
            <p className="mt-4 text-sm opacity-90">
              (904) 241-9775 · (904) 249-3638 (fax)
            </p>
          </div>
          <div>
            <h4 className="font-label text-xs tracking-[0.2em] uppercase text-primary-container mb-5">Services</h4>
            <ul className="text-sm space-y-2 opacity-90">
              <li>Obstetrics</li>
              <li>Gynecology</li>
              <li>Minimally Invasive Surgery</li>
              <li>Hormone Replacement</li>
            </ul>
          </div>
          <div>
            <h4 className="font-label text-xs tracking-[0.2em] uppercase text-primary-container mb-5">Office Hours</h4>
            <p className="text-sm leading-relaxed opacity-90">
              Monday–Thursday: 9:00am–12:00pm, 2:00pm–5:00pm<br />
              Friday: 9:00am–12:00pm
            </p>
            <p className="mt-6 text-sm leading-relaxed opacity-75">
              We are a member of the TopLine MD Alliance, a collective group of
              practices, providers and specialty centers that help patients
              navigate a complicated healthcare system.
            </p>
          </div>
        </div>
        <div className="border-t border-on-primary/15">
          <div className="max-w-[1240px] mx-auto px-5 md:px-10 py-6 flex flex-col md:flex-row gap-3 items-center justify-between text-xs opacity-75">
            <p>© Copyright 2012</p>
            <div className="flex gap-6">
              <a href="https://www.toplinemd.com/practice-terms-policies/" className="hover:underline">Terms and Policies</a>
              <a href="https://www.toplinemd.com/affiliation-disclaimer/" className="hover:underline">Affiliation Disclaimer</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
