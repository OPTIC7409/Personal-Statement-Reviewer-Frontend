'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from "@/lib/utils"
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import * as React from "react"
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
  const pathname = usePathname()
  const [isDashboard, setIsDashboard] = useState(false)
  const [isHome, setIsHome] = useState(false)
  const { setTheme } = useTheme()

  useEffect(() => {
    setIsDashboard(pathname === '/dashboard')
    setIsHome(pathname === '/')
  }, [pathname])

  if (isHome) return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 ">
      <nav className="flex justify-between items-center backdrop-blur-[8px] rounded-full px-6 py-3">
        <div className="text-2xl font-bold">PSReviewer</div>
        <div className="flex space-x-4">
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#how-it-works" className="hover:text-white">How It Works</a>
          <a href="#about" className="hover:text-white">About</a>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </div>
  );

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 pl-4">
            {!isDashboard && (
              <span className="text-2xl font-bold text-gray-900 dark:text-white">PSReviewer</span>
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
                      ? "border-primary text-gray-900 dark:text-white"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                  )}
                  onClick={() => setActiveItem(item.name)}
                >
                  <span className="text-gray-900 dark:text-white">{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="flex-shrink-0 w-48 flex justify-end pr-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}