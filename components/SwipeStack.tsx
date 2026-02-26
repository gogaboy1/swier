'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import SwipeableCard from './SwipeableCard'
import SwipeCard from './SwipeCard'
import ContactModal from './ContactModal'
import CommentsModal from './CommentsModal'
import { Heart, X, Undo2, Info, MessageCircle, MessageSquare } from 'lucide-react'

interface Startup {
  id: string
  name: string
  logo: string | null
  shortDescription: string
  geo: string
  stage: string
  tags: string
  telegramUsername?: string | null
  email?: string | null
  website?: string | null
}

interface SwipeStackProps {
  startups: Startup[]
  onSwipe: (direction: 'left' | 'right', startupId: string) => void
  undoCount?: number
  onUndo?: () => void
}

export default function SwipeStack({ startups, onSwipe, undoCount = 0, onUndo }: SwipeStackProps) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(startups.length - 1)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false)
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null)

  const canSwipe = currentIndex >= 0

  const handleSwipe = (direction: 'left' | 'right') => {
    if (currentIndex >= 0 && currentIndex < startups.length) {
      const startup = startups[currentIndex]
      onSwipe(direction, startup.id)
      setCurrentIndex(currentIndex - 1)
    }
  }

  const swipe = (dir: 'left' | 'right') => {
    handleSwipe(dir)
  }

  const handleContactClick = () => {
    if (currentIndex >= 0 && currentIndex < startups.length) {
      setSelectedStartup(startups[currentIndex])
      setIsContactModalOpen(true)
    }
  }

  const handleCommentsClick = () => {
    if (currentIndex >= 0 && currentIndex < startups.length) {
      setSelectedStartup(startups[currentIndex])
      setIsCommentsModalOpen(true)
    }
  }

  if (startups.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center px-8">
          <div className="relative w-24 h-24 mx-auto mb-6">
             <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-20"></div>
             <div className="relative bg-white p-4 rounded-full shadow-sm border border-gray-100">
                <p className="text-5xl">🎉</p>
             </div>
          </div>
          <p className="text-xl font-semibold text-gray-900 mb-2">Стартапов больше нет</p>
          <p className="text-sm text-gray-500">Загляните позже, чтобы увидеть новые проекты</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-1 relative w-full max-w-sm mx-auto">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Render current card and next 2 cards for stacking effect */}
          {startups.map((startup, index) => {
            // Since we render from end to start, next cards are at LOWER indices
            const isActive = index === currentIndex
            const isNext = (currentIndex - 1 >= 0) && (index === currentIndex - 1)
            const isNextNext = (currentIndex - 2 >= 0) && (index === currentIndex - 2)
            
            // Only render if this is one of the top 3 cards
            if (!isActive && !isNext && !isNextNext) return null
            
            let zIndex = 0
            let scale = 1
            let translateY = 0
            let opacity = 1
            let blur = 0
            
            if (isActive) {
              zIndex = 30
              scale = 1
              translateY = 0
              opacity = 1
              blur = 0
            } else if (isNext) {
              zIndex = 20
              scale = 0.94
              translateY = 18
              opacity = 0.85
              blur = 2
            } else if (isNextNext) {
              zIndex = 10
              scale = 0.88
              translateY = 34
              opacity = 0.7
              blur = 4
            }
            
            return (
              <div
                key={startup.id}
                className="absolute w-full h-full transition-all duration-300 ease-out"
                style={{
                  zIndex,
                  transform: `scale(${scale}) translateY(${translateY}px)`,
                  opacity,
                  pointerEvents: isActive ? 'auto' : 'none',
                  transformOrigin: 'center center',
                  filter: blur > 0 ? `blur(${blur}px)` : 'none'
                }}
              >
                {isActive ? (
                  <SwipeableCard
                    startup={startup}
                    onSwipe={handleSwipe}
                    isActive={true}
                    onCommentsClick={handleCommentsClick}
                  />
                ) : (
                  <div className="relative w-full h-full pointer-events-none">
                    <SwipeCard startup={startup} onCommentsClick={handleCommentsClick} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex justify-center items-center gap-5 py-6 pb-8">
        {/* Undo Button - Yellow */}
        <button
          onClick={onUndo}
          disabled={undoCount === 0}
          className="w-12 h-12 rounded-full glass-button flex items-center justify-center text-amber-500 disabled:opacity-30 disabled:cursor-not-allowed"
        >
           <Undo2 className="w-5 h-5" strokeWidth={2.5} />
        </button>

        {/* Dislike Button */}
        <button
          onClick={() => swipe('left')}
          disabled={!canSwipe}
          className="w-16 h-16 rounded-full glass-button flex items-center justify-center text-rose-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X className="w-8 h-8" strokeWidth={3} />
        </button>

        {/* Info Button */}
        <button
          onClick={() => {
            if (currentIndex >= 0 && currentIndex < startups.length) {
              router.push(`/startup/${startups[currentIndex].id}`)
            }
          }}
          disabled={!canSwipe}
          className="w-12 h-12 rounded-full glass-button flex items-center justify-center text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Info className="w-6 h-6" strokeWidth={2.5} />
        </button>

        {/* Like Button */}
        <button
          onClick={() => swipe('right')}
          disabled={!canSwipe}
          className="w-16 h-16 rounded-full glass-button flex items-center justify-center text-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Heart className="w-8 h-8" strokeWidth={3} fill="currentColor" />
        </button>

         {/* Contact Button */}
         <button
          onClick={handleContactClick}
          disabled={!canSwipe}
          className="w-12 h-12 rounded-full glass-button flex items-center justify-center text-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
           <MessageCircle className="w-6 h-6" strokeWidth={2.5} />
        </button>
      </div>

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        startup={selectedStartup}
      />

      {/* Comments Modal */}
      {selectedStartup && (
        <CommentsModal
          isOpen={isCommentsModalOpen}
          onClose={() => setIsCommentsModalOpen(false)}
          startupId={selectedStartup.id}
          startupName={selectedStartup.name}
        />
      )}
    </div>
  )
}
