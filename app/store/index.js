import {configureStore, combineReducers} from '@reduxjs/toolkit';

import {offline} from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';

import {persistReducer} from 'redux-persist';
import createSensitiveStorage from 'redux-persist-sensitive-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

import auth from './auth';
import observations from './observations';
import images from './images';
import names from './names';
import draft from './draft';

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
  auth: persistReducer(authPersistConfig, auth),
  observations: persistReducer(mainPersistConfig, observations),
  images: persistReducer(mainPersistConfig, images),
  names: persistReducer(mainPersistConfig, names),
  draft: persistReducer(mainPersistConfig, draft),
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: true,
  // Adding offline enchancers
  enhancers: [offline(offlineConfig)],
});
