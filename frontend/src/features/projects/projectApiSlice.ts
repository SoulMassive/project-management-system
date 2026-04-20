import { apiSlice } from '../api/apiSlice';

export const projectApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query({
      query: (params) => ({
        url: '/projects',
        params,
      }),
      providesTags: ['Project'],
    }),
    getProject: builder.query({
      query: (id) => `/projects/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Project', id }],
    }),
    createProject: builder.mutation({
      query: (projectData) => ({
        url: '/projects',
        method: 'POST',
        body: projectData,
      }),
      invalidatesTags: ['Project'],
    }),
    updateProject: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `/projects/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (_result, _error, { id }) => ['Project', { type: 'Project', id }],
    }),
    updateProjectStage: builder.mutation({
      query: ({ id, stage }) => ({
        url: `/projects/${id}/stage`,
        method: 'PATCH',
        body: { stage },
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Project', id }],
    }),
    manageTeam: builder.mutation({
      query: ({ id, userId, action }) => ({
        url: `/projects/${id}/team`,
        method: 'POST',
        body: { userId, action },
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Project', id }],
    }),
    addProjectNote: builder.mutation({
      query: ({ id, content }) => ({
        url: `/projects/${id}/notes`,
        method: 'POST',
        body: { content },
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Project', id }],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useGetProjectQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useUpdateProjectStageMutation,
  useManageTeamMutation,
  useAddProjectNoteMutation,
} = projectApiSlice;
