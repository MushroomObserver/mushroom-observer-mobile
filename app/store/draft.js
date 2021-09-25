import {createSlice} from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import {merge} from 'lodash';

const slice = createSlice({
  name: 'draft',
  initialState: {
    name: '',
    date: dayjs().format('YYYYMMDD'),
    gps_hidden: false,
    is_collection_location: true,
    location: '',
    latitude: '',
    longitude: '',
    altitude: '',
    notes: '',
    vote: undefined,
  },
  reducers: {
    updateDraft: (state, action) => merge(state, action.payload),
    clearDraft: (state, action) => ({}),
  },
});

export const {updateDraft, clearDraft} = slice.actions;

export const selectDraft = state => state.draft;

export default slice.reducer;
