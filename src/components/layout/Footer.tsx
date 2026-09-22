'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bus, ShieldCheck, Clock, Award, Phone, Mail } from 'lucide-react';
import { useAppDispatch } from '@/store';
import { setCurrentPage } from '@/store/slices/navigationSlice';
import { setSearchParams, searchBuses } from '@/store/slices/searchSlice';

export const Footer: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleRouteClick = (from: string, to: string) => {
    dispatch(setSearchParams({ from, to }));
    dispatch(searchBuses({ from, to, date: '2026-09-22' }));
    dispatch(setCurrentPage('search'));
    router.push('/search');
  };

  return (
    <footer className="bg-neutral-900 text-neutral-300 border-t border-neutral-800 mt-20">
      {/* Top trust highlights */}
      <div className="border-b border-neutral-800 py-8 bg-neutral-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center text-theme">
              <Bus className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">36 Million+ Happy Riders</h4>
              <p className="text-xs text-neutral-400">Serving passengers across 25+ states</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center text-theme">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Verified Safety & Hygiene</h4>
              <p className="text-xs text-neutral-400">Sanitized buses & emergency SOS</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center text-theme">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">98.4% On-Time Departure</h4>
              <p className="text-xs text-neutral-400">Real-time GPS bus tracking</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center text-theme">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Instant Refunds Guarantee</h4>
              <p className="text-xs text-neutral-400">Zero fee cancellation protection</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer navigation columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand & about */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-theme flex items-center justify-center text-white">
                <Bus className="w-4 h-4" />
              </div>
              <span className="font-display text-2xl font-black tracking-tight text-white">
                hop<span className="text-theme">zy</span>
              </span>
            </Link>
            <p className="text-sm text-neutral-400 max-w-sm leading-relaxed">
              Hopzy is India's premier online bus ticketing platform offering real-time seat selection, certified sanitization standards, and seamless booking across 3,500+ private bus operators and state road transport corporations.
            </p>
            <div className="flex items-center gap-4 text-xs text-neutral-400">
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-neutral-300" />
                1800-419-01 (Toll Free)
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-neutral-300" />
                support@hopzy.demo
              </span>
            </div>
          </div>

          {/* Popular Routes */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Top Bus Routes
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => handleRouteClick('Bangalore', 'Goa')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Bangalore to Goa Bus
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleRouteClick('Delhi', 'Jaipur')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Delhi to Jaipur Bus
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleRouteClick('Mumbai', 'Pune')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Mumbai to Pune Bus
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleRouteClick('Hyderabad', 'Bangalore')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Hyderabad to Bangalore Bus
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleRouteClick('Delhi', 'Manali')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Delhi to Manali Bus
                </button>
              </li>
            </ul>
          </div>

          {/* Bus Operators */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Top Bus Operators
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li className="hover:text-white transition-colors cursor-default">IntrCity SmartBus</li>
              <li className="hover:text-white transition-colors cursor-default">Zingbus Express</li>
              <li className="hover:text-white transition-colors cursor-default">NueGo Electric AC</li>
              <li className="hover:text-white transition-colors cursor-default">Orange Tours & Travels</li>
              <li className="hover:text-white transition-colors cursor-default">VRL Travels Multi-Axle</li>
              <li className="hover:text-white transition-colors cursor-default">SRS Luxury Coaches</li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li>
                <Link
                  href="/"
                  className="hover:text-white transition-colors cursor-pointer block"
                >
                  Home & Offers
                </Link>
              </li>
              <li>
                <Link
                  href="/search"
                  className="hover:text-white transition-colors cursor-pointer block"
                >
                  Bus Search
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-white transition-colors cursor-pointer block"
                >
                  Travel Stories & Blog
                </Link>
              </li>
              <li className="hover:text-neutral-400 text-neutral-500">Cancellation & Refunds</li>
              <li className="hover:text-neutral-400 text-neutral-500">Privacy & Security</li>
              <li className="hover:text-neutral-400 text-neutral-500">Terms of Service</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© 2026 Hopzy. Built with Next.js App Router, Redux & Developer CSS Theme Templating.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-neutral-400 cursor-pointer">Security Certifications</span>
            <span className="hover:text-neutral-400 cursor-pointer">ISO 27001 Certified</span>
            <span className="hover:text-neutral-400 cursor-pointer">PCI-DSS Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
