import { createSlice } from '@reduxjs/toolkit';
import { teacherApi } from '../../services/leApi/teacherApi';
import { logout } from './authSlice';

interface TeachersState {
  teacherMap: Record<string, { name: string; email?: string }>; // id -> details mapping
}

const initialState: TeachersState = {
  teacherMap: {},
};

const teachersSlice = createSlice({
  name: 'teachers',
  initialState,
  reducers: {
    clearTeachers: (state) => {
      state.teacherMap = {};
    },
  },
  extraReducers: (builder) => {
    // Clear on logout
    builder.addCase(logout, (state) => {
      state.teacherMap = {};
    });

    // Handle getTeachers success
    builder.addMatcher(
      teacherApi.endpoints.getTeachers.matchFulfilled,
      (state, action) => {
        const newMap: Record<string, { name: string; email?: string }> = {};
        action.payload.forEach((teacher) => {
          newMap[teacher.id] = { 
            name: `${teacher.user.first_name} ${teacher.user.last_name}`,
            email: teacher.user.email 
          };
        });
        state.teacherMap = newMap;
      }
    );

    // Handle createTeacher success
    builder.addMatcher(
      teacherApi.endpoints.createTeacher.matchFulfilled,
      (state, action) => {
        state.teacherMap[action.payload.id] = { 
          name: `${action.payload.user.first_name} ${action.payload.user.last_name}`,
          email: action.payload.user.email
        };
      }
    );

    // Handle deleteTeacher success
    builder.addMatcher(
      teacherApi.endpoints.deleteTeacher.matchFulfilled,
      (state, action) => {
        const deletedId = action.meta.arg;
        if (typeof deletedId === 'string') {
          delete state.teacherMap[deletedId];
        }
      }
    );
  },
});

export const { clearTeachers } = teachersSlice.actions;
export default teachersSlice.reducer;
export const selectTeacherMap = (state: { teachers: TeachersState }) => state.teachers.teacherMap;
