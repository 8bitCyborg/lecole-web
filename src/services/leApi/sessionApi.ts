import { baseApi } from '.';

export interface Term {
  id: string;
  identifier: string;
  startDate: string;
  endDate: string | null;
  numberOfWeeks: number;
  status: string;
}

export interface AcademicSession {
  id: string;
  identifier: string;
  schoolId: string | null;
  status: string;
  termsPerSession: number;
  terms: Term[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateAcademicSessionRequest {
  identifier: string;
  termsPerSession?: number;
  term?: {
    identifier: string;
    startDate: string;
    numberOfWeeks: number;
    endDate?: string;
  };
}

export interface UpdateAcademicSessionRequest {
  id: string;
  identifier?: string;
  termsPerSession?: number;
}

export const sessionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSessions: builder.query<AcademicSession[], void>({
      query: () => ({
        url: '/school/session',
        method: 'GET',
      }),
      providesTags: ['AcademicSession'],
    }),
    getCurrentSession: builder.query<AcademicSession | null, void>({
      query: () => ({
        url: '/school/session/current',
        method: 'GET',
      }),
      providesTags: ['AcademicSession'],
    }),
    createSession: builder.mutation<AcademicSession, CreateAcademicSessionRequest>({
      query: (body) => ({
        url: '/school/session',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['AcademicSession', 'School'],
    }),
    updateSession: builder.mutation<AcademicSession, UpdateAcademicSessionRequest>({
      query: ({ id, ...body }) => ({
        url: `/school/session/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['AcademicSession'],
    }),
    createTerm: builder.mutation<Term, Partial<Term> & { academicSessionId: string }>({
      query: (body) => ({
        url: '/school/term',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['AcademicSession'],
    }),
    updateTerm: builder.mutation<Term, Partial<Term> & { id: string }>({
      query: ({ id, ...body }) => ({
        url: `/school/term/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['AcademicSession'],
    }),
    endTerm: builder.mutation<Term, string>({
      query: (id) => ({
        url: `/school/term/${id}/end`,
        method: 'PATCH',
      }),
      invalidatesTags: ['AcademicSession'],
    }),
  }),
});

export const { 
  useGetSessionsQuery, 
  useGetCurrentSessionQuery, 
  useCreateSessionMutation,
  useUpdateSessionMutation,
  useCreateTermMutation,
  useUpdateTermMutation,
  useEndTermMutation
} = sessionApi;
