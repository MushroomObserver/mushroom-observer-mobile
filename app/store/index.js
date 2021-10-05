import {configureStore, combineReducers} from '@reduxjs/toolkit';
import {setupListeners} from '@reduxjs/toolkit/query';
import {persistReducer} from 'redux-persist';
import createSensitiveStorage from 'redux-persist-sensitive-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

import auth from './auth';
import observations from './observations';
import images from './images';
import names from './names';
import locations from './locations';
import draft from './draft';
import mushroomObserverApi from './mushroomObserver';

const mainPersistConfig = {
  key: 'main',
  storage: AsyncStorage,
};

const sensitiveStorage = createSensitiveStorage({
  keychainService: 'mushroomObserverKeychain',
  sharedPreferencesName: 'mushroomObserverSharedPreferences',
});

const authPersistConfig = {
  key: 'auth',
  storage: sensitiveStorage,
};

let rootReducer = combineReducers({
  [mushroomObserverApi.reducerPath]: mushroomObserverApi.reducer,
  auth: persistReducer(authPersistConfig, auth),
  observations: persistReducer(mainPersistConfig, observations),
  images: persistReducer(mainPersistConfig, images),
  names: persistReducer(mainPersistConfig, names),
  locations: persistReducer(mainPersistConfig, locations),
  draft: persistReducer(mainPersistConfig, draft),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(mushroomObserverApi.middleware),
  devTools: true,
});

setupListeners(store.dispatch);
