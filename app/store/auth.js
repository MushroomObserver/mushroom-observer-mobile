import Config from 'react-native-config';
import {createSlice} from '@reduxjs/toolkit';

const API_URL = Config.MUSHROOM_OBSERVER_API_URL;
const API_KEY = Config.MUSHROOM_OBSERVER_API_KEY;

const slice = createSlice({
  name: 'auth',
  initialState: {user: undefined, key: undefined},
  reducers: {
    loginSuccess: (state, action) => {
      const {
        user,
        results: [{key}],
      } = action.payload;

      const {login_name} = action.meta;

      state.user = {id: user, login_name};
      state.key = key;
    },
    logout: state => {
      state.user = undefined;
      state.key = undefined;
    },
    login: {
      reducer: (state, action) => {},
      prepare: (login_name, password) => {
        return {
          payload: {login_name, password},
          meta: {
            offline: {
              effect: {
                url: `${API_URL}/api2/api_keys?api_key=${API_KEY}&for_user=${encodeURIComponent(
                  login_name,
                )}&password=${encodeURIComponent(
                  password,
                )}&app=mushroom-observer-mobile&detail=high`,
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
              },
              commit: {
                type: 'auth/loginSuccess',
                meta: {login_name},
              },
              rollback: {
                type: 'auth/loginFailure',
                meta: {login_name},
              },
            },
          },
        };
      },
    },
  },
});

export const {login, logout} = slice.actions;

export const selectCurrentUser = state => state.auth.user;

export const selectKey = state => state.auth.key;

export default slice.reducer;
