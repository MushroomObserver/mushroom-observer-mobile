import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

const adapter = createEntityAdapter();

const slice = createSlice({
  name: 'names',
  initialState: adapter.getInitialState(),
  reducers: {
    preloadNames: (state, action) => {
      const names = require('./name_primer.json');
      adapter.addMany(state, names);
    },
    namesLoaded: (state, action) => {
      adapter.addMany(state, action.payload);
    },
  },
});

// Extract the action creators object and the reducer
const { actions, reducer } = slice;

// Extract and export each action creator by name
export const { reloadNames, preloadNames } = actions;

export const { selectAll, selectById, selectEntities, selectIds, selectTotal } =
  adapter.getSelectors(state => state.names);

// Export the reducer, either as a default or named export
export default reducer;
