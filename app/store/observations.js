import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import Config from 'react-native-config';

const API_URL = Config.MUSHROOM_OBSERVER_API_URL;
const API_KEY = Config.MUSHROOM_OBSERVER_API_KEY;

const adapter = createEntityAdapter();

const slice = createSlice({
  name: 'observations',
  initialState: adapter.getInitialState(),
  reducers: {
    observationCreated(state, action) {
      if (!action.payload.errors) {
        console.log(action.payload.results);
        adapter.addOne(state, action.payload.results[0]);
      }
    },
    observationUpdated(state, action) {
      if (!action.payload.errors) {
        adapter.setOne(state, action.payload.results[0]);
      }
    },
    observationsLoaded(state, action) {
      if (!action.payload.errors) {
        adapter.addMany(state, action.payload.results);
      }
    },
    loadObservations: {
      reducer: (state, action) => {},
      prepare: login_name => {
        return {
          payload: { login_name },
          meta: {
            offline: {
              effect: {
                url: `${API_URL}/api2/observations?api_key=${API_KEY}&user=${login_name}&detail=high`,
                method: 'GET',
                headers: {
                  Accept: 'application/json',
                  'content-type': 'application/json',
                },
              },
              commit: {
                type: 'observations/observationsLoaded',
                meta: { login_name },
              },
              rollback: {
                type: 'observations/loadRolledBack',
                meta: { login_name },
              },
            },
          },
        };
      },
    },
    postObservation: {
      reducer: (state, action) => {},
      prepare: (observation, auth) => {
        console.log('observation', observation);
        let body = '';
        for (const key in observation) {
          body += `${key}=${observation[key]}&`;
        }
        console.log('body', body);
        return {
          payload: observation,
          meta: {
            offline: {
              effect: {
                url: `${API_URL}/api2/observations?api_key=${auth.key}&detail=high`,
                method: 'POST',
                body,
                headers: {
                  Accept: 'application/json',
                  'content-type': 'application/x-www-form-urlencoded',
                },
              },
              commit: {
                type: 'observations/observationCreated',
                meta: observation,
              },
              rollback: {
                type: 'observations/createRolledBack',
                meta: observation,
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
export const {
  observationAdded,
  observationCreated,
  observationUpdated,
  observationsLoaded,
  loadObservations,
  postObservation,
} = actions;

export const { selectAll, selectById, selectEntities, selectIds, selectTotal } =
  adapter.getSelectors(state => state.observations);
// Export the reducer, either as a default or named export
export default reducer;
