// Hidden design prototype — reimagining of the practice's Contact page
// in the coastal palette and type system. Not linked from anywhere;
// reachable only at /contactclone.

import Starfish from '../components/Starfish'
import { PracticeHeader, PracticeFooter, APPOINTMENT_URL } from '../components/PracticeChrome'

const LOCATIONS = [
  {
    name: 'Jacksonville Beach',
    address: ['1577 Roberts Drive, Suite 323', 'Jacksonville Beach, FL 32250'],
    query: '1577 Roberts Drive Suite 323, Jacksonville Beach, FL 32250',
  },
  {
    name: 'RG Skinner Parkway',
    address: ['9010 RG Skinner Parkway, Suite 102', 'Jacksonville, FL 32256'],
    query: '9010 RG Skinner Parkway Suite 102, Jacksonville, FL 32256',
  },
]

const CHANNELS = [
  { label: 'Phone', value: '(904) 241-9775', href: 'tel:9042419775' },
  { label: 'Text', value: '(904) 441-6725', href: 'sms:9044416725' },
  { label: 'Fax', value: '(904) 249-3638', href: null },
]

const HOURS = [
  { days: 'Monday – Thursday', times: '9:00am–12:00pm · 2:00pm–5:00pm' },
  { days: 'Friday', times: '9:00am–12:00pm' },
  { days: 'Saturday – Sunday', times: 'Closed' },
]

export default function ContactClonePage() {
  return (
    <div className="bg-surface text-on-surface">
      <PracticeHeader />

      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden min-h-[420px] h-[55vh] max-h-[640px]">
        <video
          className="absolute inset-0 w-full h-full object-cover object-[center_60%]"
          src="/hero/jax-flyover.mp4"
          poster="/hero/pier.jpg"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a44]/80 via-[#1e3a44]/45 to-[#1e3a44]/10" />
        <div className="relative z-10 max-w-[1240px] mx-auto px-5 md:px-10 h-full flex items-center">
          <div className="max-w-2xl">
            <p className="font-label text-xs tracking-[0.25em] uppercase text-primary-container mb-6">
              Contact Us
            </p>
            <h1 className="font-headline text-4xl md:text-5xl xl:text-6xl leading-[1.08] text-white">
              Two offices, minutes from the ocean.
            </h1>
            <p className="mt-6 text-lg text-white/85 leading-relaxed max-w-lg">
              Call, text, or stop by — whichever is easiest for you. We&rsquo;re
              here Monday through Friday at both of our Jacksonville locations.
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

      {/* ---------- Reach us / hours ---------- */}
      <section className="max-w-[1240px] mx-auto px-5 md:px-10 py-24 md:py-32 grid lg:grid-cols-2 gap-12 lg:gap-20">
        <div>
          <p className="font-label text-xs tracking-[0.25em] uppercase text-secondary mb-5">Reach Us</p>
          <h2 className="font-headline text-3xl md:text-4xl leading-[1.15]">
            However you like to get in touch.
          </h2>
          <div className="mt-10 space-y-6">
            {CHANNELS.map(c => (
              <div key={c.label} className="flex items-baseline gap-6 border-b border-outline-variant/60 pb-5">
                <span className="font-label text-[10px] tracking-[0.2em] uppercase text-secondary w-16 shrink-0">
                  {c.label}
                </span>
                {c.href ? (
                  <a href={c.href} className="font-headline text-2xl text-primary hover:underline">{c.value}</a>
                ) : (
                  <span className="font-headline text-2xl text-on-surface-variant">{c.value}</span>
                )}
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-on-surface-variant leading-relaxed max-w-md">
            Texts are answered through Klara, our HIPAA-compliant messaging
            platform — same day on weekdays, Monday morning on weekends.
          </p>
        </div>

        <div>
          <p className="font-label text-xs tracking-[0.25em] uppercase text-secondary mb-5">Office Hours</p>
          <h2 className="font-headline text-3xl md:text-4xl leading-[1.15]">
            When we&rsquo;re in.
          </h2>
          <div className="mt-10 space-y-6">
            {HOURS.map(h => (
              <div key={h.days} className="flex items-baseline justify-between gap-6 border-b border-outline-variant/60 pb-5">
                <span className="font-headline text-lg">{h.days}</span>
                <span className="text-on-surface-variant text-right">{h.times}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Locations ---------- */}
      <section className="bg-surface-container-low">
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 py-24 md:py-32">
          <p className="font-label text-xs tracking-[0.25em] uppercase text-secondary mb-5">Our Locations</p>
          <h2 className="font-headline text-3xl md:text-5xl leading-[1.15] max-w-2xl">
            Find the office that&rsquo;s closest to you.
          </h2>
          <div className="mt-14 grid md:grid-cols-2 gap-8">
            {LOCATIONS.map(l => (
              <div key={l.name} className="bg-surface-container-lowest shadow-lift overflow-hidden">
                <iframe
                  title={`Map to our ${l.name} office`}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(l.query)}&z=14&output=embed`}
                  className="w-full h-72 border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
                <div className="p-8">
                  <h3 className="font-headline text-2xl">{l.name}</h3>
                  <p className="mt-3 text-on-surface-variant leading-relaxed">
                    {l.address[0]}<br />{l.address[1]}
                  </p>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(l.query)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-block font-label text-xs tracking-[0.2em] uppercase text-primary hover:underline"
                  >
                    Get Directions →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Closing CTA ---------- */}
      <section className="max-w-[1240px] mx-auto px-5 md:px-10 py-24 md:py-32 text-center">
        <Starfish className="w-12 h-12 mx-auto mb-6 text-primary" />
        <h2 className="font-headline text-3xl md:text-5xl leading-[1.15] max-w-2xl mx-auto">
          We&rsquo;d love to hear from you.
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
