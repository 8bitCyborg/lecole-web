import { baseApi } from '.';

export interface School {
  id: string;
  userId: string;
  name: string;
  shortname: string | null;
  address: string;
  state: string;
  lga: string | null;
  phone: string;
  email: string;

  type: string | null;
  curriculum: string | null;
  gradingSystem: string | null;
  
  currentTermId: string | null;
  currentSessionId: string | null;

  ownershipType: string | null;
  proprietor: string | null;
  website: string | null;
  logo: string | null;
  motto: string | null;
  dateOfInception: string | null;

  cacNumber: string | null;
  cacCertificateUrl: string | null;
  moeNumber: string | null;
  moeCerticateUrl: string | null;
  trcnUrl: string | null;
  tin: string | null;

  bankName: string | null;
  accountNumber: string | null;
  accountName: string | null;

  verificationStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface AcademicSession {
  id: string;
  identifier: string;
  schoolId: string | null;
  startDate: string | null;
  endDate: string | null;
  terms?: any[];
  createdAt: string;
  updatedAt: string;
}

export interface Term {
  id: string;
  identifier: string;
  academicSessionId: string | null;
  schoolId: string | null;
  startDate: string;
  endDate: string | null;
  numberOfWeeks: number;
  createdAt: string;
  updatedAt: string;
}



export interface CreateSchoolRequest {
  userId: string;
  name: string;
  shortname?: string;
  address: string;
  state: string;
  lga?: string;
  phone: string;
  email: string;

  ownershipType?: string;
  proprietor?: string;
  website?: string;
  logo?: string;
  motto?: string;
  dateOfInception?: string;
}

export interface CreateAcademicSessionRequest {
  identifier: string;
  startDate?: string;
  endDate?: string;
  term?: {
    identifier: string;
    startDate: string;
    numberOfWeeks: number;
    endDate?: string;
  };
}

export interface CreateTermRequest {
  identifier: string;
  academicSessionId: string;
  startDate: string;
  endDate?: string;
  numberOfWeeks: number;
}



export interface UpdateSchoolRequest extends Partial<Omit<CreateSchoolRequest, 'userId'>> {
  id: string;
  currentTermId?: string | null;
  currentSessionId?: string | null;
}

export const schoolApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSchool: builder.mutation<School, CreateSchoolRequest>({
      query: (schoolData) => ({
        url: '/school',
        method: 'POST',
        body: schoolData,
      }),
      invalidatesTags: ['School'],
    }),
    findMySchool: builder.query<School, void>({
      query: () => ({
        url: '/school',
        method: 'GET',
      }),
      providesTags: ['School'],
    }),
    updateSchool: builder.mutation<School, UpdateSchoolRequest>({
      query: ({ id, ...patch }) => ({
        url: `/school/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ['School'],
    }),
    createAcademicSession: builder.mutation<AcademicSession, CreateAcademicSessionRequest>({
      query: (sessionData) => ({
        url: '/school/sessions',
        method: 'POST',
        body: sessionData,
      }),
      invalidatesTags: ['AcademicSession', 'School'],
    }),
    getAcademicSessions: builder.query<AcademicSession[], void>({
      query: () => ({
        url: '/school/sessions',
        method: 'GET',
      }),
      providesTags: ['AcademicSession'],
    }),
    getAcademicSessionById: builder.query<AcademicSession, string>({
      query: (id) => ({
        url: `/school/sessions/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'AcademicSession', id }],
    }),
    createTerm: builder.mutation<Term, CreateTermRequest>({
      query: (termData) => ({
        url: '/school/terms',
        method: 'POST',
        body: termData,
      }),
      invalidatesTags: ['AcademicSession', 'School'],
    }),
    getTerms: builder.query<Term[], { sessionId?: string } | void>({
      query: (params) => ({
        url: '/school/terms',
        method: 'GET',
        params: params || undefined,
      }),
      providesTags: ['AcademicSession'],
    }),

  }),
});



export const {
  useCreateSchoolMutation,
  useFindMySchoolQuery,
  useUpdateSchoolMutation,
  useCreateAcademicSessionMutation,
  useGetAcademicSessionsQuery,
  useGetAcademicSessionByIdQuery,
  useCreateTermMutation,
  useGetTermsQuery,
} = schoolApi;


