import {configureStore} from '@reduxjs/toolkit';

import {offline} from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';

import {mushroomObserver} from '../services/mushroomObserver';
import authReducer from '../services/auth';
import observations from './observations';

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    auth: authReducer,
    [mushroomObserver.reducerPath]: mushroomObserver.reducer,
    observations: observations,
  },
  devTools: true,
  // Adding offline enchancers
  enhancers: [offline(offlineConfig)],
});
