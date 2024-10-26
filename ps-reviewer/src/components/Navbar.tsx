'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/ui/toggle-dm"
import { useTheme } from 'next-themes'
import { usePathname } from 'next/navigation'

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'FAQ', href: '/faq' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Terms', href: '/terms' },
  { name: 'Feedback', href: '/feedback' },
]

export function Navbar() {
  const [activeItem, setActiveItem] = useState('Home')
  const { theme } = useTheme()
  const pathname = usePathname()
  const [isDashboard, setIsDashboard] = useState(false)

  useEffect(() => {
    setIsDashboard(pathname === '/dashboard')
  }, [pathname])

  return (
    <nav className={cn("shadow-sm", theme === 'dark' ? 'bg-gray-900' : 'bg-white')}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 pl-4">
            {!isDashboard && (
              <span className={cn("text-2xl font-bold", theme === 'dark' ? 'text-white' : 'text-gray-900')}>PSReviewer</span>
            )}
          </div>
          <div className="flex-grow flex justify-center">
            <div className="hidden sm:flex sm:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium",
                    activeItem === item.name
                      ? "border-primary text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  )}
                  onClick={() => setActiveItem(item.name)}
                >
                  <span className={cn(theme === 'dark' ? 'text-white' : 'text-gray-900')}>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="flex-shrink-0 w-48 flex justify-end pr-4">
            <ModeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}