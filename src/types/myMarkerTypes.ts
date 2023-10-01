import { LatLngExpression, MarkerOptions } from 'leaflet';
import { EventedProps } from '@react-leaflet/core';
import { ReactNode } from 'react';
import { RouteDto } from '../models';

export interface MarkerProps extends MarkerOptions, EventedProps {
  data?: string;
  unicKey?: string;
  children?: ReactNode;
  position?: LatLngExpression;
  item: RouteDto | any;
  onClick: (item: RouteDto) => void | any;
  props?: any | null
  type: 'extraPoint' | 'routes';
  // Добавьте свои дополнительные поля или изменения здесь
}