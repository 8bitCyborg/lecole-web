import { baseApi } from '.';
import type { Student } from './studentApi';

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

export const armsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createArm: builder.mutation<Arm, CreateArmRequest>({
      query: (armData) => ({
        url: `/class/${armData.classId}/arms`,
        method: 'POST',
        body: armData,
      }),
      invalidatesTags: ['Class', 'Arm'],
    }),
    updateArm: builder.mutation<Arm, { classId: string; armId: string; name: string; capacity?: number }>({
      query: ({ classId, armId, ...armData }) => ({
        url: `/class/${classId}/arms/${armId}`,
        method: 'PATCH',
        body: armData,
      }),
      invalidatesTags: ['Class', 'Arm'],
    }),

    getSchoolArms: builder.query<Arm[], void>({
      query: () => ({
        url: `/class/arms`,
        method: 'GET',
      }),
      keepUnusedDataFor: 86400, // 24 hours
      providesTags: ['Arm'],
    }),
    getArms: builder.query<Arm[], string>({
      query: (classId) => ({
        url: `/class/${classId}/arms`,
        method: 'GET',
      }),
      // providesTags: ['Arm'],
    }),
    deleteArm: builder.mutation<void, { classId: string; armId: string }>({
      query: ({ classId, armId }) => ({
        url: `/class/${classId}/arms/${armId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Class', 'Teachers', 'Student', 'Arm'],
    }),

    assignMasterToArm: builder.mutation<Arm, { armId: string; staffId: string | null }>({
      query: ({ armId, staffId }) => ({
        url: `/class/arms/${armId}/master`,
        method: 'PATCH',
        body: { staffId },
      }),
      invalidatesTags: ['Class', 'Staff', 'Teachers', 'Arm'],
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
  useCreateArmMutation,
  useUpdateArmMutation,
  useGetSchoolArmsQuery,
  useGetArmsQuery,
  useDeleteArmMutation,
  useAssignMasterToArmMutation,
  useGetStudentsByArmQuery,
} = armsApi;
