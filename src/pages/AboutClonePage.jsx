// Hidden design prototype — reimagining of the practice's About page in
// the coastal palette and type system. Editorial provider profiles with
// the real portraits. Not linked from anywhere; reachable only at
// /aboutclone.

import { useState } from 'react'
import Starfish from '../components/Starfish'
import { PracticeHeader, PracticeFooter, APPOINTMENT_URL } from '../components/PracticeChrome'

const PHYSICIAN_BIOS = [
  {
    name: 'Leandro Rodriguez', credentials: 'MD, FACOG', photo: '/providers/rodriguez.jpg',
    training: 'Born in Puerto Rico. University of Puerto Rico School of Medicine, magna cum laude, Alpha Omega Alpha; residency at the University of Miami, serving as administrative chief resident.',
    interests: 'Gynecologic ultrasound, minimally invasive treatment of heavy menstrual bleeding, and da Vinci robotic surgery.',
    personal: 'Cyclist and golfer.',
    fullBio: 'Born in Puerto Rico, Dr. Rodriguez graduated Magna Cum Laude from the University of Puerto Rico and completed his residency at the University of Miami as Administrative Chief Resident. He has practiced in Jacksonville Beach since 2005 and currently serves as Chief of the Medical Staff at Baptist Beaches. His clinical interests include gynecologic ultrasound, minimally invasive treatment of heavy menstrual bleeding, advanced laparoscopy, and da Vinci robotic surgery.',
  },
  {
    name: 'Rebekah Richmond', credentials: 'MD, FACOG', photo: '/providers/richmond.jpg',
    training: 'Jacksonville native. University of Florida (neuroscience); University of South Florida College of Medicine; residency at UF Health Jacksonville.',
    interests: 'Hormone replacement, contraceptive management, infertility, and da Vinci robotic surgery. Chair, Department of Women and Children Services at Baptist Beaches Medical Center.',
    personal: 'Enjoys fishing, skiing, and Gator football.',
    fullBio: 'Dr. Richmond is a Jacksonville native who studied Neuroscience at the University of Florida and completed her OB/GYN training there. She serves as Chairman for the Department of Women and Children Services at Baptist Beaches Medical Center. Her expertise includes hormone replacement, contraceptive management, sexual dysfunction, and infertility. She enjoys fishing, skiing, and Gator football.',
  },
  {
    name: 'Laura Peter', credentials: 'DO, FACOG', photo: '/providers/peter.jpg',
    training: 'University of Florida; Nova Southeastern University College of Osteopathic Medicine; training at Summa Health Akron City.',
    interests: 'Whole-person osteopathic approach to obstetrics and gynecology. Member, ACOG.',
    personal: 'Jacksonville Beach resident who loves cooking and traveling.',
    fullBio: 'Dr. Peter was born in Pennsylvania, raised in Virginia, and trained at Summa Health Akron City in Ohio. She earned her degree from Nova Southeastern University College of Osteopathic Medicine and brings a whole-person osteopathic approach to obstetrics and gynecology. She now resides in Jacksonville Beach and enjoys cooking, traveling, and spending time with family and friends.',
  },
  {
    name: 'Kimberly Manek', credentials: 'MD, FACOG', photo: '/providers/manek.jpg',
    training: 'University of Miami, magna cum laude; Florida State University College of Medicine; chief resident at Sacred Heart Hospital, Pensacola.',
    interests: 'Gynecologic oncology and long-term patient relationships across every stage of care.',
    personal: 'Has volunteered on medical service trips to India and the Philippines.',
    fullBio: 'A Daytona Beach native, Dr. Manek earned her degree from the University of Miami with Magna Cum Laude honors and completed her residency at Sacred Heart Hospital in Pensacola as Chief Resident, where she was recognized as Outstanding Resident in Gynecologic Oncology. She values building long-term relationships with her patients across every stage of care, and has conducted medical volunteer work in India and the Philippines.',
  },
  {
    name: 'Anita Patel', credentials: 'MD, FACOG', photo: '/providers/patel.jpg',
    training: 'Jacksonville native. University of Florida (microbiology); University of Central Florida College of Medicine; residency at Stony Brook University Hospital, where she earned the Golden Scalpel award for surgical excellence.',
    interests: 'Minimally invasive surgery, abnormal uterine bleeding, pelvic pain, and menopause care.',
    personal: 'Active in international medical mission work.',
    fullBio: 'A Jacksonville native, Dr. Patel earned her medical degree on scholarship from the University of Central Florida College of Medicine and completed her residency at Stony Brook University Hospital, where she received the Golden Scalpel award. She specializes in minimally invasive surgery, abnormal uterine bleeding, pelvic pain, and menopause care, and participates in medical mission work through Global Health Ministries.',
  },
  {
    name: 'Rakiya Miller', credentials: 'MD, FACOG', photo: '/providers/miller.jpg',
    training: 'Wofford College, cum laude; University of South Carolina School of Medicine; OBGYN residency at UF Health Jacksonville.',
    interests: 'Minimally invasive gynecology — AAGL Excellence Award and Outstanding Resident in Gynecologic Oncology recipient. Committed to quality care for every community.',
    personal: 'Mother of four who enjoys singing, restaurants, and the beach.',
    fullBio: 'Dr. Miller graduated cum laude from Wofford College and completed her residency at the University of Florida in Jacksonville as Administrative Chief Resident. She received both the Outstanding Resident in Gynecologic Oncology award and the AAGL Excellence in Minimally Invasive Gynecology Award. She is committed to empowering women and ensuring quality care for minority populations. She has four children and enjoys singing, shopping, trying new restaurants, and time at the beach.',
  },
  {
    name: 'Joana Fischer', credentials: 'MD', photo: '/providers/fischer.jpg',
    training: 'University of Alabama; UAB School of Medicine; OBGYN residency at UF Health Jacksonville. Member, ACOG.',
    interests: 'Educating women on menstrual health, contraception, and family planning. Bilingual — English and Spanish.',
    personal: 'Enjoys indoor gardening and time at Jacksonville Beach.',
    fullBio: 'A Huntsville, Alabama native, Dr. Fischer is bilingual and completed her residency at the University of Florida in Jacksonville. She has provided international medical services in Cameroon and the Dominican Republic, and is especially passionate about educating women on the complexities of female health — from menstrual cycles to contraception and family planning. She enjoys indoor gardening and spending time at Jacksonville Beach.',
  },
  {
    name: 'John Bordelon', credentials: 'MD, FACOG', photo: '/providers/bordelon.jpg',
    badge: 'Founding member · Retired 8/2026',
    training: 'LSU School of Medicine; residency at LSU Medical Center. In private gynecologic practice in Jacksonville since 1991.',
    interests: 'Endometrial ablation, laparoscopy, hysteroscopy, and da Vinci robotic surgery.',
    personal: 'Gardener, cyclist, and admirer of antique automobiles.',
    fullBio: 'Dr. Bordelon trained at Louisiana State University and has practiced gynecology in Jacksonville since 1991. His clinical interests encompass endometrial ablation, tubal occlusion, advanced laparoscopy, hysteroscopy, da Vinci robotic surgery, and adolescent gynecology. Outside of medicine, he enjoys gardening, biking, beachcombing, antique automobiles, and cruising the beaches with the top down.',
  },
]

const APRN_BIOS = [
  {
    name: 'Malinda Moussa', credentials: 'APRN', photo: '/providers/moussa.jpg',
    training: 'University of Tennessee, Knoxville; Master of Science in Nursing from Vanderbilt University, summa cum laude.',
    interests: 'More than 19 years as a women’s health nurse practitioner at the Beaches; with the practice since 2000.',
    personal: 'Family time, college football, and travel.',
  },
  {
    name: 'Gabrielle Ahrens', credentials: 'APRN', photo: '/providers/ahrens.jpg',
    training: 'Salisbury University, BSN cum laude; University of South Alabama, MSN magna cum laude, specializing in women’s health.',
    interests: 'Labor, delivery, and postpartum care. DAISY Award recipient, 2024. Member, NPWH.',
    personal: 'Has served on medical missions in Guatemala.',
  },
  {
    name: 'Katherine Dorsey', credentials: 'APRN', photo: '/providers/dorsey.jpg',
    training: 'Florida Atlantic University, cum laude; Master of Science in Nursing from Jacksonville University.',
    interests: 'Over 15 years in healthcare, formerly Director of the Maternal Newborn Service Line at Baptist Health. Passionate about patient education, postpartum support, and breastfeeding.',
    personal: 'Happiest outdoors with her family.',
  },
]

function BioRow({ bio, flip }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={`grid md:grid-cols-[2fr_3fr] gap-8 md:gap-16 items-center ${flip ? 'md:[direction:rtl]' : ''}`}>
      <div className="[direction:ltr]">
        <img
          src={bio.photo}
          alt={`Portrait of ${bio.name}`}
          loading="lazy"
          className="shadow-lift w-full aspect-[4/5] object-cover"
        />
      </div>
      <div className="[direction:ltr]">
        <h3 className="font-headline text-2xl md:text-3xl leading-snug">
          {bio.name}, <span className="text-on-surface-variant text-xl md:text-2xl">{bio.credentials}</span>
        </h3>
        {bio.badge && (
          <p className="mt-2 font-label text-[11px] tracking-[0.18em] uppercase text-secondary">{bio.badge}</p>
        )}
        <div className="w-10 h-px bg-secondary-fixed-dim my-5" />
        <dl className="space-y-4 max-w-xl">
          <div>
            <dt className="font-label text-[10px] tracking-[0.2em] uppercase text-secondary">Training</dt>
            <dd className="mt-1 text-sm md:text-base text-on-surface-variant leading-relaxed">{bio.training}</dd>
          </div>
          <div>
            <dt className="font-label text-[10px] tracking-[0.2em] uppercase text-secondary">Clinical Interests</dt>
            <dd className="mt-1 text-sm md:text-base text-on-surface-variant leading-relaxed">{bio.interests}</dd>
          </div>
          {bio.personal && (
            <div>
              <dt className="font-label text-[10px] tracking-[0.2em] uppercase text-secondary">Beyond the Office</dt>
              <dd className="mt-1 text-sm md:text-base text-on-surface-variant leading-relaxed">{bio.personal}</dd>
            </div>
          )}
        </dl>

        {bio.fullBio && (
          <div className="max-w-xl">
            <div
              className="grid transition-[grid-template-rows] duration-300 ease-in-out"
              style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <p className="mt-6 pt-6 border-t border-outline-variant/50 text-sm md:text-base text-on-surface-variant leading-relaxed">
                  {bio.fullBio}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(o => !o)}
              aria-expanded={open}
              className="mt-5 inline-flex items-center gap-1.5 font-label text-[11px] tracking-[0.2em] uppercase text-primary hover:underline"
            >
              {open ? 'Show less' : 'Read full bio'}
              <svg
                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AboutClonePage() {
  return (
    <div className="bg-surface text-on-surface">
      <PracticeHeader />

      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden bg-surface-container-low">
        <Starfish className="absolute -top-24 -right-24 w-96 h-96 text-primary-fixed-dim opacity-10 rotate-12 pointer-events-none" />
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 py-24 md:py-36">
          <p className="font-label text-xs tracking-[0.25em] uppercase text-secondary mb-6">
            About Beaches OBGYN
          </p>
          <h1 className="font-headline text-4xl md:text-6xl leading-[1.08] max-w-3xl">
            Your physicians, your neighbors — caring for the Beaches for more
            than 25 years.
          </h1>
          <p className="mt-8 text-on-surface-variant md:text-lg leading-relaxed max-w-2xl">
            We are an independent, physician-owned obstetrics and gynecology
            practice in Jacksonville Beach, delivering at Baptist Beaches
            Medical Center and caring for women through every chapter of life.
            As members of the TopLine MD Alliance, our patients are connected
            to a trusted network of specialists whenever they need one.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 items-center">
            <a
              href={APPOINTMENT_URL}
              className="font-label text-xs tracking-[0.2em] uppercase bg-primary text-on-primary px-8 py-4 rounded-full shadow-lift hover:bg-primary-container hover:text-on-primary-container transition"
            >
              Request an Appointment
            </a>
            <a
              href="https://www.toplinemd.com/"
              className="font-label text-xs tracking-[0.2em] uppercase text-primary hover:underline"
            >
              Learn more about the alliance
            </a>
          </div>
        </div>
      </section>

      {/* ---------- Physicians ---------- */}
      <section className="max-w-[1240px] mx-auto px-5 md:px-10 py-24 md:py-32">
        <p className="font-label text-xs tracking-[0.25em] uppercase text-secondary mb-5">Our Physicians</p>
        <h2 className="font-headline text-3xl md:text-5xl leading-[1.15] max-w-2xl">
          Eight physicians. One standard of care.
        </h2>
        <div className="mt-16 space-y-20 md:space-y-28">
          {PHYSICIAN_BIOS.map((bio, i) => (
            <BioRow key={bio.name} bio={bio} flip={i % 2 === 1} />
          ))}
        </div>
      </section>

      {/* ---------- APRNs ---------- */}
      <section className="bg-surface-container-low">
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 py-24 md:py-32">
          <p className="font-label text-xs tracking-[0.25em] uppercase text-secondary mb-5">Advanced Practice Providers</p>
          <h2 className="font-headline text-3xl md:text-5xl leading-[1.15] max-w-2xl">
            Nurse practitioners who know you by name.
          </h2>
          <div className="mt-16 space-y-20 md:space-y-28">
            {APRN_BIOS.map((bio, i) => (
              <BioRow key={bio.name} bio={bio} flip={i % 2 === 1} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Closing CTA ---------- */}
      <section className="max-w-[1240px] mx-auto px-5 md:px-10 py-24 md:py-32 text-center">
        <Starfish className="w-12 h-12 mx-auto mb-6 text-primary" />
        <h2 className="font-headline text-3xl md:text-5xl leading-[1.15] max-w-2xl mx-auto">
          Come meet us in person.
        </h2>
        <p className="mt-6 text-on-surface-variant md:text-lg max-w-xl mx-auto">
          Two convenient locations — Jacksonville Beach and RG Skinner Parkway.
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
