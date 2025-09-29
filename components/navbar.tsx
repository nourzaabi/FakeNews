"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import Image from "next/image"

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <Image
              src="/images/unmask-logo-light.png"
              alt="Unmask Logo"
              width={120}
              height={40}
              className="h-8 w-auto dark:hidden"
              priority
            />
            <Image
              src="/images/unmask-logo-dark.png"
              alt="Unmask Logo"
              width={120}
              height={40}
              className="h-8 w-auto hidden dark:block"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1">
            <Link href="/" className="px-4 py-2 rounded-md hover:bg-primary-foreground/10 transition-colors">
              Home
            </Link>
            <Link href="/about" className="px-4 py-2 rounded-md hover:bg-primary-foreground/10 transition-colors">
              About
            </Link>
            <Link href="/contact" className="px-4 py-2 rounded-md hover:bg-primary-foreground/10 transition-colors">
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-primary-foreground/10 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              href="/"
              className="block px-4 py-2 rounded-md hover:bg-primary-foreground/10 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="block px-4 py-2 rounded-md hover:bg-primary-foreground/10 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block px-4 py-2 rounded-md hover:bg-primary-foreground/10 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
