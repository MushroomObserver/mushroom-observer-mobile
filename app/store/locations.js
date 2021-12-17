import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

const adapter = createEntityAdapter();

const slice = createSlice({
  name: 'locations',
  initialState: adapter.getInitialState(),
  reducers: {
    preloadLocations: (state, action) => {
      const locations = require('./location_primer.json');
      adapter.setAll(state, locations);
    },
  },
});

// Extract the action creators object and the reducer
const { actions, reducer } = slice;

// Extract and export each action creator by name
export const { reloadLocations, preloadLocations } = actions;

// Export the selectors from the entity adapter
export const { selectAll, selectById, selectEntities, selectIds, selectTotal } =
  adapter.getSelectors(state => state.locations);

// Export the reducer, either as a default or named export
export default reducer;
