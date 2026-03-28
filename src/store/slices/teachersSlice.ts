import { createSlice } from '@reduxjs/toolkit';
import { staffApi } from '../../services/leApi/staffApi';
import { logout } from './authSlice';

interface TeachersState {
  teacherMap: Record<string, { name: string; email?: string }>;
}

const initialState: TeachersState = {
  teacherMap: {},
};

export const teachersSlice = createSlice({
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

    // Handle getTeachingStaff success - ONLY teaching staff
    builder.addMatcher(
      staffApi.endpoints.getTeachingStaff.matchFulfilled,
      (state, action) => {
        const newMap: Record<string, { name: string; email?: string }> = {};
        action.payload.forEach((staff) => {
          newMap[staff.id] = { 
            name: `${staff.user.firstName} ${staff.user.lastName}`,
            email: staff.user.email 
          };
        });
        state.teacherMap = newMap;
      }
    );

    // Handle createStaff success - ONLY if teaching staff
    builder.addMatcher(
      staffApi.endpoints.createStaff.matchFulfilled,
      (state, action) => {
        if (action.payload.isTeachingStaff) {
          state.teacherMap[action.payload.id] = { 
            name: `${action.payload.user.firstName} ${action.payload.user.lastName}`,
            email: action.payload.user.email
          };
        }
      }
    );

    // Handle deleteStaff success
    builder.addMatcher(
      staffApi.endpoints.deleteStaff.matchFulfilled,
      (state, action) => {
        const deletedId = action.meta.arg.originalArgs;
        if (typeof deletedId === 'string' && state.teacherMap[deletedId]) {
          delete state.teacherMap[deletedId];
        }
      }
    );
  },
});

export const { clearTeachers } = teachersSlice.actions;
export default teachersSlice.reducer;
export const selectTeacherMap = (state: { teachers: TeachersState }) => state.teachers.teacherMap;
