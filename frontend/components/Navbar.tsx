'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Wallet, Sparkles } from 'lucide-react'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-900/80 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">
              Invite<span className="accent-text">Me</span> NFT
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/events" className="text-gray-300 hover:text-white transition-colors">
              My Events
            </Link>
            <Link href="/create-event" className="text-gray-300 hover:text-white transition-colors">
              Create Event
            </Link>
            <Link href="/scanner" className="text-gray-300 hover:text-white transition-colors">
              Scanner
            </Link>
          </div>

          {/* Wallet Button */}
          <div className="hidden md:flex items-center gap-4">
            <button className="btn-secondary py-2 px-4 text-sm">
              <Wallet className="w-4 h-4 inline mr-2" />
              Connect Wallet
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-dark-800 border-t border-white/10">
          <div className="px-6 py-4 space-y-4">
            <Link 
              href="/events" 
              className="block text-gray-300 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              My Events
            </Link>
            <Link 
              href="/create-event" 
              className="block text-gray-300 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Create Event
            </Link>
            <Link 
              href="/scanner" 
              className="block text-gray-300 hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Scanner
            </Link>
            <button className="btn-primary w-full py-3 text-sm">
              <Wallet className="w-4 h-4 inline mr-2" />
              Connect Wallet
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
