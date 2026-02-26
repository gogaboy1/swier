'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Trash2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface Comment {
  id: string
  text: string
  createdAt: string
  userName: string | null
  userEmail: string
  userId: string
}

interface CommentsModalProps {
  isOpen: boolean
  onClose: () => void
  startupId: string
  startupName: string
}

export default function CommentsModal({ isOpen, onClose, startupId, startupName }: CommentsModalProps) {
  const { user } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      fetchComments()
    }
  }, [isOpen, startupId])

  const fetchComments = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/comments?startupId=${startupId}`)
      if (response.ok) {
        const data = await response.json()
        setComments(data)
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !user) return

    setSubmitting(true)
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startupId, text: newComment })
      })

      if (response.ok) {
        setNewComment('')
        fetchComments()
      } else {
        alert('Не удалось отправить комментарий')
      }
    } catch (error) {
      console.error('Error posting comment:', error)
      alert('Не удалось отправить комментарий')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteClick = (commentId: string) => {
    setDeleteConfirmId(commentId)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmId) return

    try {
      const response = await fetch(`/api/comments?commentId=${deleteConfirmId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchComments()
        setDeleteConfirmId(null)
      } else {
        alert('Не удалось удалить комментарий')
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
      alert('Не удалось удалить комментарий')
    }
  }

  const handleDeleteCancel = () => {
    setDeleteConfirmId(null)
  }

  const formatDate = (dateString: string) => {
    // SQLite returns UTC time, need to parse it correctly
    // Format from SQLite: "2026-02-25 20:13:00" (UTC)
    const date = new Date(dateString + ' UTC')
    
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    
    return `${day}.${month}.${year} в ${hours}:${minutes}`
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
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 glass-bottom-sheet z-50 max-w-md mx-auto max-h-[85vh] flex flex-col"
          >
            {/* Handle */}
            <div className="flex justify-center pt-4 pb-2">
              <div className="w-12 h-1.5 bg-gray-300/50 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 pb-4 border-b border-gray-200/50">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Комментарии</h2>
                <p className="text-sm text-gray-500 font-medium">{startupName}</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full glass-button flex items-center justify-center text-gray-500"
              >
                <X className="w-5 h-5" strokeWidth={2.5} />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center py-10">
                  <div className="text-5xl mb-4 opacity-50">💬</div>
                  <p className="text-gray-900 font-semibold text-lg">Пока нет комментариев</p>
                  <p className="text-sm text-gray-500 mt-1">Будьте первым, кто поделится мнением!</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="glass-panel bg-white/40 rounded-2xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-sm">
                        {(comment.userName || comment.userEmail).charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900">
                          {comment.userName || comment.userEmail.split('@')[0]}
                        </p>
                        <p className="text-xs text-gray-500 font-medium">{formatDate(comment.createdAt)}</p>
                      </div>
                      {user && user.id === comment.userId && (
                        <button
                          onClick={() => handleDeleteClick(comment.id)}
                          className="w-8 h-8 rounded-full glass-button flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
                          title="Удалить комментарий"
                        >
                          <Trash2 className="w-4 h-4" strokeWidth={2.5} />
                        </button>
                      )}
                    </div>
                    <p className="text-[15px] text-gray-700 leading-relaxed">{comment.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Comment Input */}
            {user ? (
              <form onSubmit={handleSubmit} className="p-4 pb-6 border-t border-gray-200/50 bg-white/50 backdrop-blur-md">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Написать комментарий..."
                    maxLength={500}
                    className="flex-1 px-5 py-3 glass-panel rounded-full focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none text-sm placeholder:text-gray-400"
                  />
                  <button
                    type="submit"
                    disabled={!newComment.trim() || submitting}
                    className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-shrink-0"
                  >
                    <Send className="w-5 h-5 ml-1" />
                  </button>
                </div>
                <p className="text-[11px] text-gray-400 font-medium text-center mt-2">{newComment.length}/500</p>
              </form>
            ) : (
              <div className="p-6 border-t border-gray-200/50 text-center bg-white/50 backdrop-blur-md">
                <p className="text-sm font-medium text-gray-500 mb-3">Войдите, чтобы оставить комментарий</p>
                <button
                  onClick={() => window.location.href = '/auth/signin'}
                  className="px-6 py-2 bg-gray-900 text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors"
                >
                  Войти
                </button>
              </div>
            )}
          </motion.div>

          {/* Delete Confirmation Modal */}
          <AnimatePresence>
            {deleteConfirmId && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4"
                  onClick={handleDeleteCancel}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden"
                  >
                    <div className="p-6 text-center">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trash2 className="w-8 h-8 text-red-600" strokeWidth={2.5} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Удалить комментарий?</h3>
                      <p className="text-sm text-gray-500 mb-6">Это действие нельзя будет отменить</p>
                      
                      <div className="flex gap-3">
                        <button
                          onClick={handleDeleteCancel}
                          className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-full font-semibold hover:bg-gray-200 transition-colors"
                        >
                          Отмена
                        </button>
                        <button
                          onClick={handleDeleteConfirm}
                          className="flex-1 px-4 py-3 bg-red-500 text-white rounded-full font-semibold hover:bg-red-600 transition-colors"
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  )
}
