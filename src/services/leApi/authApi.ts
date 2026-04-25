import { baseApi } from '.';
import type { User } from '../../store/slices/authSlice';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest extends LoginRequest {
  firstName: string;
  middleName?: string;
  lastName: string;
  phone: string;
}

export interface AuthResponse {
  user: User;
  message: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/local/signin',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    signup: builder.mutation<AuthResponse, SignupRequest>({
      query: (userData) => ({
        url: '/auth/local/signup',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),
    verifyPassword: builder.mutation<{ success: boolean }, { password: string }>({
      query: (body) => ({
        url: '/auth/verify-password',
        method: 'POST',
        body,
      }),
    }),
    getProfile: builder.query<{ memberships: any[]; profile: any }, void>({
      query: () => ({
        url: '/user/profile',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useLogoutMutation,
  useVerifyPasswordMutation,
  useGetProfileQuery,
} = authApi;
