import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from "redux-persist/lib/storage";
import userSlice from './features/feature.auth';

const persistConfig = {
  version: 1,
  key: "root",
  storage
};

const rootReducer = combineReducers({
  auth: userSlice
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getMiddleWare) =>
    getMiddleWare({
      serializableCheck: false,
    }),
});

export default store;