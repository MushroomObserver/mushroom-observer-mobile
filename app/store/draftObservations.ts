import { DraftObservation } from '../types/store';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

const adapter = createEntityAdapter<DraftObservation>();

const slice = createSlice({
  name: 'draftObservations',
  initialState: adapter.getInitialState(),
  reducers: {
    addDraftObservations: adapter.addMany,
    addDraftObservation: adapter.addOne,
    removeDraftObservation: adapter.removeOne,
    removeDraftObservations: adapter.removeMany,
    updateDraftObservation: adapter.updateOne,
    updateDraftObservations: adapter.updateMany,
  }
});

// Extract the action creators object and the reducer
const { actions, reducer } = slice;

// Extract and export each action creator by name
export const {
  addDraftObservations,
  addDraftObservation,
  removeDraftObservation,
  removeDraftObservations,
  updateDraftObservation,
  updateDraftObservations,
} = actions;

export const { selectAll, selectById, selectEntities, selectIds, selectTotal } =
  adapter.getSelectors(state => state.draftObservations);

// Export the reducer, either as a default or named export
export default reducer;
