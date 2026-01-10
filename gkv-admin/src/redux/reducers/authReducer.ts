import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  token: string;
  user: {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
  } | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: '',
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    addAuth: (state, action: PayloadAction<{ token: string; user: any }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    removeAuth: (state) => {
      state.token = '';
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { addAuth, removeAuth } = authSlice.actions;
export default authSlice.reducer;

