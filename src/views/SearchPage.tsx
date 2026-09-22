'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../store';
import {
  searchBuses,
  setSearchParams,
  toggleBusTypeFilter,
  toggleDepartureTimeFilter,
  toggleOperatorFilter,
  setPriceRange,
  setMinRating,
  setSortBy,
  resetFilters,
  toggleSeatSelectionView,
} from '../store/slices/searchSlice';
import { initBookingForBus } from '../store/slices/bookingSlice';
import { BASE_BUSES, generateSeats } from '../services/mockData';
import { SearchWidget } from '../components/search/SearchWidget';
import { SeatSelector } from '../components/search/SeatSelector';
import { Slider } from '../components/ui/Slider';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  Bus as BusIcon,
  SlidersHorizontal,
  Star,
  Clock,
  Wifi,
  Zap,
  MapPin,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Check,
  Filter,
} from 'lucide-react';
import { Bus } from '../types';

export const SearchPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const urlSearchParams = useSearchParams();
  const urlFrom = urlSearchParams ? urlSearchParams.get('from') : null;
  const urlTo = urlSearchParams ? urlSearchParams.get('to') : null;
  const urlDate = urlSearchParams ? urlSearchParams.get('date') : null;

  const { searchParams, filters, buses, isLoading, selectedBusIdForSeats } = useAppSelector(
    (state) => state.search
  );

  const [showModifySearch, setShowModifySearch] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [expandedBusId, setExpandedBusId] = useState<string | null>(null);

  useEffect(() => {
    if (urlFrom && urlTo) {
      const updated = { from: urlFrom, to: urlTo, date: urlDate || '2026-09-22' };
      dispatch(setSearchParams(updated));
      dispatch(searchBuses(updated));
      setExpandedBusId(null);
      dispatch(toggleSeatSelectionView(null));
    } else if (buses.length === 0) {
      dispatch(searchBuses(searchParams));
    }
  }, [dispatch, urlFrom, urlTo, urlDate]);

  // Ensure buses are always present even before network completes
  const activeBuses: Bus[] =
    buses && buses.length > 0
      ? buses
      : BASE_BUSES.map((base) => ({
          ...base,
          id: base.id,
          originCity: searchParams.from || 'Bangalore',
          destinationCity: searchParams.to || 'Goa',
          seats: base.seats && base.seats.length > 0 ? base.seats : generateSeats(),
        }));

  // Filter & Sort Logic
  const filteredBuses = activeBuses.filter((bus) => {
    // Bus type
    if (filters.busTypes.length > 0) {
      const match = filters.busTypes.some((type) => {
        if (type === 'AC') return bus.isAC;
        if (type === 'Non-AC') return !bus.isAC;
        if (type === 'Sleeper') return bus.isSleeper;
        if (type === 'Seater') return !bus.isSleeper;
        if (type === 'Electric') return bus.isElectric;
        return true;
      });
      if (!match) return false;
    }

    // Departure Time
    if (filters.departureTimes.length > 0) {
      const hour = parseInt(bus.departureTime.split(':')[0], 10);
      const matchTime = filters.departureTimes.some((slot) => {
        if (slot === 'before-6am') return hour < 6;
        if (slot === '6am-12pm') return hour >= 6 && hour < 12;
        if (slot === '12pm-6pm') return hour >= 12 && hour < 18;
        if (slot === 'after-6pm') return hour >= 18;
        return true;
      });
      if (!matchTime) return false;
    }

    // Operators
    if (filters.operators.length > 0) {
      if (!filters.operators.includes(bus.operatorName)) return false;
    }

    // Price Range
    if (bus.price < filters.priceRange[0] || bus.price > filters.priceRange[1]) {
      return false;
    }

    // Min Rating
    if (filters.minRating > 0 && bus.rating < filters.minRating) {
      return false;
    }

    return true;
  });

  // Sort
  const sortedBuses = [...filteredBuses].sort((a, b) => {
    if (filters.sortBy === 'cheapest') return a.price - b.price;
    if (filters.sortBy === 'highest-rated') return b.rating - a.rating;
    if (filters.sortBy === 'early-departure') return a.departureTime.localeCompare(b.departureTime);
    if (filters.sortBy === 'late-departure') return b.departureTime.localeCompare(a.departureTime);
    return 0;
  });

  const handleToggleSeats = (bus: Bus) => {
    const isCurrentlyExpanded = expandedBusId === bus.id || selectedBusIdForSeats === bus.id;
    if (isCurrentlyExpanded) {
      setExpandedBusId(null);
      dispatch(toggleSeatSelectionView(null));
    } else {
      setExpandedBusId(bus.id);
      dispatch(initBookingForBus(bus));
      dispatch(toggleSeatSelectionView(bus.id));
      setTimeout(() => {
        try {
          const el = document.getElementById(`seat-layout-${bus.id}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        } catch {
          // ignore potential scroll issues in sandboxed environments
        }
      }, 50);
    }
  };

  const renderFilterSidebar = () => (
    <div className="space-y-6">
      {/* Header with reset */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
        <h3 className="font-bold font-display text-sm text-neutral-900 flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-theme" />
          Filter Buses
        </h3>
        <button
          type="button"
          onClick={() => dispatch(resetFilters())}
          className="text-xs text-neutral-500 hover:text-theme flex items-center gap-1 cursor-pointer font-medium"
        >
          <RotateCcw className="w-3 h-3" />
          Reset All
        </button>
      </div>

      {/* Bus Types */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2.5">
          Bus Type
        </h4>
        <div className="space-y-2">
          {[
            { id: 'AC', label: 'AC Coaches' },
            { id: 'Non-AC', label: 'Non-AC' },
            { id: 'Sleeper', label: 'Sleeper Berths' },
            { id: 'Seater', label: 'Pushback Seater' },
            { id: 'Electric', label: 'Electric EV Coach' },
          ].map((type) => {
            const checked = filters.busTypes.includes(type.id);
            return (
              <label
                key={type.id}
                className="flex items-center gap-2.5 text-xs text-neutral-700 cursor-pointer select-none hover:text-neutral-900"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => dispatch(toggleBusTypeFilter(type.id))}
                  className="w-4 h-4 rounded-md text-theme border-neutral-300 focus:ring-theme"
                />
                <span>{type.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Departure Time Slots */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2.5">
          Departure Time
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'before-6am', label: 'Early Morning', sub: 'Before 6 AM' },
            { id: '6am-12pm', label: 'Morning', sub: '6 AM - 12 PM' },
            { id: '12pm-6pm', label: 'Afternoon', sub: '12 PM - 6 PM' },
            { id: 'after-6pm', label: 'Night', sub: 'After 6 PM' },
          ].map((slot) => {
            const active = filters.departureTimes.includes(slot.id);
            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => dispatch(toggleDepartureTimeFilter(slot.id))}
                className={`p-2 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                  active
                    ? 'border-theme bg-theme-light text-theme font-semibold'
                    : 'border-neutral-200 hover:border-neutral-300 text-neutral-700 bg-white'
                }`}
              >
                <div className="font-bold">{slot.label}</div>
                <div className="text-[10px] text-neutral-400">{slot.sub}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-600">
            Price Range
          </h4>
          <span className="text-xs font-bold text-neutral-900">
            Up to ₹{filters.priceRange[1]}
          </span>
        </div>
        <Slider
          defaultValue={[filters.priceRange[1]]}
          value={[filters.priceRange[1]]}
          max={2500}
          min={300}
          step={50}
          onValueChange={(val) => dispatch(setPriceRange([filters.priceRange[0], val[0]]))}
        />
        <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
          <span>₹300</span>
          <span>₹2,500</span>
        </div>
      </div>

      {/* Minimum Rating */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2.5">
          Star Rating
        </h4>
        <div className="flex items-center gap-2">
          {[0, 4.0, 4.5].map((rating) => (
            <button
              key={`rating-${rating}`}
              type="button"
              onClick={() => dispatch(setMinRating(rating))}
              className={`flex-1 py-1.5 px-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-all ${
                filters.minRating === rating
                  ? 'bg-theme text-white border-theme'
                  : 'bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              {rating === 0 ? (
                'All'
              ) : (
                <>
                  <Star className="w-3 h-3 fill-current" />
                  {rating}+
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Bus Operators */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2.5">
          Bus Operators
        </h4>
        <div className="space-y-2">
          {[
            'IntrCity SmartBus',
            'Zingbus Premium',
            'NueGo Intercity Electric',
            'Orange Tours and Travels',
            'VRL Travels Classic',
            'SRS Travels Super Luxury',
          ].map((op) => {
            const checked = filters.operators.includes(op);
            return (
              <label
                key={op}
                className="flex items-center gap-2.5 text-xs text-neutral-700 cursor-pointer select-none hover:text-neutral-900"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => dispatch(toggleOperatorFilter(op))}
                  className="w-4 h-4 rounded-md text-theme border-neutral-300 focus:ring-theme"
                />
                <span className="truncate">{op}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* TOP ROUTE BAR & DATE SELECTOR */}
      <div className="bg-white rounded-2xl border border-neutral-200/90 p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-theme-light text-theme flex items-center justify-center font-bold">
              <BusIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black font-display text-neutral-900">
                  {searchParams.from} → {searchParams.to}
                </h1>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {sortedBuses.length} Buses Found
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Departure Date: <span className="font-semibold text-neutral-700">{searchParams.date}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              id="modify-search-toggle-btn"
              type="button"
              variant={showModifySearch ? 'theme' : 'outline'}
              size="sm"
              onClick={() => setShowModifySearch((prev) => !prev)}
              className="text-xs font-semibold cursor-pointer"
            >
              {showModifySearch ? 'Close Search Bar' : 'Modify Search'}
            </Button>

            {/* Mobile filter toggle */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden text-xs flex items-center gap-1.5"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
            </Button>
          </div>
        </div>

        {/* Expandable Search Widget */}
        {showModifySearch && (
          <div id="modify-search-panel" className="mt-4 pt-4 border-t border-neutral-100">
            <SearchWidget
              variant="compact"
              onSearchComplete={() => {
                setShowModifySearch(false);
                setExpandedBusId(null);
                dispatch(toggleSeatSelectionView(null));
              }}
            />
          </div>
        )}
      </div>

      {/* MAIN LAYOUT: Filters Left + Bus Results Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:block lg:col-span-3 bg-white rounded-2xl border border-neutral-200/90 p-5 shadow-xs sticky top-24">
          {renderFilterSidebar()}
        </aside>

        {/* MOBILE FILTERS MODAL */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-white w-full sm:max-w-md max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl p-6 space-y-4 animate-in slide-in-from-bottom">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <h3 className="font-bold text-base">Filter Buses</h3>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="text-neutral-500 font-bold text-sm px-2 py-1"
                >
                  Done
                </button>
              </div>
              {renderFilterSidebar()}
              <Button
                variant="theme"
                className="w-full"
                onClick={() => setMobileFiltersOpen(false)}
              >
                Apply Filters ({sortedBuses.length} Buses)
              </Button>
            </div>
          </div>
        )}

        {/* RESULTS AREA */}
        <main className="lg:col-span-9 space-y-4">
          {/* SORTING BAR */}
          <div className="bg-white rounded-xl border border-neutral-200/80 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-neutral-500 font-medium hidden sm:inline">Sort buses by:</span>
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'cheapest', label: 'Cheapest' },
                { id: 'highest-rated', label: 'Highest Rated' },
                { id: 'early-departure', label: 'Earliest' },
                { id: 'late-departure', label: 'Latest' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => dispatch(setSortBy(s.id as any))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    filters.sortBy === s.id
                      ? 'bg-neutral-900 text-white shadow-2xs'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* BUS CARDS LIST */}
          {isLoading ? (
            <div className="py-20 text-center space-y-3 bg-white rounded-2xl border border-neutral-200">
              <div className="w-8 h-8 rounded-full border-2 border-theme border-t-transparent animate-spin mx-auto" />
              <p className="text-sm font-semibold text-neutral-600">
                Finding best bus routes & certified operators...
              </p>
            </div>
          ) : sortedBuses.length === 0 ? (
            <div className="py-16 text-center space-y-4 bg-white rounded-2xl border border-neutral-200 p-6">
              <div className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
                <BusIcon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-neutral-900 font-display">
                No buses found for this filter criteria
              </h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Try widening your price range or clearing some filters to see all available Volvo and sleeper coaches.
              </p>
              <Button variant="theme" size="sm" onClick={() => dispatch(resetFilters())}>
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedBuses.map((bus) => {
                const isExpanded = expandedBusId === bus.id || selectedBusIdForSeats === bus.id;
                return (
                  <div
                    key={bus.id}
                    className={`bg-white rounded-2xl border transition-all ${
                      isExpanded
                        ? 'border-theme ring-2 ring-[var(--theme-primary-ring)] shadow-lg'
                        : 'border-neutral-200/90 hover:border-neutral-300 shadow-2xs hover:shadow-md'
                    }`}
                  >
                    {/* Bus Card Content */}
                    <div className="p-4 sm:p-6 space-y-4">
                      {/* Top row: Operator name & ratings */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base sm:text-lg font-bold text-neutral-900">
                              {bus.operatorName}
                            </h3>
                            {bus.isElectric && (
                              <Badge variant="success">100% Electric EV</Badge>
                            )}
                            {bus.liveTrackingAvailable && (
                              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                                <Zap className="w-3 h-3" /> Live GPS
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-neutral-500 mt-0.5">{bus.busType}</p>
                        </div>

                        {/* Rating pill */}
                        <div className="flex items-center gap-2 self-start sm:self-auto">
                          <div className="flex items-center gap-1 bg-emerald-600 text-white px-2.5 py-1 rounded-lg text-xs font-bold">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span>{bus.rating.toFixed(1)}</span>
                          </div>
                          <span className="text-xs text-neutral-400">
                            ({bus.totalReviews.toLocaleString()} reviews)
                          </span>
                        </div>
                      </div>

                      {/* Middle row: Timings, Duration, Boarding/Dropping */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-neutral-50/70 p-3 sm:p-4 rounded-xl border border-neutral-100">
                        {/* Departure */}
                        <div className="sm:col-span-4">
                          <div className="text-lg sm:text-xl font-black font-display text-neutral-900">
                            {bus.departureTime}
                          </div>
                          <div className="text-xs font-bold text-neutral-700 truncate">
                            {bus.boardingPoints[0]?.location || bus.originCity}
                          </div>
                          <div className="text-[11px] text-neutral-400 truncate">
                            {bus.boardingPoints[0]?.landmark}
                          </div>
                        </div>

                        {/* Duration Indicator */}
                        <div className="sm:col-span-4 text-center">
                          <div className="text-[11px] text-neutral-500 font-medium flex items-center justify-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{bus.duration}</span>
                          </div>
                          <div className="relative my-1 flex items-center justify-center">
                            <div className="h-[2px] w-full bg-neutral-300 rounded-full" />
                            <BusIcon className="w-3.5 h-3.5 text-neutral-600 bg-neutral-50 px-0.5 absolute" />
                          </div>
                          <div className="text-[10px] text-emerald-600 font-semibold">
                            {bus.cancellationPolicy.includes('Free') ? 'Free Cancellation' : 'On-Time Guaranteed'}
                          </div>
                        </div>

                        {/* Arrival */}
                        <div className="sm:col-span-4 text-left sm:text-right">
                          <div className="text-lg sm:text-xl font-black font-display text-neutral-900">
                            {bus.arrivalTime}
                          </div>
                          <div className="text-xs font-bold text-neutral-700 truncate">
                            {bus.droppingPoints[0]?.location || bus.destinationCity}
                          </div>
                          <div className="text-[11px] text-neutral-400 truncate">
                            {bus.droppingPoints[0]?.landmark}
                          </div>
                        </div>
                      </div>

                      {/* Bottom row: Amenities, Seats left, Price & CTA */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                        {/* Amenities preview */}
                        <div className="flex flex-wrap items-center gap-2">
                          {bus.amenities.slice(0, 3).map((amenity, idx) => (
                            <span
                              key={`amenity-${idx}`}
                              className="text-[11px] text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded-lg font-medium"
                            >
                              {amenity}
                            </span>
                          ))}
                          {bus.amenities.length > 3 && (
                            <span className="text-[10px] text-neutral-400 font-medium">
                              +{bus.amenities.length - 3} more
                            </span>
                          )}
                        </div>

                        {/* Price & Action */}
                        <div className="flex items-center justify-between sm:justify-end gap-5">
                          <div className="text-right">
                            <div className="flex items-baseline gap-2">
                              <span className="text-xs text-neutral-400 line-through">
                                ₹{bus.originalPrice}
                              </span>
                              <span className="text-xl sm:text-2xl font-black font-display text-neutral-900">
                                ₹{bus.price}
                              </span>
                            </div>
                            <span className="text-[11px] font-semibold text-rose-600 block -mt-1">
                              {bus.seatsAvailable} berths left
                            </span>
                          </div>

                          <Button
                            id={`view-seats-btn-${bus.id}`}
                            type="button"
                            variant={isExpanded ? 'secondary' : 'theme'}
                            size="md"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleToggleSeats(bus);
                            }}
                            className="font-bold min-w-[125px] cursor-pointer select-none"
                            data-testid="view-seats-btn"
                          >
                            {isExpanded ? (
                              <>
                                <span>Hide Seats</span>
                                <ChevronUp className="w-4 h-4 ml-1" />
                              </>
                            ) : (
                              <>
                                <span>View Seats</span>
                                <ChevronDown className="w-4 h-4 ml-1" />
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* EXPANDED SEAT SELECTION INTERFACE */}
                    {isExpanded && (
                      <div id={`seat-layout-${bus.id}`} data-testid="seat-layout">
                        <SeatSelector bus={bus} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
