import React, { FC, memo, useEffect, useMemo, useState } from 'react';
import { MapContainer, Polyline, TileLayer } from 'react-leaflet';
import { Box, useTheme } from '@mui/material';

import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import L from 'leaflet';
import 'leaflet-routing-machine';

// import { Marker } from './Marker';
// import MarkerClusterGroup from 'react-leaflet-cluster';
import ClusterCroup from './ClusterGroup';

import { routesActions, useAppSelector } from '../../store';

import { getDrivingForMap } from '../../api';
import { useDispatch } from 'react-redux';
import { RouteDto } from '../../models';
import dayjs from 'dayjs';

type PropsRouteMap = {
  setMap: (value: L.Map | null) => void;
  map: L.Map | null;
};

export const RouteMap: FC<PropsRouteMap> = memo(({ setMap, map }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [markers, setMarkers] = useState<RouteDto[]>([]);
  const [extraMarkers, setExtraMarkers] = useState<RouteDto[]>([]);
  // const selectedRouteItem = useAppSelector((state) => state.routes.selectedRouteItem);
  // const selectedExtraPoint = useAppSelector((state) => state.routes.selectedExtraPoint);
  const extraPoints = useAppSelector((state) => state.data.extraPoints);
  const selectedRoute = useAppSelector((state) => state.routes.selectedRoute);

  const history = useAppSelector((state) => state.routes.history);

  const { search, planId, extraPointDate } = useAppSelector((state) => state.filters);

  const [routePolyline, setRoutePolyline] = useState<any>([]);

  const polylineOptions = {
    color: theme.palette.primary.main,
  };

  const handleSetMarkers = React.useCallback((value: RouteDto[]) => {
    setMarkers(value);
  }, []);

  const handleSetExtraMarkers = React.useCallback((value: RouteDto[]) => {
    setExtraMarkers(value);
  }, []);

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

  // const handleClickExtraPoints = useCallback((item: RouteDto) => {
  //   dispatch(routesActions.setSelectedExtraPoint(item));

  //   document
  //     .getElementById(`${item.payload}${item.latitude}${item.longitude}`)
  //     ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // const handleClickRoute = useCallback((item: RouteDto) => {
  //   dispatch(routesActions.setSelectedRouteItem(item));

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

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

        if (map && coordinates.length) {
          const bounds = L.latLngBounds(coordinates);
          map.fitBounds(bounds);
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

        if (map && availableRoute.coordinates.length) {
          const bounds = L.latLngBounds(availableRoute.coordinates);
          map.fitBounds(bounds);
        }

        dispatch(routesActions.setLoading(false));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoute, map]);

  React.useEffect(() => {
    handleSetMarkers(selectedRoute);
  }, [selectedRoute, handleSetMarkers]);

  React.useEffect(() => {
    handleSetExtraMarkers(filteredExtraPoints);
  }, [filteredExtraPoints, handleSetExtraMarkers]);

  return (
    <Box display="flex" width="100%" height="100%">
      <MapContainer
        center={[39.25082889999999, -119.9515585]}
        zoom={5}
        ref={setMap}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ClusterCroup map={map}></ClusterCroup>
        {/* <MarkerClusterGroup chunkedLoading removeOutsideVisibleBounds={false} maxClusterRadius={40}>
          {markers.length > 0 &&
            markers.map((item, index) => {
              const isSelected =
                selectedRouteItem &&
                item.planID === selectedRouteItem?.planID &&
                item.payload === selectedRouteItem?.payload &&
                item.longitude === selectedRouteItem?.longitude &&
                item.latitude === selectedRouteItem?.latitude;

              return (
                <Marker
                  type="routes"
                  item={item}
                  selectedRouteItem={isSelected ? selectedRouteItem : null}
                  selectedExtraItem={null}
                  key={`route-marker-item-${index}`}
                  onClick={handleClickRoute}
                />
              );
            })}
          {extraMarkers.length > 0 &&
            extraMarkers.map((item, index) => {
              const isSelected =
                selectedExtraPoint &&
                item.planID === selectedExtraPoint?.planID &&
                item.payload === selectedExtraPoint?.payload &&
                item.longitude === selectedExtraPoint?.longitude &&
                item.latitude === selectedExtraPoint?.latitude;

              return (
                <Marker
                  type="extraPoint"
                  item={item}
                  selectedExtraItem={isSelected ? selectedExtraPoint : null}
                  selectedRouteItem={null}
                  key={`extra-point-marker-item-${index}`}
                  onClick={handleClickExtraPoints}
                />
              );
            })}
        </MarkerClusterGroup> */}
        {routePolyline?.length > 0 && (
          <Polyline positions={routePolyline} pathOptions={polylineOptions} />
        )}
      </MapContainer>
    </Box>
  );
});
