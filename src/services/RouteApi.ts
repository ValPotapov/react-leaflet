import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { dynamicRoute } from '../common/utils';
import { ENDPOINTS, ENDPOINT_ROOT_OPR } from '../constants';
const ORS_API_KEY = process.env.REACT_APP_OPR_API_KEY || '';

export const routeApi = createApi({
  reducerPath: 'routeApi',
  baseQuery: fetchBaseQuery({
    baseUrl: ENDPOINT_ROOT_OPR,
    prepareHeaders: (headers) => {
      headers.set('Accept', 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8');
      headers.set('Content-Type', 'application/json');
      headers.set('Authorization', ORS_API_KEY);
      return headers;
    },
  }),
  endpoints: (build) => ({
    routeDirectionFetch: build.mutation<any, Record<string, any>>({
      query: (coordinates) => ({
        url: dynamicRoute(ENDPOINTS.ORS.DIRECTION_FETCH, ''),
        method: 'POST',
        body: {coordinates, geometry_simplify: "true"},
      }),
    }),

  }),
});


export const {
  useRouteDirectionFetchMutation,
} = routeApi;
