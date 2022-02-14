import { DraftImage } from '../types/store';
import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import { filter, includes } from 'lodash';

const adapter = createEntityAdapter<DraftImage>();

const slice = createSlice({
  name: 'draftImages',
  initialState: adapter.getInitialState(),
  reducers: {
    addDraftImages: adapter.addMany,
    addDraftImage: adapter.addOne,
    removeDraftImage: adapter.removeOne,
    removeDraftImages: adapter.removeMany,
    updateDraftImage: adapter.updateOne,
    updateDraftImages: adapter.updateMany,
  },
});

// Extract the action creators object and the reducer
const { actions, reducer } = slice;

// Extract and export each action creator by name
export const {
  addDraftImages,
  addDraftImage,
  removeDraftImage,
  removeDraftImages,
  updateDraftImage,
  updateDraftImages,
} = actions;

export const { selectAll, selectById, selectEntities, selectIds, selectTotal } =
  adapter.getSelectors(state => state.draftImages);


export const selectByIds = createSelector(selectAll, (items, ids) => filter(items, item => includes(ids, item.id) ))
export const selectByDraftObservationId = createSelector(selectAll, (items, id) => filter(items, item => item.draftObservationId == id ))
// Export the reducer, either as a default or named export
export default reducer;
