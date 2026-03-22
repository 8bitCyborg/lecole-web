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
  grading_system: string;
  current_term: string;
  current_session: string;
  ownership_type: string | null;

  proprietor: string | null;
  website: string | null;
  logo: string | null;
  motto: string | null;
  date_of_inception: string | null;

  cac_number: string | null;
  cac_certificate_url: string | null;
  moe_number: string | null;
  moe_certicate_url: string | null;
  trcn_url: string | null;
  tin: string | null;

  bank_name: string | null;
  account_number: string | null;
  account_name: string | null;

  verification_status: string;
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
