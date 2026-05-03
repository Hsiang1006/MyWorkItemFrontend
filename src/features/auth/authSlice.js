import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token') || null,
    role: localStorage.getItem('role') || null,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { user, token, role } = action.payload;
      state.user = user;
      state.token = token;
      state.role = role;
      localStorage.setItem('token', token);
      if (role) {
        localStorage.setItem('role', role);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
