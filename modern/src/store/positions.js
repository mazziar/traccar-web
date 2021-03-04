import { createSlice } from '@reduxjs/toolkit';

const { reducer, actions } = createSlice({
  name: 'positions',
  initialState: {
    items: {},
     obd:{},
     error:{},
  },
  reducers: {
    update(state, action) {
      action.payload.forEach(item => state.items[item['deviceId']] = item);
    },
    updateobd(state, action) {
      action.payload.forEach(
        newItem => {
          state.obd[newItem['deviceId']] = newItem.attributes.obd; 
        // console.log(newItem.attributes.obd)
         });
    },
    updateError(state, action) {
      action.payload.forEach(
        newItem => {
          state.error[newItem['deviceId']] = newItem.attributes.error; 
          // console.log(newItem.attributes.error)
         });
    },
  }
});

export { actions as positionsActions };
export { reducer as positionsReducer };
