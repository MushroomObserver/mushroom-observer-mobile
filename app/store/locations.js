import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import Config from 'react-native-config';

const API_URL = Config.MUSHROOM_OBSERVER_API_URL;

const adapter = createEntityAdapter();

const slice = createSlice({
  name: 'locations',
  initialState: adapter.getInitialState(),
  reducers: {
    preloadLocations: (state, action) => {
      const locations = require('../location_primer.json');
      adapter.addMany(state, locations);
    },
    namesLoaded: (state, action) => {
      adapter.addMany(state, action.payload);
    },
    reloadLocations: {
      reducer: (state, action) => {},
      prepare: () => {
        return {
          meta: {
            offline: {
              effect: {
                url: `${API_URL}/ajax/location_primer`,
                method: 'GET',
                headers: {
                  Accept: 'application/json',
                  'content-type': 'application/json',
                },
              },
              commit: {
                type: 'locations/locationsLoaded',
              },
              rollback: {
                type: 'locations/loadRolledBack',
              },
            },
          },
        };
      },
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
