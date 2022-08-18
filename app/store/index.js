import auth from './auth';
import draftImages from './draftImages';
import draftObservations from './draftObservations';
import flash from './flash';
import googleApi from './google';
import images from './images';
import locations from './locations';
import mushroomObserverApi from './mushroomObserver';
import names from './names';
import observations from './observations';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import FilesystemStorage from 'redux-persist-filesystem-storage';
import createSensitiveStorage from 'redux-persist-sensitive-storage';

const mainPersistConfig = {
  key: 'main',
  version: 1,
  storage: FilesystemStorage,
  blacklist: ['auth', mushroomObserverApi.reducerPath, googleApi.reducerPath],
};

const sensitiveStorage = createSensitiveStorage({
  keychainService: 'mushroomObserverKeychain',
  sharedPreferencesName: 'mushroomObserverSharedPreferences',
});

const authPersistConfig = {
  key: 'auth',
  storage: sensitiveStorage,
};

const mainReducer = combineReducers({
  [mushroomObserverApi.reducerPath]: mushroomObserverApi.reducer,
  [googleApi.reducerPath]: googleApi.reducer,
  auth: persistReducer(authPersistConfig, auth),
  draftObservations,
  observations,
  draftImages,
  images,
  names,
  locations,
  flash,
});

const rootReducer = (state, action) => {
  if (action.type === 'auth/logout') {
    return mainReducer(undefined, action);
  }
  return mainReducer(state, action);
};

const middlewares = [mushroomObserverApi.middleware, googleApi.middleware];

if (__DEV__) {
  const createDebugger = require('redux-flipper').default;
  middlewares.push(createDebugger());
}

export const store = configureStore({
  reducer: persistReducer(mainPersistConfig, rootReducer),
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: {
        warnAfter: 2000,
      },
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        warnAfter: 2000,
      },
    }).concat(middlewares),
  devTools: true,
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);
