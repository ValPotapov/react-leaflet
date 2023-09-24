import React, { FC, memo, useCallback, useMemo, useState } from 'react';

// import 'leaflet/dist/leaflet.css';
// import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import L from 'leaflet';
import 'leaflet-routing-machine';

import { Marker } from './Marker';
import MarkerClusterGroup from 'react-leaflet-cluster';

import { routesActions, useAppSelector } from '../../store';

import { useDispatch } from 'react-redux';
import { RouteDto } from '../../models';
import dayjs from 'dayjs';


interface ClusterCroupProps {
  onclick?: any;
  map: L.Map | null;
  children?: React.PropsWithChildren | React.ReactNode
}


const ClusterCroup: FC<ClusterCroupProps> = memo(({ map }) => {

  const dispatch = useDispatch();

  const [markers, setMarkers] = useState<RouteDto[]>([]);
  const [extraMarkers, setExtraMarkers] = useState<RouteDto[]>([]);

  const extraPoints = useAppSelector((state) => state.data.extraPoints);
  const selectedRoute = useAppSelector((state) => state.routes.selectedRoute);

  const { search, planId, extraPointDate } = useAppSelector((state) => state.filters);

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



  const handleSetMarkers = React.useCallback((value: RouteDto[]) => {
    setMarkers(value);
  }, []);


  const handleSetExtraMarkers = React.useCallback((value: RouteDto[]) => {
    setExtraMarkers(value);
  }, []);


  const handleClickRoute = useCallback((item: RouteDto) => {
    dispatch(routesActions.setSelectedRouteItem(item));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleClickExtraPoints = useCallback((item: RouteDto) => {

    dispatch(routesActions.setSelectedExtraPoint(item));

    document
      .getElementById(`${item.payload}${item.latitude}${item.longitude}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    handleSetMarkers(selectedRoute);
  }, [selectedRoute, handleSetMarkers]);

  React.useEffect(() => {
    handleSetExtraMarkers(filteredExtraPoints);
  }, [filteredExtraPoints, handleSetExtraMarkers]);


  return (
    <>

      <MarkerClusterGroup
        chunkedLoading removeOutsideVisibleBounds={false} maxClusterRadius={40}>

        {markers.length > 0 &&
          markers.map((item, index) => {

            return (
              <Marker
                type="routes"
                item={item}
                // key={item.unicKey}
                key={`route-marker-item-${index}`}
                onClick={handleClickRoute}
              />
            );
          })}
        {extraMarkers.length > 0 &&
          extraMarkers.map((item, index) => {

            return (
              <Marker
                type="extraPoint"
                item={item}
                // key={item.unicKey}
                key={`extra-point-marker-item-${index}`}
                onClick={handleClickExtraPoints}
              />
            );
          })}
      </MarkerClusterGroup>
    </>

  )
})

export default ClusterCroup