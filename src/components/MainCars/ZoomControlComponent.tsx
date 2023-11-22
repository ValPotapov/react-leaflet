import React, { useEffect, useState, useRef } from 'react';
// import { useLocation } from 'react-router-dom';

import { MapContainer, TileLayer, ZoomControl, useMap } from 'react-leaflet';
import 'leaflet-rotatedmarker';
import L from 'leaflet';

import { useAppDispatch, useAppSelector, dataActions } from '../../store';
import getCarsFetch from './lib/fetchGetCars';

import { ICarObject, ICompanyData } from '../../types/carsTypes';
import carsPageconfig from './lib/config';

import { Box } from '@mui/material';
import { Spinner } from '../HistoryComponents/IconComponent/Spinner';
import PainCars from './PainCars';
import PaneHistoryMap from '../HistoryComponents/PaneHistoryMap';




const ZoomControlComponent = () => {

  const map = useMap()
  useEffect(() => {
    const zoomInButton = map.getContainer().querySelector('.leaflet-control-zoom-in') as HTMLElement;
    const zoomOutButton = map.getContainer().querySelector('.leaflet-control-zoom-out') as HTMLElement;

    const zoomBar = zoomInButton.closest('.leaflet-bar') as HTMLElement;

    if (zoomInButton && zoomOutButton) {
      zoomInButton.style.backgroundColor = 'rgb(7, 140, 117)';
      zoomInButton.style.borderRadius = '50% 50%'
      zoomInButton.style.marginBottom = '1rem'
      zoomInButton.style.color = 'white'
      zoomInButton.style.border = 'none'

      zoomOutButton.style.backgroundColor = 'rgb(7, 140, 117)';
      zoomOutButton.style.backgroundColor = 'rgb(7, 140, 117)';
      zoomOutButton.style.borderRadius = '50% 50%'
      zoomOutButton.style.marginBottom = '1rem'
      zoomOutButton.style.color = 'white'
      zoomOutButton.style.border = 'none'
      // Другие стили

      zoomBar.style.border = 'none'
    }
  }, [map]);


  return (
    <ZoomControl position="topleft" />
  )
}

export default ZoomControlComponent;