'use client'

import { useEffect, useRef } from 'react'

interface HorizontalSwipeWrapperProps {
  children: React.ReactNode
}

export default function HorizontalSwipeWrapper({ children }: HorizontalSwipeWrapperProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    let isDragging = false
    let startY = 0

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true
      startY = e.clientY
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return

      const card = wrapper.querySelector('[class*="react-tinder-card"]') as HTMLElement
      if (!card) return

      // Get current transform
      const transform = window.getComputedStyle(card).transform
      if (transform && transform !== 'none') {
        const matrix = new DOMMatrix(transform)
        
        // Keep only horizontal movement, reset vertical to 0
        const newTransform = `translate(${matrix.m41}px, 0px) rotate(${Math.atan2(matrix.m21, matrix.m11) * (180 / Math.PI)}deg)`
        card.style.transform = newTransform
      }
    }

    const handleMouseUp = () => {
      isDragging = false
    }

    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  return <div ref={wrapperRef} className="w-full h-full">{children}</div>
}
