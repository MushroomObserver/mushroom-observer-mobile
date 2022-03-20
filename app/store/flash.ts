import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';

export type FlashState = {
  error: string | undefined;
  warning: string | undefined;
  info: string | undefined;
};

const initialState: FlashState = {
  error: undefined,
  warning: undefined,
  info: undefined,
};

const slice = createSlice({
  name: 'flash',
  initialState,
  reducers: {
    setError(state, action: PayloadAction<string | undefined>) {
      state.error = action.payload;
    },
    setWarning(state, action: PayloadAction<string | undefined>) {
      state.warning = action.payload;
    },
    setInfo(state, action: PayloadAction<string | undefined>) {
      state.info = action.payload;
    },
  },
});

// Extract the action creators object and the reducer
const { actions, reducer } = slice;

// Extract and export each action creator by name
export const { setError, setWarning, setInfo } = actions;

const selectError = state => state.flash.error;
const selectWarning = state => state.flash.warning;
const selectInfo = state => state.flash.info;

export { selectError, selectWarning, selectInfo };

// Export the reducer, either as a default or named export
export default reducer;
