'use client'

import { MapPin, Info, MessageSquare } from 'lucide-react'

interface Startup {
  id: string
  name: string
  logo: string | null
  shortDescription: string
  geo: string
  stage: string
  tags: string
  seekingInvestment?: boolean
}

interface SwipeCardProps {
  startup: Startup
  onCommentsClick?: () => void
}

export default function SwipeCard({ startup, onCommentsClick }: SwipeCardProps) {
  return (
    <div className="relative h-full w-full bg-white rounded-[32px] ios-shadow border border-gray-100/50 overflow-hidden select-none">
        
        {/* Comments Button - Top Right */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onCommentsClick?.()
          }}
          className="absolute top-4 right-4 z-20 w-11 h-11 bg-white/30 backdrop-blur-xl border border-white/40 rounded-full shadow-sm flex items-center justify-center text-white hover:bg-white/40 hover:scale-105 active:scale-95 transition-all duration-200 pointer-events-auto"
        >
          <MessageSquare className="w-5 h-5" strokeWidth={2.5} />
        </button>
        
        {/* Investment Badge */}
        {startup.seekingInvestment && (
          <div className="absolute top-4 left-4 z-10 bg-emerald-500/90 backdrop-blur-md border border-white/20 text-white px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm flex items-center gap-1.5">
            <span className="text-sm">💰</span> Ищем инвестиции
          </div>
        )}
        
        {/* Full height image */}
        <div className="absolute inset-0 bg-gray-100">
          {startup.logo ? (
            <img
              src={startup.logo}
              alt={startup.name}
              className="w-full h-full object-cover pointer-events-none"
              draggable={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
              <span className="text-8xl font-bold text-slate-300">
                {startup.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-slate-950/95 via-slate-900/60 to-transparent pointer-events-none" />

        {/* Text Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-7 text-white pointer-events-none">
          <h2 className="text-3xl font-bold leading-tight drop-shadow-sm mb-1.5">
            {startup.name}
          </h2>

          <div className="flex items-center gap-1.5 text-white/90 mb-3.5 text-sm font-medium drop-shadow-sm pointer-events-none">
            <MapPin className="w-4 h-4 text-white/70" strokeWidth={2.5} />
            <span>{startup.geo}</span>
          </div>

          <p className="text-white/80 line-clamp-2 text-[15px] leading-relaxed mb-2 drop-shadow-sm font-medium pointer-events-none">
            {startup.shortDescription}
          </p>
        </div>
    </div>
  )
}
