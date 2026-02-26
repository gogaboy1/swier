'use client'

import { useState } from 'react'
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion'
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

interface SwipeableCardProps {
  startup: Startup
  onSwipe: (direction: 'left' | 'right') => void
  onSwipeStart?: () => void
  onSwipeEnd?: () => void
  isActive: boolean
  onCommentsClick?: () => void
}

export default function SwipeableCard({ 
  startup, 
  onSwipe, 
  onSwipeStart,
  onSwipeEnd,
  isActive,
  onCommentsClick
}: SwipeableCardProps) {
  const [exitX, setExitX] = useState(0)
  const x = useMotionValue(0)
  
  // Calculate rotation based on horizontal position
  const rotate = useTransform(x, [-200, 200], [-25, 25])
  
  // Calculate opacity for overlays based on position
  const likeOpacity = useTransform(x, [0, 150], [0, 0.5])
  const nopeOpacity = useTransform(x, [-150, 0], [0.5, 0])

  const handleDragEnd = (event: any, info: PanInfo) => {
    const threshold = 150
    
    if (Math.abs(info.offset.x) > threshold) {
      // Swipe completed
      setExitX(info.offset.x > 0 ? 1000 : -1000)
      onSwipe(info.offset.x > 0 ? 'right' : 'left')
    }
    
    onSwipeEnd?.()
  }

  return (
    <motion.div
      className="absolute w-full h-full cursor-grab active:cursor-grabbing"
      style={{
        x,
        rotate,
      }}
      drag={isActive ? 'x' : false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={1}
      onDragStart={onSwipeStart}
      onDragEnd={handleDragEnd}
      animate={exitX !== 0 ? { x: exitX } : {}}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
    >
      <div className="relative w-full h-full">
        {/* Green overlay for like (right swipe) */}
        <motion.div
          className="absolute inset-0 bg-green-500 rounded-3xl pointer-events-none z-10"
          style={{ opacity: likeOpacity }}
        />
        
        {/* Red overlay for nope (left swipe) */}
        <motion.div
          className="absolute inset-0 bg-red-500 rounded-3xl pointer-events-none z-10"
          style={{ opacity: nopeOpacity }}
        />
        
        {/* Card content */}
        <SwipeCard startup={startup} onCommentsClick={onCommentsClick} />
      </div>
    </motion.div>
  )
}
