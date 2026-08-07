// Hidden design prototype — reimagining of the practice's About page in
// the coastal palette and type system. Editorial provider profiles with
// the real portraits. Not linked from anywhere; reachable only at
// /aboutclone.

import { useState, useEffect } from 'react'
import Starfish from '../components/Starfish'
import { PracticeHeader, PracticeFooter, APPOINTMENT_URL } from '../components/PracticeChrome'

const PHYSICIAN_BIOS = [
  {
    name: 'Leandro Rodriguez', credentials: 'MD, FACOG', photo: '/providers/rodriguez.jpg',
    training: 'Born in Puerto Rico. University of Puerto Rico School of Medicine, magna cum laude, Alpha Omega Alpha; residency at the University of Miami, serving as administrative chief resident.',
    interests: 'Gynecologic ultrasound, minimally invasive treatment of heavy menstrual bleeding, and da Vinci robotic surgery. Bilingual — English and Spanish.',
    personal: 'Cyclist and golfer.',
    fullBio: `Dr. Leandro Rodriguez was born in Mayaguez, Puerto Rico. He went to medical school at the University of Puerto Rico (San Juan, PR), where he graduated Magna Cum Laude and was a member of Alpha Omega Alpha, the medical honor society that honors the top 10% of medical students. He completed residency at the University of Miami (Miami, FL), during which he was elected Administrative Chief Resident, received multiple recognitions, and authored various articles in peer-reviewed journals. Dr. Rodriguez has been a private practice Gynecologist in Jacksonville Beach since 2005. He served as the Chairman for the Department of Women and Children Services at Baptist Beaches Medical Center and is a past Chief of the Medical Staff. His clinical interests include gynecologic ultrasound, minimally invasive treatment of heavy menstrual periods, advanced laparoscopy, da Vinci robotic surgery, and in-office surgeries like endometrial ablation and hysteroscopy. He is a Fellow of the American College of Obstetricians and Gynecologists (FACOG) and is bilingual in English and Spanish. Dr. Rodriguez is married and has two children. His hobbies include cycling, golf, and spending time with his wife, kids, family and friends.`,
  },
  {
    name: 'Rebekah Richmond', credentials: 'MD, FACOG', photo: '/providers/richmond.jpg',
    training: 'Jacksonville native. University of Florida (neuroscience); University of South Florida College of Medicine; residency at UF Health Jacksonville.',
    interests: 'Hormone replacement, contraceptive management, infertility, and da Vinci robotic surgery. Past Chair, Department of Women and Children Services at Baptist Beaches Medical Center.',
    personal: 'Enjoys fishing, skiing, and Gator football.',
    fullBio: `Dr. Rebekah Richmond is a native of Jacksonville. She majored in Neuroscience at the University of Florida and went on to obtain her medical degree at the University of South Florida. Dr. Richmond returned home to complete her training in Obstetrics and Gynecology at the University of Florida (Jacksonville, FL). During residency she developed a passion for minimally invasive surgery and has continued to advance this skill with the addition of the daVinci robot to her surgical practice. Dr. Richmond's clinical expertise includes hormone replacement, contraceptive management, sexual dysfunction, and infertility. Dr. Richmond previously served as the Chairman for the Department of Women and Children Services at Baptist Beaches Medical Center. She spent the first nine years of her career in an academic institution. She was able to remain abreast of the latest practice guidelines as well as help educate residents while building a well-respected practice of her own here in Jacksonville Beach. While completing her training, Dr. Richmond met her husband, Dr. Erez Sternberg, and now calls Ponte Vedra Beach home. She is surrounded by testosterone with her two sons, Rex and Leo, and two male cats. During her free time, she enjoys fishing, skiing, and watching Gator football.`,
  },
  {
    name: 'Laura Peter', credentials: 'DO, FACOG', photo: '/providers/peter.jpg',
    training: 'University of Florida; Nova Southeastern University College of Osteopathic Medicine; training at Summa Health Akron City.',
    interests: 'Whole-person osteopathic approach to obstetrics and gynecology; current Chair, Department of Women and Children Services at Baptist Beaches Medical Center. Member, ACOG.',
    personal: 'Jacksonville Beach resident who loves cooking and traveling.',
    fullBio: `Dr. Laura Peter was born in Pittsburgh, Pennsylvania, and was raised in Richmond, Virginia. She now calls Jacksonville Beach home again after moving from Akron, Ohio. A member of the American College of Obstetrics and Gynecology, Dr. Peter graduated with a Bachelors from the University of Florida (Gainesville, FL), received her medical degree from Nova Southeastern University College of Osteopathic Medicine (Fort Lauderdale, FL) and completed her training at Summa Health Akron City (Akron, OH). She currently serves as Chair of the Department of Women and Children Services at Baptist Beaches Medical Center. Dr. Peter is married and lives in Jacksonville Beach, Florida, where she and her husband have family that live nearby. Her personal interests include cooking, traveling, and spending time with family and friends.`,
  },
  {
    name: 'Kimberly Manek', credentials: 'MD, FACOG', photo: '/providers/manek.jpg',
    training: 'University of Miami, magna cum laude; Florida State University College of Medicine; chief resident at Sacred Heart Hospital, Pensacola.',
    interests: 'Comprehensive obstetric and gynecologic care, with lasting patient relationships through every stage of life.',
    personal: 'Has volunteered on medical service trips to India and the Philippines.',
    fullBio: `Born and raised in Daytona Beach, Dr. Kimberly Manek received her Bachelor of Science at the University of Miami where she received Magna Cum Laude honors before attending medical school at Florida State University. Most recently, the FSU alum completed her four-year residency with Sacred Heart Hospital in Pensacola, Florida, where she was the Chief Resident throughout her final academic year and named an Outstanding Resident in Gynecologic Oncology. Dr. Manek builds lasting relationships with her patients, caring for them through every stage of life. She also takes pleasure in guiding women through pregnancy and "having the privilege to be a part of a family's special moments." Dr. Manek has also conducted medical volunteer work throughout India and the Philippines, providing physicals and access to medications for both adult and pediatric residents.`,
  },
  {
    name: 'Anita Patel', credentials: 'MD, FACOG', photo: '/providers/patel.jpg',
    training: 'Jacksonville native. University of Florida (microbiology); University of Central Florida College of Medicine; residency at Stony Brook University Hospital, where she earned the Golden Scalpel award for surgical excellence.',
    interests: 'Obstetrics, minimally invasive surgery, abnormal uterine bleeding, pelvic pain, and menopause care.',
    personal: 'Active in international medical mission work.',
    fullBio: `A native of Jacksonville, Dr. Anita Patel attended Stanton College Prep before earning her bachelor's degree in microbiology and cell science from the University of Florida (GO GATORS!). While completing her medical education on scholarship at the University of Central Florida College of Medicine, she discovered an interest in women's health advocacy and published research regarding the gynecologic care of adolescents with developmental disabilities. During her residency at Stonybrook University Hospital in Long Island, New York, Dr. Patel earned several teaching awards, served on departmental quality improvement committees, and received the "Golden Scalpel" award, given to the chief resident who best demonstrates excellence in surgical technique and operative patient care. Dr. Patel also participates in medical mission work with Global Health Ministries, providing surgical gynecologic care for women in underserved and resource-poor communities around the world. A Junior Fellow of the American College of Obstetricians and Gynecologists (ACOG) she practices full range obstetrics and gynecology and has a special interest in minimally invasive surgery including single-site laparoscopy and da Vinci robotic surgery, abnormal uterine bleeding, pelvic pain, and menopause care. Dr. Patel is married to a fellow Jacksonville native and enjoys backpacking, yoga/meditation, gardening, cooking, and strolling the beach with her two rescue dogs.`,
  },
  {
    name: 'Rakiya Miller', credentials: 'MD, FACOG', photo: '/providers/miller.jpg',
    training: 'Wofford College, cum laude; University of South Carolina School of Medicine; OBGYN residency at UF Health Jacksonville.',
    interests: 'Minimally invasive gynecology — AAGL Excellence Award and Outstanding Resident in Gynecologic Oncology recipient. Committed to quality care for every community.',
    personal: 'Mother of four who enjoys singing, restaurants, and the beach.',
    fullBio: `Born and raised in Lancaster, South Carolina, Dr. Rakiya Miller graduated cum laude from Wofford College before receiving her medical degree from the University of South Carolina in Greenville. She completed her OBGYN residency at the University of Florida in Jacksonville where she served as Administrative Chief Resident during her final academic year and received numerous accolades including Outstanding Resident in Gynecologic Oncology, Outstanding Resident Teacher Award, and the AAGL Excellence in Minimally Invasive Gynecology Award. A member of the American College of Obstetricians and Gynecologists (ACOG), Dr. Miller is especially passionate about empowering women to take control of their health and gain knowledge about their bodies and the changes that occur as they age, in addition to working to ensure that all women, including those in minority populations, receive quality care. Dr. Miller is married and has four children. In her free time, she enjoys singing, shopping with her stepdaughters, trying new restaurants, cheering on the Texas Longhorns, watching her children play sports, and spending time at the beach.`,
  },
  {
    name: 'Joana Fischer', credentials: 'MD', photo: '/providers/fischer.jpg',
    training: 'University of Alabama; UAB School of Medicine; OBGYN residency at UF Health Jacksonville. Member, ACOG.',
    interests: 'Educating women on menstrual health, contraception, and family planning. Bilingual — English and Spanish.',
    personal: 'Enjoys indoor gardening and time at Jacksonville Beach.',
    fullBio: `A native of Huntsville, Alabama, Dr. Fischer received her undergraduate degree (double major in Biology and Spanish) at the University of Alabama in Tuscaloosa and her medical degree at UAB. Bilingual in both English and Spanish, she completed her OBGYN residency at the University of Florida in Jacksonville and spent two months in Cameroon, Africa, assisting labor & delivery in a rural community hospital and one month in the Dominican Republic providing family medicine services. A member of the American College of Obstetricians and Gynecologists (ACOG), Dr. Fischer is especially passionate about educating women on the complexities of female health and empowering them to make informed decisions regarding menstrual cycles, contraception, and family planning. Dr. Fischer is married and enjoys indoor gardening, trying new restaurants, cruising around Jacksonville Beach with her husband, and spending time with her two dogs at the local parks.`,
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
  // Anchor id = last name lowercased; the Our Team nav submenu links here.
  // scroll-mt clears the sticky header on fragment navigation.
  const id = bio.name.split(' ').pop().toLowerCase()

  return (
    <div id={id} className={`scroll-mt-28 grid md:grid-cols-[2fr_3fr] gap-8 md:gap-16 items-center ${flip ? 'md:[direction:rtl]' : ''}`}>
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
  // This page is client-rendered, so on a fresh cross-route load to
  // /aboutclone#<slug> the browser's native fragment scroll fires before
  // React has rendered the bio rows and finds nothing. Scroll ourselves
  // after mount. (Same-page hash clicks still scroll natively.)
  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (!hash) return
    requestAnimationFrame(() => {
      document.getElementById(decodeURIComponent(hash))?.scrollIntoView()
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
      <section className="glass-band">
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
