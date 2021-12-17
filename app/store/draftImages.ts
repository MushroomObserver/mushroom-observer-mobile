import { DraftImage } from '../types/store';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

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

// Export the reducer, either as a default or named export
export default reducer;
