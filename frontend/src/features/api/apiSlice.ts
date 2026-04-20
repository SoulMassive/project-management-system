import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../app/store';

const baseQuery = fetchBaseQuery({
  baseUrl: (import.meta.env.VITE_API_BASE_URL as string) || '/_/backend/api',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['User', 'Client', 'Project', 'Task', 'File', 'Notification'],
  endpoints: () => ({}),
});
