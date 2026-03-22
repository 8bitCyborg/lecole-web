import { baseApi } from '.';
import type { School } from '../../store/slices/schoolSlice';

export interface CreateSchoolRequest {
  user_id: string;
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
}

export interface UpdateSchoolRequest extends Partial<Omit<CreateSchoolRequest, 'user_id'>> {
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
