'use client'

import { Users, Rocket, Clock, CheckCircle, XCircle, MousePointerClick, Heart, TrendingUp } from 'lucide-react'
import StatsCard from './StatsCard'

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
}

interface StatsGridProps {
  stats: AdminStats
  filter?: 'all' | 'pending' | 'approved' | 'rejected'
  onFilterChange?: (filter: 'all' | 'pending' | 'approved' | 'rejected') => void
}

export default function StatsGrid({ stats, filter = 'all', onFilterChange }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatsCard
        label="Зарегистрированные пользователи"
        value={stats.users.total}
        delta={`+${stats.users.last24h} за 24ч, +${stats.users.last7d} за 7д`}
        icon={Users}
        iconColor="text-blue-600"
      />
      
      <StatsCard
        label="Всего стартапов"
        value={stats.startups.total}
        delta={`${stats.startups.approved} опубликовано`}
        icon={Rocket}
        iconColor="text-purple-600"
        onClick={() => onFilterChange?.('all')}
        isActive={filter === 'all'}
      />
      
      <StatsCard
        label="На модерации"
        value={stats.startups.pending}
        delta={`${stats.startups.rejected} отклонено`}
        icon={Clock}
        iconColor="text-orange-600"
        onClick={() => onFilterChange?.('pending')}
        isActive={filter === 'pending'}
      />
      
      <StatsCard
        label="Опубликованные"
        value={stats.startups.approved}
        delta={`${((stats.startups.approved / stats.startups.total) * 100).toFixed(1)}% от всех`}
        icon={CheckCircle}
        iconColor="text-green-600"
        onClick={() => onFilterChange?.('approved')}
        isActive={filter === 'approved'}
      />
      
      <StatsCard
        label="Свайпы за 24ч"
        value={stats.votes.last24h}
        delta={`${stats.votes.total} всего`}
        icon={MousePointerClick}
        iconColor="text-indigo-600"
      />
      
      <StatsCard
        label="Лайки за 24ч"
        value={stats.likes.last24h}
        delta={`${stats.likes.total} всего`}
        icon={Heart}
        iconColor="text-red-600"
      />
      
      <StatsCard
        label="Дизлайки за 24ч"
        value={stats.dislikes.last24h}
        delta={`${stats.dislikes.total} всего`}
        icon={XCircle}
        iconColor="text-gray-600"
      />
      
      <StatsCard
        label="Конверсия лайков"
        value={`${stats.conversionRate}%`}
        delta={`${stats.likes.total} лайков / ${stats.votes.total} свайпов`}
        icon={TrendingUp}
        iconColor="text-emerald-600"
      />
    </div>
  )
}
