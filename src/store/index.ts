import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' 
import { apiSlice } from './rtk-query/apiSlice';
import authReducer from './slices/authSlice';
import emailReducer from './slices/emailSlice'
import oAuthCheckReducer from './slices/oAuthSlice'
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux'


const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], 
}

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
  userEmail: emailReducer,
  oAuthCheck: oAuthCheckReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(apiSlice.middleware),
})

export const persistor = persistStore(store)


export type RootState = ReturnType<typeof store.getState>;
export type AppDispath = typeof store.dispatch;