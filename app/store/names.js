import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { filter } from 'lodash';

const adapter = createEntityAdapter();

const slice = createSlice({
  name: 'names',
  initialState: adapter.getInitialState(),
  reducers: {
    preloadNames: (state, action) => {
      let names = require('./name_primer.json');
      names = filter(names, name => !name.deprecated);
      adapter.setAll(state, names);
    },
  },
});

// Extract the action creators object and the reducer
const { actions, reducer } = slice;

// Extract and export each action creator by name
export const { preloadNames } = actions;

export const { selectAll, selectById, selectEntities, selectIds, selectTotal } =
  adapter.getSelectors(state => state.names);

// Export the reducer, either as a default or named export
export default reducer;
