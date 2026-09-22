'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SearchWidget } from '../components/search/SearchWidget';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchInitialData, setSearchParams, searchBuses } from '../store/slices/searchSlice';
import { setCurrentPage } from '../store/slices/navigationSlice';
import {
  Bus,
  ShieldCheck,
  Clock,
  Zap,
  Tag,
  Check,
  Star,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  TrendingUp,
  BookOpen,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { MOCK_OFFERS, POPULAR_ROUTES, BLOG_ARTICLES } from '../services/mockData';

export const LandingPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { popularRoutes, offers } = useAppSelector((state) => state.search);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const displayOffers = offers && offers.length > 0 ? offers : MOCK_OFFERS;
  const displayRoutes = popularRoutes && popularRoutes.length > 0 ? popularRoutes : POPULAR_ROUTES;

  useEffect(() => {
    dispatch(fetchInitialData());
  }, [dispatch]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleSelectRoute = (from: string, to: string) => {
    const updated = { from, to, date: '2026-09-22' };
    dispatch(setSearchParams(updated));
    dispatch(searchBuses(updated));
    dispatch(setCurrentPage('search'));
    const query = new URLSearchParams({ from, to, date: '2026-09-22' }).toString();
    router.push(`/search?${query}`);
  };

  const FAQS = [
    {
      q: 'How do I book a bus ticket on this platform?',
      a: 'Simply enter your departure city, destination city, and date of travel in the search box above. Compare available buses, select your preferred sleeper or seater berth in the interactive seat map, enter passenger details, and proceed to book.',
    },
    {
      q: 'Can I cancel my bus ticket and get an instant refund?',
      a: 'Yes, our platform supports flexible cancellation policies. Most premium operators like IntrCity, Zingbus, and NueGo offer free cancellation up to 6 to 12 hours before scheduled departure. Refunds are processed immediately back to your original payment method.',
    },
    {
      q: 'How can I track the live location of my bus?',
      a: 'Once your ticket is confirmed, an SMS and email notification with an active GPS tracking link is dispatched 30 minutes before departure time, allowing you to monitor real-time road location and estimated time of arrival.',
    },
    {
      q: 'Are ladies-only berths protected during booking?',
      a: 'Yes, female-only seats (marked in pink in the seat layout) can only be reserved by solo women travelers or accompanied families, ensuring complete comfort and security throughout the journey.',
    },
    {
      q: 'What amenities are provided on AC Sleeper and Electric coaches?',
      a: 'Amenities include sanitized blankets and pillows, individual bedside charging ports (Type-A & Type-C), complimentary mineral water bottles, high-speed WiFi, reading lamps, and climate-controlled AC cabins.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-12">
      {/* HERO SECTION WITH TRAVEL ILLUSTRATION BACKGROUND */}
      <section className="relative overflow-visible">
        {/* Panoramic Illustrated Banner matching reference */}
        <div className="relative w-full min-h-[360px] sm:min-h-[420px] lg:min-h-[460px] overflow-hidden flex items-start sm:items-center bg-slate-900">
          {/* Illustration Background Image matching reference image */}
          <img
            src="/images/hero-travel-banner.jpg"
            alt="Scenic travel highway illustration with luxury bus"
            className="absolute inset-0 w-full h-full object-cover object-right sm:object-center select-none pointer-events-none"
            referrerPolicy="no-referrer"
          />

          {/* Gradient Overlay for high-contrast legible text */}
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/85 via-neutral-900/60 to-black/25 sm:to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

          {/* Banner Content (Text, Badge, Headline) */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-8 sm:pt-12 pb-24 sm:pb-28">
            <div className="max-w-2xl space-y-4">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-white/30 shadow-md text-xs font-semibold text-neutral-900">
                <span className="w-2 h-2 rounded-full bg-theme animate-pulse" />
                <span>Over 3,500+ Luxury & Govt RTC Bus Operators</span>
                <span className="text-neutral-300">|</span>
                <span className="text-theme font-bold">Flat 20% OFF Code: FIRSTBUS</span>
              </div>

              {/* Heading */}
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-white leading-[1.12] drop-shadow-md">
                  Book Online Bus Tickets With <span className="text-theme">Confidence</span>
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* OVERLAPPING SEARCH WIDGET CONTAINER */}
        <div className="relative -mt-16 sm:-mt-20 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchWidget variant="hero" />

          {/* Trust points */}
          <div className="pt-5 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-medium text-neutral-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              100% Secure Payments
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-neutral-600" />
              Live Bus GPS Tracking
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              Instant E-Tickets & PNR
            </span>
          </div>
        </div>
      </section>

      {/* OFFERS & PROMO CAROUSEL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-theme mb-1">
              <Tag className="w-3.5 h-3.5" />
              Special Travel Deals
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-neutral-900">
              Exclusive Offers & Coupons
            </h2>
          </div>
          <span className="text-xs text-neutral-500">Tap code to copy directly</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayOffers.map((offer) => {
            const isCopied = copiedCode === offer.code;
            return (
              <div
                key={offer.id}
                className="bg-white rounded-2xl border border-neutral-200/90 p-5 flex flex-col justify-between hover:shadow-md transition-shadow relative group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="theme">{offer.badge}</Badge>
                    <span className="text-[11px] text-neutral-400 font-medium">
                      Valid: {offer.validTill}
                    </span>
                  </div>
                  <h3 className="font-bold text-neutral-900 text-sm group-hover:text-theme transition-colors">
                    {offer.title}
                  </h3>
                  <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2">
                    {offer.description}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-dashed border-neutral-200 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleCopyCode(offer.code)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-dashed border-neutral-300 bg-neutral-50 hover:bg-theme-light hover:border-theme text-xs font-mono font-bold text-neutral-800 transition-all cursor-pointer"
                    title="Click to copy code"
                  >
                    <span>{offer.code}</span>
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Tag className="w-3.5 h-3.5 text-neutral-400" />
                    )}
                  </button>
                  <span className="text-[11px] font-semibold text-emerald-600">
                    Up to ₹{offer.maxDiscount} OFF
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* POPULAR BUS ROUTES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-theme mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              Most Frequent Journeys
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-neutral-900">
              Popular Domestic Bus Routes
            </h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => dispatch(setCurrentPage('search'))}
            className="self-start sm:self-auto"
          >
            Explore All Routes <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayRoutes.map((route) => (
            <div
              key={route.id}
              className="bg-white rounded-2xl border border-neutral-200/90 overflow-hidden shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={route.image}
                  alt={`${route.from} to ${route.to}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                  <div>
                    <h3 className="font-display font-bold text-lg text-white">
                      {route.from} → {route.to}
                    </h3>
                    <p className="text-xs text-neutral-200">{route.duration} avg • {route.dailyBuses} Daily Buses</p>
                  </div>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between bg-neutral-50/60 border-t border-neutral-100">
                <div>
                  <span className="text-[11px] text-neutral-500 block">Fares starting from</span>
                  <span className="text-lg font-bold text-neutral-900 font-display">
                    ₹{route.startingPrice}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="theme"
                  onClick={() => handleSelectRoute(route.from, route.to)}
                >
                  Book Seats
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE US / FEATURES */}
      <section className="bg-neutral-900 text-white py-16 sm:py-20 rounded-3xl max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 relative overflow-hidden">
        <div className="relative z-10 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl font-black font-display tracking-tight">
              Why Millions of Travelers Book on <span className="text-theme">Hopzy</span>
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base">
              Designed from ground up to guarantee punctuality, onboard comfort, and transparent pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            <div className="bg-neutral-800/80 border border-neutral-700/60 rounded-2xl p-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-theme/20 text-theme flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Guaranteed On-Time Departures</h3>
              <p className="text-neutral-400 text-xs leading-relaxed">
                Over 98% of partner buses depart precisely on schedule. If your bus is delayed by more than 30 minutes without prior notice, receive a 25% instant refund.
              </p>
            </div>

            <div className="bg-neutral-800/80 border border-neutral-700/60 rounded-2xl p-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-theme/20 text-theme flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Hygiene & Safety Certified</h3>
              <p className="text-neutral-400 text-xs leading-relaxed">
                Buses undergo multi-point deep sanitation between trips. Fresh wrapped bedsheets and sanitized blankets are standard on all AC sleeper coaches.
              </p>
            </div>

            <div className="bg-neutral-800/80 border border-neutral-700/60 rounded-2xl p-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-theme/20 text-theme flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Live Tracking & Zero Hassle</h3>
              <p className="text-neutral-400 text-xs leading-relaxed">
                Know where your boarding point is located with Google Maps coordinates and live bus telemetry shared via SMS 30 minutes before arrival.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PARTNER OPERATORS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">
            Trusted By Top Fleets & State Road Corporations
          </h3>
          <p className="text-lg font-bold text-neutral-800">
            Book official tickets across premier private operators
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {['IntrCity SmartBus', 'Zingbus Electric', 'Orange Tours', 'NueGo Intercity', 'VRL Multi-Axle', 'SRS Travels'].map(
            (op, i) => (
              <div
                key={`op-${i}`}
                className="bg-white border border-neutral-200/80 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:border-theme transition-all shadow-2xs"
              >
                <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700 font-bold font-display text-sm">
                  {op.substring(0, 2).toUpperCase()}
                </div>
                <span className="text-xs font-bold text-neutral-800 text-center">{op}</span>
                <span className="text-[10px] text-emerald-600 font-semibold">4.6 ★ Verified</span>
              </div>
            )
          )}
        </div>
      </section>

      {/* TRAVEL JOURNAL & EXPERT GUIDES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-theme-light text-theme">
                <BookOpen className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-theme">
                Hopzy Travel Journal
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-neutral-900">
              Travel Guides & Sleeper Bus Tips
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500">
              Handpicked itineraries, night coach hacks, and scenic routes across India
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-theme hover:underline self-start sm:self-end"
          >
            <span>View All Stories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BLOG_ARTICLES.slice(0, 3).map((article) => (
            <article
              key={article.id}
              className="bg-white rounded-2xl border border-neutral-200/90 overflow-hidden shadow-2xs hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                <Link href={`/blog/${article.slug}`} className="block h-48 relative overflow-hidden">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="bg-white/90 backdrop-blur-xs font-semibold">
                      {article.category}
                    </Badge>
                  </div>
                </Link>

                <div className="p-5 space-y-2.5">
                  <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                    <span>{article.publishedAt}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>

                  <Link href={`/blog/${article.slug}`} className="block">
                    <h3 className="font-bold font-display text-base text-neutral-900 group-hover:text-theme transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="flex items-center justify-between pt-3 border-t border-neutral-100 text-xs text-neutral-500">
                  <span className="font-medium text-neutral-800">{article.author.name}</span>
                  <Link
                    href={`/blog/${article.slug}`}
                    className="text-theme font-semibold hover:underline flex items-center gap-0.5"
                  >
                    Read Details →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black font-display text-neutral-900">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500">
            Everything you need to know about booking, seat layouts, and cancellations
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={`faq-${index}`}
                className="border border-neutral-200 rounded-2xl bg-white overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-neutral-50 transition-colors"
                >
                  <span className="text-sm font-bold text-neutral-900">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-theme shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 text-xs text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
