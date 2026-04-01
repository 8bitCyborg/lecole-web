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
    getTeachingStaff: builder.query<Staff[], void>({
      query: () => ({
        url: '/staff/teachers',
        method: 'GET',
      }),
      providesTags: ['Staff'],
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
      invalidatesTags: ['Staff'],
    }),
    deleteStaff: builder.mutation<void, string>({
      query: (id) => ({
        url: `/staff/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Staff'],
    }),
  }),
});

export const {
  useGetStaffQuery,
  useGetTeachingStaffQuery,
  useGetStaffMemberQuery,
  useCreateStaffMutation,
  useDeleteStaffMutation,
} = staffApi;
