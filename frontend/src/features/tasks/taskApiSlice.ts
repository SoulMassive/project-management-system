import { apiSlice } from '../api/apiSlice';

export const taskApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProjectTasks: builder.query({
      query: ({ projectId, ...params }) => ({
        url: `/projects/${projectId}/tasks`,
        params,
      }),
      providesTags: (result) => 
        result 
          ? [...result.data.map(({ _id }: any) => ({ type: 'Task', id: _id })), { type: 'Task', id: 'LIST' }]
          : [{ type: 'Task', id: 'LIST' }],
    }),
    getMyTasks: builder.query({
      query: (params) => ({
        url: '/tasks/my-tasks',
        params,
      }),
      providesTags: (result) => 
        result 
          ? [...result.data.map(({ _id }: any) => ({ type: 'Task', id: _id })), { type: 'Task', id: 'LIST' }]
          : [{ type: 'Task', id: 'LIST' }],
    }),
    getTask: builder.query({
      query: (id) => `/tasks/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Task', id }],
    }),
    createTask: builder.mutation({
      query: ({ projectId, ...taskData }) => ({
        url: `/projects/${projectId}/tasks`,
        method: 'POST',
        body: taskData,
      }),
      invalidatesTags: [{ type: 'Task', id: 'LIST' }],
    }),
    updateTask: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `/tasks/${id}`,
        method: 'PATCH',
        body: updates,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Task', id }, { type: 'Task', id: 'LIST' }],
    }),
    updateTaskStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/tasks/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Task', id }, { type: 'Task', id: 'LIST' }],
    }),
    addSubtask: builder.mutation({
      query: ({ taskId, ...subtaskData }) => ({
        url: `/tasks/${taskId}/subtasks`,
        method: 'POST',
        body: subtaskData,
      }),
      invalidatesTags: (_result, _error, { taskId }) => [{ type: 'Task', id: taskId }],
    }),
    toggleSubtask: builder.mutation({
      query: ({ taskId, subtaskId }) => ({
        url: `/tasks/${taskId}/subtasks/${subtaskId}`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, { taskId }) => [{ type: 'Task', id: taskId }],
    }),
    addComment: builder.mutation({
      query: ({ taskId, content }) => ({
        url: `/tasks/${taskId}/comments`,
        method: 'POST',
        body: { content },
      }),
      invalidatesTags: (_result, _error, { taskId }) => [{ type: 'Task', id: taskId }],
    }),
  }),
});

export const {
  useGetProjectTasksQuery,
  useGetMyTasksQuery,
  useGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation,
  useAddSubtaskMutation,
  useToggleSubtaskMutation,
  useAddCommentMutation,
} = taskApiSlice;
