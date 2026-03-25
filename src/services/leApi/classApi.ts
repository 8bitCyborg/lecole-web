import { baseApi } from '.';

export interface Class {
  id: string;
  name: string;
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
    createArm: builder.mutation<Arm, CreateArmRequest>({
      query: (armData) => ({
        url: `/class/${armData.classId}/arms`,
        method: 'POST',
        body: armData,
      }),
      invalidatesTags: ['Class'],
    }),
    getArms: builder.query<Arm[], string>({
      query: (classId) => ({
        url: `/class/${classId}/arms`,
        method: 'GET',
      }),
      providesTags: ['Class'],
    }),
    deleteClass: builder.mutation<void, string>({
      query: (id) => ({
        url: `/class/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Class'],
    }),
    deleteArm: builder.mutation<void, { classId: string; armId: string }>({
      query: ({ classId, armId }) => ({
        url: `/class/${classId}/arms/${armId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Class'],
    }),
  }),
});

export const {
  useGetClassesQuery,
  useCreateClassMutation,
  useCreateArmMutation,
  useGetArmsQuery,
  useDeleteClassMutation,
  useDeleteArmMutation,
} = classApi;





