import { fetchBaseQuery } from '@reduxjs/toolkit/dist/query';
import { createApi } from '@reduxjs/toolkit/query/react';
import { Platform } from 'react-native';
import Config from 'react-native-config';

const API_URL = 'https://maps.googleapis.com/maps/api/';
const API_KEY = Config.GOOGLE_MAPS_API_KEY;

const googleApi = createApi({
  reducerPath: 'googleApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${API_URL}` }),
  endpoints: builder => ({
    geocode: builder.query({
      query: location => ({
        url: `/geocode/json?key=${API_KEY}&address=${encodeURIComponent(
          location,
        )}`,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }),
    }),
    elevation: builder.query({
      query: ({ latitude, longitude }) => ({
        url: `elevation/json?key=${API_KEY}&locations=${encodeURIComponent(
          `${latitude},${longitude}`,
        )}`,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }),
    }),
  }),
});

export const { useGeocodeQuery, useElevationQuery } = googleApi;

export default googleApi;
