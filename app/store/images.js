import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

const adapter = createEntityAdapter();

const slice = createSlice({
  name: 'images',
  initialState: adapter.getInitialState(),
  reducers: {
    addImages: adapter.addMany,
    addImage: adapter.addOne,
    removeImage: adapter.removeOne,
    updateImage: adapter.updateOne,
    updateImages: adapter.updateMany,
  },
});

// Extract the action creators object and the reducer
const { actions, reducer } = slice;

// Extract and export each action creator by name
export const { addImages, addImage, removeImage, updateImage } = actions;

export const { selectAll, selectById, selectEntities, selectIds, selectTotal } =
  adapter.getSelectors(state => state.images);

// Export the reducer, either as a default or named export
export default reducer;
