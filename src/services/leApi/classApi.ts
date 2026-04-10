import { baseApi } from '.';
import type { Student } from './studentApi';

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

export interface Arm {
  id: string;
  name: string;
  classId: string;
  schoolId: string;
  capacity?: number;
  classMasterId?: string;
  createdAt: string;
  updatedAt: string;
  class?: { name: string };
}

export interface CreateArmRequest {
  name: string;
  classId: string;
  schoolId: string;
  capacity?: number;
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
    deleteClass: builder.mutation<void, string>({
      query: (id) => ({
        url: `/class/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Class', 'Student'],
    }),

    createArm: builder.mutation<Arm, CreateArmRequest>({
      query: (armData) => ({
        url: `/class/${armData.classId}/arms`,
        method: 'POST',
        body: armData,
      }),
      invalidatesTags: ['Class'],
    }),
    updateArm: builder.mutation<Arm, { classId: string; armId: string; name: string; capacity?: number }>({
      query: ({ classId, armId, ...armData }) => ({
        url: `/class/${classId}/arms/${armId}`,
        method: 'PATCH',
        body: armData,
      }),
      invalidatesTags: ['Class'],
    }),

    getSchoolArms: builder.query<Arm[], void>({
      query: () => ({
        url: `/class/arms`,
        method: 'GET',
      }),
      keepUnusedDataFor: 86400, // 24 hours
      providesTags: ['Class'],
    }),
    getArms: builder.query<Arm[], string>({
      query: (classId) => ({
        url: `/class/${classId}/arms`,
        method: 'GET',
      }),
      providesTags: ['Class'],
    }),
    deleteArm: builder.mutation<void, { classId: string; armId: string }>({
      query: ({ classId, armId }) => ({
        url: `/class/${classId}/arms/${armId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Class', 'Teachers', 'Student'],
    }),

    assignSubjectsToClass: builder.mutation<any, { classId: string; subjectIds: string[] }>({
      query: ({ classId, subjectIds }) => ({
        url: `/class/${classId}/subjects`,
        method: 'POST',
        body: { subjectIds },
      }),
      invalidatesTags: ['Class', 'Subject', 'Student'],
    }),
    assignMasterToArm: builder.mutation<Arm, { armId: string; staffId: string | null }>({
      query: ({ armId, staffId }) => ({
        url: `/class/arms/${armId}/master`,
        method: 'PATCH',
        body: { staffId },
      }),
      invalidatesTags: ['Class', 'Staff', 'Teachers'],
    }),

    getStudentsByArm: builder.query<Student[], string>({
      query: (armId) => ({
        url: `/class/arms/${armId}/students`,
        method: 'GET',
      }),
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: 'Student' as const, id })),
            { type: 'Student', id: 'LIST' },
          ]
          : [{ type: 'Student', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetClassesQuery,
  useGetClassQuery,
  useCreateClassMutation,
  useCreateArmMutation,
  useUpdateArmMutation,
  useGetSchoolArmsQuery,
  useGetArmsQuery,
  useDeleteClassMutation,
  useDeleteArmMutation,
  useAssignSubjectsToClassMutation,
  useAssignMasterToArmMutation,
  useGetStudentsByArmQuery,
} = classApi;





