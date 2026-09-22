import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AppPage = 'landing' | 'search' | 'blog';

interface NavigationState {
  currentPage: AppPage;
}

const initialState: NavigationState = {
  currentPage: 'landing',
};

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<AppPage>) => {
      state.currentPage = action.payload;
    },
  },
});

export const { setCurrentPage } = navigationSlice.actions;
export default navigationSlice.reducer;
