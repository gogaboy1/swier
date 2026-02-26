'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Plus, Info, X, User, LogOut, Edit, MapPin, Instagram, Send, Twitter, Rocket } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'

interface ProfileMenuProps {
  isOpen: boolean
  onClose: () => void
  likesCount?: number
}

export default function ProfileMenu({ isOpen, onClose, likesCount = 0 }: ProfileMenuProps) {
  const router = useRouter()
  const { user, loading, logout } = useAuth()

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const handleNavigate = (path: string) => {
    router.push(path)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, { offset, velocity }) => {
              if (offset.y > 100 || velocity.y > 500) {
                onClose()
              }
            }}
            className="fixed bottom-0 left-0 right-0 glass-bottom-sheet z-50 max-w-md mx-auto"
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-4 pb-3">
              <div className="w-12 h-1.5 bg-gray-300/50 rounded-full" />
            </div>

            <div className="px-5 pb-6 max-h-[85vh] overflow-y-auto">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                </div>
              ) : user ? (
                <>
                  {/* User Profile Header */}
                  <div className="flex flex-col items-center mb-5">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 p-1 mb-3 shadow-lg">
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name || 'User'} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl font-bold bg-gradient-to-tr from-blue-500 to-purple-600 bg-clip-text text-transparent">
                            {(user.name || user.email).charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-0.5">{user.name || 'Пользователь'}</h2>
                    <p className="text-sm text-gray-500 font-medium mb-3">{user.email}</p>
                    
                    <button
                      onClick={() => handleNavigate('/profile/edit')}
                      className="py-2 px-5 glass-button text-sm font-semibold text-gray-700 flex items-center justify-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Редактировать профиль
                    </button>
                  </div>

                  <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4" />

                  {/* Menu Items */}
                  <div className="space-y-2.5 mb-4">
                    <button
                      onClick={() => handleNavigate('/favorites')}
                      className="w-full flex items-center gap-3 p-3.5 glass-panel rounded-2xl transition-all duration-200 hover:scale-[1.02] active:scale-95"
                    >
                      <div className="w-9 h-9 rounded-full bg-pink-50 flex items-center justify-center flex-shrink-0">
                        <Heart className="w-4.5 h-4.5 text-pink-500" fill="currentColor" />
                      </div>
                      <span className="font-semibold text-gray-900 text-[15px]">Избранное</span>
                    </button>

                    <button
                      onClick={() => handleNavigate('/my-startups')}
                      className="w-full flex items-center gap-3 p-3.5 glass-panel rounded-2xl transition-all duration-200 hover:scale-[1.02] active:scale-95"
                    >
                      <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <Rocket className="w-4.5 h-4.5 text-blue-500" />
                      </div>
                      <span className="font-semibold text-gray-900 text-[15px]">Мои стартапы</span>
                    </button>

                    {/* Green Glass Submit Startup Button */}
                    <button
                      onClick={() => handleNavigate('/submit')}
                      className="w-full flex items-center justify-center gap-2 p-3.5 mt-1 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 hover:bg-emerald-500/30 rounded-2xl transition-all duration-200 shadow-[0_4px_20px_rgba(16,185,129,0.15)] hover:shadow-[0_4px_20px_rgba(16,185,129,0.25)] active:scale-95"
                    >
                      <Plus className="w-5 h-5 text-emerald-700" strokeWidth={2.5} />
                      <span className="font-bold text-emerald-700 text-[15px]">Предложить стартап</span>
                    </button>
                  </div>

                  {/* Social Links */}
                  {(user.instagram || user.telegram) && (
                    <>
                      <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4" />
                      <div className="space-y-2.5 mb-4">
                        {user.instagram && (
                          <a
                            href={`https://instagram.com/${user.instagram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center gap-3 p-3.5 glass-panel rounded-2xl transition-all duration-200 hover:scale-[1.02] active:scale-95"
                          >
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                              <Instagram className="w-4.5 h-4.5 text-white" />
                            </div>
                            <span className="font-semibold text-gray-900 text-[15px]">@{user.instagram.replace('@', '')}</span>
                          </a>
                        )}

                        {user.telegram && (
                          <a
                            href={`https://t.me/${user.telegram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center gap-3 p-3.5 glass-panel rounded-2xl transition-all duration-200 hover:scale-[1.02] active:scale-95"
                          >
                            <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                              <Send className="w-4.5 h-4.5 text-white" />
                            </div>
                            <span className="font-semibold text-gray-900 text-[15px]">@{user.telegram.replace('@', '')}</span>
                          </a>
                        )}
                      </div>
                    </>
                  )}

                  <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4" />

                  {/* Logout Button */}
                  <button
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 p-3.5 bg-red-50/80 backdrop-blur-md border border-red-100 rounded-2xl transition-all duration-200 hover:bg-red-100 active:scale-95 text-red-600 font-bold text-[15px]"
                  >
                    <LogOut className="w-4.5 h-4.5" strokeWidth={2.5} />
                    Выйти
                  </button>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Войдите в профиль</h3>
                  <p className="text-gray-500 mb-6">
                    Чтобы сохранять стартапы в избранное и предлагать свои
                  </p>
                  
                  <button
                    onClick={() => handleNavigate('/auth/signin')}
                    className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-bold text-base hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg active:scale-95"
                  >
                    Войти
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
