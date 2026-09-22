'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bus, Compass, BookOpen, Menu, X, ShieldCheck, PhoneCall } from 'lucide-react';
import { useAppDispatch } from '@/store';
import { setCurrentPage } from '@/store/slices/navigationSlice';
import { Button } from '../ui/Button';

export const Navbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHome = pathname === '/';
  const isSearch = Boolean(pathname?.startsWith('/search'));
  const isBlog = Boolean(pathname?.startsWith('/blog'));

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 shadow-2xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-theme flex items-center justify-center text-white shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform">
                <Bus className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  <span className="font-display text-xl sm:text-2xl font-black tracking-tight text-neutral-900">
                    hop<span className="text-theme">zy</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-sm bg-neutral-100 text-neutral-600 ml-1">
                    Pro
                  </span>
                </div>
                <p className="text-[10px] text-neutral-400 font-medium hidden sm:block -mt-1">
                  India's Trusted Bus Booking
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1.5">
              <Link
                id="nav-landing-btn"
                href="/"
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  isHome
                    ? 'bg-theme-light text-theme'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                <Bus className="w-4 h-4" />
                <span>Bus Tickets</span>
              </Link>

              <Link
                id="nav-search-btn"
                href="/search"
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  isSearch
                    ? 'bg-theme-light text-theme'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                <Compass className="w-4 h-4" />
                <span>Search Buses</span>
              </Link>

              <Link
                id="nav-blog-btn"
                href="/blog"
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  isBlog
                    ? 'bg-theme-light text-theme'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Travel Blog</span>
              </Link>
            </nav>
          </div>

          {/* Right actions: 24/7 Helpline, Book Now action, Mobile menu toggle */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-neutral-600 px-3 py-1.5 rounded-lg border border-neutral-200/80 bg-neutral-50/70">
              <PhoneCall className="w-3.5 h-3.5 text-neutral-500" />
              <span>24/7 Helpline: 1800-419-01</span>
            </div>

            <Link href="/search" onClick={() => dispatch(setCurrentPage('search'))}>
              <Button
                size="sm"
                variant="theme"
                className="hidden sm:inline-flex shadow-sm cursor-pointer"
              >
                Book Now
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white px-4 py-4 space-y-2 shadow-xl animate-in slide-in-from-top-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
              isHome ? 'bg-theme-light text-theme' : 'text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <Bus className="w-5 h-5" />
            <span>Bus Tickets (Home)</span>
          </Link>

          <Link
            href="/search"
            onClick={() => setMobileMenuOpen(false)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
              isSearch ? 'bg-theme-light text-theme' : 'text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span>Search Buses & Seats</span>
          </Link>

          <Link
            href="/blog"
            onClick={() => setMobileMenuOpen(false)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
              isBlog ? 'bg-theme-light text-theme' : 'text-neutral-700 hover:bg-neutral-50'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span>Travel Guides & Blogs</span>
          </Link>

          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500 px-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Verified Safe Bus Operators
            </span>
            <span>Helpline: 1800-419</span>
          </div>
        </div>
      )}
    </header>
  );
};
