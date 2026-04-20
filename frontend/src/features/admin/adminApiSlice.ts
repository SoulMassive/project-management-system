import { apiSlice } from '../api/apiSlice';

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (params) => ({
        url: '/admin/users',
        params,
      }),
      providesTags: ['User'],
    }),
    createUser: builder.mutation({
      query: (userData) => ({
        url: '/admin/users',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `/admin/users/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: ['User'],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    getActivityLogs: builder.query({
      query: (params) => ({
        url: '/admin/activity-logs',
        params,
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetActivityLogsQuery,
} = adminApiSlice;
