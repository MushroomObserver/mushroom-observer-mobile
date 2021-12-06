import { Observation } from '../types';
import { createSlice, SliceCaseReducers } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import { merge } from 'lodash';

const initialState = {
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
  photos: undefined,
};

const slice = createSlice({
  name: 'draft',
  initialState,
  reducers: {
    updateDraft: (state, action) => merge(state, action.payload),
    clearDraft: () => initialState,
  },
});

export const { updateDraft, clearDraft } = slice.actions;

export const selectDraft = state => state.draft;

export default slice.reducer;
