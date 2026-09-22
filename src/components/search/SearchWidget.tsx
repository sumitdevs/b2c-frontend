'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRightLeft, Calendar, MapPin, Search } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../store';
import { setSearchParams, swapOrigins, searchBuses } from '../../store/slices/searchSlice';
import { setCurrentPage } from '../../store/slices/navigationSlice';
import { Button } from '../ui/Button';

interface SearchWidgetProps {
  variant?: 'hero' | 'compact';
  onSearchComplete?: () => void;
}

export const SearchWidget: React.FC<SearchWidgetProps> = ({ variant = 'hero', onSearchComplete }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { searchParams, cities } = useAppSelector((state) => state.search);

  const [fromInput, setFromInput] = useState(searchParams.from);
  const [toInput, setToInput] = useState(searchParams.to);
  const [dateInput, setDateInput] = useState(searchParams.date);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Keep inputs synced when searchParams in store updates
  useEffect(() => {
    if (searchParams.from) setFromInput(searchParams.from);
    if (searchParams.to) setToInput(searchParams.to);
    if (searchParams.date) setDateInput(searchParams.date);
  }, [searchParams.from, searchParams.to, searchParams.date]);

  // Quick date chips
  const todayStr = '2026-09-20';
  const tomorrowStr = '2026-09-21';
  const nextWeekendStr = '2026-09-26';

  const handleSwap = () => {
    const temp = fromInput;
    setFromInput(toInput);
    setToInput(temp);
    dispatch(swapOrigins());
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!fromInput.trim() || !toInput.trim()) {
      setErrorMessage('Please select both Departure and Destination cities.');
      return;
    }

    if (fromInput.trim().toLowerCase() === toInput.trim().toLowerCase()) {
      setErrorMessage('Source and Destination cannot be the exact same city.');
      return;
    }

    setErrorMessage(null);
    const updated = {
      from: fromInput.trim(),
      to: toInput.trim(),
      date: dateInput,
    };

    const query = new URLSearchParams({
      from: updated.from,
      to: updated.to,
      date: updated.date,
    }).toString();

    dispatch(setSearchParams(updated));
    dispatch(searchBuses(updated));
    dispatch(setCurrentPage('search'));
    router.push(`/search?${query}`);
    onSearchComplete?.();
  };

  return (
    <div
      className={`bg-white rounded-2xl md:rounded-3xl border border-neutral-200/90 shadow-2xl shadow-neutral-900/10 ring-1 ring-black/5 ${
        variant === 'hero' ? 'p-4 sm:p-6 lg:p-7 max-w-5xl mx-auto' : 'p-3 sm:p-4'
      }`}
    >
      <form onSubmit={handleSearch} className="space-y-4">
        {/* Main Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* FROM Input */}
          <div className="md:col-span-4 relative group">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-theme" />
              From City
            </label>
            <div className="relative">
              <input
                id="search-from-input"
                type="text"
                list="from-cities"
                value={fromInput}
                onChange={(e) => {
                  setFromInput(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="Enter departure city"
                className="w-full h-12 sm:h-14 px-4 bg-neutral-50 hover:bg-neutral-100/70 focus:bg-white border border-neutral-200 rounded-xl text-neutral-900 font-semibold text-base focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-ring)] focus:border-theme transition-all"
                required
              />
              <datalist id="from-cities">
                {cities.map((city) => (
                  <option key={`from-${city}`} value={city} />
                ))}
              </datalist>
            </div>
          </div>

          {/* SWAP BUTTON */}
          <div className="md:col-span-1 flex justify-center py-1 md:py-0 md:pt-5">
            <button
              type="button"
              onClick={handleSwap}
              id="swap-cities-btn"
              title="Swap Departure and Destination"
              className="w-10 h-10 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 hover:text-theme flex items-center justify-center shadow-xs hover:border-theme transition-all hover:rotate-180 duration-300 cursor-pointer"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {/* TO Input */}
          <div className="md:col-span-4 relative group">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              To Destination
            </label>
            <div className="relative">
              <input
                id="search-to-input"
                type="text"
                list="to-cities"
                value={toInput}
                onChange={(e) => {
                  setToInput(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="Enter destination city"
                className="w-full h-12 sm:h-14 px-4 bg-neutral-50 hover:bg-neutral-100/70 focus:bg-white border border-neutral-200 rounded-xl text-neutral-900 font-semibold text-base focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-ring)] focus:border-theme transition-all"
                required
              />
              <datalist id="to-cities">
                {cities.map((city) => (
                  <option key={`to-${city}`} value={city} />
                ))}
              </datalist>
            </div>
          </div>

          {/* DATE Input */}
          <div className="md:col-span-3 relative">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-neutral-600" />
              Date of Journey
            </label>
            <input
              id="search-date-input"
              type="date"
              value={dateInput}
              min="2026-09-19"
              onChange={(e) => setDateInput(e.target.value)}
              className="w-full h-12 sm:h-14 px-3.5 bg-neutral-50 hover:bg-neutral-100/70 focus:bg-white border border-neutral-200 rounded-xl text-neutral-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[var(--theme-primary-ring)] focus:border-theme transition-all cursor-pointer"
              required
            />
          </div>
        </div>

        {/* Quick Date Chips & Search Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-neutral-100">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-neutral-400 font-medium hidden sm:inline">Quick dates:</span>
            <button
              type="button"
              onClick={() => setDateInput(todayStr)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                dateInput === todayStr
                  ? 'bg-theme-light border-theme text-theme'
                  : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              Today (20 Sep)
            </button>
            <button
              type="button"
              onClick={() => setDateInput(tomorrowStr)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                dateInput === tomorrowStr
                  ? 'bg-theme-light border-theme text-theme'
                  : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              Tomorrow (21 Sep)
            </button>
            <button
              type="button"
              onClick={() => setDateInput(nextWeekendStr)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                dateInput === nextWeekendStr
                  ? 'bg-theme-light border-theme text-theme'
                  : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              Next Weekend (26 Sep)
            </button>
          </div>

          <Button
            type="submit"
            id="search-buses-submit-btn"
            variant="theme"
            size="lg"
            className="w-full sm:w-auto px-8 rounded-full font-bold shadow-md hover:shadow-lg transition-all"
          >
            <Search className="w-4 h-4 mr-2" />
            <span>Search buses</span>
          </Button>
        </div>

        {errorMessage && (
          <div className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-xl animate-in fade-in">
            {errorMessage}
          </div>
        )}
      </form>
    </div>
  );
};
