import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RouteDto } from '../../models';

type TypeInitialState = {
  search: string;
  planId: string;
  routeDate: string | null;
  extraPointDate: string | null;
  sortRoute: keyof RouteDto | null;
  sortExtraPoint: keyof RouteDto | null;
};

const initialState: TypeInitialState = {
  search: '',
  planId: '1',
  routeDate: null,
  extraPointDate: null,
  sortRoute: null,
  sortExtraPoint: null,
};

export const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setPlanId(state, action: PayloadAction<string>) {
      state.planId = action.payload;
    },
    setRouteDate(state, action: PayloadAction<string | null>) {
      state.routeDate = action.payload;
    },
    setExtraPointDate(state, action: PayloadAction<string | null>) {
      state.extraPointDate = action.payload;
    },
    setSortRoute(state, action: PayloadAction<keyof RouteDto | null>) {
      state.sortRoute = action.payload;
    },
    setSortExtraPoint(state, action: PayloadAction<keyof RouteDto | null>) {
      state.sortExtraPoint = action.payload;
    },
  },
});

export const { actions: filterActions, reducer: filterReducer } = filtersSlice;
