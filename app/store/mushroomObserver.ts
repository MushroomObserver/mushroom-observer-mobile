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

console.log(API_URL, API_KEY);
/*
 * This is only used to encode query params that have been typed
 * so the 'any' type is fine just here. Otherwise we like types.
 */
const encodeQueryParams = (object: any) => {
  const string = Object.keys(object)
    .map(key => `${key}=${encodeURIComponent(object[key])}`)
    .join('&');
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
  tagTypes: ['Observation', 'Image'],
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
    getObservations: builder.query<Observation[], GetObservationsRequestParams>(
      {
        query: params => ({
          url: `observations?${encodeQueryParams(params)}`,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          validateStatus: createValidateStatus<Observation[]>(),
        }),
        providesTags: result =>
          result
            ? [
                ...result.map(({ id }) => ({
                  type: 'Observation' as const,
                  id,
                })),
                'Observation',
              ]
            : ['Observation'],
      },
    ),
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
      invalidatesTags: ['Observation'],
    }),
    deleteObservation: builder.mutation({
      query: params => ({
        url: `observations?${encodeQueryParams(params)}`,
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        validateStatus: createValidateStatus<Observation>(),
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Observation', id: arg.id },
      ],
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
      providesTags: ['Image'],
    }),
    deleteImage: builder.mutation({
      query: params => ({
        url: `images?${encodeQueryParams(params)}`,
        method: 'DELETE',
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
  usePostUserMutation,
  useGetObservationsQuery,
  usePostObservationMutation,
  useDeleteObservationMutation,
  useGetImagesQuery,
  usePostImageMutation,
  useDeleteImageMutation,
} = mushroomObserverApi;

export default mushroomObserverApi;
