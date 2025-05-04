/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TranslationsState {
  resources: Record<string, any> | null;
}

const initialState: TranslationsState = {
  resources: null
};

const translationsSlice = createSlice({
  name: 'translations',
  initialState,
  reducers: {
    setTranslations: (state, action: PayloadAction<Record<string, any>>) => {
      state.resources = action.payload;
    }
  }
});

export const { setTranslations } = translationsSlice.actions;
export default translationsSlice.reducer;