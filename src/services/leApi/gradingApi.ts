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

export interface Grade {
  id: string;
  score: number;
  studentId: string;
  subjectId: string;
  gradingModuleId: string;
  classId: string;
  armId?: string;
  term: string;
  session: string;
  schoolId: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertGradesRequest {
  context: {
    schoolId: string;
    classId: string;
    armId: string;
    term: string;
    session: string;
  };
  scores: {
    studentId: string;
    subjectId: string;
    gradingModuleId: string;
    score: number | null;
  }[];
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
    getGradesByArm: builder.query<Grade[], string>({
      query: (armId) => ({
        url: `/grading/arms/${armId}/grades`,
        method: 'GET',
      }),
      providesTags: (result, _error, armId) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: 'Grading' as const, id })),
            { type: 'Grading', id: `ARM-${armId}` },
          ]
          : [{ type: 'Grading', id: `ARM-${armId}` }],
    }),
    upsertGrades: builder.mutation<{ count: number }, UpsertGradesRequest>({
      query: (data) => ({
        url: '/grading/batch-upsert',
        method: 'POST',
        body: data,
      }),
      async onQueryStarted({ context, scores }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          gradingApi.util.updateQueryData('getGradesByArm', context.armId, (draft) => {
            scores.forEach((newGrade) => {
              const existingIndex = draft.findIndex(
                (g) =>
                  g.studentId === newGrade.studentId &&
                  g.subjectId === newGrade.subjectId &&
                  g.gradingModuleId === newGrade.gradingModuleId
              );

              if (existingIndex !== -1) {
                draft[existingIndex].score = newGrade.score ?? 0;
              } else {
                // If it doesn't exist, we'd need more data (id, etc.) 
                // but for optimistic UI, we can just push a partial or wait for refetch
                // Usually, we just update what we have.
              }
            });
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (_result, _error, { context, scores }) => {
        const studentIds = [...new Set(scores.map(s => s.studentId))];
        return [
          { type: 'Grading', id: `ARM-${context.armId}` },
          ...studentIds.map(id => ({ type: 'Grading' as const, id: `STUDENT-${id}` })),
        ];
      },
    }),

    getStudentGrades: builder.query<Grade[], string>({
      query: (studentId) => ({
        url: `/grading/grades/${studentId}`,
        method: 'GET',
      }),
      providesTags: (result, _error, studentId) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: 'Grading' as const, id })),
            { type: 'Grading', id: `STUDENT-${studentId}` },
          ]
          : [{ type: 'Grading', id: `STUDENT-${studentId}` }],
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
  useGetGradesByArmQuery,
  useUpsertGradesMutation,
  useGetStudentGradesQuery,
} = gradingApi;
