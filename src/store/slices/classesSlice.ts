import { createSlice } from '@reduxjs/toolkit';
import { classApi } from '../../services/leApi/classApi';
import { logout } from './authSlice';

interface ClassesState {
  classMap: Record<string, { name: string; category: string }>; // id -> details mapping
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
        const newMap: Record<string, { name: string; category: string }> = {};
        action.payload.forEach((cls) => {
          newMap[cls.id] = { name: cls.name, category: cls.category };
        });
        state.classMap = newMap;
      }
    );

    // Handle createClass success
    builder.addMatcher(
      classApi.endpoints.createClass.matchFulfilled,
      (state, action) => {
        state.classMap[action.payload.id] = { 
          name: action.payload.name, 
          category: action.payload.category 
        };
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