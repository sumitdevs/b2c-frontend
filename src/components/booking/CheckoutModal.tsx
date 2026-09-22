'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  closeCheckoutModal,
  updatePassenger,
  setContactDetails,
  applyCoupon,
  removeCoupon,
  submitBookingThunk,
  resetBookingSuccess,
} from '../../store/slices/bookingSlice';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/Dialog';
import { Button } from '../ui/Button';
import { CheckCircle2, Copy, Shield, Tag, Ticket, User, X } from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    activeBus,
    selectedSeats,
    selectedBoardingPoint,
    selectedDroppingPoint,
    passengers,
    contactEmail,
    contactPhone,
    appliedCoupon,
    discountAmount,
    isCheckoutModalOpen,
    isSubmitting,
    confirmedPNR,
    confirmationMessage,
  } = useAppSelector((state) => state.booking);

  const { searchParams } = useAppSelector((state) => state.search);
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [copiedPNR, setCopiedPNR] = useState(false);

  if (!isCheckoutModalOpen || !activeBus) return null;

  const baseFare = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const taxes = Math.round(baseFare * 0.05);
  const totalPayable = Math.max(0, baseFare + taxes - discountAmount);

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    setCouponError(null);
    if (code === 'FIRSTBUS') {
      dispatch(applyCoupon({ code: 'FIRSTBUS', discountPercentage: 20, maxDiscount: 250 }));
    } else if (code === 'WEEKEND50') {
      dispatch(applyCoupon({ code: 'WEEKEND50', discountPercentage: 15, maxDiscount: 150 }));
    } else if (code === 'ELEC100') {
      dispatch(applyCoupon({ code: 'ELEC100', discountPercentage: 18, maxDiscount: 180 }));
    } else {
      setCouponError('Invalid coupon code. Try: FIRSTBUS, WEEKEND50, or ELEC100');
    }
  };

  const handleCopyPNR = () => {
    if (confirmedPNR) {
      navigator.clipboard?.writeText(confirmedPNR);
      setCopiedPNR(true);
      setTimeout(() => setCopiedPNR(false), 2000);
    }
  };

  return (
    <Dialog
      open={isCheckoutModalOpen}
      onOpenChange={(open) => {
        if (!open) {
          if (confirmedPNR) {
            dispatch(resetBookingSuccess());
          } else {
            dispatch(closeCheckoutModal());
          }
        }
      }}
    >
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        {/* SUCCESS CONFIRMATION VIEW */}
        {confirmedPNR ? (
          <div className="text-center py-6 space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div>
              <h3 className="font-display text-2xl font-bold text-neutral-900">
                Ticket Booking Confirmed!
              </h3>
              <p className="text-sm text-neutral-600 mt-1">{confirmationMessage}</p>
            </div>

            {/* PNR Card */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5 max-w-md mx-auto text-left space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-200/80 pb-3">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Booking Reference / PNR
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-lg font-bold text-neutral-900">{confirmedPNR}</span>
                  <button
                    onClick={handleCopyPNR}
                    className="p-1 text-neutral-500 hover:text-neutral-900 rounded-md hover:bg-neutral-200 cursor-pointer"
                    title="Copy PNR"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-neutral-500 block">Operator:</span>
                  <span className="font-semibold text-neutral-900">{activeBus.operatorName}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Route:</span>
                  <span className="font-semibold text-neutral-900">
                    {searchParams.from} → {searchParams.to}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Seats:</span>
                  <span className="font-semibold text-neutral-900">
                    {selectedSeats.map((s) => s.number).join(', ')}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block">Total Paid:</span>
                  <span className="font-bold text-theme font-display text-sm">₹{totalPayable}</span>
                </div>
              </div>
            </div>

            <Button
              variant="theme"
              size="lg"
              onClick={() => dispatch(resetBookingSuccess())}
              className="w-full max-w-md mx-auto font-bold"
            >
              Done & Return to Buses
            </Button>
          </div>
        ) : (
          /* CHECKOUT FORM VIEW */
          <div className="space-y-6">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Ticket className="w-5 h-5 text-theme" />
                Passenger Details & Booking
              </DialogTitle>
            </DialogHeader>

            {/* Trip summary badge */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-neutral-900 text-sm">{activeBus.operatorName}</span>
                <span className="text-neutral-500 block">
                  {searchParams.from} → {searchParams.to} • {searchParams.date}
                </span>
              </div>
              <div className="text-right">
                <span className="font-semibold text-neutral-700">
                  Seats: {selectedSeats.map((s) => s.number).join(', ')}
                </span>
                <span className="text-neutral-500 block">
                  Boarding: {selectedBoardingPoint?.time} ({selectedBoardingPoint?.location})
                </span>
              </div>
            </div>

            {/* Passenger Forms */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                Passenger Information
              </h4>

              {passengers.map((p, idx) => (
                <div
                  key={`passenger-${p.seatId}`}
                  className="bg-neutral-50/70 border border-neutral-200/80 rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-neutral-800">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-theme" />
                      Passenger {idx + 1}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-white border border-neutral-200 font-mono text-[11px]">
                      Seat {p.seatNumber}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-6">
                      <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={p.name}
                        onChange={(e) =>
                          dispatch(updatePassenger({ index: idx, data: { name: e.target.value } }))
                        }
                        placeholder="e.g. Rahul Sharma"
                        className="w-full h-10 px-3 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-theme"
                        required
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                        Age
                      </label>
                      <input
                        type="number"
                        min="5"
                        max="99"
                        value={p.age}
                        onChange={(e) =>
                          dispatch(
                            updatePassenger({
                              index: idx,
                              data: { age: parseInt(e.target.value) || 25 },
                            })
                          )
                        }
                        className="w-full h-10 px-3 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-theme"
                        required
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                        Gender
                      </label>
                      <select
                        value={p.gender}
                        onChange={(e) =>
                          dispatch(
                            updatePassenger({
                              index: idx,
                              data: { gender: e.target.value as 'male' | 'female' | 'other' },
                            })
                          )
                        }
                        className="w-full h-10 px-3 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-theme"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Details */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                Contact & Ticket Delivery
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) =>
                      dispatch(setContactDetails({ email: e.target.value, phone: contactPhone }))
                    }
                    className="w-full h-10 px-3 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-theme"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) =>
                      dispatch(setContactDetails({ email: contactEmail, phone: e.target.value }))
                    }
                    className="w-full h-10 px-3 text-xs bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-theme"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Coupon Code Section */}
            <div className="border border-neutral-200 rounded-xl p-3 bg-neutral-50/70">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-theme" />
                Have a Promo Code?
              </label>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-800">Coupon applied: {appliedCoupon}</span>
                    <span className="text-emerald-700">(-₹{discountAmount})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => dispatch(removeCoupon())}
                    className="text-neutral-400 hover:text-neutral-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value);
                        if (couponError) setCouponError(null);
                      }}
                      placeholder="Try 'FIRSTBUS' or 'WEEKEND50'"
                      className="flex-1 h-9 px-3 text-xs uppercase font-mono bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-theme"
                    />
                    <Button size="sm" variant="outline" type="button" onClick={handleApplyCoupon}>
                      Apply
                    </Button>
                  </div>
                  {couponError && (
                    <p className="text-[11px] text-rose-600 font-medium">{couponError}</p>
                  )}
                </div>
              )}
            </div>

            {/* Fare Breakdown */}
            <div className="border-t border-neutral-200 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Base Fare ({selectedSeats.length} seats):</span>
                <span className="font-medium text-neutral-900">₹{baseFare}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>GST & Operator Convenience (5%):</span>
                <span className="font-medium text-neutral-900">₹{taxes}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Promo Discount:</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-neutral-900 pt-2 border-t border-dashed border-neutral-200">
                <span>Final Payable Amount:</span>
                <span className="text-lg text-theme font-display">₹{totalPayable}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2">
              <Button
                variant="theme"
                size="lg"
                isLoading={isSubmitting}
                onClick={() => dispatch(submitBookingThunk())}
                className="w-full font-bold shadow-md hover:shadow-lg transition-all"
              >
                PAY ₹{totalPayable} & CONFIRM BOOKING
              </Button>
              <div className="flex items-center justify-center gap-1 text-[11px] text-neutral-500 mt-2">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                <span>Instant confirmation SMS & E-Ticket generated</span>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
