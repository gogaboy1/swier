'use client'

import { useState, useEffect } from 'react'
import SwipeCard from './SwipeCard'

interface Startup {
  id: string
  name: string
  logo: string | null
  shortDescription: string
  geo: string
  stage: string
  tags: string
}

interface SwipeCardWrapperProps {
  startup: Startup
  cardRef: any
}

export default function SwipeCardWrapper({ startup, cardRef }: SwipeCardWrapperProps) {
  const [swipeOffset, setSwipeOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const card = cardRef?.current
    if (!card) return

    let animationFrameId: number

    const updatePosition = () => {
      const element = card.querySelector('[data-swipe-card]')
      if (element) {
        const transform = window.getComputedStyle(element).transform
        if (transform && transform !== 'none') {
          const matrix = new DOMMatrix(transform)
          setSwipeOffset({ x: matrix.m41, y: matrix.m42 })
        }
      }
      animationFrameId = requestAnimationFrame(updatePosition)
    }

    animationFrameId = requestAnimationFrame(updatePosition)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [cardRef])

  // Calculate opacity based on swipe distance
  const maxSwipeDistance = 150
  const swipeDistance = Math.abs(swipeOffset.x)
  const opacity = Math.min(swipeDistance / maxSwipeDistance, 0.5)

  // Determine color based on direction
  const isSwipingRight = swipeOffset.x > 10
  const isSwipingLeft = swipeOffset.x < -10

  return (
    <div className="relative w-full h-full" data-swipe-card>
      <SwipeCard startup={startup} />
      
      {/* Green overlay for right swipe (like) */}
      {isSwipingRight && (
        <div 
          className="absolute inset-0 bg-green-500 rounded-3xl pointer-events-none transition-opacity duration-100"
          style={{ opacity }}
        />
      )}
      
      {/* Red overlay for left swipe (dislike) */}
      {isSwipingLeft && (
        <div 
          className="absolute inset-0 bg-red-500 rounded-3xl pointer-events-none transition-opacity duration-100"
          style={{ opacity }}
        />
      )}
    </div>
  )
}
