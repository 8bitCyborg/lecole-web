import { baseApi } from '.';

export interface Subject {
  id: string;
  name: string;
  code?: string;
  schoolId: string;
  classes?: { id: string; name: string }[];
  staff?: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
      email?: string;
    }
  }[];
  _count?: {
    classes: number;
    staff: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubjectRequest {
  name: string;
  schoolId: string;
  code?: string;
}

export const subjectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubjects: builder.query<Subject[], void>({
      query: () => ({
        url: '/subject',
        method: 'GET',
      }),
      keepUnusedDataFor: 86400, // 24 hours
      providesTags: ['Subject'],
    }),
    getSubjectById: builder.query<Subject & { _count: { classes: number; teachers: number } }, string>({
      query: (id) => ({
        url: `/subject/${id}`,
        method: 'GET',
      }),
      providesTags: ['Subject'],
    }),
    createSubject: builder.mutation<Subject, CreateSubjectRequest>({
      query: (subjectData) => ({
        url: '/subject',
        method: 'POST',
        body: subjectData,
      }),
      invalidatesTags: ['Subject'],
    }),

    assignClasses: builder.mutation<Subject, { id: string; classIds: string[] }>({
      query: ({ id, classIds }) => ({
        url: `/subject/${id}/classes`,
        method: 'PATCH',
        body: { classIds },
      }),
      invalidatesTags: ['Subject'],
    }),

    assignTeachers: builder.mutation<Subject, { id: string; teacherIds: string[] }>({
      query: ({ id, teacherIds }) => ({
        url: `/subject/${id}/teachers`,
        method: 'PATCH',
        body: { teacherIds },
      }),
      invalidatesTags: ['Subject', 'Staff', 'Teachers'],
    }),

    deleteSubject: builder.mutation<void, string>({
      query: (id) => ({
        url: `/subject/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Subject'],
    }),

  }),
});

export const {
  useGetSubjectsQuery,
  useGetSubjectByIdQuery,
  useCreateSubjectMutation,
  useAssignClassesMutation,
  useAssignTeachersMutation,
  useDeleteSubjectMutation,
} = subjectApi;
