import Config from 'react-native-config';
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

const API_URL = Config.MUSHROOM_OBSERVER_API_URL;
const API_KEY = Config.MUSHROOM_OBSERVER_API_KEY;

export const mushroomObserver = createApi({
  reducerPath: 'mushroomObserver',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/api2/`,
    prepareHeaders: headers => {
      headers.set('Accept', 'application/json');
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: builder => ({
    getApiKeyForUser: builder.mutation({
      query: ({username, password}) => ({
        url: `api_keys?api_key=${API_KEY}&for_user=${username}&password=${encodeURIComponent(
          password,
        )}&app=mushroom-observer-mobile&detail=high`,
        method: 'POST',
      }),
    }),
    getUserById: builder.query({
      query: id => ({
        url: `users?api_key=${API_KEY}&id=${id}&detail=high`,
      }),
    }),
    getObservationsByUser: builder.query({
      query: ({user, key}) =>
        `observations?api_key=${key}&user=${user.login_name}&detail=high`,
    }),
    getImageById: builder.query({
      query: id => `images?api_key=${API_KEY}&id=${id}&detail=high`,
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetApiKeyForUserMutation,
  useGetUserByIdQuery,
  useLazyGetUserByIdQuery,
  useGetObservationsByUserQuery,
  useGetImageByIdQuery,
} = mushroomObserver;
