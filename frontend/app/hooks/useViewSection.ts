import { useEffect, useRef } from 'react'

export function useViewSection(eventName: string) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.gtag?.('event', eventName)
          observer.disconnect() // dispara apenas uma vez
        }
      },
      { threshold: 0.4 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [eventName])

  return ref
}
