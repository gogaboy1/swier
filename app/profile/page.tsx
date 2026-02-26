'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, LogOut } from 'lucide-react'
import { getUserKey } from '@/lib/userKey'

export default function ProfilePage() {
  const router = useRouter()
  const [userKey, setUserKey] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
    startup: ''
  })

  useEffect(() => {
    const key = getUserKey()
    setUserKey(key)
    
    // Load profile data from localStorage
    const savedProfile = localStorage.getItem('userProfile')
    if (savedProfile) {
      try {
        setFormData(JSON.parse(savedProfile))
      } catch (e) {
        console.error('Failed to load profile:', e)
      }
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSave = () => {
    localStorage.setItem('userProfile', JSON.stringify(formData))
    alert('Профиль сохранён!')
  }

  const handleLogout = () => {
    if (confirm('Вы уверены, что хотите выйти? Все данные будут удалены.')) {
      // Clear all user data
      localStorage.clear()
      // Redirect to home
      router.push('/')
      // Reload to reset state
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.push('/')}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-shadow"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-3xl font-semibold text-gray-900">
            Профиль
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          {/* User ID */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">
              ID пользователя
            </label>
            <div className="px-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-600 font-mono">
              {userKey}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Имя
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Ваше имя"
            />
          </div>

          {/* Nickname */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Никнейм
            </label>
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="@username"
            />
          </div>

          {/* Startup */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Стартап
              <span className="text-xs font-normal text-gray-500 ml-2">— при наличии</span>
            </label>
            <input
              type="text"
              name="startup"
              value={formData.startup}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="Название вашего стартапа"
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 active:scale-95 transition-all"
          >
            Сохранить
          </button>

          {/* Divider */}
          <div className="border-t border-gray-200 my-6" />

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 py-3.5 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 active:scale-95 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Выйти из профиля
          </button>
        </div>
      </div>
    </div>
  )
}
