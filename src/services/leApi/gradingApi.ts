import { baseApi } from '.';

export type ModuleCategory = 'CA' | 'EXAM' | 'PRACTICAL' | 'OTHER';

export interface GradingModule {
  id: string;
  schoolId?: string;
  term?: string;
  session?: string;
  name: string;
  percentage: number;
  category: ModuleCategory;
  sequence: number;
  isLocked: boolean;
  subjectId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGradingModuleRequest {
  name: string;
  percentage: number;
  category?: ModuleCategory;
  sequence?: number;
  isLocked?: boolean;
  subjectId?: string;
}

export interface ToggleLockRequest {
  ids: string[];
  lock: boolean;
}

export const gradingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGradingModules: builder.query<GradingModule[], { session?: string; term?: string } | void>({
      query: (params) => ({
        url: '/grading/modules',
        method: 'GET',
        params: params || undefined,
      }),
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: 'Grading' as const, id })),
            { type: 'Grading', id: 'LIST' },
          ]
          : [{ type: 'Grading', id: 'LIST' }],
    }),
    getGradingModuleById: builder.query<GradingModule, string>({
      query: (id) => ({
        url: `/grading/modules/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Grading', id }],
    }),
    createGradingModule: builder.mutation<GradingModule, CreateGradingModuleRequest>({
      query: (data) => ({
        url: '/grading/modules',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Grading', id: 'LIST' }],
    }),
    updateGradingModule: builder.mutation<GradingModule, { id: string } & Partial<CreateGradingModuleRequest>>({
      query: ({ id, ...data }) => ({
        url: `/grading/modules/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Grading', id },
        { type: 'Grading', id: 'LIST' },
      ],
    }),
    toggleLockModules: builder.mutation<{ count: number }, ToggleLockRequest>({
      query: (data) => ({
        url: '/grading/modules/lock',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (_result, _error, { ids }) => [
        ...ids.map(id => ({ type: 'Grading' as const, id })),
        { type: 'Grading', id: 'LIST' },
      ],
    }),
    deleteGradingModule: builder.mutation<void, string>({
      query: (id) => ({
        url: `/grading/modules/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Grading', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetGradingModulesQuery,
  useGetGradingModuleByIdQuery,
  useCreateGradingModuleMutation,
  useUpdateGradingModuleMutation,
  useToggleLockModulesMutation,
  useDeleteGradingModuleMutation,
} = gradingApi;
