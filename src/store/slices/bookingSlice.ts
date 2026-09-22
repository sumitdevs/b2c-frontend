import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { BoardingPoint, DroppingPoint, Passenger, Seat, Bus } from '../../types';
import { MockBusApi } from '../../services/mockApi';

interface BookingState {
  activeBus: Bus | null;
  selectedSeats: Seat[];
  selectedBoardingPoint: BoardingPoint | null;
  selectedDroppingPoint: DroppingPoint | null;
  passengers: Passenger[];
  contactEmail: string;
  contactPhone: string;
  appliedCoupon: string | null;
  discountAmount: number;
  isCheckoutModalOpen: boolean;
  isSubmitting: boolean;
  confirmedPNR: string | null;
  confirmationMessage: string | null;
}

const initialState: BookingState = {
  activeBus: null,
  selectedSeats: [],
  selectedBoardingPoint: null,
  selectedDroppingPoint: null,
  passengers: [],
  contactEmail: 'traveler@hopzy.demo',
  contactPhone: '+91 98765 43210',
  appliedCoupon: null,
  discountAmount: 0,
  isCheckoutModalOpen: false,
  isSubmitting: false,
  confirmedPNR: null,
  confirmationMessage: null,
};

export const submitBookingThunk = createAsyncThunk(
  'booking/submitBooking',
  async (_, { getState }) => {
    const state = (getState() as { booking: BookingState }).booking;
    if (!state.activeBus || !state.selectedBoardingPoint || !state.selectedDroppingPoint) {
      throw new Error('Incomplete booking information');
    }

    const baseFare = state.selectedSeats.reduce((acc, s) => acc + s.price, 0);
    const finalTotal = Math.max(0, baseFare - state.discountAmount);

    const payload = {
      busId: state.activeBus.id,
      bus: state.activeBus,
      selectedSeats: state.selectedSeats,
      boardingPoint: state.selectedBoardingPoint,
      droppingPoint: state.selectedDroppingPoint,
      passengers: state.passengers,
      contactEmail: state.contactEmail,
      contactPhone: state.contactPhone,
      totalAmount: baseFare,
      discountAmount: state.discountAmount,
      finalAmount: finalTotal,
      appliedCoupon: state.appliedCoupon || undefined,
    };

    const result = await MockBusApi.createBooking(payload);
    return result;
  }
);

export const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    initBookingForBus: (state, action: PayloadAction<Bus>) => {
      const bus = action.payload;
      state.activeBus = bus;
      state.selectedSeats = [];
      state.passengers = [];
      const defaultBp = {
        id: `bp-${bus.id}-1`,
        time: bus.departureTime || '21:00',
        location: `${bus.originCity || 'Origin'} Central Terminal`,
        landmark: 'Platform 1',
      };
      const defaultDp = {
        id: `dp-${bus.id}-1`,
        time: bus.arrivalTime || '06:30',
        location: `${bus.destinationCity || 'Destination'} Central Stand`,
        landmark: 'City Circle',
      };
      state.selectedBoardingPoint =
        bus.boardingPoints && bus.boardingPoints.length > 0 ? bus.boardingPoints[0] : defaultBp;
      state.selectedDroppingPoint =
        bus.droppingPoints && bus.droppingPoints.length > 0 ? bus.droppingPoints[0] : defaultDp;
      state.appliedCoupon = null;
      state.discountAmount = 0;
      state.confirmedPNR = null;
    },
    toggleSeat: (state, action: PayloadAction<Seat>) => {
      const seat = action.payload;
      if (seat.status === 'booked') return;

      const existingIndex = state.selectedSeats.findIndex((s) => s.id === seat.id);
      if (existingIndex >= 0) {
        state.selectedSeats.splice(existingIndex, 1);
        state.passengers = state.passengers.filter((p) => p.seatId !== seat.id);
      } else {
        if (state.selectedSeats.length >= 6) {
          return; // maximum 6 seats limit
        }
        state.selectedSeats.push(seat);
        state.passengers.push({
          seatNumber: seat.number,
          seatId: seat.id,
          name: `Passenger ${state.passengers.length + 1}`,
          age: 28,
          gender: 'male',
        });
      }
    },
    clearSeats: (state) => {
      state.selectedSeats = [];
      state.passengers = [];
    },
    setBoardingPoint: (state, action: PayloadAction<BoardingPoint>) => {
      state.selectedBoardingPoint = action.payload;
    },
    setDroppingPoint: (state, action: PayloadAction<DroppingPoint>) => {
      state.selectedDroppingPoint = action.payload;
    },
    updatePassenger: (
      state,
      action: PayloadAction<{ index: number; data: Partial<Passenger> }>
    ) => {
      const { index, data } = action.payload;
      if (state.passengers[index]) {
        state.passengers[index] = { ...state.passengers[index], ...data };
      }
    },
    setContactDetails: (
      state,
      action: PayloadAction<{ email: string; phone: string }>
    ) => {
      state.contactEmail = action.payload.email;
      state.contactPhone = action.payload.phone;
    },
    applyCoupon: (
      state,
      action: PayloadAction<{ code: string; discountPercentage: number; maxDiscount: number }>
    ) => {
      const total = state.selectedSeats.reduce((acc, s) => acc + s.price, 0);
      const calculated = Math.min(
        (total * action.payload.discountPercentage) / 100,
        action.payload.maxDiscount
      );
      state.appliedCoupon = action.payload.code;
      state.discountAmount = Math.round(calculated);
    },
    removeCoupon: (state) => {
      state.appliedCoupon = null;
      state.discountAmount = 0;
    },
    openCheckoutModal: (state) => {
      state.isCheckoutModalOpen = true;
    },
    closeCheckoutModal: (state) => {
      state.isCheckoutModalOpen = false;
    },
    resetBookingSuccess: (state) => {
      state.confirmedPNR = null;
      state.confirmationMessage = null;
      state.selectedSeats = [];
      state.passengers = [];
      state.appliedCoupon = null;
      state.discountAmount = 0;
      state.isCheckoutModalOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitBookingThunk.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(submitBookingThunk.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.confirmedPNR = action.payload.pnr;
        state.confirmationMessage = `Booking Confirmed! E-Ticket sent to ${state.contactEmail}.`;
      })
      .addCase(submitBookingThunk.rejected, (state) => {
        state.isSubmitting = false;
      });
  },
});

export const {
  initBookingForBus,
  toggleSeat,
  clearSeats,
  setBoardingPoint,
  setDroppingPoint,
  updatePassenger,
  setContactDetails,
  applyCoupon,
  removeCoupon,
  openCheckoutModal,
  closeCheckoutModal,
  resetBookingSuccess,
} = bookingSlice.actions;

export default bookingSlice.reducer;
