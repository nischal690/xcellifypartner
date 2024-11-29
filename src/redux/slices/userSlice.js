import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSignedIn: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signIn: (state) => {
      state.isSignedIn = true;
    },
    signOut: (state) => {
      state.isSignedIn = false;
      localStorage.removeItem("token")
    },
  },
});

export const { signIn, signOut } = userSlice.actions;
export default userSlice.reducer;
