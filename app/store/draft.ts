import { createSlice, SliceCaseReducers } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import { merge } from 'lodash';
import { Observation } from '../types';

const slice = createSlice<Observation, SliceCaseReducers<Observation>, 'draft'>(
  {
    name: 'draft',
    initialState: {
      id: undefined,
      name: '',
      date: dayjs().format('YYYYMMDD'),
      gpsHidden: false,
      isCollectionLocation: true,
      location: undefined,
      latitude: undefined,
      longitude: undefined,
      altitude: undefined,
      notes: undefined,
      vote: undefined,
      isUploaded: false,
      hasChanges: false,
    },
    reducers: {
      updateDraft: (state, action) => merge(state, action.payload),
      clearDraft: () => undefined,
    },
  },
);

export const { updateDraft, clearDraft } = slice.actions;

export const selectDraft = state => state.draft;

export default slice.reducer;
