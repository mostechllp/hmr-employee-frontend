import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: localStorage.getItem('employee-logged-in') === 'true',
  user: {
    email: localStorage.getItem('employee-email') || 'jithin@thesay.ae',
    name: 'JITHIN',
    role: 'IT Dept Head',
    employeeId: '1',
    department: 'IT',
    joinedDate: '01 Jan 2022',
    gender: 'Male',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('employee-logged-in', 'true');
      localStorage.setItem('employee-email', action.payload.email);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      localStorage.removeItem('employee-logged-in');
      localStorage.removeItem('employee-email');
      localStorage.removeItem('employee-remembered');
    },
    updateProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
});

export const { login, logout, updateProfile } = authSlice.actions;
export default authSlice.reducer;