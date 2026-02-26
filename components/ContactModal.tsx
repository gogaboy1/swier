'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Mail, Globe } from 'lucide-react'
import { useEffect } from 'react'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
  startup: {
    name: string
    telegramUsername?: string | null
    email?: string | null
    website?: string | null
  } | null
}

export default function ContactModal({ isOpen, onClose, startup }: ContactModalProps) {
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

  if (!startup) return null

  const hasContacts = startup.telegramUsername || startup.email || startup.website

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
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 max-w-md mx-auto"
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* Content */}
            <div className="px-6 pb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Контакты</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              <p className="text-gray-600 mb-6">{startup.name}</p>

              {!hasContacts ? (
                <p className="text-center text-gray-500 py-8">Контактная информация не указана</p>
              ) : (
                <div className="space-y-3">
                  {/* Telegram */}
                  {startup.telegramUsername && (
                    <a
                      href={`https://t.me/${startup.telegramUsername.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 bg-blue-50 hover:bg-blue-100 rounded-2xl transition-colors group"
                    >
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Send className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">Telegram</div>
                        <div className="text-sm text-gray-600">{startup.telegramUsername}</div>
                      </div>
                    </a>
                  )}

                  {/* Email */}
                  {startup.email && (
                    <a
                      href={`mailto:${startup.email}`}
                      className="flex items-center gap-4 p-4 bg-red-50 hover:bg-red-100 rounded-2xl transition-colors group"
                    >
                      <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">Email</div>
                        <div className="text-sm text-gray-600">{startup.email}</div>
                      </div>
                    </a>
                  )}

                  {/* Website */}
                  {startup.website && (
                    <a
                      href={startup.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 bg-green-50 hover:bg-green-100 rounded-2xl transition-colors group"
                    >
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Globe className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">Веб-сайт</div>
                        <div className="text-sm text-gray-600 truncate">{startup.website}</div>
                      </div>
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
