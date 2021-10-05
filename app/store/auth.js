import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'auth',
  initialState: { user: undefined, key: undefined },
  reducers: {
    loginSuccess: (state, action) => {
      const { id, login_name, key } = action.payload;

      state.user = { id, login_name };
      state.key = key;
    },
    logout: state => {
      state.user = undefined;
      state.key = undefined;
    },
  },
});

export const { loginSuccess, logout } = slice.actions;

export const selectCurrentUser = state => state.auth.user;

export const selectKey = state => state.auth.key;

export default slice.reducer;
