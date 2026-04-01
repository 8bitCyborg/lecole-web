import { createSlice } from '@reduxjs/toolkit';
import { classApi } from '../../services/leApi/classApi';
import { logout } from './authSlice';

interface ClassArmsState {
  armMap: Record<string, {
    name: string;
    classId: string,
    className?: { name: string },
    classMasterId?: string
  }>;
}

const initialState: ClassArmsState = {
  armMap: {},
};

const classArmsSlice = createSlice({
  name: 'classArms',
  initialState,
  reducers: {
    clearArms: (state) => {
      state.armMap = {};
    },
  },
  extraReducers: (builder) => {
    // Clear on logout
    builder.addCase(logout, (state) => {
      state.armMap = {};
    });

    // Handle getArms success
    // builder.addMatcher(
    //   classApi.endpoints.getArms.matchFulfilled,
    //   (state, action) => {
    //     // We'll optionally clear out arms for the class we are fetching if we want a fresh list,
    //     // but updating existing entries is safer to keep cross-class cache intact.
    //     action.payload.forEach((arm) => {
    //       state.armMap[arm.id] = { name: arm.name, classId: arm.classId };
    //     });
    //   }
    // );

    builder.addMatcher(
      classApi.endpoints.getSchoolArms.matchFulfilled,
      (state, action) => {
        action.payload.forEach((arm) => {
          state.armMap[arm.id] = {
            name: arm.name,
            classId: arm.classId,
            className: arm.class,
            classMasterId: arm.classMasterId
          };
        });
      }
    );

    // Handle createArm success
    builder.addMatcher(
      classApi.endpoints.createArm.matchFulfilled,
      (state, action) => {
        state.armMap[action.payload.id] = {
          name: action.payload.name,
          classId: action.payload.classId
        };
      }
    );

    // Handle deleteArm success
    builder.addMatcher(
      classApi.endpoints.deleteArm.matchFulfilled,
      (state, action) => {
        // Depending on RTK Query version, arg might be nested
        const originalArgs = (action.meta.arg as any).originalArgs || action.meta.arg;
        const armId = originalArgs?.armId;
        if (typeof armId === 'string') {
          delete state.armMap[armId];
        }
      }
    );
  },
});

export const { clearArms } = classArmsSlice.actions;
export default classArmsSlice.reducer;
export const selectArmMap = (state: { classArms: ClassArmsState }) => state.classArms.armMap;
