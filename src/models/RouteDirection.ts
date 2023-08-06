/* istanbul ignore file */
/* eslint-disable */

import { Maybe } from "../types";

export type RouteDirection = {
  truckID: string;
  truckSize: number;
  hired: boolean;
  date: string;
  time: string;
  latitude: number;
  longitude: number;
  payload: Maybe<string>;
  routeID: string;
  includesJIT: boolean;
  loadedTime: Maybe<string>;
  freeTime: Maybe<string>;
  loadedHours: Maybe<number>;
  freeHours: Maybe<number>;
  city: string;
};

