"use client"

import { useEffect, useRef } from "react"

export function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const createParticle = () => {
      const particle = document.createElement("div")
      particle.className = "particle"

      const size = Math.random() * 4 + 2
      particle.style.width = `${size}px`
      particle.style.height = `${size}px`
      particle.style.left = `${Math.random() * 100}%`
      particle.style.animationDuration = `${Math.random() * 10 + 15}s`
      particle.style.animationDelay = `${Math.random() * 5}s`

      container.appendChild(particle)

      setTimeout(() => {
        if (container.contains(particle)) {
          container.removeChild(particle)
        }
      }, 25000)
    }

    const interval = setInterval(createParticle, 300)

    // Create initial particles
    for (let i = 0; i < 20; i++) {
      setTimeout(createParticle, i * 100)
    }

    return () => {
      clearInterval(interval)
    }
  }, [])

  return <div ref={containerRef} className="particle-bg" />
}
