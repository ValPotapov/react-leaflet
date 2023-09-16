import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { RouteDto } from '../../models';
import { RouteData } from '../../hooks';

type TypeInitialStore = {
  routes: RouteData;
  extraPoints: RouteDto[];
};

const cachedNames = {
  routes: 'routes',
  extraPoints: 'extraPoints',
};

const cachedRoutes = localStorage.getItem(cachedNames.routes);
const cachedExtraPointes = localStorage.getItem(cachedNames.extraPoints);

const initialState: TypeInitialStore = {
  routes: cachedRoutes ? JSON.parse(cachedRoutes) : {},
  extraPoints: cachedExtraPointes ? JSON.parse(cachedExtraPointes) : {},
};

export const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setRoutes: (state, action: PayloadAction<RouteData>) => {
      state.routes = action.payload;
      localStorage.setItem(cachedNames.routes, JSON.stringify(action.payload));
    },
    setExtraPoints: (state, action: PayloadAction<RouteDto[]>) => {
      state.extraPoints = action.payload;
      localStorage.setItem(cachedNames.extraPoints, JSON.stringify(action.payload));
    },
    reset: (state) => {
      state.extraPoints = [];
      state.routes = {};
      localStorage.removeItem(cachedNames.routes);
      localStorage.removeItem(cachedNames.extraPoints);
    },
  },
});

export const { actions: dataActions, reducer: dataReducer } = dataSlice;
