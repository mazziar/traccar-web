import { createSlice } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'general',
  initialState: {
    ws: null,
    MOD: false, // map or dashboard
    blocking : false,
  },
  reducers: {
    openWs(state, action) {
      state.ws = true ;
    },
    closeWs(state, action) {
      state.ws = false ;
    },
    showMap(state, action) {
      state.MOD = false ;
    },
    showDashboard(state, action) {
      state.MOD = false ;
    },
    block(state, action) {
      state.blocking = true ;
    },
    notBlock(state, action) {
      state.blocking = false ;
    },
  },
});

export { actions as generalActions };
export { reducer as generalReducer };
