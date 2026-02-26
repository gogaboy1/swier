'use client'

import { useState, useEffect } from 'react'
import SwipeStack from '@/components/SwipeStack'
import Header from '@/components/Header'
import AuthModal from '@/components/AuthModal'
import { useAuth } from '@/hooks/useAuth'

interface Startup {
  id: string
  name: string
  logo: string | null
  shortDescription: string
  geo: string
  stage: string
  tags: string
}

interface UndoItem {
  startup: Startup
  direction: 'left' | 'right'
}

export default function Home() {
  const { user } = useAuth()
  const [geo, setGeo] = useState<'Russia' | 'Worldwide'>('Russia')
  const [category, setCategory] = useState<string | null>(null)
  const [startups, setStartups] = useState<Startup[]>([])
  const [loading, setLoading] = useState(true)
  const [undoHistory, setUndoHistory] = useState<UndoItem[]>([])
  const [authModalOpen, setAuthModalOpen] = useState(false)

  useEffect(() => {
    // Load undo history from localStorage
    const savedHistory = localStorage.getItem('undoHistory')
    if (savedHistory) {
      try {
        setUndoHistory(JSON.parse(savedHistory))
      } catch (e) {
        console.error('Failed to load undo history:', e)
      }
    }
    fetchStartups()
  }, [])

  useEffect(() => {
    fetchStartups()
  }, [geo, category])

  const fetchStartups = async () => {
    setLoading(true)
    try {
      const url = `/api/startups-direct?geo=${geo}${category ? `&category=${category}` : ''}`
      const response = await fetch(url)
      const data = await response.json()
      setStartups(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching startups:', error)
      setStartups([])
    } finally {
      setLoading(false)
    }
  }

  const handleSwipe = async (direction: 'left' | 'right', startupId: string) => {
    // Check if user is authenticated
    if (!user) {
      setAuthModalOpen(true)
      return
    }

    try {
      // Find the swiped startup
      const swipedStartup = startups.find(s => s.id === startupId)
      
      if (swipedStartup) {
        // Add to undo history (max 5 items)
        const newHistory = [{ startup: swipedStartup, direction }, ...undoHistory].slice(0, 5)
        setUndoHistory(newHistory)
        localStorage.setItem('undoHistory', JSON.stringify(newHistory))
      }

      // Record swipe in API
      if (direction === 'right') {
        await fetch('/api/like-direct', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ startupId })
        })
      } else {
        await fetch('/api/dislike-direct', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ startupId })
        })
      }
    } catch (error) {
      console.error('Error recording swipe:', error)
    }
  }

  const handleUndo = async () => {
    if (undoHistory.length === 0) return

    const [lastItem, ...restHistory] = undoHistory
    
    // Remove from undo history
    setUndoHistory(restHistory)
    localStorage.setItem('undoHistory', JSON.stringify(restHistory))

    // Remove the like/dislike from API
    if (lastItem.direction === 'right') {
      await fetch('/api/like-direct', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startupId: lastItem.startup.id })
      })
    } else {
      await fetch('/api/dislike-direct', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ startupId: lastItem.startup.id })
      })
    }

    // Re-fetch startups to get fresh list without the removed card
    await fetchStartups()
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden fixed inset-0 flex flex-col">
      {/* Header with Profile and Geo Toggle */}
      <Header 
        geo={geo} 
        onGeoChange={setGeo}
        selectedCategory={category}
        onCategoryChange={setCategory}
        likesCount={0}
      />
      
      {/* Swipe Stack - Full Height */}
      <div className="flex-1 relative min-h-0">
        <div className="max-w-md mx-auto px-4 h-full">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="relative">
                <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></div>
                <div className="relative inline-flex rounded-full h-12 w-12 bg-blue-500"></div>
              </div>
            </div>
          ) : (
            <SwipeStack 
              startups={startups} 
              onSwipe={handleSwipe}
              undoCount={undoHistory.length}
              onUndo={handleUndo}
            />
          )}
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)} 
      />
    </div>
  )
}
