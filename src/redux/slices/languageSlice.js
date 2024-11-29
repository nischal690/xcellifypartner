import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userLanguage : 'en',
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    changeLang: (state,action) => {
      state.userLanguage = action.payload;
    },
  },
});

export const { changeLang } = languageSlice.actions;
export default languageSlice.reducer;