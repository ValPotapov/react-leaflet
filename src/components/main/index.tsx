import React, { ComponentType, useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { RightMenu, RouteUploadFile } from '../../features';
import { useFileUpload, useRoute } from '../../hooks';

import { dataActions, routesActions, useAppDispatch, useAppSelector } from '../../store';

import { RouteMap } from '../../features/route-map';
import { sortByKey } from '../../common/utils/sortByKey.utils';
import { RouteDto } from '../../models';
import L from 'leaflet';

export const Main: ComponentType = () => {
  const dispatch = useAppDispatch();
  const routes = useAppSelector((state) => state.data.routes);
  const extraPoints = useAppSelector((state) => state.data.extraPoints);
  const [isLoadingRoutes, setIsLoadingRoutes] = React.useState<boolean>(true);

  const {
    file,
    isLoading: isLoadingFile,
    errorMessage,
    handleDrop,
    handleDragOver,
    handleInputChange,
    fileInputRef,
  } = useFileUpload(['csv'], 5 * 1024 * 1024);

  const { dataRoute, dataExtraPoints } = useRoute(file);

  const routesNotEmpty = Object.keys(routes).length > 0;

  const [map, setMap] = useState<L.Map | null>(null);

  const { search, planId, extraPointDate, routeDate, sortExtraPoint, sortRoute } = useAppSelector(
    (state) => state.filters
  );

  const filteredExtraPoints = useMemo(() => {
    if (routesNotEmpty) {
      const currentShipment = extraPoints.filter((route) => !route.truckID);

      const date = extraPointDate ? extraPointDate : '';

      const result = currentShipment.filter((value) => {
        if (
          (value.payload?.toLowerCase().includes(search.toLowerCase()) ||
            value.includesJIT?.toString().toLowerCase().includes(search.toLowerCase()) ||
            value.city?.toLowerCase().includes(search.toLowerCase())) &&
          value.planID?.toLowerCase().includes(planId.toLowerCase()) &&
          value.date?.includes(date)
        ) {
          return true;
        } else return false;
      });

      if (sortExtraPoint) {
        return result.sort(sortByKey<RouteDto>(sortExtraPoint));
      }

      return result;
    }

    return [];
  }, [search, extraPoints, planId, extraPointDate, sortExtraPoint, routesNotEmpty]);

  const filteredRoutes = useMemo(() => {
    if (routesNotEmpty) {
      const routesKeys = Object.keys(routes);
      const routesArray = routesKeys.map((key) => routes[key]).flat();

      const date = routeDate ? routeDate : '';

      let result = routesArray.filter((value) => {
        if (
          (value.routeID.toLowerCase().includes(search.toLowerCase()) ||
            value?.payload?.toLowerCase().includes(search.toLowerCase()) ||
            value?.includesJIT?.toString().toLowerCase().includes(search.toLowerCase()) ||
            value.city.toLowerCase().includes(search.toLowerCase())) &&
          value?.planID.includes(planId) &&
          value.date.includes(date)
        ) {
          return true;
        } else return false;
      });

      if (sortRoute) {
        result = result.sort(sortByKey<RouteDto>(sortRoute));
      }

      const formatResult = result.reduce((acc, obj) => {
        let { routeID } = obj;
        routeID = `k${routeID}`;

        if (!acc[routeID]) {
          acc[routeID] = [];
        }
        acc[routeID].push(obj);
        return acc;
      }, {} as { [routeID: string]: RouteDto[] });

      return formatResult;
    }

    return {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routes, search, planId, routeDate, sortRoute, routesNotEmpty]);

  useEffect(() => {
    if (Object.keys(dataRoute).length > 0) {
      dispatch(dataActions.setRoutes(dataRoute));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataRoute]);

  useEffect(() => {
    if (dataExtraPoints.length) {
      dispatch(dataActions.setExtraPoints(dataExtraPoints));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataExtraPoints]);

  useEffect(() => {
    if (routesNotEmpty) {
      if (filteredRoutes) {
        setIsLoadingRoutes(true);
        const firstRoute = Object.keys(filteredRoutes)[0];

        if (firstRoute) dispatch(routesActions.setSelectedRoute(filteredRoutes[firstRoute])); // add Igor
        setIsLoadingRoutes(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredRoutes, routesNotEmpty]);

  return (
    <Box display="flex" position="relative" flexDirection="row" height="100vh" width="100%">
      {!routesNotEmpty ? (
        <RouteUploadFile
          file={file}
          isLoading={isLoadingFile}
          errorMessage={errorMessage}
          fileInputRef={fileInputRef}
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          handleInputChange={handleInputChange}
          sx={{
            alignSelf: 'center',
            margin: 'auto',
          }}
        />
      ) : null}
      {routesNotEmpty ? (
        <>
          {isLoadingRoutes ? (
            <Box>Загрузка данных...</Box>
          ) : (
            <>
              <Box width="100%">
                  <RouteMap setMap={setMap} map={map} />
              </Box>
              <RightMenu
                map={map}
                filteredRoutes={filteredRoutes}
                filteredExtraPoints={filteredExtraPoints}
              />
            </>
          )}
        </>
      ) : null}
    </Box>
  );
};
