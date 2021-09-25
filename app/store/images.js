import {createEntityAdapter, createSlice} from '@reduxjs/toolkit';

const adapter = createEntityAdapter();

const slice = createSlice({
  name: 'images',
  initialState: adapter.getInitialState(),
  reducers: {
    imagesAdded: adapter.addMany,
    imageCreated: adapter.addOne,
    imageRemoved: adapter.removeOne,
    imageUpdated: adapter.updateOne,
  },
  extraReducers: builder => {
    builder.addCase('observations/observationsLoaded', (state, action) => {
      const images = action.payload.results.flatMap(o => o.images);
      const primary_images = action.payload.results.flatMap(
        o => o.primary_image,
      );
      adapter.addMany(state, [...images, ...primary_images]);
    });
  },
});

// Extract the action creators object and the reducer
const {actions, reducer} = slice;

// Extract and export each action creator by name
export const {imagesAdded, imageCreated, imageRemoved, imageUpdated} = actions;

export const {selectAll, selectById, selectEntities, selectIds, selectTotal} =
  adapter.getSelectors(state => state.images);
// Export the reducer, either as a default or named export
export default reducer;
