'use client'

import { Trophy, ExternalLink } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface TopStartup {
  id: string
  name: string
  logo: string | null
  likesCount: number
}

interface TopStartupsProps {
  startups: TopStartup[]
}

export default function TopStartups({ startups }: TopStartupsProps) {
  const router = useRouter()

  const getMedalColor = (index: number) => {
    if (index === 0) return 'text-yellow-500'
    if (index === 1) return 'text-gray-400'
    if (index === 2) return 'text-orange-500'
    return 'text-gray-300'
  }

  const getRankBg = (index: number) => {
    if (index === 0) return 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200'
    if (index === 1) return 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200'
    if (index === 2) return 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200'
    return 'bg-white border-gray-100'
  }

  if (startups.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-yellow-500" />
        <h2 className="text-lg font-bold text-gray-900">Топ-5 стартапов по лайкам</h2>
      </div>

      <div className="space-y-3">
        {startups.map((startup, index) => (
          <div
            key={startup.id}
            className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${getRankBg(index)}`}
          >
            {/* Rank */}
            <div className="flex items-center justify-center w-8">
              {index < 3 ? (
                <Trophy className={`w-6 h-6 ${getMedalColor(index)}`} />
              ) : (
                <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
              )}
            </div>

            {/* Logo */}
            <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
              {startup.logo ? (
                <img
                  src={startup.logo}
                  alt={startup.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {startup.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900 truncate">{startup.name}</h3>
              <p className="text-sm text-gray-600">
                <Heart className="w-4 h-4 inline text-red-500 mr-1" />
                {startup.likesCount} {startup.likesCount === 1 ? 'лайк' : 'лайков'}
              </p>
            </div>

            {/* Open Button */}
            <button
              onClick={() => router.push(`/startup/${startup.id}`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              Открыть
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function Heart({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
        clipRule="evenodd"
      />
    </svg>
  )
}
