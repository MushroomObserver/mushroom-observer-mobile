import {createSlice} from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'auth',
  initialState: {user: undefined, key: undefined},
  reducers: {
    setCredentials: (state, {payload: {user, key}}) => {
      state.user = user;
      state.key = key;
    },
    clearCredentials: state => {
      state.user = undefined;
      state.key = undefined;
    },
  },
});

export const {setCredentials, clearCredentials} = slice.actions;

export const selectCurrentUser = state => state.auth.user;
export const selectKey = state => state.auth.key;

export default slice.reducer;
