'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, TrendingUp, RefreshCw } from 'lucide-react'

interface RatedStartup {
  id: string
  name: string
  logo: string | null
  geo: string
  shortDescription: string
  likesCount: number
}

export default function RatingPage() {
  const router = useRouter()
  const [startups, setStartups] = useState<RatedStartup[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'Russia' | 'Worldwide'>('all')

  useEffect(() => {
    fetchRating()
  }, [filter])

  const fetchRating = async () => {
    setLoading(true)
    try {
      const url = filter === 'all' 
        ? '/api/rating' 
        : `/api/rating?geo=${filter}`
      const response = await fetch(url)
      const data = await response.json()
      setStartups(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching rating:', error)
      setStartups([])
    } finally {
      setLoading(false)
    }
  }

  const getRankStyle = (index: number) => {
    if (index === 0) return 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-300'
    if (index === 1) return 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-300'
    if (index === 2) return 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-300'
    return 'bg-white border-gray-100'
  }

  const getRankBadge = (index: number) => {
    if (index === 0) return 'bg-yellow-500 text-white'
    if (index === 1) return 'bg-gray-400 text-white'
    if (index === 2) return 'bg-orange-500 text-white'
    return 'bg-gray-100 text-gray-600'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-2xl font-semibold text-gray-900 flex-1">
            Рейтинг стартапов
          </h1>
          <button
            onClick={fetchRating}
            disabled={loading}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 text-gray-700 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Все
          </button>
          <button
            onClick={() => setFilter('Russia')}
            className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all ${
              filter === 'Russia'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Россия
          </button>
          <button
            onClick={() => setFilter('Worldwide')}
            className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all ${
              filter === 'Worldwide'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Весь мир
          </button>
        </div>

        {/* Rating List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : startups.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">Нет данных для отображения</p>
          </div>
        ) : (
          <div className="space-y-3">
            {startups.map((startup, index) => (
              <button
                key={startup.id}
                onClick={() => router.push(`/startup/${startup.id}`)}
                className={`w-full p-4 rounded-2xl border-2 transition-all hover:shadow-md active:scale-98 ${getRankStyle(index)}`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank Badge */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${getRankBadge(index)}`}>
                    {index + 1}
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
                  <div className="flex-1 text-left min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">
                      {startup.name}
                    </h3>
                    <p className="text-xs text-gray-600 truncate">
                      {startup.shortDescription}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-lg font-medium">
                        {startup.geo}
                      </span>
                    </div>
                  </div>

                  {/* Likes Count */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-sm font-bold text-green-600">
                      {startup.likesCount}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
