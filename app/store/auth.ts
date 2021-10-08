import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'auth',
  initialState: { user: undefined, key: undefined, isLogout: false },
  reducers: {
    loginSuccess: (state, action) => {
      const { id, login_name, key } = action.payload;

      state.user = { id, login_name };
      state.key = key;
      state.isLogout = false;
    },
    logout: state => {
      state.isLogout = true;
      state.user = undefined;
      state.key = undefined;
    },
  },
});

export const { loginSuccess, logout } = slice.actions;

const selectCurrentUser = state => state.auth.user;
const selectKey = state => state.auth.key;
const selectIsLogout = state => state.auth.isLogout;

export { selectCurrentUser, selectIsLogout, selectKey };

export default slice.reducer;
