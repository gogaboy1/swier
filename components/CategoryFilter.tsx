'use client'

interface CategoryFilterProps {
  selectedCategory: string | null
  onCategoryChange: (category: string | null) => void
}

const CATEGORIES = [
  { id: 'all', label: 'Все', emoji: '🌟' },
  { id: 'AI', label: 'AI', emoji: '🤖' },
  { id: 'SaaS', label: 'SaaS', emoji: '☁️' },
  { id: 'B2B', label: 'B2B', emoji: '🏢' },
  { id: 'FinTech', label: 'FinTech', emoji: '💰' },
  { id: 'EdTech', label: 'EdTech', emoji: '📚' },
  { id: 'HealthTech', label: 'HealthTech', emoji: '🏥' },
  { id: 'E-commerce', label: 'E-commerce', emoji: '🛒' },
  { id: 'Marketplace', label: 'Marketplace', emoji: '🏪' },
  { id: 'Crypto', label: 'Crypto', emoji: '₿' },
  { id: 'Blockchain', label: 'Blockchain', emoji: '⛓️' },
  { id: 'Mobile', label: 'Mobile', emoji: '📱' },
  { id: 'Web3', label: 'Web3', emoji: '🌐' },
  { id: 'Gaming', label: 'Gaming', emoji: '�' },
  { id: 'Social', label: 'Social', emoji: '👥' },
  { id: 'Analytics', label: 'Analytics', emoji: '📊' },
  { id: 'Security', label: 'Security', emoji: '🔒' },
]

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-3">
        {CATEGORIES.map((category) => {
          const isSelected = category.id === 'all' 
            ? selectedCategory === null 
            : selectedCategory === category.id
          
          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id === 'all' ? null : category.id)}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 active:scale-95 ${
                isSelected
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-white/50 hover:bg-white/80 text-gray-700 border border-gray-200/50'
              }`}
            >
              <span className="text-xl">{category.emoji}</span>
              <span>{category.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
