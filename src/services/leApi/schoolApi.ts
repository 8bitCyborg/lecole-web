import { baseApi } from '.';
import type { School } from '../../store/slices/schoolSlice';

export interface CreateSchoolRequest {
  userId: string;
  name: string;
  address: string;
  state: string;
  lga?: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
  proprietor?: string;
  description?: string;
  date_of_inception?: string;
  type?: string;
  curriculum?: string;
  grading_system?: string;
  current_term?: string;
  current_session?: string;
  ownership_type?: string;
  motto?: string;
}

export interface UpdateSchoolRequest extends Partial<Omit<CreateSchoolRequest, 'userId'>> {
  id: string;
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
