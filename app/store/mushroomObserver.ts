import {
  ApiKeyForUserRequestParams,
  ApiKeyResult,
  ApiResponse,
  GetImageRequestParams,
  GetObservationsRequestParams,
  PostObservationRequestParams,
  PostUserRequestParams,
  UserResult,
} from '../types/api';
import { Image, Observation } from '../types/store';
import { fetchBaseQuery } from '@reduxjs/toolkit/query';
import { createApi } from '@reduxjs/toolkit/query/react';
import { Platform } from 'react-native';
import Config from 'react-native-config';

const API_URL = Config.MUSHROOM_OBSERVER_API_URL;
const API_KEY = Config.MUSHROOM_OBSERVER_API_KEY;

/*
 * This is only used to encode query params that have been typed
 * so the 'any' type is fine just here. Otherwise we like types.
 */
const encodeQueryParams = (object: any) => {
  console.log('before', object);
  const string = Object.keys(object)
    .map(key => `${key}=${encodeURIComponent(object[key])}`)
    .join('&');
  console.log('after', string);
  return string;
};

const createValidateStatus =
  <ApiResult>() =>
  (response: Response, body: ApiResponse<ApiResult>) =>
    response.status === 200 && !body.errors;

const mushroomObserverApi = createApi({
  reducerPath: 'mushroomObserverApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_URL}/api2/`,
  }),
  endpoints: builder => ({
    getApiKeyForUser: builder.mutation<
      ApiResponse<ApiKeyResult>,
      ApiKeyForUserRequestParams
    >({
      query: (params: ApiKeyForUserRequestParams) => ({
        url: `api_keys?${encodeQueryParams(params)}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        validateStatus: createValidateStatus<ApiKeyResult>(),
      }),
    }),
    postUser: builder.mutation<ApiResponse<UserResult>, PostUserRequestParams>({
      query: ({ email, login, password }) => {
        return {
          // url: `users?encodeQueryParams(params)`,
          url: `users?email=${email}login=${login}password=${password}api_key=${API_KEY}&create_key=mushroom-observer-mobile&detail=high`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          validateStatus: createValidateStatus<UserResult>(),
        };
      },
    }),
    getObservations: builder.query<Observation, GetObservationsRequestParams>({
      query: params => ({
        url: `observations?${encodeQueryParams(params)}`,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        validateStatus: createValidateStatus<Observation>(),
      }),
    }),
    postObservation: builder.mutation<
      ApiResponse<Observation>,
      PostObservationRequestParams
    >({
      query: params => {
        return {
          url: `observations?${encodeQueryParams(params)}`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
          },
          validateStatus: createValidateStatus<Observation>(),
        };
      },
    }),
    getImages: builder.query<Image, GetImageRequestParams>({
      query: params => ({
        url: `images?${encodeQueryParams(params)}`,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        validateStatus: createValidateStatus<Image>(),
      }),
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
            'Content-Type': type,
            Accept: 'application/json',
          },
        };
      },
    }),
  }),
});

export const {
  useGetApiKeyForUserMutation,
  useGetObservationsQuery,
  usePostObservationMutation,
  useGetImagesQuery,
  usePostImageMutation,
  usePostUserMutation,
} = mushroomObserverApi;

export default mushroomObserverApi;
