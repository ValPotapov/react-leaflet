import { FC, MutableRefObject, useState, useCallback, useEffect, useMemo, memo } from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import { Box, useTheme } from '@mui/material';

import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import L from 'leaflet';
import 'leaflet-routing-machine';

import { Marker } from './Marker';
import MarkerClusterGroup from 'react-leaflet-cluster';

import { useAppSelector, routesActions } from '../../store';

import { getDrivingForMap } from '../../api';
import { useDispatch } from 'react-redux';
import { RouteDto } from '../../models';
import dayjs from 'dayjs';

type PropsRouteMap = {
  mapRef: MutableRefObject<any>;
};

export const RouteMap: FC<PropsRouteMap> = memo(({ mapRef }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const extraPoints = useAppSelector((state) => state.data.extraPoints);
  const selectedRoute = useAppSelector((state) => state.routes.selectedRoute);

  const history = useAppSelector((state) => state.routes.history);

  const { search, planId, extraPointDate } = useAppSelector((state) => state.filters);

  const [routePolyline, setRoutePolyline] = useState<any>([]);

  const polylineOptions = {
    color: theme.palette.primary.main,
  };

  const filteredExtraPoints = useMemo(() => {
    const currentShipment = extraPoints.filter((route) => !route.truckID);

    const date = extraPointDate ? dayjs(extraPointDate).format('YYYY-MM-DD') : '';

    const result = currentShipment.filter((value) => {
      if (
        (value.payload?.toLowerCase().includes(search.toLowerCase()) ||
          value?.includesJIT?.toString().toLowerCase().includes(search.toLowerCase()) ||
          value.city?.toLowerCase().includes(search.toLowerCase())) &&
        value.planID?.toLowerCase().includes(planId.toLowerCase()) &&
        value.date?.includes(date)
      ) {
        return true;
      } else return false;
    });

    return result;
  }, [search, extraPoints, planId, extraPointDate]);

  const handleClickExtraPoints = useCallback((item: RouteDto) => {
    dispatch(routesActions.setSelectedExtraPoint(item));

    document
      .getElementById(`${item.payload}${item.latitude}${item.longitude}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClickRoute = useCallback((item: RouteDto) => {
    dispatch(routesActions.setSelectedRouteItem(item));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const initial = async () => {
      const coordinates = selectedRoute.map((item) => [
        Number(item.longitude),
        Number(item.latitude),
      ]);

      const response = await getDrivingForMap(coordinates);

      const geometry = response?.features[0]?.geometry;

      if (geometry) {
        const coordinates = geometry.coordinates.map((item: any) => [item[1], item[0]]);

        setRoutePolyline(coordinates);

        if (mapRef?.current && coordinates.length) {
          const bounds = L.latLngBounds(coordinates);
          mapRef.current.fitBounds(bounds);
        }

        if (selectedRoute.length) {
          dispatch(
            routesActions.addHistoryRoutes({
              routeId: selectedRoute[0].routeID,
              coordinates: coordinates,
            })
          );
        }
      }
      dispatch(routesActions.setLoading(false));
    };

    if (selectedRoute.length) {
      const availableRoute = history.find((h) => h.routeId === selectedRoute[0].routeID);

      if (!availableRoute) {
        initial();
      } else {
        setRoutePolyline(availableRoute.coordinates);

        if (mapRef?.current && availableRoute.coordinates.length) {
          const bounds = L.latLngBounds(availableRoute.coordinates);
          mapRef.current.fitBounds(bounds);
        }

        dispatch(routesActions.setLoading(false));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoute]);

  return (
    <Box display="flex" width="100%" height="100%">
      <MapContainer
        center={[39.25082889999999, -119.9515585]}
        zoom={5}
        ref={mapRef}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MarkerClusterGroup chunkedLoading>
          {selectedRoute.map((item, index) => {
            return (
              <Marker
                type="routes"
                item={item}
                key={`route-marker-item-${index}`}
                onClick={handleClickRoute}
              />
            );
          })}
          {filteredExtraPoints.map((item, index) => {
            return (
              <Marker
                type="extraPoint"
                item={item}
                key={`extra-point-marker-item-${index}`}
                onClick={handleClickExtraPoints}
              />
            );
          })}
        </MarkerClusterGroup>
        {routePolyline?.length > 0 && (
          <Polyline positions={routePolyline} pathOptions={polylineOptions} />
        )}
      </MapContainer>
    </Box>
  );
});
