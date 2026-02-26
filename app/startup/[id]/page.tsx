'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { getTelegramLink, getWhatsAppLink, getEmailLink } from '@/lib/contacts'

interface Startup {
  id: string
  name: string
  logo: string | null
  shortDescription: string
  longDescription: string
  geo: string
  stage: string
  tags: string
  telegramUsername: string | null
  email: string | null
  whatsappPhone: string | null
  website: string | null
}

export default function StartupDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [startup, setStartup] = useState<Startup | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStartup()
  }, [params.id])

  const fetchStartup = async () => {
    try {
      const response = await fetch(`/api/startup-direct/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setStartup(data)
      }
    } catch (error) {
      console.error('Error fetching startup:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  if (!startup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Startup not found</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-6 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  const tags = startup.tags ? startup.tags.split(',') : []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">
            О стартапе
          </h1>
        </div>

        {/* Logo and Name */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
          <div className="flex items-center gap-4 mb-4">
            {startup.logo ? (
              <img
                src={startup.logo}
                alt={startup.name}
                className="w-16 h-16 rounded-2xl object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0">
                <span className="text-gray-400 text-2xl font-bold">
                  {startup.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {startup.name}
              </h2>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 bg-gray-100 rounded-lg text-xs font-medium text-gray-700">
                  {startup.stage}
                </span>
                <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
                  {startup.geo}
                </span>
              </div>
            </div>
          </div>

          {/* Short Description */}
          <p className="text-gray-600 text-sm leading-relaxed break-words">
            {startup.shortDescription}
          </p>
        </div>

        {/* Long Description */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Описание</h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere">
            {startup.longDescription}
          </p>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Теги</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Contacts */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Контакты</h3>
          <div className="space-y-3">
            {startup.telegramUsername && (
              <a
                href={getTelegramLink(startup.telegramUsername)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
              >
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">T</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">Telegram</p>
                  <p className="text-xs text-gray-600">{startup.telegramUsername}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </a>
            )}

            {startup.email && (
              <a
                href={getEmailLink(startup.email)}
                className="flex items-center gap-3 p-3 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
              >
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">@</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">Email</p>
                  <p className="text-xs text-gray-600 truncate">{startup.email}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </a>
            )}

            {startup.website && (
              <a
                href={startup.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
              >
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">🌐</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">Веб-сайт</p>
                  <p className="text-xs text-gray-600 truncate">{startup.website}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
