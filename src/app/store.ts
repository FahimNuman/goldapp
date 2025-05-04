import { configureStore } from '@reduxjs/toolkit';
import translationsReducer from './slices/translationsSlice';

export const store = configureStore({
  reducer: {
    translations: translationsReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;