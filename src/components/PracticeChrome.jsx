// Shared chrome for the hidden practice-site prototypes (/mainclone,
// /misclone): navigation mirroring toplinemd.com/beaches-obgyn's menu and
// a footer reproducing its content, both styled in the coastal palette.

import { useState, useEffect } from 'react'
import logo from '../assets/toplinelogo.png'
import allianceLogo from '../assets/topline-alliance.png'
import toplineHorizontal from '../assets/toplinehorizontal.webp'
import Starfish from './Starfish'

// The "Request an Appointment" CTA across the practice pages points at the
// newclone New Patients prototype's appointment section.
export const APPOINTMENT_URL = '/newclone#appointment'

// Providers, in the order they appear on /aboutclone. The slug is the
// last name lowercased, which matches the anchor id on each bio row.
const TEAM = [
  'Leandro Rodriguez',
  'Rebekah Richmond',
  'Laura Peter',
  'Kimberly Manek',
  'Anita Patel',
  'Rakiya Miller',
  'Joana Fischer',
  'John Bordelon',
  'Malinda Moussa',
  'Gabrielle Ahrens',
  'Katherine Dorsey',
]

const NAV = [
  { label: 'About', href: '/aboutclone' },
  {
    label: 'Services',
    href: '/mainclone#services',
    children: [
      { label: 'GYN Services', href: '/gynclone' },
      { label: 'OB Services', href: '/obclone' },
      { label: 'Minimally Invasive Surgery', href: '/misclone' },
      { label: 'Hormone Health', href: '/hrtclone' },
    ],
  },
  {
    label: 'Our Team',
    href: '/aboutclone',
    children: TEAM.map(name => ({
      label: name,
      href: `/aboutclone#${name.split(' ').pop().toLowerCase()}`,
    })),
  },
  {
    label: 'Patient Resources',
    href: 'https://www.toplinemd.com/beaches-obgyn/new-patients/',
    children: [
      { label: 'Blog', href: 'https://www.toplinemd.com/beaches-obgyn/blog/' },
      { label: 'New Patients', href: '/newclone' },
      { label: 'Terms and Policies', href: 'https://www.toplinemd.com/practice-terms-policies/' },
    ],
  },
  { label: 'Shop', href: 'https://shop.beachesobgyn.com/' },
  { label: 'Pay My Bill', href: 'https://securelink-prod.valorpaytech.com:4430/?redirect=1&uid=ee7b47e6-1bc6-11f1-8df0-12a0879a85b1' },
  { label: 'Contact', href: '/contactclone' },
]

export function PracticeHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  // Which mobile submenu is expanded (accordion — only one at a time so the
  // menu stays short enough that every top-level item is reachable)
  const [openSub, setOpenSub] = useState(null)
  // Collapse the lockup to the starfish mark once the page is scrolled, or
  // whenever the lockup and full menu would collide (the lg–xl band)
  const [compact, setCompact] = useState(false)

  useEffect(() => {
    const band = window.matchMedia('(min-width: 1024px) and (max-width: 1279px)')
    const update = () => setCompact(window.scrollY > 40 || band.matches)
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    band.addEventListener('change', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      band.removeEventListener('change', update)
    }
  }, [])

  return (
    <>
      {/* Utility bar — call/text, centered at every width */}
      <div className="bg-primary text-on-primary">
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 h-10 flex items-center justify-center gap-4">
          <div className="flex items-center gap-4 sm:gap-5 font-label text-[11px] tracking-[0.12em]">
            <a href="tel:9042419775" className="flex items-center gap-2 hover:text-primary-container transition whitespace-nowrap">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.22a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="hidden min-[400px]:inline">CALL </span>(904) 241-9775
            </a>
            <a href="sms:9044416725" className="flex items-center gap-2 hover:text-primary-container transition whitespace-nowrap">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="hidden min-[400px]:inline">TEXT </span>(904) 441-6725
            </a>
          </div>
        </div>
      </div>

      {/* Alliance ribbon — a "proud member" strip beneath the contact bar,
          mirroring the live TopLine MD site. Soft-neutral bg holds the
          dark logo and separates it from the white sticky header below. */}
      <a
        href="https://www.toplinemd.com/"
        aria-label="Proud member of the TopLine MD Alliance"
        className="block bg-surface-container-low border-b border-outline-variant/40 hover:bg-surface-container transition"
      >
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 h-9 md:h-10 flex items-center justify-center gap-2.5 md:gap-3">
          <span className="font-label text-[9px] md:text-[10px] tracking-[0.18em] uppercase text-on-surface-variant whitespace-nowrap">
            Proud member of the
          </span>
          <img src={toplineHorizontal} alt="TopLine MD Alliance" className="h-3.5 md:h-4 w-auto" />
        </div>
      </a>

      {/* No bottom border: a white hairline is the usual glass edge, but this
          header travels over dark photo heroes and the teal bands, where it
          reads as a bright line. A soft shadow separates it on light content
          and disappears on dark. */}
      <header className="sticky top-0 z-40 bg-white/55 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_1px_3px_rgb(47_86_100_/_0.07)]">
      <div className="max-w-[1240px] mx-auto px-5 md:px-10 h-20 md:h-24 flex items-center gap-6">
        {/* Full lockup at rest; crossfades to the starfish mark on scroll
            (and in the lg–xl band where lockup + menu would collide) */}
        <a
          href="/mainclone"
          aria-label="Beaches OBGYN"
          className={`relative shrink-0 flex items-center h-[4.2rem] md:h-[4.8rem] transition-[width] duration-300 ${
            compact ? 'w-12 md:w-14' : 'w-[168px] md:w-[193px]'
          }`}
        >
          <img
            src={logo}
            alt="Beaches OBGYN — TopLine MD Alliance"
            className={`absolute left-0 h-full w-auto max-w-none transition-opacity duration-300 ${
              compact ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <Starfish
            className={`absolute left-0 w-12 h-12 md:w-14 md:h-14 text-primary transition-opacity duration-300 ${
              compact ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          />
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
                  {/* glass-menu, not glass: the panel hangs outside the
                      header's backdrop root, so a backdrop-filter here is a
                      no-op and the labels end up bare on the hero */}
                  <div className="glass-menu rounded-md py-2 min-w-56">
                    {item.children.map(c => (
                      <a
                        key={c.label}
                        href={c.href}
                        className="block px-5 py-2.5 font-label text-[11px] tracking-[0.12em] uppercase text-on-surface-variant hover:text-primary hover:bg-primary-container/40 transition whitespace-nowrap"
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
          onClick={() => { setMenuOpen(o => !o); setOpenSub(null) }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {menuOpen
              ? <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              : <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />}
          </svg>
        </button>
      </div>

      {menuOpen && (
        // Held at /85 rather than the /55 used elsewhere: this is a scrolling
        // list of links, and content sliding underneath a lighter glass makes
        // the labels swim.
        <nav className="lg:hidden border-t border-outline-variant/40 bg-white/85 backdrop-blur-2xl backdrop-saturate-150 px-5 py-3 max-h-[calc(100dvh-11rem)] overflow-y-auto overscroll-contain">
          {NAV.map(item => (
            <div key={item.label} className="border-b border-outline-variant/30 last:border-0">
              {item.children ? (
                <>
                  {/* Label navigates; the chevron toggles the submenu */}
                  <div className="flex items-center">
                    <a
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex-1 py-3 font-label text-xs tracking-[0.18em] uppercase text-on-surface"
                    >
                      {item.label}
                    </a>
                    <button
                      type="button"
                      onClick={() => setOpenSub(openSub === item.label ? null : item.label)}
                      aria-expanded={openSub === item.label}
                      aria-label={`Toggle ${item.label} submenu`}
                      className="p-3 -mr-3 text-on-surface-variant"
                    >
                      <svg
                        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        className={`transition-transform duration-300 ${openSub === item.label ? 'rotate-180' : ''}`}
                        aria-hidden="true"
                      >
                        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                  <div
                    className="grid transition-[grid-template-rows] duration-300 ease-in-out"
                    style={{ gridTemplateRows: openSub === item.label ? '1fr' : '0fr' }}
                  >
                    <div className="overflow-hidden">
                      <div className="pb-2">
                        {item.children.map(c => (
                          <a
                            key={c.label}
                            href={c.href}
                            onClick={() => setMenuOpen(false)}
                            className="block py-1.5 pl-4 font-label text-[11px] tracking-[0.12em] uppercase text-on-surface-variant"
                          >
                            {c.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <a
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-3 font-label text-xs tracking-[0.18em] uppercase text-on-surface"
                >
                  {item.label}
                </a>
              )}
            </div>
          ))}
          <a href={APPOINTMENT_URL} className="mt-4 inline-block font-label text-xs tracking-[0.18em] uppercase bg-primary text-on-primary px-5 py-3 rounded-full">
            Request an Appointment
          </a>
        </nav>
      )}
      </header>
    </>
  )
}

function HomeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="shrink-0 mt-0.5 text-primary" aria-hidden="true">
      <path d="M3 10.5 12 3l9 7.5M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function PracticeFooter() {
  return (
    <footer className="glass-band text-on-surface">
      <div className="max-w-[1240px] mx-auto px-5 md:px-10 py-16">
        <div className="grid lg:grid-cols-[1.9fr_1fr] gap-12 lg:gap-16">
          {/* Left region — co-branded lockup + info columns */}
          <div>
            <img src={logo} alt="Beaches OBGYN — TopLine MD Alliance" className="h-16 w-auto" />

            <div className="mt-12 grid gap-10 sm:grid-cols-3">
              <div>
                <h4 className="font-label text-xs tracking-[0.2em] uppercase text-on-surface-variant mb-5">Contact Information</h4>
                <p className="flex gap-2.5 text-sm leading-relaxed text-on-surface-variant">
                  <HomeIcon />
                  <span>1577 Roberts Drive, Suite 323<br />Jacksonville Beach, FL 32250</span>
                </p>
                <p className="mt-4 flex gap-2.5 text-sm leading-relaxed text-on-surface-variant">
                  <HomeIcon />
                  <span>9010 RG Skinner Parkway, Suite 102<br />Jacksonville, FL 32256</span>
                </p>
                <p className="mt-5 space-y-1.5 text-sm text-on-surface-variant">
                  <a href="tel:9042419775" className="flex items-center gap-2.5 hover:text-primary transition">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-primary" aria-hidden="true">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.22a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    (904) 241-9775
                  </a>
                  <span className="flex items-center gap-2.5">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-primary" aria-hidden="true">
                      <path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    (904) 249-3638 (fax)
                  </span>
                </p>
              </div>
              <div>
                <h4 className="font-label text-xs tracking-[0.2em] uppercase text-on-surface-variant mb-5">Services</h4>
                <ul className="text-sm space-y-2 text-on-surface-variant">
                  <li>Obstetrics</li>
                  <li>Gynecology</li>
                  <li>Minimally Invasive Surgery</li>
                  <li>Hormone Replacement</li>
                </ul>
              </div>
              <div>
                <h4 className="font-label text-xs tracking-[0.2em] uppercase text-on-surface-variant mb-5">Office Hours</h4>
                <p className="text-sm leading-relaxed text-on-surface-variant">
                  <span className="text-on-surface">Monday – Thursday:</span><br />
                  9:00am – 12:00pm<br />
                  2:00pm – 5:00pm
                </p>
                <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">
                  <span className="text-on-surface">Friday:</span> 9:00am – 12:00pm
                </p>
              </div>
            </div>
          </div>

          {/* Right region — alliance logo + membership statement */}
          <div className="lg:pl-8 lg:border-l lg:border-outline-variant/40">
            <a href="https://www.toplinemd.com/" aria-label="TopLine MD Alliance">
              <img src={allianceLogo} alt="TopLine MD Alliance" className="h-11 w-auto" />
            </a>
            <p className="mt-8 text-sm leading-relaxed text-on-surface-variant">
              We are a member of the TopLine MD Alliance, a collective group of
              practices, providers and specialty centers that help patients
              navigate a complicated healthcare system. Membership in the
              Alliance is highly selective and based on exceptional patient
              satisfaction. Our priority is to provide you with top-of-the-line
              care, through a network of dedicated people you can trust, while
              making your experience simple and convenient.
            </p>
            <a
              href="https://www.toplinemd.com/"
              className="mt-4 inline-block text-sm text-primary font-medium hover:underline"
            >
              Learn more about the Alliance &rsaquo;
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-outline-variant/40">
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 py-6 flex flex-col md:flex-row gap-3 items-center justify-between text-xs text-on-surface-variant">
          <p>© Copyright 2012</p>
          <div className="flex gap-6">
            <a href="https://www.toplinemd.com/practice-terms-policies/" className="hover:text-primary transition">Terms and Policies</a>
            <a href="https://www.toplinemd.com/affiliation-disclaimer/" className="hover:text-primary transition">Affiliation Disclaimer</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
