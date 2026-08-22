"use client"

import { useEffect } from "react"
import Lenis from "lenis"

export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // PROTOTYPE-ONLY (wayfinder #55): exposed so /prototype/assessment can stop
    // Lenis for the eighteen. A 1.2s global smoothing turns every programmatic
    // jump in the journey into a second of drift, which would read as a finding
    // about the design rather than about the scroll library. Revert with the
    // rest of the prototype branch.
    ;(window as unknown as { __lenis?: Lenis }).__lenis = lenis

    return () => {
      delete (window as unknown as { __lenis?: Lenis }).__lenis
      lenis.destroy()
    }
  }, [])

  return null
}
