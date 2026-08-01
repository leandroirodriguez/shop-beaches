// Hidden design prototype — a dedicated Hormone Health page covering
// perimenopause, menopause, and sexual health. The live TopLine MD site
// treats hormone replacement as a single line under GYN Services; this
// gives it a page of its own. Reachable only at /hrtclone.

import Starfish from '../components/Starfish'
import { PracticeHeader, PracticeFooter, APPOINTMENT_URL } from '../components/PracticeChrome'

// Verbatim from the practice's GYN Services page: the symptoms hormonal
// change can bring on through perimenopause and menopause.
const SYMPTOMS = [
  'Hot flashes',
  'Night sweats',
  'Insomnia',
  'Vaginal dryness',
  'Mood swings',
  'Decreased libido',
]

const STAGES = [
  {
    label: 'Perimenopause',
    text: 'The years before your last period, when cycles grow unpredictable and sleep, mood, and energy often shift first. Many women are told they are "too young" for this conversation — they are not. Evaluating symptoms early gives you options while you still have them.',
    shop: '/category/perimenopause',
  },
  {
    label: 'Menopause',
    text: 'Once cycles have stopped, symptoms can persist for years and quietly reshape sleep, bone health, and day-to-day comfort. Treatment is not automatic and it is not for everyone — but it should be a decision you make deliberately, with your own physician.',
    shop: '/category/menopause',
  },
  {
    label: 'Sexual Health',
    text: 'Dryness, discomfort, and changes in desire are among the most common effects of hormonal change and among the least discussed. We treat them as ordinary clinical concerns, because that is what they are.',
    shop: '/category/sexual-health',
  },
]

const APPROACH = [
  {
    title: 'A full evaluation first',
    text: 'Symptoms, history, and where you are in the transition — before any prescription. Hormone therapy is offered when it is indicated, not by default.',
  },
  {
    title: 'Therapy matched to you',
    text: 'Patient-specific hormone replacement, chosen around your symptoms, your health history, and what you want to feel like again.',
  },
  {
    title: 'Reviewed over time',
    text: 'Hormone needs change. We revisit how you are doing and adjust rather than leaving you on the same plan indefinitely.',
  },
  {
    title: 'Care beyond hormones',
    text: 'Sleep, bone health, and cardiovascular risk are part of the same conversation — a complete approach to healthier aging, not a single prescription.',
  },
]

// Physicians whose stated clinical interests cover this area.
const CLINICIANS = [
  {
    name: 'Rebekah Richmond',
    credentials: 'MD, FACOG',
    photo: '/providers/richmond.jpg',
    focus: 'Hormone replacement, contraceptive management, and sexual dysfunction. Chair, Department of Women and Children Services at Baptist Beaches.',
  },
  {
    name: 'Anita Patel',
    credentials: 'MD, FACOG',
    photo: '/providers/patel.jpg',
    focus: 'Menopause care, abnormal uterine bleeding, and pelvic pain, alongside minimally invasive surgery.',
  },
]

export default function HRTClonePage() {
  return (
    <div className="bg-surface text-on-surface">
      <PracticeHeader />

      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden bg-surface-container-low">
        <Starfish className="absolute -top-24 -right-24 w-96 h-96 text-primary-fixed-dim opacity-10 rotate-12 pointer-events-none" />
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 py-16 md:py-24">
          <p className="font-label text-xs tracking-[0.25em] uppercase text-secondary mb-6">
            Services · Hormone Health
          </p>
          <h1 className="font-headline text-4xl md:text-6xl leading-[1.08] max-w-3xl">
            Hormone health, through every transition.
          </h1>
          <p className="mt-8 text-on-surface-variant md:text-lg leading-relaxed max-w-2xl">
            Hormonal change in perimenopause and menopause can affect sleep,
            mood, comfort, and intimacy — often for years. Our physicians
            specialize in a complete approach to healthier aging, including
            patient-specific hormone replacement therapy when it is indicated.
          </p>
          <a
            href={APPOINTMENT_URL}
            className="mt-10 inline-block font-label text-xs tracking-[0.2em] uppercase bg-primary text-on-primary px-8 py-4 rounded-full shadow-lift hover:bg-primary-container hover:text-on-primary-container transition"
          >
            Request an Appointment
          </a>
        </div>
      </section>

      {/* ---------- Symptoms ---------- */}
      <section className="max-w-[1240px] mx-auto px-5 md:px-10 py-12 md:py-16 grid lg:grid-cols-[1.3fr_1fr] gap-12 lg:gap-20">
        <div>
          <p className="font-label text-xs tracking-[0.25em] uppercase text-secondary mb-5">
            What Hormonal Change Feels Like
          </p>
          <h2 className="font-headline text-3xl md:text-5xl leading-[1.15]">
            If this sounds familiar, it is worth a conversation.
          </h2>
          <p className="mt-7 text-on-surface-variant md:text-lg leading-relaxed">
            These are the symptoms women most often bring to us — and the ones
            most often dismissed as simply part of getting older. They are
            measurable, they are treatable, and they are a legitimate reason to
            make an appointment.
          </p>
        </div>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-1 gap-x-8 self-start">
          {SYMPTOMS.map(s => (
            <li
              key={s}
              className="flex items-center gap-4 border-b border-outline-variant/60 py-4 text-on-surface"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              {s}
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- Three stages ---------- */}
      <section className="bg-surface-container-low">
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 py-12 md:py-16">
          <p className="font-label text-xs tracking-[0.25em] uppercase text-secondary mb-5">
            Where You Are
          </p>
          <h2 className="font-headline text-3xl md:text-5xl leading-[1.15] max-w-2xl">
            Three stages, one continuous conversation.
          </h2>
          <div className="mt-12 grid md:grid-cols-3 gap-x-12 gap-y-10">
            {STAGES.map((s, i) => (
              <div key={s.label} className="border-t border-outline-variant/60 pt-7">
                <span className="font-headline text-3xl text-secondary-fixed-dim">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-4 font-headline text-xl leading-snug">{s.label}</h3>
                <p className="mt-3 text-sm md:text-base text-on-surface-variant leading-relaxed">
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Our approach ---------- */}
      <section className="max-w-[1240px] mx-auto px-5 md:px-10 py-12 md:py-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <p className="font-label text-xs tracking-[0.25em] uppercase text-secondary mb-5">
              How We Approach It
            </p>
            <h2 className="font-headline text-3xl md:text-5xl leading-[1.15]">
              Treatment when it&rsquo;s indicated — never by default.
            </h2>
            <dl className="mt-10 space-y-7 max-w-xl">
              {APPROACH.map(a => (
                <div key={a.title} className="flex gap-4">
                  <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  <div>
                    <dt className="font-headline text-lg leading-snug">{a.title}</dt>
                    <dd className="mt-1 text-sm text-on-surface-variant leading-relaxed">{a.text}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <img
              src="/services/meno.jpg"
              alt="A woman in her fifties, smiling"
              loading="lazy"
              className="w-full aspect-[4/5] object-cover shadow-lift"
            />
          </div>
        </div>
      </section>

      {/* ---------- Who you'll see ---------- */}
      <section className="bg-surface-container-low">
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 py-12 md:py-16">
          <p className="font-label text-xs tracking-[0.25em] uppercase text-secondary mb-5">
            Who You&rsquo;ll See
          </p>
          <h2 className="font-headline text-3xl md:text-5xl leading-[1.15] max-w-2xl">
            Physicians who focus on this work.
          </h2>
          <div className="mt-12 grid sm:grid-cols-2 gap-8 md:gap-12 max-w-3xl">
            {CLINICIANS.map(c => (
              <article key={c.name} className="flex gap-6">
                <img
                  src={c.photo}
                  alt={`Portrait of ${c.name}`}
                  loading="lazy"
                  className="w-32 md:w-40 aspect-[4/5] object-cover shadow-lift shrink-0"
                />
                <div>
                  <h3 className="font-headline text-xl leading-snug">
                    {c.name},{' '}
                    <span className="text-on-surface-variant text-lg">{c.credentials}</span>
                  </h3>
                  <div className="w-8 h-px bg-secondary-fixed-dim my-4" />
                  <p className="text-sm text-on-surface-variant leading-relaxed">{c.focus}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-10 text-sm text-on-surface-variant max-w-2xl">
            Every physician in the practice manages hormonal health — these two
            list it among their primary clinical interests.
          </p>
        </div>
      </section>

      {/* ---------- Shop cross-link ---------- */}
      <section className="max-w-[1240px] mx-auto px-5 md:px-10 py-12 md:py-16">
        <div className="grid lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-16 items-end">
          <div>
            <p className="font-label text-xs tracking-[0.25em] uppercase text-secondary mb-5">
              Between Visits
            </p>
            <h2 className="font-headline text-3xl md:text-4xl leading-[1.15]">
              Products our physicians actually recommend.
            </h2>
            <p className="mt-6 text-on-surface-variant leading-relaxed">
              Our team curates a small shop of supplements and comfort products
              for each stage — hand-picked, never sponsored.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {STAGES.map(s => (
              <a
                key={s.label}
                href={s.shop}
                className="group border-t border-outline-variant/60 pt-5 hover:border-primary transition"
              >
                <span className="block font-headline text-lg leading-snug group-hover:text-primary transition">
                  {s.label}
                </span>
                <span className="mt-2 block font-label text-[10px] tracking-[0.2em] uppercase text-secondary">
                  Shop the edit →
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Closing CTA ---------- */}
      <section className="bg-surface-container-low">
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 py-12 md:py-16 text-center">
          <Starfish className="w-12 h-12 mx-auto mb-6 text-primary" />
          <h2 className="font-headline text-3xl md:text-5xl leading-[1.15] max-w-2xl mx-auto">
            You don&rsquo;t have to wait it out.
          </h2>
          <p className="mt-6 text-on-surface-variant md:text-lg max-w-xl mx-auto">
            Bring us your symptoms — we&rsquo;ll tell you honestly whether
            treatment makes sense for you.
          </p>
          <a
            href={APPOINTMENT_URL}
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
