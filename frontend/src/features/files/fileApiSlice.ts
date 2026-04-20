import { apiSlice } from '../api/apiSlice';

export const fileApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProjectFolders: builder.query({
      query: (projectId) => `/projects/${projectId}/folders`,
      providesTags: ['File'],
    }),
    createFolder: builder.mutation({
      query: ({ projectId, ...folderData }) => ({
        url: `/projects/${projectId}/folders`,
        method: 'POST',
        body: folderData,
      }),
      invalidatesTags: ['File'],
    }),
    getProjectFiles: builder.query({
      query: ({ projectId, folderId }) => ({
        url: `/projects/${projectId}/files`,
        params: { folderId },
      }),
      providesTags: ['File'],
    }),
    uploadFile: builder.mutation({
      query: ({ projectId, formData }) => ({
        url: `/projects/${projectId}/files`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['File'],
    }),
    deleteFile: builder.mutation({
      query: (id) => ({
        url: `/files/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['File'],
    }),
  }),
});

export const {
  useGetProjectFoldersQuery,
  useCreateFolderMutation,
  useGetProjectFilesQuery,
  useUploadFileMutation,
  useDeleteFileMutation,
} = fileApiSlice;
