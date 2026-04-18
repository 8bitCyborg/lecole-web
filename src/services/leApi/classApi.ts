import { baseApi } from '.';

export type Category = 'EARLY_YEARS' | 'BASIC' | 'JUNIOR_SECONDARY' | 'SENIOR_SECONDARY' | 'OTHER';

export const CATEGORY_OPTIONS: { value: Category; label: string }[] = [
  { value: 'EARLY_YEARS', label: 'Early Years' },
  { value: 'BASIC', label: 'Basic' },
  { value: 'JUNIOR_SECONDARY', label: 'Junior Secondary' },
  { value: 'SENIOR_SECONDARY', label: 'Senior Secondary' },
  { value: 'OTHER', label: 'Other' },
];

export interface Class {
  id: string;
  name: string;
  category: Category;
  schoolId: string;
  order?: number;
  _count?: {
    arms: number;
    subjects: number;
  };
  subjects?: { id: string; name: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateClassRequest {
  schoolId: string;
  name: string;
  category: Category;
}

export interface CreateBulkClassesRequest {
  classes: { name: string; category: Category }[];
  schoolId: string;
}



export const classApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClasses: builder.query<Class[], void>({
      query: () => ({
        url: '/class',
        method: 'GET',
      }),
      keepUnusedDataFor: 86400, // 24 hours
      providesTags: ['Class'],
    }),
    getClass: builder.query<Class, string>({
      query: (id) => ({
        url: `/class/${id}`,
        method: 'GET',
      }),
      providesTags: ['Class'],
    }),
    createClass: builder.mutation<Class, CreateClassRequest>({
      query: (classData) => ({
        url: '/class',
        method: 'POST',
        body: classData,
      }),
      invalidatesTags: ['Class'],
    }),
    createBulkClasses: builder.mutation<{ count: number }, CreateBulkClassesRequest>({
      query: (data) => ({
        url: '/class/bulk',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Class'],
    }),
    deleteClass: builder.mutation<void, string>({
      query: (id) => ({
        url: `/class/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Class', 'Student'],
    }),



    assignSubjectsToClass: builder.mutation<any, { classId: string; subjectIds: string[] }>({
      query: ({ classId, subjectIds }) => ({
        url: `/class/${classId}/subjects`,
        method: 'POST',
        body: { subjectIds },
      }),
      invalidatesTags: ['Class', 'Subject', 'Student'],
    }),

  }),
});

export const {
  useGetClassesQuery,
  useGetClassQuery,
  useCreateClassMutation,
  useCreateBulkClassesMutation,
  useDeleteClassMutation,
  useAssignSubjectsToClassMutation,
} = classApi;





