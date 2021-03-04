import { createSlice } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'newuser',
  initialState: {
    newuser: {},
  },
  reducers: {
    updateNewUser(state, action) {
    state.newuser = action.payload;
    },
  },
});

export { actions as newuserActions };
export { reducer as newuserReducer };
