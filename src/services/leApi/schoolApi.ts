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


  }),
});



export const {
  useCreateSchoolMutation,
  useFindMySchoolQuery,
  useUpdateSchoolMutation,
} = schoolApi;


