'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, CheckCircle, CreditCard } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface Startup {
  id: string
  name: string
  logo: string | null
  priceRub: number
  status: string
  paymentStatus: string
  userId: string
}

export default function PaymentPage() {
  const router = useRouter()
  const params = useParams()
  const { user, loading: authLoading } = useAuth()
  const [startup, setStartup] = useState<Startup | null>(null)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin')
      return
    }
    
    if (user && params.startupId) {
      fetchStartup()
    }
  }, [user, authLoading, params.startupId])

  const fetchStartup = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/startups/${params.startupId}`)
      if (response.ok) {
        const data = await response.json()
        setStartup(data)
        
        console.log('Startup userId:', data.userId)
        console.log('Current user id:', user?.id)
        
        // Validate payment eligibility
        if (data.status !== 'approved') {
          setError('Стартап должен быть одобрен для оплаты')
        } else if (data.paymentStatus === 'paid') {
          setError('Стартап уже оплачен')
        } else if (data.userId && data.userId !== user?.id) {
          setError('Вы не являетесь владельцем этого стартапа')
        }
      } else {
        setError('Стартап не найден')
      }
    } catch (error) {
      console.error('Error fetching startup:', error)
      setError('Ошибка загрузки данных')
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async () => {
    if (!startup || !user) return
    
    setPaying(true)
    try {
      const response = await fetch('/api/payments/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startupId: startup.id })
      })

      if (response.ok) {
        // Payment successful
        router.push('/my-startups?payment=success')
      } else {
        const data = await response.json()
        setError(data.error || 'Ошибка оплаты')
      }
    } catch (error) {
      console.error('Error processing payment:', error)
      setError('Ошибка обработки платежа')
    } finally {
      setPaying(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    )
  }

  if (error || !startup) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.push('/my-startups')}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="text-2xl font-semibold text-gray-900">Оплата</h1>
          </div>
          
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Ошибка
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push('/my-startups')}
              className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-all"
            >
              Вернуться к стартапам
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push('/my-startups')}
            className="w-10 h-10 glass-button flex items-center justify-center text-gray-700"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            Оплата публикации
          </h1>
        </div>

        {/* Startup Info */}
        <div className="glass-panel rounded-3xl p-5 mb-6">
          <div className="flex gap-4 items-center">
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
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{startup.name}</h3>
              <span className="flex items-center gap-1 w-fit px-3 py-1.5 bg-green-500/10 border border-green-500/20 text-green-700 rounded-full text-xs font-semibold backdrop-blur-md shadow-sm">
                <CheckCircle className="w-3.5 h-3.5" />
                Одобрен
              </span>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="glass-panel rounded-3xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-5">Детали оплаты</h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Публикация стартапа</span>
              <span className="font-bold text-gray-900">{startup.priceRub} ₽</span>
            </div>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200/50 to-transparent" />
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-900 text-lg">Итого</span>
              <span className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">{startup.priceRub} ₽</span>
            </div>
          </div>

          <div className="bg-blue-50/80 backdrop-blur-sm border border-blue-200/50 rounded-2xl p-5 mb-8 shadow-sm">
            <p className="text-[15px] text-blue-900 leading-relaxed">
              <span className="font-bold mb-2 block">💡 Что вы получите:</span>
              <span className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                Публикация в общей ленте
              </span>
              <span className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                Доступ к статистике просмотров
              </span>
              <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                Возможность получать лайки и контакты
              </span>
            </p>
          </div>

          {/* Mock Payment Button */}
          <button
            onClick={handlePayment}
            disabled={paying}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-[0_8px_30px_rgb(59,130,246,0.3)] hover:shadow-[0_8px_30px_rgb(59,130,246,0.4)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {paying ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                Обработка...
              </>
            ) : (
              <>
                <CreditCard className="w-6 h-6" />
                Оплатить {startup.priceRub} ₽
              </>
            )}
          </button>

          <p className="text-xs font-medium text-gray-400 text-center mt-6 px-4">
            🔒 Это тестовый платёж (mock). В реальной версии здесь будет интеграция с платёжной системой.
          </p>
        </div>
      </div>
    </div>
  )
}
