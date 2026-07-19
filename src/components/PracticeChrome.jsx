// Shared chrome for the hidden practice-site prototypes (/mainclone,
// /misclone): navigation mirroring toplinemd.com/beaches-obgyn's menu and
// a footer reproducing its content, both styled in the coastal palette.

import { useState } from 'react'
import logo from '../assets/toplinelogo.png'

export const APPOINTMENT_URL = 'https://www.toplinemd.com/beaches-obgyn/new-patients/#appoitment'

const NAV = [
  { label: 'About', href: 'https://www.toplinemd.com/beaches-obgyn/about/' },
  {
    label: 'Services',
    href: '/mainclone#services',
    children: [
      { label: 'GYN Services', href: 'https://www.toplinemd.com/beaches-obgyn/gyn-services/' },
      { label: 'OB Services', href: 'https://www.toplinemd.com/beaches-obgyn/ob-services/' },
      { label: 'Minimally Invasive Surgery', href: '/misclone' },
    ],
  },
  { label: 'Our Team', href: '/mainclone#physicians' },
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

export function PracticeHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      {/* Utility bar — phone/text on the left, alliance membership on the right */}
      <div className="bg-primary text-on-primary">
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 h-10 flex items-center justify-between gap-4">
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

      <header className="sticky top-0 z-40 bg-surface-container-lowest/95 backdrop-blur border-b border-outline-variant/40">
      <div className="max-w-[1240px] mx-auto px-5 md:px-10 h-20 md:h-24 flex items-center gap-6">
        <a href="/mainclone" aria-label="Beaches OBGYN">
          <img src={logo} alt="Beaches OBGYN — TopLine MD Alliance" className="block h-14 md:h-16 w-auto" />
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
    </>
  )
}

export function PracticeFooter() {
  return (
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
  )
}
