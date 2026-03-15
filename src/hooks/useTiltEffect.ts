/* useTiltEffect.ts — 3D tilt hover hook (Claude-style card animation) */

import { useRef, useCallback } from 'react'

interface TiltStyle {
  transform: string
  transition: string
}

export function useTiltEffect(intensity = 8) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    const rotateX = ((cy - y) / cy) * intensity
    const rotateY = ((x - cx) / cx) * intensity
    el.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`
    el.style.transition = 'transform 0.08s ease-out'
  }, [intensity])

  const handleMouseLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg) translateY(0)'
    el.style.transition = 'transform 0.35s ease'
  }, [])

  return { ref, handleMouseMove, handleMouseLeave }
}
