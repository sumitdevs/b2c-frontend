import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import searchReducer from './slices/searchSlice';
import bookingReducer from './slices/bookingSlice';
import blogReducer from './slices/blogSlice';
import navigationReducer from './slices/navigationSlice';

export const store = configureStore({
  reducer: {
    search: searchReducer,
    booking: bookingReducer,
    blog: blogReducer,
    navigation: navigationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
