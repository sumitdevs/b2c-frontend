'use client';

import React, { useState } from 'react';
import { Bus, Seat, BoardingPoint, DroppingPoint } from '../../types';
import { useAppDispatch, useAppSelector } from '../../store';
import { generateSeats } from '../../services/mockData';
import {
  toggleSeat,
  setBoardingPoint,
  setDroppingPoint,
  openCheckoutModal,
} from '../../store/slices/bookingSlice';
import { Button } from '../ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/Tabs';
import { Check, Info, Shield, Users, Bus as BusIcon } from 'lucide-react';

interface SeatSelectorProps {
  bus: Bus;
}

export const SeatSelector: React.FC<SeatSelectorProps> = ({ bus }) => {
  const dispatch = useAppDispatch();
  const { selectedSeats = [], selectedBoardingPoint, selectedDroppingPoint, discountAmount = 0 } =
    useAppSelector((state) => state.booking);

  const [activeDeck, setActiveDeck] = useState<'lower' | 'upper'>('lower');

  const busSeats =
    bus?.seats && Array.isArray(bus.seats) && bus.seats.length > 0 ? bus.seats : generateSeats();
  const lowerSeats = busSeats.filter((s) => s.deck === 'lower');
  const upperSeats = busSeats.filter((s) => s.deck === 'upper');

  const originName = bus?.originCity || 'Bangalore';
  const destName = bus?.destinationCity || 'Goa';

  const safeBoardingPoints: BoardingPoint[] =
    bus?.boardingPoints && Array.isArray(bus.boardingPoints) && bus.boardingPoints.length > 0
      ? bus.boardingPoints
      : [
          {
            id: `bp-${bus?.id || 'default'}-1`,
            time: bus?.departureTime || '21:00',
            location: `${originName} Central Terminal`,
            landmark: 'Platform 3, Main Bay',
          },
          {
            id: `bp-${bus?.id || 'default'}-2`,
            time: '21:45',
            location: `${originName} Highway Toll Hub`,
            landmark: 'Near Toll Plaza Counter 2',
          },
        ];

  const safeDroppingPoints: DroppingPoint[] =
    bus?.droppingPoints && Array.isArray(bus.droppingPoints) && bus.droppingPoints.length > 0
      ? bus.droppingPoints
      : [
          {
            id: `dp-${bus?.id || 'default'}-1`,
            time: bus?.arrivalTime || '06:30',
            location: `${destName} Central Bus Stand`,
            landmark: 'Main City Circle',
          },
          {
            id: `dp-${bus?.id || 'default'}-2`,
            time: '07:15',
            location: `${destName} Expressway Interchange`,
            landmark: 'Opposite State Bank',
          },
        ];

  const isSeatSelected = (seatId: string) => selectedSeats.some((s) => s.id === seatId);

  const baseFare = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const taxes = Math.round(baseFare * 0.05);
  const finalTotal = Math.max(0, baseFare + taxes - discountAmount);

  const isSleeper = bus?.isSleeper !== false;
  const hasUpperDeck = upperSeats.length > 0;

  const renderDeckGrid = (seats: Seat[]) => {
    if (!seats || seats.length === 0) {
      return (
        <div className="bg-neutral-100 p-8 rounded-2xl border border-neutral-200 text-center text-xs text-neutral-500">
          No berths available on this deck.
        </div>
      );
    }

    // Determine row count dynamically
    const maxRow = Math.max(6, ...seats.map((s) => s.row || 1));
    const rows = Array.from({ length: maxRow }, (_, i) => i + 1);

    // Verify if structured rows have seats
    const hasRowStructure = seats.some((s) => s.row !== undefined && s.column !== undefined);

    if (!hasRowStructure) {
      // Fallback: render all seats in a clean responsive grid
      return (
        <div className="bg-neutral-100/80 p-5 rounded-2xl border border-neutral-200">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-200 text-xs font-semibold text-neutral-500">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-400" />
              <span>Cabin & Steering (Front)</span>
            </div>
            <span className="text-[11px] font-mono text-neutral-400">Entry Door 🚪</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {seats.map((seat) => renderSeatBerth(seat))}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-neutral-100/80 p-4 sm:p-5 rounded-2xl border border-neutral-200">
        {/* Bus Front Indicator */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-200 text-xs font-semibold text-neutral-500">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-400" />
            <span>Cabin & Driver (Front)</span>
          </div>
          <span className="text-[11px] font-mono text-neutral-500">Entry Door 🚪</span>
        </div>

        {/* Rows of berths / seats */}
        <div className="space-y-3">
          {rows.map((r) => {
            const singleBerth = seats.find((s) => s.row === r && s.column === 1);
            const doubleBerth1 = seats.find((s) => s.row === r && s.column === 2);
            const doubleBerth2 = seats.find((s) => s.row === r && s.column === 3);
            const extraBerth = seats.find((s) => s.row === r && s.column === 4);

            // If this row has no seats at all, skip rendering empty line
            if (!singleBerth && !doubleBerth1 && !doubleBerth2 && !extraBerth) {
              return null;
            }

            return (
              <div key={`row-${r}`} className="flex items-center justify-between gap-2 sm:gap-4">
                {/* Left Side (Single Berth / Window) */}
                <div className="min-w-[64px] sm:w-20">
                  {singleBerth ? (
                    renderSeatBerth(singleBerth)
                  ) : (
                    <div className="h-12 w-16 sm:w-20" />
                  )}
                </div>

                {/* Aisle Spacer */}
                <div className="text-[10px] text-neutral-400 font-mono flex-1 text-center select-none py-1">
                  Row {r}
                </div>

                {/* Right Side (Double Berths or Seater Pair) */}
                <div className="flex items-center gap-2">
                  {doubleBerth1 && renderSeatBerth(doubleBerth1)}
                  {doubleBerth2 && renderSeatBerth(doubleBerth2)}
                  {extraBerth && renderSeatBerth(extraBerth)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bus Rear Indicator */}
        <div className="text-center pt-3 mt-4 border-t border-neutral-200 text-[11px] font-mono text-neutral-400">
          Bus Rear (Back)
        </div>
      </div>
    );
  };

  const renderSeatBerth = (seat: Seat) => {
    const isSelected = isSeatSelected(seat.id);
    const isBooked = seat.status === 'booked';
    const isFemaleOnly = seat.status === 'female-only';

    let seatClasses =
      'h-12 w-16 sm:w-20 rounded-xl border flex flex-col items-center justify-center relative transition-all cursor-pointer select-none text-xs font-semibold';

    if (isSelected) {
      seatClasses += ' bg-theme border-theme text-white shadow-sm ring-2 ring-[var(--theme-primary-ring)]';
    } else if (isBooked) {
      seatClasses += ' bg-neutral-200/90 border-neutral-300 text-neutral-400 cursor-not-allowed';
    } else if (isFemaleOnly) {
      seatClasses += ' bg-pink-50 border-pink-300 text-pink-700 hover:bg-pink-100/80';
    } else {
      seatClasses += ' bg-white border-neutral-300 text-neutral-800 hover:border-theme hover:bg-neutral-50 shadow-2xs';
    }

    return (
      <button
        key={seat.id}
        type="button"
        disabled={isBooked}
        onClick={() => dispatch(toggleSeat(seat))}
        className={seatClasses}
        title={`Seat ${seat.number} - ₹${seat.price} (${seat.status})`}
      >
        {/* Pillow indicator */}
        <span
          className={`absolute top-1 right-1 w-2.5 h-2 rounded-xs ${
            isSelected ? 'bg-white/40' : isBooked ? 'bg-neutral-300' : 'bg-neutral-200'
          }`}
        />
        <span className="font-mono font-bold text-[11px]">{seat.number}</span>
        <span className={`text-[10px] ${isSelected ? 'text-white/90' : 'text-neutral-500'}`}>
          ₹{seat.price}
        </span>
      </button>
    );
  };

  return (
    <div id="seat-selector-view" className="p-4 sm:p-6 bg-white border-t border-neutral-200 rounded-b-2xl animate-in fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Seat Map */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <BusIcon className="w-4 h-4 text-theme" />
              <span>{isSleeper ? 'Select Your Berths' : 'Select Your Seats'}</span>
            </h4>

            {/* Deck Switcher */}
            {hasUpperDeck ? (
              <div className="flex rounded-xl bg-neutral-100 p-1 border border-neutral-200 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveDeck('lower')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    activeDeck === 'lower' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600'
                  }`}
                >
                  Lower Deck ({lowerSeats.filter((s) => s.status !== 'booked').length} left)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDeck('upper')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    activeDeck === 'upper' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-600'
                  }`}
                >
                  Upper Deck ({upperSeats.filter((s) => s.status !== 'booked').length} left)
                </button>
              </div>
            ) : (
              <span className="text-xs font-medium text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-lg">
                Single Deck Coach ({lowerSeats.filter((s) => s.status !== 'booked').length} seats left)
              </span>
            )}
          </div>

          {/* Seat Layout Render */}
          {activeDeck === 'lower' || !hasUpperDeck
            ? renderDeckGrid(lowerSeats)
            : renderDeckGrid(upperSeats)}

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-600 pt-2 border-t border-neutral-100">
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-md border border-neutral-300 bg-white" />
              <span>Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-md border border-theme bg-theme text-white flex items-center justify-center text-[9px]">
                ✓
              </span>
              <span>Selected</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-md border border-pink-300 bg-pink-100" />
              <span>Ladies Berth</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-md border border-neutral-300 bg-neutral-200" />
              <span>Booked</span>
            </div>
          </div>
        </div>

        {/* Right: Boarding / Dropping & Fare Breakdown */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6 bg-neutral-50 p-5 rounded-2xl border border-neutral-200/80">
          <div className="space-y-5">
            {/* Boarding Point */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                Boarding Point & Time
              </label>
              <div className="space-y-2">
                {safeBoardingPoints.map((bp) => {
                  const isSelected = selectedBoardingPoint?.id === bp.id;
                  return (
                    <button
                      key={bp.id}
                      type="button"
                      onClick={() => dispatch(setBoardingPoint(bp))}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-start justify-between cursor-pointer ${
                        isSelected
                          ? 'border-neutral-900 bg-white shadow-xs font-medium text-neutral-900'
                          : 'border-neutral-200 hover:border-neutral-300 bg-white/60 text-neutral-600'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                          <span>{bp.time}</span>
                          <span className="font-normal text-neutral-500">• {bp.location}</span>
                        </div>
                        <div className="text-[11px] text-neutral-500">{bp.landmark}</div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-theme shrink-0 mt-0.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dropping Point */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                Dropping Point & Time
              </label>
              <div className="space-y-2">
                {safeDroppingPoints.map((dp) => {
                  const isSelected = selectedDroppingPoint?.id === dp.id;
                  return (
                    <button
                      key={dp.id}
                      type="button"
                      onClick={() => dispatch(setDroppingPoint(dp))}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-start justify-between cursor-pointer ${
                        isSelected
                          ? 'border-neutral-900 bg-white shadow-xs font-medium text-neutral-900'
                          : 'border-neutral-200 hover:border-neutral-300 bg-white/60 text-neutral-600'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                          <span>{dp.time}</span>
                          <span className="font-normal text-neutral-500">• {dp.location}</span>
                        </div>
                        <div className="text-[11px] text-neutral-500">{dp.landmark}</div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-theme shrink-0 mt-0.5" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Selected Seats summary & Checkout Action */}
          <div className="border-t border-neutral-200 pt-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-500">Selected Berths:</span>
              <span className="font-bold text-neutral-900">
                {selectedSeats.length > 0
                  ? selectedSeats.map((s) => s.number).join(', ')
                  : 'No berth chosen yet'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-500">Base Fare ({selectedSeats.length} seats):</span>
              <span className="font-medium text-neutral-900">₹{baseFare}</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-500">Taxes & GST (5%):</span>
              <span className="font-medium text-neutral-900">₹{taxes}</span>
            </div>

            <div className="flex items-center justify-between text-sm font-bold pt-2 border-t border-dashed border-neutral-200">
              <span>Total Amount:</span>
              <span className="text-base text-theme font-display">₹{finalTotal}</span>
            </div>

            <Button
              id="proceed-to-checkout-btn"
              variant="theme"
              size="lg"
              disabled={selectedSeats.length === 0}
              onClick={() => dispatch(openCheckoutModal())}
              className="w-full font-bold shadow-md hover:shadow-lg transition-all"
            >
              PROCEED TO BOOK ({selectedSeats.length} {selectedSeats.length === 1 ? 'SEAT' : 'SEATS'})
            </Button>

            <p className="text-[11px] text-neutral-500 text-center flex items-center justify-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              Secure 256-bit SSL encrypted booking
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
