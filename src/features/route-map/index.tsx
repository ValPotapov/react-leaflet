import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Box, BoxProps, useTheme } from '@mui/material';
import { RouteDto } from '../../models';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import L from 'leaflet';
import 'leaflet-routing-machine';

import { RouteInfo } from './route-info';
import { useRouteDirection } from '../../hooks/useRouteDirection';
import MarkerClusterGroup from 'react-leaflet-cluster';

type MapWithRoutesProps = BoxProps & {
  route: RouteDto[];
  extraPoints?: RouteDto[];
};

export const RouteMap: React.FC<MapWithRoutesProps> = ({ route, extraPoints, ...props }) => {
  const mapRef = useRef<any>(null);
  const [routePoints, setRoutePoints] = useState<any>([]);
  const [routePolyline, setRoutePolyline] = useState<any>([]);
  const theme = useTheme();
  const polylineOptions = {
    color: theme.palette.primary.main,
  };

  const { getDirection, data: dataPolyline } = useRouteDirection();

  useEffect(() => {
    getDirection(routePoints);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routePoints]);

  useEffect(() => {
    if (route) {
      setRoutePoints(route.map((item) => [Number(item.longitude), Number(item.latitude)]));
    }
  }, [route]);

  useEffect(() => {
    if (dataPolyline && dataPolyline.features && dataPolyline.features[0].geometry) {
      const geometry = dataPolyline.features[0].geometry;
      const coordinates = geometry.coordinates.map((item: any) => [item[1], item[0]]);
      setRoutePolyline(coordinates);
    }
  }, [dataPolyline]);

  useEffect(() => {
    if (mapRef.current && routePolyline.length > 0) {
      const bounds = L.latLngBounds(routePolyline);
      mapRef.current.fitBounds(bounds); // get center and zoom
    }
  }, [dataPolyline, routePolyline]);

  return (
    <Box
      sx={{
        ...props.sx,
        display: 'flex',
        width: '100%',
        height: '100%',
      }}
    >
      <MapContainer
        center={[39.25082889999999, -119.9515585]}
        zoom={5}
        ref={mapRef}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {route &&
          route.map((item, index) => {
            return (
              <Marker
                key={index}
                position={[item.latitude, item.longitude]}
                icon={
                  new L.DivIcon({
                    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${theme.palette.primary.main}"><path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z" /></svg>`,
                    iconSize: [32, 32],
                    iconAnchor: [16, 32],
                    popupAnchor: [0, 0],
                    shadowSize: [32, 32],
                    shadowAnchor: [32, 32],
                  })
                }
              >
                <Popup>
                  <RouteInfo route={item} />
                </Popup>
              </Marker>
            );
          })}

        <MarkerClusterGroup chunkedLoading>
          {extraPoints &&
            extraPoints.map((item, index) => {
              return (
                <Marker
                  key={index}
                  position={[item.latitude, item.longitude]}
                  icon={
                    new L.DivIcon({
                      html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${theme.palette.secondary.main}"><path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z" /></svg>`,
                      iconSize: [32, 32],
                      iconAnchor: [16, 32],
                      popupAnchor: [0, 0],
                      shadowSize: [32, 32],
                      shadowAnchor: [32, 32],
                    })
                  }
                >
                  <Popup>
                    <RouteInfo route={item} />
                  </Popup>
                </Marker>
              );
            })}
        </MarkerClusterGroup>
        {routePolyline.length > 0 && (
          <Polyline positions={routePolyline} pathOptions={polylineOptions} />
        )}
      </MapContainer>
    </Box>
  );
};
