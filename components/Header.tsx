'use client'

import { useState } from 'react'
import { User, TrendingUp, Filter } from 'lucide-react'
import { useRouter } from 'next/navigation'
import ProfileMenu from './ProfileMenu'
import CategoryFilter from './CategoryFilter'

interface HeaderProps {
  geo: 'Russia' | 'Worldwide'
  onGeoChange: (geo: 'Russia' | 'Worldwide') => void
  selectedCategory: string | null
  onCategoryChange: (category: string | null) => void
  likesCount?: number
}

export default function Header({ geo, onGeoChange, selectedCategory, onCategoryChange, likesCount = 0 }: HeaderProps) {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  return (
    <>
      <div className="w-full px-4 py-3 z-40 relative">
        <div className="max-w-md mx-auto flex items-center justify-between">
          {/* Profile Avatar - Left */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="w-10 h-10 glass-button flex items-center justify-center text-gray-700"
          >
            <User className="w-5 h-5" strokeWidth={2} />
          </button>

          {/* Geo Toggle - Center */}
          <div className="flex glass-panel rounded-full p-1">
            <button
              onClick={() => onGeoChange('Russia')}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                geo === 'Russia'
                  ? 'bg-white text-gray-900 shadow-sm ios-shadow'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Россия
            </button>
            <button
              onClick={() => onGeoChange('Worldwide')}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                geo === 'Worldwide'
                  ? 'bg-white text-gray-900 shadow-sm ios-shadow'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Весь мир
            </button>
          </div>

          {/* Right Buttons Group */}
          <div className="flex items-center gap-2">
            {/* Filter Button */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className={`w-10 h-10 glass-button flex items-center justify-center ${
                selectedCategory ? 'bg-blue-500 border-blue-400 text-white' : 'text-gray-700'
              }`}
            >
              <Filter className="w-5 h-5" strokeWidth={2} />
            </button>

            {/* Rating Button */}
            <button
              onClick={() => router.push('/rating')}
              className="w-10 h-10 glass-button flex items-center justify-center text-gray-700"
            >
              <TrendingUp className="w-5 h-5" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      {/* Profile Menu Modal */}
      <ProfileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        likesCount={likesCount}
      />

      {/* Filter Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end" onClick={() => setIsFilterOpen(false)}>
          <div className="glass-bottom-sheet w-full max-w-md mx-auto p-6 pb-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-center mb-6">
              <div className="w-12 h-1.5 bg-gray-300/50 rounded-full" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Фильтры</h2>
            <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={(cat) => {
              onCategoryChange(cat)
              setIsFilterOpen(false)
            }} />
          </div>
        </div>
      )}
    </>
  )
}
