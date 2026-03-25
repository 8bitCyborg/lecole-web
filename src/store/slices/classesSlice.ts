import { createSlice } from '@reduxjs/toolkit';
import { classApi } from '../../services/leApi/classApi';
import { logout } from './authSlice';

interface ClassesState {
  classMap: Record<string, string>; // id -> name mapping
}

const initialState: ClassesState = {
  classMap: {},
};

const classesSlice = createSlice({
  name: 'classes',
  initialState,
  reducers: {
    clearClasses: (state) => {
      state.classMap = {};
    },
  },
  extraReducers: (builder) => {
    // Clear on logout
    builder.addCase(logout, (state) => {
      state.classMap = {};
    });

    // Handle getClasses success
    builder.addMatcher(
      classApi.endpoints.getClasses.matchFulfilled,
      (state, action) => {
        const newMap: Record<string, string> = {};
        action.payload.forEach((cls) => {
          newMap[cls.id] = cls.name;
        });
        state.classMap = newMap;
      }
    );

    // Handle createClass success
    builder.addMatcher(
      classApi.endpoints.createClass.matchFulfilled,
      (state, action) => {
        state.classMap[action.payload.id] = action.payload.name;
      }
    );

    // Handle deleteClass success
    builder.addMatcher(
      classApi.endpoints.deleteClass.matchFulfilled,
      (state, action) => {
        const deletedId = action.meta.arg;
        if (typeof deletedId === 'string') {
          delete state.classMap[deletedId];
        }
      }
    );
  },
});

export const { clearClasses } = classesSlice.actions;
export default classesSlice.reducer;
export const selectClassMap = (state: { classes: ClassesState }) => state.classes.classMap;