import {
  FC,
  useMemo,
  useRef,
  useState,
  useCallback,
  useEffect,
  MutableRefObject,
  memo,
} from 'react';
import { Button, Grid, Box, Typography } from '@mui/material';

import { RouteList } from '../route-list';

import { RouteDto } from '../../models';
import { ShipmentList } from '../shipment-list';
import { Filters } from '../filters';
import { findOneMarkerAndOpen, findOneClusterAndOpen } from '../choose/chooseHandlers';
import { useAppSelector, useAppDispatch, routesActions, dataActions } from '../../store';

import { useResizable } from 'react-resizable-layout';

import { SampleSplitter } from '../../components';

import TuneIcon from '@mui/icons-material/Tune';

// import { reverseObjectKeys } from '../../common/utils/reverseObject.utils';
import { sortByKey } from '../../common/utils/sortByKey.utils';
import L from 'leaflet';

type PropsRightMenu = {
  map: L.Map | null | any;
  filteredExtraPoints: RouteDto[];
  filteredRoutes: { [p: string]: RouteDto[] };
};

export const RightMenu: FC<PropsRightMenu> = memo(
  ({ map, filteredExtraPoints, filteredRoutes }) => {
    const dispatch = useAppDispatch();
    const routes = useAppSelector((state) => state.data.routes);

    const { search, planId, extraPointDate, routeDate, sortExtraPoint, sortRoute } = useAppSelector(
      (state) => state.filters
    );

    const [isOpenFilter, setIsOpenFilter] = useState(false);

    const { isDragging, position, splitterProps } = useResizable({
      axis: 'x',
      initial: 360,
      min: 200,
      max: 1000,
      reverse: true,
    });

    const {
      isDragging: isDraggingY,
      position: positionY,
      splitterProps: splitterPropsY,
    } = useResizable({
      axis: 'y',
      initial: window.innerHeight / 2,
      min: 100,
      max: 1000,
    });

    const wrapperRef = useRef<HTMLDivElement>(null);

    const wrapperWidth = wrapperRef.current?.clientWidth;

    const handleSelectRoute = useCallback(
      (route: string | any) => {
        dispatch(routesActions.setSelectedRoute(filteredRoutes[route]));

        dispatch(routesActions.setLoading(true));

        // dispatch(routesActions.setSelectedExtraPoint(null));
        dispatch(routesActions.setSelectedExtraPoint(route));
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [filteredRoutes, map]
    );

    const handleSelectExtraPoint = useCallback(
      (shipment: RouteDto) => {

        if (map) {
          map.setView([shipment.latitude, shipment.longitude], 18);

          if (!findOneMarkerAndOpen(map, shipment)) findOneClusterAndOpen(map, shipment)
        }
        dispatch(routesActions.setSelectedExtraPoint(shipment));
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [map]
    );

    const onSelectItemRoute = useCallback(
      (route: RouteDto) => {
        dispatch(routesActions.setSelectedRouteItem(route));

        if (map) {
          map.setView([route.latitude, route.longitude], 18);
          map.setView([route.latitude, route.longitude], 18);
          if (!findOneMarkerAndOpen(map, route)) findOneClusterAndOpen(map, route)
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [map]
    );

    const handleReset = useCallback(() => {
      dispatch(routesActions.reset());
      dispatch(dataActions.reset());
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <Box ref={wrapperRef} display="flex" position="absolute" right="0" zIndex={9999}>
        <SampleSplitter isDragging={isDragging} {...splitterProps} />
        <Box width={position} overflow="hidden" height="100vh" bgcolor="white">
          {isOpenFilter && (
            <Filters right={wrapperWidth} handleClose={() => setIsOpenFilter(false)} />
          )}
          <Box height={positionY}>
            <Grid container spacing={1} p={2}>
              <Grid item>
                <Button variant="contained" size="small" onClick={handleReset}>
                  Сбросить
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setIsOpenFilter((prev) => !prev)}
                >
                  <TuneIcon />
                  {search && <Typography>{search}; </Typography>}
                  {planId && <Typography>Plan ID: {planId}</Typography>}
                  {routeDate && <Typography>; {routeDate}</Typography>}
                  {extraPointDate && <Typography>; {extraPointDate}</Typography>}
                </Button>
              </Grid>
            </Grid>
            <Box height="calc(100% - 71px)">
              <RouteList
                data={filteredRoutes}
                onSelectItem={onSelectItemRoute}
                onSelect={handleSelectRoute}
              />
            </Box>
          </Box>
          <SampleSplitter isDragging={isDraggingY} dir="vertical" {...splitterPropsY} />
          <Box height={`calc(100% - ${positionY}px)`}>
            <Box height="100%">
              <ShipmentList data={filteredExtraPoints} onSelect={handleSelectExtraPoint} />
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }
);
