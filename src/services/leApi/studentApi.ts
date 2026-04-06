import { baseApi } from '.';

export type Gender = 'MALE' | 'FEMALE';
export type StudentStatus = 'ACTIVE' | 'GRADUATED' | 'WITHDRAWN';

export interface Student {
  id: string;
  userId: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
  };
  schoolId: string;
  classId?: string;
  class?: {
    id: string;
    name: string;
  };
  armId?: string;
  arm?: {
    id: string;
    name: string;
  };
  admissionNumber: string;
  dateOfBirth?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  isFeesPaid: boolean;
  gender: Gender;
  status: StudentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudentRequest {
  firstName: string;
  lastName: string;
  email?: string;
  gender: Gender;
  admissionNumber: string;
  dateOfBirth?: string;
  guardianPhone?: string;
  guardianEmail?: string;
  classId?: string;
  armId?: string;
  schoolId: string;
  password?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const studentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getActiveStudents: builder.query<PaginatedResponse<Student>, { page?: number; limit?: number } | void>({
      query: (params) => ({
        url: '/student',
        method: 'GET',
        params: params || undefined,
      }),
      keepUnusedDataFor: 86400, // 24 hours
      providesTags: ['Student'],
    }),
    getArchivedStudents: builder.query<PaginatedResponse<Student>, { page?: number; limit?: number } | void>({
      query: (params) => ({
        url: '/student/archived',
        method: 'GET',
        params: params || undefined,
      }),
      keepUnusedDataFor: 86400,
      providesTags: ['Student'],
    }),
    getGraduatedStudents: builder.query<PaginatedResponse<Student>, { page?: number; limit?: number } | void>({
      query: (params) => ({
        url: '/student/graduated',
        method: 'GET',
        params: params || undefined,
      }),
      keepUnusedDataFor: 86400,
      providesTags: ['Student'],
    }),
    getStudentById: builder.query<Student, string>({
      query: (id) => ({
        url: `/student/${id}`,
        method: 'GET',
      }),
      providesTags: ['Student'],
    }),
    createStudent: builder.mutation<Student, CreateStudentRequest>({
      query: (studentData) => ({
        url: '/student',
        method: 'POST',
        body: studentData,
      }),
      invalidatesTags: ['Student'],
    }),
    updateStudent: builder.mutation<Student, { id: string } & Partial<CreateStudentRequest>>({
      query: ({ id, ...studentData }) => ({
        url: `/student/${id}`,
        method: 'PATCH',
        body: studentData,
      }),
      invalidatesTags: ['Student'],
    }),
    withdrawStudent: builder.mutation<void, string>({
      query: (id) => ({
        url: `/student/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Student'],
    }),
  }),
});

export const {
  useGetActiveStudentsQuery,
  useGetArchivedStudentsQuery,
  useGetGraduatedStudentsQuery,
  useGetStudentByIdQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useWithdrawStudentMutation,
} = studentApi;
