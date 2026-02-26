import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  label: string
  value: string | number
  delta?: string
  icon: LucideIcon
  iconColor?: string
  onClick?: () => void
  isActive?: boolean
}

export default function StatsCard({ label, value, delta, icon: Icon, iconColor = 'text-blue-600', onClick, isActive }: StatsCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-2xl p-6 shadow-sm border transition-all ${
        onClick ? 'cursor-pointer hover:shadow-md active:scale-95' : ''
      } ${
        isActive ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-100'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          {delta && (
            <p className="text-xs text-gray-500">{delta}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gray-50 ${iconColor}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  )
}
