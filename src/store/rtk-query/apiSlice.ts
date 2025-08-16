import type { 
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError, } from '@reduxjs/toolkit/query/react'
import {
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import { clearUser } from '../slices/authSlice';
import type { RootState } from '../';
import { Mutex } from 'async-mutex';
import nookies from 'nookies';

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_PUBLIC_API_URL,
  credentials: 'include', 
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock(); // Wait if another refresh is happening

  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Acquire the mutex to prevent multiple refresh calls
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const state = api.getState() as RootState;
        const role = state.auth.details?.role;

        if (role === 'ADMIN' || role === 'USER') {
          const refreshURL = `/${role}/auth/refresh-token`;

          const refreshResult = await baseQuery(
            {
              url: refreshURL,
              method: 'POST',
              credentials: 'include',
            },
            api,
            extraOptions
          );

          if (refreshResult.error && refreshResult.error.status === 401) {
            // Token refresh failed — force logout
            api.dispatch(clearUser());
            nookies.destroy(null, 'accessToken');
            nookies.destroy(null, 'refreshToken');
            nookies.destroy(null, 'role');
          } else {
            // Refresh succeeded — retry original request
            result = await baseQuery(args, api, extraOptions);
          }
        } else {
          // No valid role found — force logout
          api.dispatch(clearUser());
          nookies.destroy(null, 'accessToken');
          nookies.destroy(null, 'refreshToken');
          nookies.destroy(null, 'role');
        }
      } finally {
        release(); // Always release the mutex
      }
    } else {
      // Wait for the other refresh to complete, then retry original request
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};


export const apiSlice = createApi({
    reducerPath : 'api',
    baseQuery : baseQueryWithReauth,
    tagTypes : ['user','admin','public'],
    endpoints : () => ({}),
})