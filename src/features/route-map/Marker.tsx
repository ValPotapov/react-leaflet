import { FC, useRef, useEffect, memo } from 'react';

import { Marker as LeafletMarker, Popup } from 'react-leaflet';
import { RouteDto } from '../../models';

import { RouteInfo } from './route-info';

import { useTheme } from '@mui/material';

import L from 'leaflet';

import { useAppSelector } from '../../store';

type MarkerProps = {
  item: RouteDto;
  onClick: (item: RouteDto) => void;
  type: 'extraPoint' | 'routes';
};

export const Marker: FC<MarkerProps> = memo(({ item, onClick, type }) => {
  const theme = useTheme();

  const selectedRouteItem = useAppSelector((state) => state.routes.selectedRouteItem);
  const selectedExtraPoint = useAppSelector((state) => state.routes.selectedExtraPoint);

  const markerRef = useRef<any>(null);

  const onClickMarker = () => {
    console.log('item: ', item);
    onClick(item);
  };

  const onClickShowMarker = () => {
    if (markerRef.current) {
      markerRef.current.openPopup();
    }
  };

  useEffect(() => {
    if (
      selectedRouteItem &&
      item.planID === selectedRouteItem?.planID &&
      item.payload === selectedRouteItem?.payload &&
      item.longitude === selectedRouteItem?.longitude &&
      item.latitude === selectedRouteItem?.latitude
    ) {
      onClickShowMarker();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRouteItem, item]);

  useEffect(() => {
    if (
      selectedExtraPoint &&
      item.planID === selectedExtraPoint?.planID &&
      item.payload === selectedExtraPoint?.payload &&
      item.longitude === selectedExtraPoint?.longitude &&
      item.latitude === selectedExtraPoint?.latitude
    ) {
      onClickShowMarker();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedExtraPoint, item]);

  const fill = {
    routes: theme.palette.primary.main,
    extraPoint: theme.palette.secondary.main,
  };

  return (
    <LeafletMarker
      eventHandlers={{
        click: onClickMarker,
      }}
      ref={markerRef}
      position={[item.latitude, item.longitude]}
      icon={
        new L.DivIcon({
          html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${fill[type]}"><path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z" /></svg>`,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, 0],
          shadowSize: [32, 32],
          shadowAnchor: [32, 32],
        })
      }
    >
      <Popup>
        <RouteInfo type={type} route={item} />
      </Popup>
    </LeafletMarker>
  );
});
