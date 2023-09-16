export const ENDPOINT_ROOT = process.env.REACT_APP_API_BASE_URL || '/';
export const ENDPOINT_ROOT_OPR = process.env.REACT_APP_OPR_API_URL || '/';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/logIn',
  },
  ORS: {
    DIRECTION_FETCH: `directions/driving-car/geojson`,
  },
};
