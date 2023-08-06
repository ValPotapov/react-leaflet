import { combineReducers } from 'redux';
import { routeApi } from '../services/RouteApi';

export const rootReducer = combineReducers({
  [routeApi.reducerPath]: routeApi.reducer,
});
