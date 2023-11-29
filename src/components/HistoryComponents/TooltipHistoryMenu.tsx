import { FC, useState, useEffect, useMemo, useLayoutEffect } from 'react';

import { Marker as LeafletMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-rotatedmarker';

import { useAppSelector } from '../../store';

import isHasToushScreen from '../MainCars/lib/isMobile';
import carsPageconfig from '../MainCars/lib/config';
import getCarsFetch from '../MainCars/lib/fetchGetCars';

export const TooltipHistoryMenu = () => {
  return (
    <div>TooltipHistoryMenu</div>
  )
}