// Hidden design prototype — reimagining of the practice's Minimally
// Invasive Surgery page in the coastal palette and type system.
// Not linked from anywhere; reachable only at /misclone.

import Starfish from '../components/Starfish'
import { PracticeHeader, PracticeFooter, APPOINTMENT_URL } from '../components/PracticeChrome'

const BENEFITS = [
  { title: 'Less Pain', text: 'Smaller incisions mean gentler recoveries and less postoperative discomfort.' },
  { title: 'Less Blood Loss', text: 'Precise techniques significantly reduce blood loss during surgery.' },
  { title: 'Lower Infection Risk', text: 'Minimal entry points lower the chance of surgical-site infection.' },
  { title: 'Shorter Stays', text: 'Many procedures are outpatient or require only a brief hospital stay.' },
  { title: 'Faster Recovery', text: 'Most patients return to normal activities in a fraction of the time.' },
]

const PROCEDURES = [
  { title: 'Endometrial Ablation', text: 'A hysteroscopic treatment for heavy menstrual bleeding that gently ablates the uterine lining — no incisions at all.' },
  { title: 'Total Laparoscopic Hysterectomy', text: 'Complete removal of the uterus through a few tiny abdominal incisions, guided by high-definition visualization.' },
  { title: 'Laparoscopic Supracervical Hysterectomy', text: 'A uterus-preserving-cervix approach for the right candidates, with the same small-incision recovery benefits.' },
  { title: 'Tubal Ligation', text: 'Permanent, reliable contraception performed laparoscopically as a brief outpatient procedure.' },
  { title: 'Advanced Hysteroscopy', text: 'A slender camera identifies — and often treats in the same visit — polyps, fibroids, and causes of abnormal bleeding.' },
  { title: 'Advanced & Single-Incision Laparoscopy', text: 'Complex pelvic surgery through incisions measured in millimeters, sometimes just one at the navel.' },
  { title: 'Robotic (da Vinci) Assisted Laparoscopy', text: 'Robotic instruments translate the surgeon’s hands into exceptionally precise, tremor-free movement.' },
  { title: 'Robotic (da Vinci) Hysterectomy', text: 'The most advanced hysterectomy technique we offer — enhanced dexterity and 3D visualization through small incisions.' },
]

const CONDITIONS = [
  'Abnormal uterine bleeding',
  'Heavy menstrual bleeding',
  'Pelvic pain',
  'Uterine fibroids',
  'Endometriosis',
  'Polyps',
]

export default function MISClonePage() {
  return (
    <div className="bg-surface text-on-surface">
      <PracticeHeader />

      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden min-h-[420px] h-[55vh] max-h-[640px]">
        <img
          src="/davinci/arms-fan.jpg"
          alt="The da Vinci Xi's articulated arms extended over the operating field"
          className="absolute inset-0 w-full h-full object-cover object-[center_40%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2c2825]/80 via-[#2c2825]/45 to-[#2c2825]/10" />
        <div className="relative z-10 max-w-[1240px] mx-auto px-5 md:px-10 h-full flex items-center">
          <div className="max-w-2xl">
            <p className="font-label text-xs tracking-[0.25em] uppercase text-primary-container mb-6">
              Services · Surgery
            </p>
            <h1 className="font-headline text-4xl md:text-5xl xl:text-6xl leading-[1.08] text-white">
              Minimally Invasive Surgery in Jacksonville Beach, Florida
            </h1>
            <p className="mt-6 text-lg text-white/85 leading-relaxed max-w-lg">
              Advanced gynecologic surgery with smaller incisions, shorter
              recoveries, and your own physician at your side.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- Intro / conditions ---------- */}
      <section className="max-w-[1240px] mx-auto px-5 md:px-10 py-24 md:py-32 grid lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-20">
        <div>
          <p className="font-label text-xs tracking-[0.25em] uppercase text-secondary mb-5">A Gentler Approach</p>
          <h2 className="font-headline text-3xl md:text-5xl leading-[1.15]">
            Surgery, when you need it. Recovery, on your terms.
          </h2>
          <p className="mt-7 text-on-surface-variant md:text-lg leading-relaxed">
            When conditions like abnormal bleeding, pelvic pain, fibroids, or
            endometriosis call for surgical care, our physicians reach first
            for the least invasive option that will work. Laparoscopic,
            hysteroscopic, and robotic techniques let us operate through
            incisions measured in millimeters — so you spend less time in the
            hospital and more time back in your life.
          </p>
          <a
            href={APPOINTMENT_URL}
            className="mt-10 inline-block font-label text-xs tracking-[0.2em] uppercase bg-primary text-on-primary px-8 py-4 rounded-full shadow-lift hover:bg-primary-container hover:text-on-primary-container transition"
          >
            Schedule an Appointment
          </a>
        </div>
        <div className="bg-surface-container-low p-8 md:p-10 self-start">
          <h3 className="font-headline text-xl">Conditions We Treat</h3>
          <div className="w-8 h-px bg-secondary-fixed-dim my-5" />
          <ul className="space-y-3">
            {CONDITIONS.map(c => (
              <li key={c} className="flex items-start gap-3 text-on-surface-variant">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Benefits ---------- */}
      <section className="relative overflow-hidden bg-surface-container-low">
        <Starfish className="absolute -top-24 -right-24 w-80 h-80 text-primary-fixed-dim opacity-10 -rotate-12 pointer-events-none" />
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 py-24 md:py-32">
          <p className="font-label text-xs tracking-[0.25em] uppercase text-secondary mb-5">Why Minimally Invasive</p>
          <h2 className="font-headline text-3xl md:text-5xl leading-[1.15] max-w-2xl">
            Small incisions. Meaningful differences.
          </h2>
          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {BENEFITS.map(b => (
              <div key={b.title} className="bg-surface-container-lowest shadow-lift p-7">
                <h3 className="font-headline text-lg leading-snug">{b.title}</h3>
                <div className="w-8 h-px bg-secondary-fixed-dim my-4" />
                <p className="text-sm text-on-surface-variant leading-relaxed">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- da Vinci system ---------- */}
      <section className="bg-primary text-on-primary">
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 py-24 md:py-32">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <p className="font-label text-xs tracking-[0.25em] uppercase text-primary-container mb-5">
                The da Vinci System
              </p>
              <h2 className="font-headline text-3xl md:text-5xl leading-[1.15]">
                Robotic precision. Your surgeon in control.
              </h2>
              <p className="mt-7 text-on-primary/80 md:text-lg leading-relaxed max-w-xl">
                Our surgeons perform robotic-assisted procedures with the
                da Vinci surgical system at Baptist Beaches. The surgeon is in
                command at every moment — the system translates their hands
                into precise, tremor-free micro-movements of wristed
                instruments, working through incisions the size of a dime with
                immersive 3D-HD visualization.
              </p>
            </div>
            <div className="bg-surface-container-lowest shadow-lift overflow-hidden">
              <img
                src="/davinci/xi-front.jpg"
                alt="The da Vinci Xi surgical system patient cart"
                className="w-full aspect-[10/7] object-cover"
              />
            </div>
          </div>
          <div className="mt-8 grid md:grid-cols-2 gap-8">
            <figure className="bg-surface-container-lowest shadow-lift overflow-hidden">
              <img
                src="/davinci/arms-fan.jpg"
                alt="The da Vinci Xi's four articulated arms converging on a single small workspace"
                className="w-full aspect-[10/7] object-cover"
              />
              <figcaption className="px-6 py-4 font-label text-[10px] tracking-[0.18em] uppercase text-on-surface-variant">
                Four arms, one tiny workspace
              </figcaption>
            </figure>
            <figure className="bg-surface-container-lowest shadow-lift overflow-hidden">
              <img
                src="/davinci/instrument.jpg"
                alt="A wristed da Vinci instrument articulating at its tip"
                className="w-full aspect-[10/7] object-cover"
              />
              <figcaption className="px-6 py-4 font-label text-[10px] tracking-[0.18em] uppercase text-on-surface-variant">
                Wristed instruments that move beyond the human hand
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* ---------- Robotic surgery in numbers (video background) ---------- */}
      <section className="relative overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/davinci/broll.mp4"
          poster="/davinci/arms-fan.jpg"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-white/40" />
        <div className="relative z-10 max-w-[1240px] mx-auto px-5 md:px-10 py-24 md:py-36 text-on-surface">
          <p className="font-label text-xs tracking-[0.25em] uppercase text-primary mb-5">
            Robotic-Assisted Surgery
          </p>
          <h2 className="font-headline text-3xl md:text-5xl leading-[1.15] max-w-2xl">
            A proven platform, trusted worldwide.
          </h2>
          <div className="mt-14 grid sm:grid-cols-3 gap-10 max-w-3xl">
            <div>
              <p className="font-headline text-5xl md:text-6xl text-primary">20M+</p>
              <p className="mt-2 text-sm text-on-surface/75 leading-relaxed">
                patients treated with da Vinci surgery worldwide
              </p>
            </div>
            <div>
              <p className="font-headline text-5xl md:text-6xl text-primary">70+</p>
              <p className="mt-2 text-sm text-on-surface/75 leading-relaxed">
                procedure types performed with the system
              </p>
            </div>
            <div>
              <p className="font-headline text-5xl md:text-6xl text-primary">25+</p>
              <p className="mt-2 text-sm text-on-surface/75 leading-relaxed">
                years in clinical use by surgeons
              </p>
            </div>
          </div>
          <p className="mt-14 text-on-surface/70 text-sm leading-relaxed max-w-2xl">
            The da Vinci system never operates on its own — your surgeon is in
            complete control of every movement, every moment. Depending on your
            procedure, robotic-assisted surgery may mean less pain and a
            shorter recovery than open surgery. As with any operation, serious
            complications can occur; your physician will help you weigh the
            risks and benefits for your situation.
          </p>
        </div>
      </section>

      {/* ---------- Procedures ---------- */}
      <section className="max-w-[1240px] mx-auto px-5 md:px-10 py-24 md:py-32">
        <p className="font-label text-xs tracking-[0.25em] uppercase text-secondary mb-5">Our Procedures</p>
        <h2 className="font-headline text-3xl md:text-5xl leading-[1.15] max-w-2xl">
          How we make surgery smaller.
        </h2>
        <div className="mt-16 grid md:grid-cols-2 gap-x-16 gap-y-12">
          {PROCEDURES.map(p => (
            <div key={p.title} className="border-t border-outline-variant/60 pt-8">
              <h3 className="font-headline text-xl leading-snug">{p.title}</h3>
              <p className="mt-3 text-sm md:text-base text-on-surface-variant leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Closing CTA ---------- */}
      <section className="bg-surface-container-low">
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 py-24 md:py-32 text-center">
          <Starfish className="w-12 h-12 mx-auto mb-6 text-primary" />
          <h2 className="font-headline text-3xl md:text-5xl leading-[1.15] max-w-2xl mx-auto">
            Wondering if a minimally invasive option is right for you?
          </h2>
          <p className="mt-6 text-on-surface-variant md:text-lg max-w-xl mx-auto">
            Our physicians will walk you through every option — surgical and
            not — and help you choose with confidence.
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
