import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { Platform } from 'react-native';
import Config from 'react-native-config';

const API_URL = Config.MUSHROOM_OBSERVER_API_URL;

const adapter = createEntityAdapter();

const slice = createSlice({
  name: 'images',
  initialState: adapter.getInitialState(),
  reducers: {
    imagesAdded: adapter.addMany,
    imageCreated: adapter.addOne,
    imageRemoved: adapter.removeOne,
    imageUpdated: adapter.updateOne,
    postImage: {
      reducer: (state, action) => {},
      prepare: (image, data, auth) => {
        console.log('image', image);

        const body = new FormData();

        body.append('photo', {
          name: image.fileName,
          type: image.type,
          uri:
            Platform.OS === 'ios'
              ? image.uri.replace('file://', '')
              : image.uri,
        });

        Object.keys(body).forEach(key => {
          body.append(key, body[key]);
        });

        return {
          payload: image,
          meta: {
            offline: {
              effect: {
                url: `${API_URL}/api2/images?api_key=${auth.key}&detail=high`,
                method: 'POST',
                body: image.base64,
                headers: {
                  Accept: 'application/json',
                  'content-type': 'multipart/form-data',
                },
              },
              commit: {
                type: 'images/imageCreated',
                meta: image,
              },
              rollback: {
                type: 'images/createRolledBack',
                meta: image,
              },
            },
          },
        };
      },
    },
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
const { actions, reducer } = slice;

// Extract and export each action creator by name
export const {
  imagesAdded,
  imageCreated,
  imageRemoved,
  imageUpdated,
  postImage,
} = actions;

export const { selectAll, selectById, selectEntities, selectIds, selectTotal } =
  adapter.getSelectors(state => state.images);
// Export the reducer, either as a default or named export
export default reducer;
