import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './reducers';
import { rtkQueryErrorLogger } from '../common/utils';
import { routeApi } from '../services/RouteApi';


export const setupStore = () =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat([
        rtkQueryErrorLogger,
        routeApi.middleware,
      ]),
  });

export const store = setupStore();

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
