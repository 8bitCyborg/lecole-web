import { baseApi } from '.';

export const Title = {
  MR: 'MR',
  MRS: 'MRS',
  MS: 'MS',
  DR: 'DR',
  PASTOR: 'PASTOR',
  REVEREND: 'REVEREND',
  OTHER: 'OTHER',
} as const;

export type Title = (typeof Title)[keyof typeof Title];

export const Gender = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER',
} as const;

export type Gender = (typeof Gender)[keyof typeof Gender];

export interface Staff {
  id: string;
  userId: string;
  schoolId: string;
  staffId?: string;
  bio?: string;
  title?: Title;
  gender: Gender;
  designation: string;
  isTeachingStaff: boolean;
  user: {
    firstName: string;
    lastName: string;
    email?: string;
    phone: string;
    role: string;
  };
  subjects?: any[];
  arms?: any[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateStaffRequest {
  title?: Title;
  gender: Gender;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  staffId?: string;
  bio?: string;
  password?: string;
  designation?: string;
  isTeachingStaff?: boolean;
}

export const staffApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStaff: builder.query<Staff[], void>({
      query: () => ({
        url: '/staff',
        method: 'GET',
      }),
      providesTags: ['Staff'],
    }),
    getTeachingStaff: builder.query<Record<string, { name: string; email?: string }>, void>({
      query: () => ({
        url: '/staff/teachers',
        method: 'GET',
      }),
      transformResponse: (response: Staff[]) => {
        return response.reduce((acc, staff) => {
          acc[staff.id] = {
            name: `${staff.user.firstName} ${staff.user.lastName}`,
            email: staff.user.email,
          };
          return acc;
        }, {} as Record<string, { name: string; email?: string }>);
      },
      keepUnusedDataFor: 86400, // 24 hours
      providesTags: ['Teachers'],
    }),
    getStaffMember: builder.query<Staff, string>({
      query: (id) => ({
        url: `/staff/${id}`,
        method: 'GET',
      }),
      providesTags: ['Staff'],
    }),
    createStaff: builder.mutation<Staff, CreateStaffRequest>({
      query: (staffData) => ({
        url: '/staff',
        method: 'POST',
        body: staffData,
      }),
      invalidatesTags: (result) => (result?.isTeachingStaff ? ['Staff', 'Teachers'] : ['Staff']),
    }),
    deleteStaff: builder.mutation<void, string>({
      query: (id) => ({
        url: `/staff/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Staff', 'Teachers'],
    }),

    assignSubjects: builder.mutation<Staff, { id: string; subjectIds: string[] }>({
      query: ({ id, subjectIds }) => ({
        url: `/staff/${id}/subjects`,
        method: 'PATCH',
        body: { subjectIds },
      }),
      invalidatesTags: ['Staff', 'Subject'],
    }),
  }),
});

export const {
  useGetStaffQuery,
  useGetTeachingStaffQuery,
  useGetStaffMemberQuery,
  useCreateStaffMutation,
  useDeleteStaffMutation,
  useAssignSubjectsMutation,
} = staffApi;
