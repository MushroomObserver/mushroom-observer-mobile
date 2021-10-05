import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistReducer, persistStore } from 'redux-persist';
import createSensitiveStorage from 'redux-persist-sensitive-storage';

import auth from './auth';
import draft from './draft';
import images from './images';
import locations from './locations';
import mushroomObserverApi from './mushroomObserver';
import names from './names';
import observations from './observations';

const mainPersistConfig = {
  key: 'main',
  storage: AsyncStorage,
  blacklist: ['auth', mushroomObserverApi.reducerPath],
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
  auth: persistReducer(authPersistConfig, auth),
  observations,
  images,
  names,
  locations,
  draft,
});

export const store = configureStore({
  reducer: persistReducer(mainPersistConfig, mainReducer),
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(mushroomObserverApi.middleware),
  devTools: true,
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);
