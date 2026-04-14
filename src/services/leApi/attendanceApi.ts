import { baseApi } from '.';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | string;
  classId: string;
  armId: string;
}

export interface GetAttendanceArgs {
  classId: string;
  armId: string;
  term: string;
  session: string;
  startDate?: string;
  endDate?: string;
}

export interface BatchUpsertAttendancePayload {
  classId: string;
  armId: string;
  date: string;
  records: { studentId: string; status: 'PRESENT' | 'ABSENT' | string }[];
}

export const attendanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAttendance: builder.query<Record<string, AttendanceRecord[]>, GetAttendanceArgs>({
      query: (params) => ({
        url: '/attendance',
        method: 'GET',
        params,
      }),
      providesTags: (result, _error, arg) =>
        result
          ? [
            ...Object.values(result).flat().map(({ studentId, date }) => ({
              type: 'Attendance' as const,
              id: `${studentId}-${date.split('T')[0]}`
            })),
            { type: 'Attendance', id: `LIST-${arg.classId}-${arg.armId}` },
          ]
          : [{ type: 'Attendance', id: `LIST-${arg.classId}-${arg.armId}` }],
    }),

    markAttendance: builder.mutation<{ count: number }, BatchUpsertAttendancePayload>({
      query: (data) => ({
        url: '/attendance/batch-upsert',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: 'Attendance', id: `LIST-${arg.classId}-${arg.armId}` }
      ],
    }),
  }),
});

export const { useGetAttendanceQuery, useMarkAttendanceMutation } = attendanceApi;
