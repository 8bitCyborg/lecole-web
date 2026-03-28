import { baseApi } from '.';

export interface Teacher {
  id: string;
  userId: string;
  schoolId: string;
  staffId?: string;
  bio?: string;
  user: {
    first_name: string;
    last_name: string;
    email?: string;
    phone: string;
    role: string;
  };
  subjects?: any[];
  arm?: any;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeacherRequest {
  first_name: string;
  last_name: string;
  email?: string;
  phone: string;
  staffId?: string;
  bio?: string;
  password?: string;
}

export const teacherApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTeachers: builder.query<Teacher[], void>({
      query: () => ({
        url: '/teacher',
        method: 'GET',
      }),
      providesTags: ['Teacher'],
    }),
    getTeacher: builder.query<Teacher, string>({
      query: (id) => ({
        url: `/teacher/${id}`,
        method: 'GET',
      }),
      providesTags: ['Teacher'],
    }),
    createTeacher: builder.mutation<Teacher, CreateTeacherRequest>({
      query: (teacherData) => ({
        url: '/teacher',
        method: 'POST',
        body: teacherData,
      }),
      invalidatesTags: ['Teacher'],
    }),
    deleteTeacher: builder.mutation<void, string>({
      query: (id) => ({
        url: `/teacher/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Teacher'],
    }),
  }),
});

export const {
  useGetTeachersQuery,
  useGetTeacherQuery,
  useCreateTeacherMutation,
  useDeleteTeacherMutation,
} = teacherApi;
