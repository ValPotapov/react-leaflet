import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { RouteDto } from '../../models';

type History = {
  routeId: string;
  coordinates: any;
};

type TypeInitialStore = {
  history: History[];
  selectedRoute: RouteDto[];
  loading: boolean;
  selectedExtraPoint: RouteDto | null;
  selectedRouteItem: RouteDto | null;
};

const initialState: TypeInitialStore = {
  history: [],
  selectedRoute: [],
  selectedRouteItem: null,
  selectedExtraPoint: null,
  loading: false,
};

export const routesSlice = createSlice({
  name: 'routes',
  initialState,
  reducers: {
    addHistoryRoutes: (state, action: PayloadAction<History>) => {
      state.history.push(action.payload);
    },
    setSelectedRoute: (state, action: PayloadAction<RouteDto[]>) => {
      state.selectedRoute = action.payload;
    },
    setSelectedExtraPoint: (state, action: PayloadAction<RouteDto | null>) => {
      state.selectedExtraPoint = action.payload;
    },
    setSelectedRouteItem: (state, action: PayloadAction<RouteDto | null>) => {
      state.selectedRouteItem = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;

      if (action.payload) {
        document.body.classList.add('loading');
      } else document.body.classList.remove('loading');
    },
    reset: (state) => {
      state.history = [];
      state.selectedRoute = [];
      state.selectedExtraPoint = null;
      state.selectedRouteItem = null;
    },
  },
});

export const { actions: routesActions, reducer: routesReducer } = routesSlice;
