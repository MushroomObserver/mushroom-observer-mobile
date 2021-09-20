import {configureStore} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/query/react';
import {mushroomObserver} from './services/mushroomObserver';
import authReducer from './services/auth';

import {offline} from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [mushroomObserver.reducerPath]: mushroomObserver.reducer,
    auth: authReducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(mushroomObserver.middleware),

  // Adding offline enchancers
  // enhancers: [offline(offlineConfig)],
});

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);
