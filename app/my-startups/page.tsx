'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CheckCircle, Clock, XCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface Startup {
  id: string
  name: string
  logo: string | null
  shortDescription: string
  status: string
  createdAt: string
  tags: string
  paymentStatus?: string
  rejectReason?: string
  priceRub?: number
}

export default function MyStartupsPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [startups, setStartups] = useState<Startup[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin')
      return
    }
    
    if (user) {
      fetchMyStartups()
    }
  }, [user, authLoading])

  const fetchMyStartups = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/my-startups')
      if (response.ok) {
        const data = await response.json()
        setStartups(data)
      }
    } catch (error) {
      console.error('Error fetching startups:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string, paymentStatus?: string) => {
    if (status === 'approved' && paymentStatus === 'paid') {
      return (
        <span className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 rounded-full text-xs font-semibold backdrop-blur-md shadow-sm">
          <CheckCircle className="w-3.5 h-3.5" />
          Опубликовано
        </span>
      )
    }
    
    switch (status) {
      case 'approved':
        return (
          <span className="flex items-center gap-1 px-3 py-1.5 bg-green-500/10 border border-green-500/20 text-green-700 rounded-full text-xs font-semibold backdrop-blur-md shadow-sm">
            <CheckCircle className="w-3.5 h-3.5" />
            Ждёт оплаты
          </span>
        )
      case 'pending':
        return (
          <span className="flex items-center gap-1 px-3 py-1.5 bg-gray-500/10 border border-gray-500/20 text-gray-700 rounded-full text-xs font-semibold backdrop-blur-md shadow-sm">
            <Clock className="w-3.5 h-3.5" />
            На модерации
          </span>
        )
      case 'rejected':
        return (
          <span className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-700 rounded-full text-xs font-semibold backdrop-blur-md shadow-sm">
            <XCircle className="w-3.5 h-3.5" />
            Отклонено
          </span>
        )
      default:
        return null
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push('/')}
            className="w-10 h-10 glass-button flex items-center justify-center text-gray-700"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Мои стартапы
          </h1>
        </div>

        {/* Startups List */}
        {startups.length === 0 ? (
          <div className="glass-panel rounded-3xl p-8 text-center">
            <div className="text-6xl mb-6 drop-shadow-md">🚀</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              У вас пока нет стартапов
            </h2>
            <p className="text-gray-500 mb-8 font-medium">
              Предложите свой стартап и он появится здесь
            </p>
            <button
              onClick={() => router.push('/submit')}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-[0_8px_30px_rgb(59,130,246,0.3)] hover:shadow-[0_8px_30px_rgb(59,130,246,0.4)] active:scale-95"
            >
              Предложить стартап
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {startups.map((startup) => (
              <div
                key={startup.id}
                className="glass-panel rounded-3xl p-5 hover:bg-white/80 transition-all duration-200 cursor-pointer group"
                onClick={() => startup.status === 'approved' && startup.paymentStatus === 'paid' && router.push(`/startup/${startup.id}`)}
              >
                <div className="flex gap-4">
                  {/* Logo */}
                  <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 shadow-sm border border-gray-100/50">
                    {startup.logo ? (
                      <img
                        src={startup.logo}
                        alt={startup.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400">
                        {startup.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 className="text-lg font-bold text-gray-900 truncate pr-2 group-hover:text-blue-600 transition-colors">
                        {startup.name}
                      </h3>
                      <div className="flex-shrink-0">
                        {getStatusBadge(startup.status, startup.paymentStatus)}
                      </div>
                    </div>
                    <p className="text-[15px] text-gray-600 line-clamp-2 mb-3 leading-relaxed font-medium">
                      {startup.shortDescription}
                    </p>
                    
                    {/* Reject Reason */}
                    {startup.status === 'rejected' && startup.rejectReason && (
                      <div className="mb-3 p-3 bg-red-50/80 backdrop-blur-sm border border-red-100/50 rounded-xl shadow-sm">
                        <p className="text-[13px] text-red-800 leading-relaxed">
                          <span className="font-bold">Причина отказа:</span> {startup.rejectReason}
                        </p>
                      </div>
                    )}
                    
                    {/* Payment Button for APPROVED + UNPAID */}
                    {startup.status === 'approved' && startup.paymentStatus === 'unpaid' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/pay/${startup.id}`)
                        }}
                        className="w-full mt-1 p-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold hover:from-emerald-600 hover:to-teal-700 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                      >
                        💳 Оплатить {startup.priceRub || 290} ₽
                      </button>
                    )}
                    
                    {/* Open Card Link for PAID startups */}
                    {startup.status === 'approved' && startup.paymentStatus === 'paid' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/startup/${startup.id}`)
                        }}
                        className="w-full mt-1 p-3 glass-button text-blue-600 font-bold text-sm flex items-center justify-center gap-2 border-blue-100"
                      >
                        🚀 Открыть карточку
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
