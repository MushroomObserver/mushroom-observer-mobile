import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

const adapter = createEntityAdapter({
  selectId: ({ id }) => id,
  sortComparer: (a, b) => {
    console.log(a, b);
    return a.date < b.date;
  },
});

const slice = createSlice({
  name: 'observations',
  initialState: adapter.getInitialState(),
  reducers: {
    addObservations: adapter.addMany,
    addObservation: adapter.addOne,
    removeObservation: adapter.removeOne,
    updateObservation: adapter.updateOne,
  },
});

// Extract the action creators object and the reducer
const { actions, reducer } = slice;

// Extract and export each action creator by name
export const {
  addObservations,
  addObservation,
  removeObservation,
  updateObservation,
} = actions;

export const { selectAll, selectById, selectEntities, selectIds, selectTotal } =
  adapter.getSelectors(state => state.observations);

// Export the reducer, either as a default or named export
export default reducer;
