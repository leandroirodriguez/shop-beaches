import { useEffect, useRef, useState } from 'react'

// Wraps any content with a quiet fade-up reveal that fires when the
// element scrolls into view. Respects prefers-reduced-motion.
// Default: 16px slide, 700ms ease-out, triggers when 15% visible.

export default function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true)
      return
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            window.setTimeout(() => setShown(true), delay)
            observer.disconnect()
          }
        })
      },
      // threshold:0 fires when ANY part of the element enters the
      // viewport — important for tall mobile grids where a 15%
      // threshold meant the user had to scroll hundreds of pixels
      // into invisible content before it faded in.
      { threshold: 0, rootMargin: '0px 0px -60px 0px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [delay])

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } ${className}`}
    >
      {children}
    </div>
  )
}
