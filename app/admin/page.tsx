'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Trash2, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import StatsGrid from '@/components/admin/StatsGrid'
import TopStartups from '@/components/admin/TopStartups'

interface Startup {
  id: string
  name: string
  logo: string | null
  shortDescription: string
  longDescription: string
  geo: string
  stage: string
  tags: string
  status: string
  createdAt: string
}

interface AdminStats {
  users: {
    total: number
    last24h: number
    last7d: number
  }
  startups: {
    total: number
    pending: number
    approved: number
    rejected: number
  }
  votes: {
    total: number
    last24h: number
  }
  likes: {
    total: number
    last24h: number
  }
  dislikes: {
    total: number
    last24h: number
  }
  conversionRate: string
  topStartups: Array<{
    id: string
    name: string
    logo: string | null
    likesCount: number
  }>
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [startups, setStartups] = useState<Startup[]>([])
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; id: string; name: string }>({ show: false, id: '', name: '' })
  const [rejectDialog, setRejectDialog] = useState<{ show: boolean; id: string; name: string }>({ show: false, id: '', name: '' })
  const [rejectReason, setRejectReason] = useState('')

  useEffect(() => {
    if (isAuthenticated) {
      fetchStartups()
      fetchStats()
    }
  }, [isAuthenticated])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      })

      if (response.ok) {
        setIsAuthenticated(true)
        setPassword('')
      } else {
        setError('Invalid password')
      }
    } catch (error) {
      setError('Login failed')
    } finally {
      setLoading(false)
    }
  }

  const fetchStartups = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/startups-direct')
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

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats', {
        headers: {
          'x-admin-password': password
        }
      })
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const updateStatus = async (id: string, status: string, rejectReason?: string) => {
    try {
      const response = await fetch('/api/admin/startups-direct', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, rejectReason })
      })

      if (response.ok) {
        setStartups(startups.map(s => s.id === id ? { ...s, status } : s))
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert('Пожалуйста, укажите причину отказа')
      return
    }
    updateStatus(rejectDialog.id, 'rejected', rejectReason)
    setRejectDialog({ show: false, id: '', name: '' })
    setRejectReason('')
  }

  const deleteStartup = async (id: string) => {
    try {
      const response = await fetch('/api/admin/startups-direct', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })

      if (response.ok) {
        setStartups(startups.filter(s => s.id !== id))
        setDeleteConfirm({ show: false, id: '', name: '' })
      }
    } catch (error) {
      console.error('Error deleting startup:', error)
    }
  }

  const router = useRouter()

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.push('/')}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="text-2xl font-semibold text-gray-900">
              Вход в админ-панель
            </h1>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Пароль
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Введите пароль администратора"
                />
              </div>

              {error && (
                <p className="text-red-600 text-sm">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? 'Вход...' : 'Войти'}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  const pendingStartups = startups.filter(s => s.status === 'pending')
  const approvedStartups = startups.filter(s => s.status === 'approved')
  const rejectedStartups = startups.filter(s => s.status === 'rejected')

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push('/')}
            className="w-10 h-10 glass-button flex items-center justify-center text-gray-700"
          >
            <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Админ-панель
          </h1>
        </div>

        {/* Stats Dashboard */}
        {stats && (
          <div className="mb-8">
            <StatsGrid stats={stats} filter={filter} onFilterChange={setFilter} />
            <TopStartups startups={stats.topStartups} />
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => setFilter(filter === 'pending' ? 'all' : 'pending')}
            className={`glass-panel rounded-3xl p-5 text-left transition-all duration-200 active:scale-95 hover:bg-white/80 ${
              filter === 'pending' ? 'border-amber-400 ring-2 ring-amber-200 shadow-md' : 'border-gray-200/50'
            }`}
          >
            <p className="text-sm font-semibold text-gray-500 mb-1">На модерации</p>
            <p className="text-3xl font-bold text-amber-500">{pendingStartups.length}</p>
          </button>
          <button
            onClick={() => setFilter(filter === 'approved' ? 'all' : 'approved')}
            className={`glass-panel rounded-3xl p-5 text-left transition-all duration-200 active:scale-95 hover:bg-white/80 ${
              filter === 'approved' ? 'border-emerald-400 ring-2 ring-emerald-200 shadow-md' : 'border-gray-200/50'
            }`}
          >
            <p className="text-sm font-semibold text-gray-500 mb-1">Одобрено</p>
            <p className="text-3xl font-bold text-emerald-500">{approvedStartups.length}</p>
          </button>
          <button
            onClick={() => setFilter(filter === 'rejected' ? 'all' : 'rejected')}
            className={`glass-panel rounded-3xl p-5 text-left transition-all duration-200 active:scale-95 hover:bg-white/80 ${
              filter === 'rejected' ? 'border-rose-400 ring-2 ring-rose-200 shadow-md' : 'border-gray-200/50'
            }`}
          >
            <p className="text-sm font-semibold text-gray-500 mb-1">Отклонено</p>
            <p className="text-3xl font-bold text-rose-500">{rejectedStartups.length}</p>
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {(filter === 'all' || filter === 'pending') && pendingStartups.length > 0 && (
              <div>
                {filter === 'all' && <h2 className="text-lg font-semibold text-gray-900 mb-3">На модерации</h2>}
                <div className="space-y-3">
                  {pendingStartups.map((startup) => (
                    <StartupCard
                      key={startup.id}
                      startup={startup}
                      onApprove={() => updateStatus(startup.id, 'approved')}
                      onReject={() => setRejectDialog({ show: true, id: startup.id, name: startup.name })}
                      onDelete={() => setDeleteConfirm({ show: true, id: startup.id, name: startup.name })}
                    />
                  ))}
                </div>
              </div>
            )}

            {(filter === 'all' || filter === 'approved') && approvedStartups.length > 0 && (
              <div>
                {filter === 'all' && <h2 className="text-lg font-semibold text-gray-900 mb-3">Одобренные</h2>}
                <div className="space-y-3">
                  {approvedStartups.map((startup) => (
                    <StartupCard
                      key={startup.id}
                      startup={startup}
                      onReject={() => updateStatus(startup.id, 'rejected')}
                      onDelete={() => setDeleteConfirm({ show: true, id: startup.id, name: startup.name })}
                    />
                  ))}
                </div>
              </div>
            )}

            {(filter === 'all' || filter === 'rejected') && rejectedStartups.length > 0 && (
              <div>
                {filter === 'all' && <h2 className="text-lg font-semibold text-gray-900 mb-3">Отклонённые</h2>}
                <div className="space-y-3">
                  {rejectedStartups.map((startup) => (
                    <StartupCard
                      key={startup.id}
                      startup={startup}
                      onApprove={() => updateStatus(startup.id, 'approved')}
                      onDelete={() => setDeleteConfirm({ show: true, id: startup.id, name: startup.name })}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Удалить стартап?
            </h3>
            <p className="text-gray-600 mb-6">
              Вы уверены, что хотите удалить "{deleteConfirm.name}"? Это действие нельзя отменить.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm({ show: false, id: '', name: '' })}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 active:scale-95 transition-all font-semibold"
              >
                Отмена
              </button>
              <button
                onClick={() => deleteStartup(deleteConfirm.id)}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 active:scale-95 transition-all font-semibold"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Dialog */}
      {rejectDialog.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Отклонить стартап
            </h3>
            <p className="text-gray-600 mb-4">
              Укажите причину отказа для "{rejectDialog.name}"
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Например: Не соответствует требованиям платформы..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all mb-4 resize-none"
              rows={4}
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setRejectDialog({ show: false, id: '', name: '' })
                  setRejectReason('')
                }}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 active:scale-95 transition-all font-semibold"
              >
                Отмена
              </button>
              <button
                onClick={handleReject}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 active:scale-95 transition-all font-semibold"
              >
                Отклонить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function StartupCard({
  startup,
  onApprove,
  onReject,
  onDelete
}: {
  startup: Startup
  onApprove?: () => void
  onReject?: () => void
  onDelete: () => void
}) {
  const router = useRouter()
  const tags = startup.tags ? startup.tags.split(',').slice(0, 3) : []

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <div 
        className="flex items-start gap-4 mb-4 cursor-pointer hover:bg-gray-50 -m-4 p-4 rounded-2xl transition-colors"
        onClick={() => router.push(`/startup/${startup.id}`)}
      >
        {startup.logo ? (
          <img
            src={startup.logo}
            alt={startup.name}
            className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0">
            <span className="text-gray-400 text-lg font-bold">
              {startup.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {startup.name}
          </h3>
          <div className="flex items-center gap-1.5 mb-2 flex-wrap">
            <span className="px-2 py-0.5 bg-gray-100 rounded-lg text-xs font-medium">
              {startup.stage}
            </span>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium">
              {startup.geo}
            </span>
            <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${
              startup.status === 'approved' ? 'bg-green-100 text-green-700' :
              startup.status === 'rejected' ? 'bg-red-100 text-red-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>
              {startup.status === 'approved' ? 'одобрено' : startup.status === 'rejected' ? 'отклонено' : 'на модерации'}
            </span>
          </div>
          <p className="text-gray-600 text-xs mb-2 line-clamp-2">
            {startup.shortDescription}
          </p>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {onApprove && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onApprove()
            }}
            className="flex items-center gap-1 px-3 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 active:scale-95 transition-all text-xs font-medium"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Одобрить
          </button>
        )}
        {onReject && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onReject()
            }}
            className="flex items-center gap-1 px-3 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 active:scale-95 transition-all text-xs font-medium"
          >
            <XCircle className="w-3.5 h-3.5" />
            Отклонить
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
          className="flex items-center gap-1 px-3 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 active:scale-95 transition-all text-xs font-medium ml-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Удалить
        </button>
      </div>
    </div>
  )
}
