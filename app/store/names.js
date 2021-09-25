import Config from 'react-native-config';
import {createEntityAdapter, createSlice} from '@reduxjs/toolkit';

const API_URL = Config.MUSHROOM_OBSERVER_API_URL;

const adapter = createEntityAdapter();

const slice = createSlice({
  name: 'names',
  initialState: adapter.getInitialState(),
  reducers: {
    namesLoaded: (state, action) => {
      console.log('names loaded', action.type);
      adapter.addMany(state, action.payload);
    },
    loadNames: {
      reducer: (state, action) => {},
      prepare: () => {
        return {
          meta: {
            offline: {
              effect: {
                url: `${API_URL}/ajax/name_primer`,
                method: 'GET',
                headers: {
                  Accept: 'application/json',
                  'content-type': 'application/json',
                },
              },
              commit: {
                type: 'names/namesLoaded',
              },
              rollback: {
                type: 'names/loadRolledBack',
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

// Extract and export each action creator by name
export const {loadNames} = actions;

export const {selectAll, selectById, selectEntities, selectIds, selectTotal} =
  adapter.getSelectors(state => state.names);
// Export the reducer, either as a default or named export
export default reducer;
