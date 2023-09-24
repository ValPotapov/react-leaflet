import { FC, memo, useRef } from 'react';

import { Marker as LeafletMarker, Popup } from 'react-leaflet';
import { RouteDto } from '../../models';

import { RouteInfo } from './route-info';

import { useTheme } from '@mui/material';

import L from 'leaflet';

type MarkerProps = {
  item: RouteDto;
  // selectedRouteItem: RouteDto | null;
  // selectedExtraItem: RouteDto | null;
  onClick: (item: RouteDto) => void;
  type: 'extraPoint' | 'routes';
};

export const Marker: FC<MarkerProps> = memo(
  ({ item, onClick, type }) => { // remove from props --> , selectedRouteItem, selectedExtraItem 
    const theme = useTheme();

    // const markerRef = useRef<any>(null);

    const onClickMarker = () => {
      onClick(item);
    };

    // const onClickShowMarker = () => {
    //   if (markerRef.current) {
    //     markerRef.current.openPopup();
    //   }
    // };

    // useEffect(() => {
    //   if (selectedRouteItem) {
    //     onClickShowMarker();
    //   }
    //   // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [selectedRouteItem, item]);

    // useEffect(() => {
    //   if (selectedExtraItem) {
    //     onClickShowMarker();
    //   }
    //   // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [selectedExtraItem, item]);

    const fill = {
      routes: theme.palette.primary.main,
      extraPoint: theme.palette.secondary.main,
    };

    return (
      <LeafletMarker
        eventHandlers={{
          click: onClickMarker,
        }}
        // ref={markerRef}
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
  }
);
