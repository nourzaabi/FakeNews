"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <img
                src="/images/unmask-logo-light.png"
                alt="Unmask Logo"
                className="h-8 w-auto dark:hidden transition-transform group-hover:scale-105"
              />
              <img
                src="/images/unmask-logo-dark.png"
                alt="Unmask Logo"
                className="h-8 w-auto hidden dark:block transition-transform group-hover:scale-105"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                isActive("/")
                  ? "text-primary bg-secondary"
                  : "text-muted-foreground hover:text-primary hover:bg-secondary/50"
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                isActive("/about")
                  ? "text-primary bg-secondary"
                  : "text-muted-foreground hover:text-primary hover:bg-secondary/50"
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                isActive("/contact")
                  ? "text-primary bg-secondary"
                  : "text-muted-foreground hover:text-primary hover:bg-secondary/50"
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive("/")
                  ? "text-primary bg-secondary"
                  : "text-muted-foreground hover:text-primary hover:bg-secondary/50"
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive("/about")
                  ? "text-primary bg-secondary"
                  : "text-muted-foreground hover:text-primary hover:bg-secondary/50"
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive("/contact")
                  ? "text-primary bg-secondary"
                  : "text-muted-foreground hover:text-primary hover:bg-secondary/50"
              }`}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
