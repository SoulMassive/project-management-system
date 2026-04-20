import { apiSlice } from '../api/apiSlice';

export const clientApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getClients: builder.query({
      query: (params) => ({
        url: '/clients',
        params,
      }),
      providesTags: ['Client'],
    }),
    getClient: builder.query({
      query: (id) => `/clients/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Client', id }],
    }),
    createClient: builder.mutation({
      query: (clientData) => ({
        url: '/clients',
        method: 'POST',
        body: clientData,
      }),
      invalidatesTags: ['Client'],
    }),
    updateClient: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `/clients/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (_result, _error, { id }) => ['Client', { type: 'Client', id }],
    }),
    deleteClient: builder.mutation({
      query: (id) => ({
        url: `/clients/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Client'],
    }),
    addCommunication: builder.mutation({
      query: ({ id, ...commData }) => ({
        url: `/clients/${id}/communications`,
        method: 'POST',
        body: commData,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Client', id }],
    }),
  }),
});

export const {
  useGetClientsQuery,
  useGetClientQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
  useAddCommunicationMutation,
} = clientApiSlice;
