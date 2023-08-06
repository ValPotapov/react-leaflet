import { fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { isRejectedWithValue, Middleware } from '@reduxjs/toolkit';

import { ENDPOINT_ROOT, BASE_AUTH_TOKEN, BASE_AUTH_USER, ROUTES } from '../../constants';

export const rtkBaseHeaders = (headers: Headers) => {
  headers.set('Content-Type', 'application/json');
  headers.set('Accept', 'application/json');

  const token = localStorage.getItem(BASE_AUTH_TOKEN);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return headers;
};

export const rtkBaseQuery = fetchBaseQuery({
  baseUrl: ENDPOINT_ROOT,
  prepareHeaders: rtkBaseHeaders,
});


export const rtkQueryErrorLogger: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const status = action && action.payload && action.payload.status ? action.payload.status : null;

    if (status === 401) {
      localStorage.removeItem(BASE_AUTH_USER);
      localStorage.removeItem(BASE_AUTH_TOKEN);
      window.location.href = ROUTES.AUTH.LOGIN;
    }
  }

  return next(action);
};
