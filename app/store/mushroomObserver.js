import { fetchBaseQuery } from '@reduxjs/toolkit/dist/query';
import { createApi } from '@reduxjs/toolkit/query/react';
import { Platform } from 'react-native';
import Config from 'react-native-config';

const API_URL = Config.MUSHROOM_OBSERVER_API_URL;
const API_KEY = Config.MUSHROOM_OBSERVER_API_KEY;

const mushroomObserverApi = createApi({
  reducerPath: 'mushroomObserverApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${API_URL}/api2/` }),
  endpoints: builder => ({
    getApiKeyForUser: builder.mutation({
      query: ({ login_name, password }) => ({
        url: `api_keys?api_key=${API_KEY}&for_user=${encodeURIComponent(
          login_name,
        )}&password=${encodeURIComponent(
          password,
        )}&app=mushroom-observer-mobile&detail=high`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }),
    }),
    postObservation: builder.mutation({
      query: ({ observation, key }) => {
        const data = Object.keys(observation)
          .map(k => `${k}=${encodeURIComponent(observation[k])}`)
          .join('&');
        return {
          url: `observations?${data}&api_key=${key}&detail=high`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
          },
        };
      },
    }),
    postImage: builder.mutation({
      query: ({ uri, name, type, key }) => {
        const formData = new FormData();
        formData.append('upload', {
          uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
          type: type,
          name: name,
        });

        return {
          url: `images?api_key=${key}&detail=high`,
          method: 'POST',
          body: formData,
          headers: {
            // 'Content-Type': 'image/jpeg',
            Accept: 'application/json',
          },
        };
      },
    }),
    postUser: builder.mutation({
      query: ({ email, username, password }) => {
        return {
          url: `users?email=${email}login=${username}password=${password}api_key=${API_KEY}&create_key=mushroom-observer-mobile&detail=high`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        };
      },
    }),
  }),
});

export const {
  useGetApiKeyForUserMutation,
  usePostObservationMutation,
  usePostImageMutation,
  usePostUserMutation,
} = mushroomObserverApi;

export default mushroomObserverApi;
