/* eslint-disable no-console */
import axios from 'axios';

import { ENDPOINT_ROOT_OPR, ENDPOINTS } from '../constants';

const ORS_API_KEY = process.env.REACT_APP_OPR_API_KEY || '';

export const getDrivingForMap = async (coordinates: number[][]) => {
  try {
    const response = await axios.post(
      `${ENDPOINT_ROOT_OPR}${ENDPOINTS.ORS.DIRECTION_FETCH}`,
      {
        coordinates,
        geometry_simplify: true,
      },
      {
        headers: {
          Authorization: ORS_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
