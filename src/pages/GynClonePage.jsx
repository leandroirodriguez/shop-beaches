// Hidden design prototype — reimagining of the practice's GYN Services
// page in the coastal palette and type system. Not linked from anywhere;
// reachable only at /gynclone. Content mirrors the live TopLine MD
// beaches-obgyn/gyn-services page.

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

export default function GynClonePage() {
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
        <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a44]/80 via-[#1e3a44]/45 to-[#1e3a44]/10" />
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
