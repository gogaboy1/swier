'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Heart, PlusCircle, Shield } from 'lucide-react'

export default function Navigation() {
  const pathname = usePathname()

  const links = [
    { href: '/', icon: Home, label: 'Главная' },
    { href: '/favorites', icon: Heart, label: 'Избранное' },
    { href: '/submit', icon: PlusCircle, label: 'Добавить' },
    { href: '/admin', icon: Shield, label: 'Админ' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-200/50 safe-area-inset-bottom z-50">
      <div className="max-w-md mx-auto">
        <div className="flex justify-around items-center h-12 px-4">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center justify-center p-2 transition-colors ${
                  isActive
                    ? 'text-blue-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
