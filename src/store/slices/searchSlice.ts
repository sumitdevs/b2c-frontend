import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Bus, FilterState, Offer, RoutePopular, SearchParams } from '../../types';
import { MockBusApi } from '../../services/mockApi';
import { MOCK_OFFERS, POPULAR_ROUTES, CITIES, BASE_BUSES, generateSeats } from '../../services/mockData';

interface SearchState {
  searchParams: SearchParams;
  filters: FilterState;
  buses: Bus[];
  popularRoutes: RoutePopular[];
  offers: Offer[];
  cities: string[];
  isLoading: boolean;
  error: string | null;
  selectedBusIdForSeats: string | null;
}

const initialFilters: FilterState = {
  busTypes: [],
  departureTimes: [],
  operators: [],
  boardingPoints: [],
  droppingPoints: [],
  amenities: [],
  priceRange: [300, 2500],
  minRating: 0,
  sortBy: 'cheapest',
};

const initialBuses: Bus[] = BASE_BUSES.map((base) => ({
  ...base,
  id: base.id,
  originCity: 'Bangalore',
  destinationCity: 'Goa',
  seats: base.seats && base.seats.length > 0 ? base.seats : generateSeats(),
}));

const initialState: SearchState = {
  searchParams: {
    from: 'Bangalore',
    to: 'Goa',
    date: '2026-09-22',
  },
  filters: initialFilters,
  buses: initialBuses,
  popularRoutes: POPULAR_ROUTES,
  offers: MOCK_OFFERS,
  cities: CITIES,
  isLoading: false,
  error: null,
  selectedBusIdForSeats: null,
};

// Async thunks
export const fetchInitialData = createAsyncThunk('search/fetchInitialData', async () => {
  const [routes, offers, cities] = await Promise.all([
    MockBusApi.getPopularRoutes(),
    MockBusApi.getOffers(),
    MockBusApi.getCities(),
  ]);
  return {
    routes: routes && routes.length > 0 ? routes : POPULAR_ROUTES,
    offers: offers && offers.length > 0 ? offers : MOCK_OFFERS,
    cities: cities && cities.length > 0 ? cities : CITIES,
  };
});

export const searchBuses = createAsyncThunk(
  'search/searchBuses',
  async (params?: Partial<SearchParams>) => {
    const results = await MockBusApi.searchBuses(params);
    return results && results.length > 0 ? results : initialBuses;
  }
);

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchParams: (state, action: PayloadAction<Partial<SearchParams>>) => {
      state.searchParams = { ...state.searchParams, ...action.payload };
    },
    swapOrigins: (state) => {
      const temp = state.searchParams.from;
      state.searchParams.from = state.searchParams.to;
      state.searchParams.to = temp;
    },
    toggleBusTypeFilter: (state, action: PayloadAction<string>) => {
      const item = action.payload;
      if (state.filters.busTypes.includes(item)) {
        state.filters.busTypes = state.filters.busTypes.filter((x) => x !== item);
      } else {
        state.filters.busTypes.push(item);
      }
    },
    toggleDepartureTimeFilter: (state, action: PayloadAction<string>) => {
      const item = action.payload;
      if (state.filters.departureTimes.includes(item)) {
        state.filters.departureTimes = state.filters.departureTimes.filter((x) => x !== item);
      } else {
        state.filters.departureTimes.push(item);
      }
    },
    toggleOperatorFilter: (state, action: PayloadAction<string>) => {
      const item = action.payload;
      if (state.filters.operators.includes(item)) {
        state.filters.operators = state.filters.operators.filter((x) => x !== item);
      } else {
        state.filters.operators.push(item);
      }
    },
    toggleAmenityFilter: (state, action: PayloadAction<string>) => {
      const item = action.payload;
      if (state.filters.amenities.includes(item)) {
        state.filters.amenities = state.filters.amenities.filter((x) => x !== item);
      } else {
        state.filters.amenities.push(item);
      }
    },
    setPriceRange: (state, action: PayloadAction<[number, number]>) => {
      state.filters.priceRange = action.payload;
    },
    setMinRating: (state, action: PayloadAction<number>) => {
      state.filters.minRating = action.payload;
    },
    setSortBy: (state, action: PayloadAction<FilterState['sortBy']>) => {
      state.filters.sortBy = action.payload;
    },
    resetFilters: (state) => {
      state.filters = initialFilters;
    },
    toggleSeatSelectionView: (state, action: PayloadAction<string | null>) => {
      if (action.payload === null || state.selectedBusIdForSeats === action.payload) {
        state.selectedBusIdForSeats = null;
      } else {
        state.selectedBusIdForSeats = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Initial Data
      .addCase(fetchInitialData.fulfilled, (state, action) => {
        state.popularRoutes = action.payload.routes;
        state.offers = action.payload.offers;
        state.cities = action.payload.cities;
      })
      // Search Buses
      .addCase(searchBuses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchBuses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.buses = action.payload;
      })
      .addCase(searchBuses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch buses';
      });
  },
});

export const {
  setSearchParams,
  swapOrigins,
  toggleBusTypeFilter,
  toggleDepartureTimeFilter,
  toggleOperatorFilter,
  toggleAmenityFilter,
  setPriceRange,
  setMinRating,
  setSortBy,
  resetFilters,
  toggleSeatSelectionView,
} = searchSlice.actions;

export default searchSlice.reducer;
