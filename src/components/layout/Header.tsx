"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl md:text-2xl font-bold text-blue-600">
            UniSee
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/schools" className="text-gray-600 hover:text-gray-900 transition-colors">
              Browse Schools
            </Link>
            <Link href="/account" className="text-gray-600 hover:text-gray-900 transition-colors">
              My Account
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="flex flex-col space-y-3">
              <Link
                href="/schools"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-600 hover:text-gray-900 transition-colors py-2"
              >
                Browse Schools
              </Link>
              <Link
                href="/account"
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-600 hover:text-gray-900 transition-colors py-2"
              >
                My Account
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
