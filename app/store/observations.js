import Config from 'react-native-config';
import {createEntityAdapter, createSlice} from '@reduxjs/toolkit';

const API_URL = Config.MUSHROOM_OBSERVER_API_URL;
const API_KEY = Config.MUSHROOM_OBSERVER_API_KEY;

const adapter = createEntityAdapter();

const slice = createSlice({
  name: 'observations',
  initialState: adapter.getInitialState(),
  reducers: {
    observationAdded: adapter.addOne,
    observationUpdated: adapter.updateOne,
    observationCreated: adapter.updateOne,
    observationsLoaded(state, action) {
      adapter.setMany(state, action.payload.results);
    },
    loadObservations: {
      reducer: (state, action) => {},
      prepare: login_name => {
        return {
          payload: {login_name},
          meta: {
            offline: {
              effect: {
                url: `${API_URL}/api2/observations?api_key=${API_KEY}&user=${login_name}&detail=high`,
                method: 'GET',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
              },
              commit: {
                type: 'observations/observationsLoaded',
                meta: {login_name},
              },
              rollback: {
                type: 'observations/observationsRolledBack',
                meta: {login_name},
              },
            },
          },
        };
      },
    },
  },
});

// Extract the action creators object and the reducer
const {actions, reducer} = slice;

console.log('reducer', reducer);
// Extract and export each action creator by name
export const {
  observationAdded,
  observationCreated,
  observationUpdated,
  observationsLoaded,
  loadObservations,
} = actions;

export const {selectAll, selectById, selectEntities, selectIds, selectTotal} =
  adapter.getSelectors(state => state.observations);
// Export the reducer, either as a default or named export
export default reducer;
