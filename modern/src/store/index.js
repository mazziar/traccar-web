import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { newuserReducer as newuser } from './newuser';
import { sessionReducer as session } from './session';
import { devicesReducer as devices } from './devices';
import { positionsReducer as positions } from './positions';
import { generalReducer as general } from './generalState';


const reducer = combineReducers({
  session,
  devices,
  positions,
  newuser,
  general,
});

export { sessionActions } from './session';
export { devicesActions } from './devices';
export { positionsActions } from './positions';
export { newuserActions } from './newuser';
export { generalActions } from './generalState';

export default configureStore({ reducer });
