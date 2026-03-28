import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { logout } from './authSlice';

export interface School {
  id: string;
  user_id: string;
  name: string;
  shortname: string | null;
  address: string;
  state: string;
  lga: string | null;
  phone: string;
  email: string;

  type: string;
  curriculum: string;
  gradingSystem: string;
  currentTerm: string;
  currentSession: string;
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

export interface SchoolState {
  school: School | null;
  isLoaded: boolean;
}

const initialState: SchoolState = {
  school: null,
  isLoaded: false,
};

export const schoolSlice = createSlice({
  name: 'school',
  initialState,
  reducers: {
    setSchool: (state, action: PayloadAction<School>) => {
      state.school = action.payload;
      state.isLoaded = true;
    },
    updateSchoolData: (state, action: PayloadAction<Partial<School>>) => {
      if (state.school) {
        state.school = { ...state.school, ...action.payload };
      }
    },
    clearSchoolData: (state) => {
      state.school = null;
      state.isLoaded = false;
    },
  },
  extraReducers: (builder) => {
    // Clear school data when user logs out
    builder.addCase(logout, (state) => {
      state.school = null;
      state.isLoaded = false;
    });
  },
});

export const { setSchool, updateSchoolData, clearSchoolData } = schoolSlice.actions;
export default schoolSlice.reducer;
