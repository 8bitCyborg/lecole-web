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
  subjects?: { name: string }[];
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
    getClasses: builder.query<Record<string, Class>, void>({
      query: () => ({
        url: '/class',
        method: 'GET',
      }),
      transformResponse: (response: Class[]) => {
        return response.reduce((acc, cls) => {
          acc[cls.id] = cls;
          return acc;
        }, {} as Record<string, Class>);
      },
      keepUnusedDataFor: 86400, // 24 hours
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
      invalidatesTags: ['Class'],
    }),
    createArm: builder.mutation<Arm, CreateArmRequest>({
      query: (armData) => ({
        url: `/class/${armData.classId}/arms`,
        method: 'POST',
        body: armData,
      }),
      invalidatesTags: ['Class'],
    }),

    getSchoolArms: builder.query<Record<string, Arm>, void>({
      query: () => ({
        url: `/class/arms`,
        method: 'GET',
      }),
      transformResponse: (response: Arm[]) => {
        return response.reduce((acc, arm) => {
          acc[arm.id] = arm;
          return acc;
        }, {} as Record<string, Arm>);
      },
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
      invalidatesTags: ['Class', 'Teachers'],
    }),

    assignMasterToArm: builder.mutation<Arm, { armId: string; staffId: string | null }>({
      query: ({ armId, staffId }) => ({
        url: `/class/arms/${armId}/master`,
        method: 'PATCH',
        body: { staffId },
      }),
      invalidatesTags: ['Class', 'Staff', 'Teachers'],
    }),
  }),
});

export const {
  useGetClassesQuery,
  useCreateClassMutation,
  useCreateArmMutation,
  useGetSchoolArmsQuery,
  useGetArmsQuery,
  useDeleteClassMutation,
  useDeleteArmMutation,
  useAssignMasterToArmMutation,
} = classApi;





